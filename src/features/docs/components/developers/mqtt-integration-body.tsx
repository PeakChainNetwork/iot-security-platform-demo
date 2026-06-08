import Link from "next/link"

import { CodeBlock } from "@/features/docs/components/code-block"
import { DocsPageHeader } from "@/features/docs/components/docs-page-header"
import { DocsResponseExample } from "@/features/docs/components/docs-response-example"
import { Callout } from "@/features/docs/components/callout"
import { Diagram } from "@/features/docs/components/diagram"
import { MessageContractDiagram } from "@/features/docs/components/diagrams/message-contract-diagram"
import { TopicStructureDiagram } from "@/features/docs/components/diagrams/topic-structure-diagram"
import { Snippet } from "@/features/docs/components/snippet"
import { SimulatedTerminal, type TerminalLine } from "@/features/docs/components/simulated-terminal"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  API_INGESTION_STATUS_URL_EXAMPLE,
  DEVICE_ID_PLACEHOLDER,
  MQTT_BROKER_WSS_URL_EXAMPLE,
  MQTT_HOST_PLACEHOLDER,
  MQTT_PASSWORD_PLACEHOLDER,
  MQTT_TOPIC_EXAMPLE,
  MQTT_USERNAME_PLACEHOLDER,
} from "@/lib/platform-constants"
import { CableIcon } from "lucide-react"
import { localizedHref } from "@/lib/i18n/routing"
import type { Locale } from "@/lib/i18n/config"

const publisherRunOutput: TerminalLine[] = [
  { text: "Connecting to PeakSoft MQTT over WSS...", tone: "muted" },
  { text: "Connected (rc=0)", tone: "success" },
  { text: `Published → site/${DEVICE_ID_PLACEHOLDER}/telemetry  {"temperature": 45.8, "pressure": 124.8, "status": "ok"}`, tone: "default" },
  { text: `Published → site/${DEVICE_ID_PLACEHOLDER}/telemetry  {"temperature": 45.9, "pressure": 124.6, "status": "ok"}`, tone: "default" },
  { text: `Published → site/${DEVICE_ID_PLACEHOLDER}/telemetry  {"temperature": 46.1, "pressure": 125.0, "status": "ok"}`, tone: "default" },
  { text: "(publishing every 10s — press Ctrl+C to stop)", tone: "muted" },
]

const examplePayload = `{
  "timestamp": "2026-04-07T13:23:26.009702+00:00",
  "temperature": 45.849,
  "pressure": 124.801,
  "vibration": 2.646,
  "power_draw": 3.968,
  "rotational_speed": 980.389,
  "status": "ok"
}`

const requestBodySchema = `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "PeakSoftRealMachineTelemetry",
  "type": "object",
  "required": ["timestamp"],
  "properties": {
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 timestamp, UTC preferred"
    },
    "temperature": { "type": "number" },
    "pressure": { "type": "number" },
    "vibration": { "type": "number" },
    "power_draw": { "type": "number" },
    "rotational_speed": { "type": "number" },
    "status": {
      "type": "string",
      "enum": ["ok", "warning", "critical"]
    }
  },
  "additionalProperties": true
}`

const pythonPublisherExample = `import json
import os
import time
from datetime import datetime, timezone

import paho.mqtt.client as mqtt

MQTT_HOST = os.getenv("MQTT_HOST", "${MQTT_HOST_PLACEHOLDER}")
MQTT_PORT = int(os.getenv("MQTT_PORT", "443"))
MQTT_USERNAME = os.getenv("MQTT_USERNAME", "${MQTT_USERNAME_PLACEHOLDER}")
MQTT_PASSWORD = os.getenv("MQTT_PASSWORD", "${MQTT_PASSWORD_PLACEHOLDER}")
MQTT_WS_PATH = os.getenv("MQTT_WS_PATH", "/mqtt")
DEVICE_ID = os.getenv("DEVICE_ID", "${DEVICE_ID_PLACEHOLDER}")
PUBLISH_INTERVAL_SECONDS = float(os.getenv("PUBLISH_INTERVAL_SECONDS", "10"))
TOPIC = f"site/{DEVICE_ID}/telemetry"


def build_payload() -> dict:
    return {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "temperature": 45.8,
        "pressure": 124.8,
        "vibration": 2.6,
        "power_draw": 4.0,
        "rotational_speed": 980.0,
        "status": "ok",
    }


def on_connect(client, _userdata, _flags, reason_code, _properties=None):
    print(f"Connected to PeakSoft MQTT with rc={reason_code}")


def on_disconnect(client, _userdata, reason_code, _properties=None):
    print(f"Disconnected from PeakSoft MQTT with rc={reason_code}")


client = mqtt.Client(client_id=f"peaksoft-{DEVICE_ID}", transport="websockets")
client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)
client.ws_set_options(path=MQTT_WS_PATH)
client.tls_set()
client.reconnect_delay_set(min_delay=1, max_delay=30)
client.on_connect = on_connect
client.on_disconnect = on_disconnect

client.connect(MQTT_HOST, MQTT_PORT, keepalive=60)
client.loop_start()

try:
    while True:
        payload = build_payload()
        message = json.dumps(payload)
        info = client.publish(TOPIC, message, qos=1, retain=False)
        info.wait_for_publish(timeout=10)
        if info.rc != mqtt.MQTT_ERR_SUCCESS:
            raise RuntimeError(f"Publish failed with rc={info.rc}")
        print(f"Published telemetry to {TOPIC}: {message}")
        time.sleep(PUBLISH_INTERVAL_SECONDS)
finally:
    client.loop_stop()
    client.disconnect()
`

const javascriptPublisherExample = `import mqtt from "mqtt"

const host = process.env.MQTT_HOST ?? "${MQTT_HOST_PLACEHOLDER}"
const port = Number(process.env.MQTT_PORT ?? "443")
const username = process.env.MQTT_USERNAME ?? "${MQTT_USERNAME_PLACEHOLDER}"
const password = process.env.MQTT_PASSWORD ?? "${MQTT_PASSWORD_PLACEHOLDER}"
const deviceId = process.env.DEVICE_ID ?? "${DEVICE_ID_PLACEHOLDER}"
const topic = \`site/\${deviceId}/telemetry\`

const client = mqtt.connect(\`wss://\${host}:\${port}/mqtt\`, {
  username,
  password,
  clientId: \`peaksoft-\${deviceId}\`,
  keepalive: 60,
  reconnectPeriod: 1000,
  rejectUnauthorized: true,
})

client.on("connect", () => {
  console.log("Connected to PeakSoft MQTT")

  setInterval(() => {
    const payload = {
      timestamp: new Date().toISOString(),
      temperature: 45.8,
      pressure: 124.8,
      vibration: 2.6,
      power_draw: 4.0,
      rotational_speed: 980.0,
      status: "ok",
    }

    client.publish(topic, JSON.stringify(payload), { qos: 1, retain: false }, (error) => {
      if (error) {
        console.error("Publish failed:", error)
        return
      }
      console.log(\`Published telemetry to \${topic}\`)
    })
  }, 10_000)
})

client.on("reconnect", () => console.log("Reconnecting to PeakSoft MQTT..."))
client.on("error", (error) => console.error("MQTT error:", error))
client.on("close", () => console.log("MQTT connection closed"))
`

const csharpPublisherExample = `using System.Text;
using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Protocol;

var host = Environment.GetEnvironmentVariable("MQTT_HOST") ?? "${MQTT_HOST_PLACEHOLDER}";
var username = Environment.GetEnvironmentVariable("MQTT_USERNAME") ?? "${MQTT_USERNAME_PLACEHOLDER}";
var password = Environment.GetEnvironmentVariable("MQTT_PASSWORD") ?? "${MQTT_PASSWORD_PLACEHOLDER}";
var deviceId = Environment.GetEnvironmentVariable("DEVICE_ID") ?? "${DEVICE_ID_PLACEHOLDER}";
var topic = $"site/{deviceId}/telemetry";

var factory = new MqttClientFactory();
var client = factory.CreateMqttClient();

var options = new MqttClientOptionsBuilder()
    .WithClientId($"peaksoft-{deviceId}")
    .WithWebSocketServer($"wss://{host}:443/mqtt")
    .WithCredentials(username, password)
    .WithTlsOptions(new MqttClientTlsOptionsBuilder().UseTls().Build())
    .Build();

client.ConnectedAsync += args =>
{
    Console.WriteLine("Connected to PeakSoft MQTT");
    return Task.CompletedTask;
};

client.DisconnectedAsync += args =>
{
    Console.WriteLine("Disconnected from PeakSoft MQTT");
    return Task.CompletedTask;
};

await client.ConnectAsync(options);

while (true)
{
    var payload = """
    {
      "timestamp": "%TIMESTAMP%",
      "temperature": 45.8,
      "pressure": 124.8,
      "vibration": 2.6,
      "power_draw": 4.0,
      "rotational_speed": 980.0,
      "status": "ok"
    }
    """.Replace("%TIMESTAMP%", DateTimeOffset.UtcNow.ToString("O"));

    var message = new MqttApplicationMessageBuilder()
        .WithTopic(topic)
        .WithPayload(Encoding.UTF8.GetBytes(payload))
        .WithQualityOfServiceLevel(MqttQualityOfServiceLevel.AtLeastOnce)
        .WithRetainFlag(false)
        .Build();

    await client.PublishAsync(message);
    Console.WriteLine($"Published telemetry to {topic}");
    await Task.Delay(TimeSpan.FromSeconds(10));
}`

const statusCommand = `curl -sS "${API_INGESTION_STATUS_URL_EXAMPLE}"`

const disconnectedStatusExample = `{
  "sources": {
    "real_machines": {
      "status": "disconnected",
      "message": "Real machine gateway service is disconnected."
    }
  }
}`

const connectedStatusExample = `{
  "sources": {
    "real_machines": {
      "status": "connected",
      "message": "Real machine gateway service is connected.",
      "last_message_at": "2026-05-26T11:35:00.000000+00:00"
    }
  }
}`

type ConnectionSetting = { title: string; value: string; desc: string }
type Pitfall = { title: string; desc: string }
type Troubleshoot = { problem: string; solution: string }

type Content = {
  header: { eyebrow: string; title: string; badges: string[]; description: React.ReactNode }
  whatYouConnect: { title: string; body: string }
  handoffCardTitle: string
  handoffItems: string[]
  gatewayCardTitle: string
  onboardingSteps: string[]
  connection: {
    eyebrow: string
    heading: string
    desc: string
    endpointTitle: string
    settings: ConnectionSetting[]
    calloutTitle: string
    callout: React.ReactNode
  }
  topic: {
    eyebrow: string
    heading: string
    desc: string
    requiredTitle: string
    examplesTitle: string
    deviceIdRulesTitle: string
    rules: { badge: string; body: React.ReactNode }[]
    topicDiagramTitle: string
    topicDiagramDesc: string
    messageDiagramTitle: string
    messageDiagramDesc: string
  }
  payload: {
    eyebrow: string
    heading: string
    desc: string
    schemaUsageTitle: string
    schemaUsage: string
    requiredFieldsTitle: string
    requiredFieldTimestampDesc: string
    metricFields: React.ReactNode
    optionalFieldsTitle: string
    optionalFields: React.ReactNode
    formattingTitle: string
    formatting: string
    schemaSnippetTitle: string
    exampleSnippetTitle: string
  }
  publisher: {
    eyebrow: string
    heading: string
    desc: React.ReactNode
    runPrompt: string
    terminalLabel: string
    pythonCardTitle: React.ReactNode
    javascriptCardTitle: React.ReactNode
    csharpCardTitle: React.ReactNode
    installLabel: string
  }
  verify: {
    eyebrow: string
    heading: string
    desc: string
    statusCommandTitle: string
    beforeTitle: string
    afterTitle: string
  }
  pitfalls: { eyebrow: string; heading: string; items: Pitfall[] }
  troubleshoot: { eyebrow: string; heading: string; items: Troubleshoot[] }
}

const content: Record<Locale, Content> = {
  en: {
    header: {
      eyebrow: "Developers",
      title: "MQTT integration (technical)",
      badges: ["MQTT over WSS", "Payload schema", "Reference publishers"],
      description: (
        <>
          The full technical reference for connecting a real-machine gateway to PeakSoft: connection
          settings, topic naming, payload schema, example code, validation, and troubleshooting. For the
          non-technical overview, see{" "}
          <Link
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/90"
            href={localizedHref("en", "/docs/connect")}
          >
            connecting your machines
          </Link>
          .
        </>
      ),
    },
    whatYouConnect: {
      title: "What you are connecting",
      body: "Your machines usually connect through a small site gateway service that reads local telemetry and forwards it to PeakSoft over an authenticated MQTT connection.",
    },
    handoffCardTitle: "What you need from PeakSoft",
    handoffItems: [
      "MQTT host or URL",
      "MQTT username",
      "MQTT password",
      "Your approved device IDs",
      "Status-check URL",
    ],
    gatewayCardTitle: "What your gateway must do",
    onboardingSteps: [
      "Choose or build a gateway application that can read telemetry from your real machines.",
      "Assign a stable device_id to each machine and keep that identifier unchanged over time.",
      "Configure the gateway with the MQTT host, username, password, and WebSocket path /mqtt.",
      "Publish JSON telemetry to site/{device_id}/telemetry using QoS 1 over WSS on port 443.",
      "Verify that the connection is accepted and the status-check endpoint changes to connected after the first valid message.",
    ],
    connection: {
      eyebrow: "Connection",
      heading: "Exact broker settings",
      desc: "Use these settings in your MQTT client or site gateway exactly as shown unless PeakSoft gives you a different value.",
      endpointTitle: "Broker endpoint",
      settings: [
        {
          title: "Transport",
          value: "MQTT over WebSockets (WSS)",
          desc: "Use secure WebSockets for the external client path. Do not rely on raw internet-facing MQTT/TCP.",
        },
        {
          title: "Endpoint",
          value: MQTT_BROKER_WSS_URL_EXAMPLE,
          desc: "Port 443 and WebSocket path /mqtt are part of the connection contract for the client gateway.",
        },
        {
          title: "Authentication",
          value: "Username + password",
          desc: "PeakSoft provides the credentials. Store them securely and rotate them when requested.",
        },
        {
          title: "Delivery",
          value: "QoS 1, retain=false",
          desc: "QoS 1 is the recommended publish mode for telemetry. Keep retained messages disabled unless agreed.",
        },
      ],
      calloutTitle: "Required external connection format",
      callout: (
        <>
          Use <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{MQTT_BROKER_WSS_URL_EXAMPLE}</code>{" "}
          with TLS enabled. Do not replace this with a plain WebSocket or unsecured MQTT connection.
        </>
      ),
    },
    topic: {
      eyebrow: "Topic",
      heading: "Publish topic",
      desc: "Publish one telemetry stream per machine using the topic pattern below.",
      requiredTitle: "Required topic",
      examplesTitle: "Topic examples",
      deviceIdRulesTitle: "Device ID rules",
      rules: [
        {
          badge: "Stable",
          body: (
            <>
              Keep the same <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">device_id</code>{" "}
              for the same physical machine over time.
            </>
          ),
        },
        {
          badge: "Unique",
          body: <>Use one unique ID per physical asset.</>,
        },
        {
          badge: "Safe",
          body: <>Use letters, numbers, dashes, and underscores only.</>,
        },
      ],
      topicDiagramTitle: "Topic structure",
      topicDiagramDesc: "Expand to inspect the topic segments and how device IDs fit into the publish path.",
      messageDiagramTitle: "Message structure",
      messageDiagramDesc: "Expand to review how the MQTT topic and JSON payload work together.",
    },
    payload: {
      eyebrow: "Payload",
      heading: "Telemetry request body schema",
      desc: "Each MQTT message must contain a JSON telemetry payload that follows this schema.",
      schemaUsageTitle: "Schema usage",
      schemaUsage: "MQTT does not use an HTTP request body, but the payload you publish should match this JSON schema.",
      requiredFieldsTitle: "Required fields",
      requiredFieldTimestampDesc: "ISO 8601 timestamp, UTC preferred.",
      metricFields: (
        <>
          Include one or more metric fields such as{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">temperature</code>,{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">pressure</code>,{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">vibration</code>,{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">power_draw</code>, or{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">rotational_speed</code>.
        </>
      ),
      optionalFieldsTitle: "Optional fields",
      optionalFields: (
        <>
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">status</code> can be{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ok</code>,{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">warning</code>, or{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">critical</code>.
        </>
      ),
      formattingTitle: "Data formatting",
      formatting: "Send numeric readings as JSON numbers, keep field names stable, and normalize units before publishing.",
      schemaSnippetTitle: "Telemetry schema",
      exampleSnippetTitle: "Example payload",
    },
    publisher: {
      eyebrow: "Example",
      heading: "Reference publishers",
      desc: (
        <>
          Use these examples as starting points for your gateway or test script. Each one connects over
          WSS, authenticates with username and password, publishes to{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">site/&lt;device_id&gt;/telemetry</code>,
          and sends JSON telemetry with QoS 1.
        </>
      ),
      runPrompt: "Press Run to see what a publisher prints once connected:",
      terminalLabel: "publisher",
      pythonCardTitle: <>Python (`paho-mqtt`)</>,
      javascriptCardTitle: <>JavaScript / Node.js (`mqtt`)</>,
      csharpCardTitle: <>C# (`MQTTnet`)</>,
      installLabel: "Install dependency",
    },
    verify: {
      eyebrow: "Verify",
      heading: "How to confirm your connection is working",
      desc: "After you send at least one valid telemetry message, the status URL provided by PeakSoft should show your real-machine source as connected.",
      statusCommandTitle: "Status check command",
      beforeTitle: "Before the first valid publish",
      afterTitle: "After a successful publish",
    },
    pitfalls: {
      eyebrow: "Avoid",
      heading: "Common mistakes",
      items: [
        {
          title: "Rotating IDs",
          desc: "A new device_id every reboot breaks history and device pages. Use a stable asset identifier.",
        },
        {
          title: "Missing timestamps",
          desc: "Without valid timestamps, ordering and charts become unreliable. Use ISO 8601 UTC.",
        },
        {
          title: "Mixed units",
          desc: "Inconsistent units across machines lead to misleading comparisons and false alerts.",
        },
      ],
    },
    troubleshoot: {
      eyebrow: "Troubleshooting",
      heading: "If the gateway does not connect or send data",
      items: [
        {
          problem: "Connection fails immediately",
          solution: "Check the host, port 443, WebSocket path /mqtt, TLS, and the MQTT username/password.",
        },
        {
          problem: "Connection works but data does not appear",
          solution: "Check the topic name, device_id, JSON payload shape, and whether at least one publish actually succeeded.",
        },
        {
          problem: "Intermittent delivery",
          solution: "Add reconnect logic, buffer briefly during short outages, and avoid unnecessary publish bursts.",
        },
      ],
    },
  },
  de: {
    header: {
      eyebrow: "Entwickler",
      title: "MQTT-Integration (technisch)",
      badges: ["MQTT über WSS", "Payload-Schema", "Referenz-Publisher"],
      description: (
        <>
          Die vollständige technische Referenz für die Anbindung eines Echtmaschinen-Gateways an PeakSoft:
          Verbindungseinstellungen, Topic-Benennung, Payload-Schema, Beispielcode, Validierung und
          Fehlerbehebung. Für den nicht-technischen Überblick siehe{" "}
          <Link
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/90"
            href={localizedHref("de", "/docs/connect")}
          >
            Maschinen anbinden
          </Link>
          .
        </>
      ),
    },
    whatYouConnect: {
      title: "Was Sie anbinden",
      body: "Ihre Maschinen werden in der Regel über einen kleinen Standort-Gateway-Dienst angebunden, der die lokale Telemetrie liest und über eine authentifizierte MQTT-Verbindung an PeakSoft weiterleitet.",
    },
    handoffCardTitle: "Was Sie von PeakSoft benötigen",
    handoffItems: [
      "MQTT-Host oder -URL",
      "MQTT-Benutzername",
      "MQTT-Passwort",
      "Ihre freigegebenen Geräte-IDs",
      "Statusprüfungs-URL",
    ],
    gatewayCardTitle: "Was Ihr Gateway tun muss",
    onboardingSteps: [
      "Wählen oder erstellen Sie eine Gateway-Anwendung, die die Telemetrie Ihrer echten Maschinen lesen kann.",
      "Weisen Sie jeder Maschine eine stabile device_id zu und halten Sie diese Kennung über die Zeit unverändert.",
      "Konfigurieren Sie das Gateway mit dem MQTT-Host, Benutzernamen, Passwort und dem WebSocket-Pfad /mqtt.",
      "Veröffentlichen Sie JSON-Telemetrie an site/{device_id}/telemetry mit QoS 1 über WSS auf Port 443.",
      "Stellen Sie sicher, dass die Verbindung akzeptiert wird und der Statusprüfungs-Endpunkt nach der ersten gültigen Nachricht auf connected wechselt.",
    ],
    connection: {
      eyebrow: "Verbindung",
      heading: "Genaue Broker-Einstellungen",
      desc: "Verwenden Sie diese Einstellungen in Ihrem MQTT-Client oder Standort-Gateway genau wie dargestellt, sofern PeakSoft Ihnen keinen anderen Wert vorgibt.",
      endpointTitle: "Broker-Endpunkt",
      settings: [
        {
          title: "Transport",
          value: "MQTT over WebSockets (WSS)",
          desc: "Verwenden Sie sichere WebSockets für den externen Client-Pfad. Verlassen Sie sich nicht auf rohes, zum Internet hin offenes MQTT/TCP.",
        },
        {
          title: "Endpunkt",
          value: MQTT_BROKER_WSS_URL_EXAMPLE,
          desc: "Port 443 und der WebSocket-Pfad /mqtt sind Teil des Verbindungsvertrags für das Client-Gateway.",
        },
        {
          title: "Authentifizierung",
          value: "Username + password",
          desc: "PeakSoft stellt die Zugangsdaten bereit. Bewahren Sie sie sicher auf und wechseln Sie sie auf Anforderung.",
        },
        {
          title: "Zustellung",
          value: "QoS 1, retain=false",
          desc: "QoS 1 ist der empfohlene Veröffentlichungsmodus für Telemetrie. Lassen Sie retained Messages deaktiviert, sofern nicht anders vereinbart.",
        },
      ],
      calloutTitle: "Erforderliches externes Verbindungsformat",
      callout: (
        <>
          Verwenden Sie <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{MQTT_BROKER_WSS_URL_EXAMPLE}</code>{" "}
          mit aktiviertem TLS. Ersetzen Sie dies nicht durch eine unverschlüsselte WebSocket- oder ungesicherte MQTT-Verbindung.
        </>
      ),
    },
    topic: {
      eyebrow: "Topic",
      heading: "Veröffentlichungs-Topic",
      desc: "Veröffentlichen Sie einen Telemetriestrom pro Maschine über das untenstehende Topic-Muster.",
      requiredTitle: "Erforderliches Topic",
      examplesTitle: "Topic-Beispiele",
      deviceIdRulesTitle: "Regeln für die Geräte-ID",
      rules: [
        {
          badge: "Stabil",
          body: (
            <>
              Behalten Sie dieselbe <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">device_id</code>{" "}
              für dieselbe physische Maschine über die Zeit bei.
            </>
          ),
        },
        {
          badge: "Eindeutig",
          body: <>Verwenden Sie eine eindeutige ID pro physischer Anlage.</>,
        },
        {
          badge: "Sicher",
          body: <>Verwenden Sie nur Buchstaben, Zahlen, Bindestriche und Unterstriche.</>,
        },
      ],
      topicDiagramTitle: "Topic-Struktur",
      topicDiagramDesc: "Ausklappen, um die Topic-Segmente zu untersuchen und zu sehen, wie sich Geräte-IDs in den Veröffentlichungspfad einfügen.",
      messageDiagramTitle: "Nachrichtenstruktur",
      messageDiagramDesc: "Ausklappen, um zu betrachten, wie das MQTT-Topic und die JSON-Payload zusammenwirken.",
    },
    payload: {
      eyebrow: "Payload",
      heading: "Schema des Telemetrie-Request-Body",
      desc: "Jede MQTT-Nachricht muss eine JSON-Telemetrie-Payload enthalten, die diesem Schema folgt.",
      schemaUsageTitle: "Schema-Verwendung",
      schemaUsage: "MQTT verwendet keinen HTTP-Request-Body, aber die Payload, die Sie veröffentlichen, sollte diesem JSON-Schema entsprechen.",
      requiredFieldsTitle: "Erforderliche Felder",
      requiredFieldTimestampDesc: "ISO 8601-Zeitstempel, UTC bevorzugt.",
      metricFields: (
        <>
          Fügen Sie ein oder mehrere Messwert-Felder hinzu, wie etwa{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">temperature</code>,{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">pressure</code>,{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">vibration</code>,{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">power_draw</code> oder{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">rotational_speed</code>.
        </>
      ),
      optionalFieldsTitle: "Optionale Felder",
      optionalFields: (
        <>
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">status</code> kann{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ok</code>,{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">warning</code> oder{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">critical</code> sein.
        </>
      ),
      formattingTitle: "Datenformatierung",
      formatting: "Senden Sie numerische Messwerte als JSON-Zahlen, halten Sie die Feldnamen stabil und normalisieren Sie die Einheiten vor dem Veröffentlichen.",
      schemaSnippetTitle: "Telemetrie-Schema",
      exampleSnippetTitle: "Beispiel-Payload",
    },
    publisher: {
      eyebrow: "Beispiel",
      heading: "Referenz-Publisher",
      desc: (
        <>
          Verwenden Sie diese Beispiele als Ausgangspunkt für Ihr Gateway oder Testskript. Jedes verbindet sich über
          WSS, authentifiziert sich mit Benutzername und Passwort, veröffentlicht an{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">site/&lt;device_id&gt;/telemetry</code>{" "}
          und sendet JSON-Telemetrie mit QoS 1.
        </>
      ),
      runPrompt: "Drücken Sie Run, um zu sehen, was ein Publisher nach dem Verbinden ausgibt:",
      terminalLabel: "publisher",
      pythonCardTitle: <>Python (`paho-mqtt`)</>,
      javascriptCardTitle: <>JavaScript / Node.js (`mqtt`)</>,
      csharpCardTitle: <>C# (`MQTTnet`)</>,
      installLabel: "Abhängigkeit installieren",
    },
    verify: {
      eyebrow: "Überprüfen",
      heading: "So bestätigen Sie, dass Ihre Verbindung funktioniert",
      desc: "Nachdem Sie mindestens eine gültige Telemetrie-Nachricht gesendet haben, sollte die von PeakSoft bereitgestellte Status-URL Ihre Echtmaschinen-Quelle als connected anzeigen.",
      statusCommandTitle: "Statusprüfungs-Befehl",
      beforeTitle: "Vor der ersten gültigen Veröffentlichung",
      afterTitle: "Nach einer erfolgreichen Veröffentlichung",
    },
    pitfalls: {
      eyebrow: "Vermeiden",
      heading: "Häufige Fehler",
      items: [
        {
          title: "Wechselnde IDs",
          desc: "Eine neue device_id bei jedem Neustart zerstört den Verlauf und die Geräteseiten. Verwenden Sie eine stabile Anlagenkennung.",
        },
        {
          title: "Fehlende Zeitstempel",
          desc: "Ohne gültige Zeitstempel werden Reihenfolge und Diagramme unzuverlässig. Verwenden Sie ISO 8601 UTC.",
        },
        {
          title: "Gemischte Einheiten",
          desc: "Uneinheitliche Einheiten über Maschinen hinweg führen zu irreführenden Vergleichen und Fehlalarmen.",
        },
      ],
    },
    troubleshoot: {
      eyebrow: "Fehlerbehebung",
      heading: "Wenn das Gateway sich nicht verbindet oder keine Daten sendet",
      items: [
        {
          problem: "Verbindung schlägt sofort fehl",
          solution: "Prüfen Sie den Host, Port 443, den WebSocket-Pfad /mqtt, TLS sowie den MQTT-Benutzernamen/das -Passwort.",
        },
        {
          problem: "Verbindung funktioniert, aber es erscheinen keine Daten",
          solution: "Prüfen Sie den Topic-Namen, die device_id, die Form der JSON-Payload und ob mindestens eine Veröffentlichung tatsächlich erfolgreich war.",
        },
        {
          problem: "Sporadische Zustellung",
          solution: "Fügen Sie Wiederverbindungslogik hinzu, puffern Sie kurz während kurzer Ausfälle und vermeiden Sie unnötige Veröffentlichungsschübe.",
        },
      ],
    },
  },
}

export function MqttIntegrationBody({ lang }: { lang: Locale }) {
  const t = content[lang]
  return (
    <div className="space-y-10">
      <DocsPageHeader
        eyebrow={t.header.eyebrow}
        title={t.header.title}
        badges={t.header.badges}
        icon={CableIcon}
        description={t.header.description}
      />

      <Callout variant="info" title={t.whatYouConnect.title}>
        {t.whatYouConnect.body}
      </Callout>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t.handoffCardTitle}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {t.handoffItems.map((item) => (
              <div key={item} className="rounded-lg border bg-card p-4 text-sm text-muted-foreground leading-relaxed">
                <div className="font-medium text-foreground">{item}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t.gatewayCardTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {t.onboardingSteps.map((step, index) => (
              <div key={step} className="flex gap-3">
                <Badge variant="secondary" className="mt-0.5 shrink-0 text-xs">
                  {index + 1}
                </Badge>
                <span className="leading-relaxed">{step}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Separator />

      <section id="connection" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t.connection.eyebrow}
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            {t.connection.heading}
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            {t.connection.desc}
          </p>
        </div>

        <Snippet title={t.connection.endpointTitle} value={MQTT_BROKER_WSS_URL_EXAMPLE} type="MQTT">
          {MQTT_BROKER_WSS_URL_EXAMPLE}
        </Snippet>

        <div className="grid gap-4 lg:grid-cols-2">
          {t.connection.settings.map((setting) => (
            <Card key={setting.title}>
              <CardHeader>
                <CardTitle className="text-base">{setting.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="rounded-xl border bg-card p-4 font-mono text-xs text-muted-foreground whitespace-pre-wrap">
                  {setting.value}
                </div>
                <p className="leading-relaxed">{setting.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Callout variant="warning" title={t.connection.calloutTitle}>
          {t.connection.callout}
        </Callout>
      </section>

      <Separator />

      <section id="topic" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t.topic.eyebrow}
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            {t.topic.heading}
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            {t.topic.desc}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <Snippet title={t.topic.requiredTitle} value={MQTT_TOPIC_EXAMPLE} type="MQTT">
              {MQTT_TOPIC_EXAMPLE}
            </Snippet>

            <Snippet
              title={t.topic.examplesTitle}
              value={"site/dev-001/telemetry\nsite/press-7/telemetry\nsite/lineA_motor_02/telemetry"}
              type="MQTT"
            >
              {"site/dev-001/telemetry\nsite/press-7/telemetry\nsite/lineA_motor_02/telemetry"}
            </Snippet>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t.topic.deviceIdRulesTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {t.topic.rules.map((rule) => (
                <div key={rule.badge} className="flex gap-3">
                  <Badge variant="secondary" className="mt-0.5 shrink-0 text-xs">
                    {rule.badge}
                  </Badge>
                  <span className="leading-relaxed">{rule.body}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Diagram
            title={t.topic.topicDiagramTitle}
            description={t.topic.topicDiagramDesc}
          >
            <TopicStructureDiagram />
          </Diagram>
          <Diagram
            title={t.topic.messageDiagramTitle}
            description={t.topic.messageDiagramDesc}
          >
            <MessageContractDiagram />
          </Diagram>
        </div>
      </section>

      <Separator />

      <section id="payload" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t.payload.eyebrow}
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            {t.payload.heading}
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            {t.payload.desc}
          </p>
        </div>

        <Callout variant="default" title={t.payload.schemaUsageTitle}>
          {t.payload.schemaUsage}
        </Callout>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t.payload.requiredFieldsTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="flex gap-3">
                  <code className="mt-0.5 shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-xs">timestamp</code>
                  <span className="leading-relaxed">{t.payload.requiredFieldTimestampDesc}</span>
                </div>
                <Separator />
                <div className="leading-relaxed">
                  {t.payload.metricFields}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t.payload.optionalFieldsTitle}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                {t.payload.optionalFields}
              </CardContent>
            </Card>

            <Callout variant="info" title={t.payload.formattingTitle}>
              {t.payload.formatting}
            </Callout>
          </div>

          <div className="space-y-4">
            <Snippet title={t.payload.schemaSnippetTitle} value={requestBodySchema} type="JSON">
              {requestBodySchema}
            </Snippet>
            <Snippet title={t.payload.exampleSnippetTitle} value={examplePayload} type="JSON">
              {examplePayload}
            </Snippet>
          </div>
        </div>
      </section>

      <Separator />

      <section id="publisher-example" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t.publisher.eyebrow}
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            {t.publisher.heading}
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            {t.publisher.desc}
          </p>
        </div>

        <p className="text-sm text-muted-foreground">{t.publisher.runPrompt}</p>
        <SimulatedTerminal command="python publisher.py" lines={publisherRunOutput} label={t.publisher.terminalLabel} />

        <Tabs defaultValue="python" className="space-y-4">
          <TabsList>
            <TabsTrigger value="python">Python</TabsTrigger>
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="csharp">C#</TabsTrigger>
          </TabsList>

          <TabsContent value="python" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t.publisher.pythonCardTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Snippet title={t.publisher.installLabel} value="pip install paho-mqtt" type="bash">
                  pip install paho-mqtt
                </Snippet>
                <CodeBlock language="python">{pythonPublisherExample}</CodeBlock>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="javascript" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t.publisher.javascriptCardTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Snippet title={t.publisher.installLabel} value="npm install mqtt" type="bash">
                  npm install mqtt
                </Snippet>
                <CodeBlock language="javascript">{javascriptPublisherExample}</CodeBlock>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="csharp" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t.publisher.csharpCardTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Snippet title={t.publisher.installLabel} value="dotnet add package MQTTnet" type="bash">
                  dotnet add package MQTTnet
                </Snippet>
                <CodeBlock language="csharp">{csharpPublisherExample}</CodeBlock>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <Separator />

      <section id="verify" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t.verify.eyebrow}
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            {t.verify.heading}
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            {t.verify.desc}
          </p>
        </div>

        <Snippet title={t.verify.statusCommandTitle} value={statusCommand} type="bash">
          {statusCommand}
        </Snippet>

        <div className="grid gap-4 lg:grid-cols-2">
          <DocsResponseExample title={t.verify.beforeTitle} status={200}>
            {disconnectedStatusExample}
          </DocsResponseExample>
          <DocsResponseExample title={t.verify.afterTitle} status={200}>
            {connectedStatusExample}
          </DocsResponseExample>
        </div>
      </section>

      <Separator />

      <section id="pitfalls" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t.pitfalls.eyebrow}
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            {t.pitfalls.heading}
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {t.pitfalls.items.map((p) => (
            <Callout key={p.title} variant="warning" title={p.title}>
              {p.desc}
            </Callout>
          ))}
        </div>
      </section>

      <Separator />

      <section id="troubleshoot" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t.troubleshoot.eyebrow}
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            {t.troubleshoot.heading}
          </h2>
        </div>

        <div className="space-y-2">
          {t.troubleshoot.items.map((item) => (
            <Card key={item.problem}>
              <CardHeader>
                <CardTitle className="text-base">{item.problem}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                {item.solution}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
