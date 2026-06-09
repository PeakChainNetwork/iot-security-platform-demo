import Link from "next/link"

import { CodeBlock } from "@/features/docs/components/code-block"
import { DocsPageHeader } from "@/features/docs/components/docs-page-header"
import { DocsDetails } from "@/features/docs/components/docs-details"
import { DocsFieldTable } from "@/features/docs/components/docs-field-table"
import { PayloadBuilder } from "@/features/docs/components/payload-builder"
import { SimulatedTerminal, type TerminalLine } from "@/features/docs/components/simulated-terminal"
import { Callout } from "@/features/docs/components/callout"
import { FlowDiagram, type FlowNode } from "@/features/docs/components/diagrams/flow-diagram"
import { Snippet } from "@/features/docs/components/snippet"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LOCAL_BACKEND_BASE_URL,
  DEVICE_ID_PLACEHOLDER,
  MQTT_BROKER_WSS_URL_EXAMPLE,
  MQTT_HOST_PLACEHOLDER,
  MQTT_PASSWORD_PLACEHOLDER,
  MQTT_TOPIC_EXAMPLE,
  MQTT_USERNAME_PLACEHOLDER,
} from "@/lib/platform-constants"
import { CableIcon, CpuIcon, RadioTowerIcon, ShieldCheckIcon } from "lucide-react"
import { localizedHref } from "@/lib/i18n/routing"
import type { Locale } from "@/lib/i18n/config"

type Content = {
  header: { eyebrow: string; title: string; badges: string[]; description: string }
  wholeIdea: string
  connectorLabels: string[]
  flowNodes: {
    machine: { title: string; subtitle: string }
    message: { title: string; subtitle: string }
    platform: { title: string; subtitle: string }
  }
  connection: {
    heading: string
    fieldTableTitle: string
    calloutTitle: string
    callout: React.ReactNode
  }
  topic: {
    heading: string
    snippetTitle: string
    desc: string
  }
  message: {
    heading: string
    intro: React.ReactNode
    fieldTableTitle: string
    builderPrompt: string
    schemaSummary: string
    schemaDescription: string
    schemaSnippetTitle: string
  }
  connectionFields: { name: string; type: string; meaning: string; required?: boolean }[]
  payloadFields: { name: string; type: string; meaning: string; required?: boolean }[]
  exampleCode: { summary: string; description: string; installLabel: string }
  checkIt: {
    summary: string
    description: string
    terminalLabel: string
    note: React.ReactNode
  }
  footer: (howItWorksHref: string, mqttHref: string, apiHref: string) => React.ReactNode
}

const statusOutput: TerminalLine[] = [
  { text: "{", tone: "default" },
  { text: '  "sources": {', tone: "default" },
  { text: '    "real_machines": {', tone: "default" },
  { text: '      "status": "connected",', tone: "success" },
  { text: '      "last_message_at": "2026-05-26T11:35:00+00:00"', tone: "muted" },
  { text: "    }", tone: "default" },
  { text: "  }", tone: "default" },
  { text: "}", tone: "default" },
]

const requestBodySchema = `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "PeakSoftRealMachineTelemetry",
  "type": "object",
  "required": ["timestamp"],
  "properties": {
    "timestamp": { "type": "string", "format": "date-time" },
    "temperature": { "type": "number" },
    "pressure": { "type": "number" },
    "vibration": { "type": "number" },
    "power_draw": { "type": "number" },
    "rotational_speed": { "type": "number" },
    "status": { "type": "string", "enum": ["ok", "warning", "critical"] }
  },
  "additionalProperties": true
}`

const pythonPublisherExample = `import json, os, time
from datetime import datetime, timezone
import paho.mqtt.client as mqtt

DEVICE_ID = os.getenv("DEVICE_ID", "${DEVICE_ID_PLACEHOLDER}")
TOPIC = f"site/{DEVICE_ID}/telemetry"

client = mqtt.Client(client_id=f"peaksoft-{DEVICE_ID}", transport="websockets")
client.username_pw_set(os.getenv("MQTT_USERNAME", "${MQTT_USERNAME_PLACEHOLDER}"),
                       os.getenv("MQTT_PASSWORD", "${MQTT_PASSWORD_PLACEHOLDER}"))
client.ws_set_options(path="/mqtt")
client.tls_set()
client.connect(os.getenv("MQTT_HOST", "${MQTT_HOST_PLACEHOLDER}"), 443, keepalive=60)
client.loop_start()

while True:
    payload = {"timestamp": datetime.now(timezone.utc).isoformat(),
               "temperature": 45.8, "pressure": 124.8, "status": "ok"}
    client.publish(TOPIC, json.dumps(payload), qos=1)
    time.sleep(10)
`

const javascriptPublisherExample = `import mqtt from "mqtt"

const deviceId = process.env.DEVICE_ID ?? "${DEVICE_ID_PLACEHOLDER}"
const topic = \`site/\${deviceId}/telemetry\`

const client = mqtt.connect(\`wss://${MQTT_HOST_PLACEHOLDER}:443/mqtt\`, {
  username: process.env.MQTT_USERNAME ?? "${MQTT_USERNAME_PLACEHOLDER}",
  password: process.env.MQTT_PASSWORD ?? "${MQTT_PASSWORD_PLACEHOLDER}",
  clientId: \`peaksoft-\${deviceId}\`,
  reconnectPeriod: 1000,
})

client.on("connect", () => {
  setInterval(() => {
    const payload = { timestamp: new Date().toISOString(), temperature: 45.8, pressure: 124.8, status: "ok" }
    client.publish(topic, JSON.stringify(payload), { qos: 1 })
  }, 10_000)
})
`

const csharpPublisherExample = `using System.Text;
using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Protocol;

var deviceId = Environment.GetEnvironmentVariable("DEVICE_ID") ?? "${DEVICE_ID_PLACEHOLDER}";
var topic = $"site/{deviceId}/telemetry";

var client = new MqttClientFactory().CreateMqttClient();
var options = new MqttClientOptionsBuilder()
    .WithClientId($"peaksoft-{deviceId}")
    .WithWebSocketServer($"wss://${MQTT_HOST_PLACEHOLDER}:443/mqtt")
    .WithCredentials("${MQTT_USERNAME_PLACEHOLDER}", "${MQTT_PASSWORD_PLACEHOLDER}")
    .WithTlsOptions(new MqttClientTlsOptionsBuilder().UseTls().Build())
    .Build();

await client.ConnectAsync(options);

while (true)
{
    var payload = """{ "timestamp": "%T%", "temperature": 45.8, "pressure": 124.8, "status": "ok" }"""
        .Replace("%T%", DateTimeOffset.UtcNow.ToString("O"));
    await client.PublishAsync(new MqttApplicationMessageBuilder()
        .WithTopic(topic).WithPayload(Encoding.UTF8.GetBytes(payload))
        .WithQualityOfServiceLevel(MqttQualityOfServiceLevel.AtLeastOnce).Build());
    await Task.Delay(TimeSpan.FromSeconds(10));
}`

const statusCommand = `curl -sS "${LOCAL_BACKEND_BASE_URL}/api/v1/ingestion/status"`

const content: Record<Locale, Content> = {
  en: {
    header: {
      eyebrow: "Documentation",
      title: "Connecting your machines",
      badges: ["MQTT over WSS", "JSON"],
      description:
        "Your machines send a small message every few seconds. Here's what they send and where it goes, your IT team can wire it up in an afternoon.",
    },
    wholeIdea: "The whole idea",
    connectorLabels: ["publish", "over WSS"],
    flowNodes: {
      machine: { title: "Your machine", subtitle: "reads telemetry" },
      message: { title: "MQTT message", subtitle: "site/<id>/telemetry" },
      platform: { title: "Peaksoft EU", subtitle: "ingests & scores" },
    },
    connection: {
      heading: "Connection",
      fieldTableTitle: "connection contract",
      calloutTitle: "Use the secure address only",
      callout: (
        <>
          Connect with <code>{MQTT_BROKER_WSS_URL_EXAMPLE}</code> and TLS on. Never use a plain connection.
        </>
      ),
    },
    topic: {
      heading: "Topic",
      snippetTitle: "Publish to",
      desc: "One stable name per machine, letters, numbers, dashes, underscores. Reuse it forever.",
    },
    message: {
      heading: "What each machine sends",
      intro: (
        <>
          Only <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">timestamp</code> is required.
          Add whichever numbers your machine has.
        </>
      ),
      fieldTableTitle: "telemetry payload",
      builderPrompt: "Build a message, toggle fields and watch the JSON update:",
      schemaSummary: "Full JSON Schema",
      schemaDescription: "The exact contract for schema validation.",
      schemaSnippetTitle: "JSON Schema",
    },
    connectionFields: [
      { name: "endpoint", type: "wss · port 443 · /mqtt", meaning: "Secure address PeakSoft gives you.", required: true },
      { name: "auth", type: "username + password", meaning: "Credentials from PeakSoft. Keep them secret.", required: true },
      { name: "topic", type: `site/${DEVICE_ID_PLACEHOLDER}/telemetry`, meaning: "One stable name per machine.", required: true },
      { name: "delivery", type: "QoS 1 · retain off", meaning: "Keep trying until it arrives.", required: true },
    ],
    payloadFields: [
      { name: "timestamp", type: "string · ISO 8601", meaning: "When the reading was taken (UTC).", required: true },
      { name: "temperature", type: "number", meaning: "How hot the machine is." },
      { name: "pressure", type: "number", meaning: "Pressure reading." },
      { name: "vibration", type: "number", meaning: "How much it shakes." },
      { name: "power_draw", type: "number", meaning: "How much power it uses." },
      { name: "rotational_speed", type: "number", meaning: "How fast it spins." },
      { name: "status", type: "ok | warning | critical", meaning: "The machine's own health word." },
    ],
    exampleCode: {
      summary: "Example code",
      description: "Connect and publish every 10 seconds, Python, JavaScript, or C#.",
      installLabel: "Install",
    },
    checkIt: {
      summary: "Check it works",
      description: "Confirm your first message arrived.",
      terminalLabel: "status check",
      note: (
        <>
          Before your first message the status reads <code>disconnected</code>; after it, <code>connected</code>.
        </>
      ),
    },
    footer: (howItWorksHref, mqttHref, apiHref) => (
      <>
        New here? See{" "}
        <Link href={howItWorksHref} className="text-primary underline underline-offset-4">
          how it works
        </Link>
        . For the full technical reference, broker settings, multi-language code, troubleshooting, see{" "}
        <Link href={mqttHref} className="text-primary underline underline-offset-4">
          MQTT integration
        </Link>
        , and full request/response shapes in the{" "}
        <Link href={apiHref} className="text-primary underline underline-offset-4">
          API reference
        </Link>
        .
      </>
    ),
  },
  de: {
    header: {
      eyebrow: "Dokumentation",
      title: "Maschinen anbinden",
      badges: ["MQTT über WSS", "JSON"],
      description:
        "Ihre Maschinen senden alle paar Sekunden eine kleine Nachricht. Hier sehen Sie, was sie senden und wohin es geht, Ihr IT-Team kann es an einem Nachmittag einrichten.",
    },
    wholeIdea: "Die ganze Idee",
    connectorLabels: ["veröffentlichen", "über WSS"],
    flowNodes: {
      machine: { title: "Ihre Maschine", subtitle: "liest Telemetrie" },
      message: { title: "MQTT-Nachricht", subtitle: "site/<id>/telemetry" },
      platform: { title: "Peaksoft EU", subtitle: "erfasst & bewertet" },
    },
    connection: {
      heading: "Verbindung",
      fieldTableTitle: "Verbindungsvertrag",
      calloutTitle: "Nur die sichere Adresse verwenden",
      callout: (
        <>
          Verbinden Sie sich mit <code>{MQTT_BROKER_WSS_URL_EXAMPLE}</code> und aktiviertem TLS. Verwenden Sie
          niemals eine unverschlüsselte Verbindung.
        </>
      ),
    },
    topic: {
      heading: "Topic",
      snippetTitle: "Veröffentlichen an",
      desc: "Ein stabiler Name pro Maschine, Buchstaben, Zahlen, Bindestriche, Unterstriche. Verwenden Sie ihn für immer wieder.",
    },
    message: {
      heading: "Was jede Maschine sendet",
      intro: (
        <>
          Nur <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">timestamp</code> ist erforderlich.
          Fügen Sie hinzu, welche Zahlen Ihre Maschine auch immer hat.
        </>
      ),
      fieldTableTitle: "Telemetrie-Payload",
      builderPrompt: "Erstellen Sie eine Nachricht, schalten Sie Felder um und sehen Sie zu, wie sich das JSON aktualisiert:",
      schemaSummary: "Vollständiges JSON Schema",
      schemaDescription: "Der genaue Vertrag für die Schema-Validierung.",
      schemaSnippetTitle: "JSON Schema",
    },
    connectionFields: [
      { name: "endpoint", type: "wss · port 443 · /mqtt", meaning: "Sichere Adresse, die PeakSoft Ihnen gibt.", required: true },
      { name: "auth", type: "username + password", meaning: "Zugangsdaten von PeakSoft. Halten Sie sie geheim.", required: true },
      { name: "topic", type: `site/${DEVICE_ID_PLACEHOLDER}/telemetry`, meaning: "Ein stabiler Name pro Maschine.", required: true },
      { name: "delivery", type: "QoS 1 · retain off", meaning: "Wiederholen, bis es ankommt.", required: true },
    ],
    payloadFields: [
      { name: "timestamp", type: "string · ISO 8601", meaning: "Wann der Messwert erfasst wurde (UTC).", required: true },
      { name: "temperature", type: "number", meaning: "Wie heiß die Maschine ist." },
      { name: "pressure", type: "number", meaning: "Druckmesswert." },
      { name: "vibration", type: "number", meaning: "Wie stark sie vibriert." },
      { name: "power_draw", type: "number", meaning: "Wie viel Strom sie verbraucht." },
      { name: "rotational_speed", type: "number", meaning: "Wie schnell sie sich dreht." },
      { name: "status", type: "ok | warning | critical", meaning: "Das Zustandswort der Maschine selbst." },
    ],
    exampleCode: {
      summary: "Beispielcode",
      description: "Verbinden und alle 10 Sekunden veröffentlichen, Python, JavaScript oder C#.",
      installLabel: "Installieren",
    },
    checkIt: {
      summary: "Prüfen, ob es funktioniert",
      description: "Bestätigen Sie, dass Ihre erste Nachricht angekommen ist.",
      terminalLabel: "Statusprüfung",
      note: (
        <>
          Vor Ihrer ersten Nachricht zeigt der Status <code>disconnected</code> an; danach <code>connected</code>.
        </>
      ),
    },
    footer: (howItWorksHref, mqttHref, apiHref) => (
      <>
        Neu hier? Siehe{" "}
        <Link href={howItWorksHref} className="text-primary underline underline-offset-4">
          So funktioniert es
        </Link>
        . Für die vollständige technische Referenz, Broker-Einstellungen, mehrsprachiger Code, Fehlerbehebung, siehe{" "}
        <Link href={mqttHref} className="text-primary underline underline-offset-4">
          MQTT-Integration
        </Link>
        , und vollständige Request/Response-Formate in der{" "}
        <Link href={apiHref} className="text-primary underline underline-offset-4">
          API-Referenz
        </Link>
        .
      </>
    ),
  },
}

export function ConnectBody({ lang }: { lang: Locale }) {
  const t = content[lang]
  const flowNodes: FlowNode[] = [
    { icon: CpuIcon, title: t.flowNodes.machine.title, subtitle: t.flowNodes.machine.subtitle, tile: "bg-chart-3/15 text-chart-3" },
    { icon: RadioTowerIcon, title: t.flowNodes.message.title, subtitle: t.flowNodes.message.subtitle, tile: "bg-chart-5/15 text-chart-5" },
    { icon: ShieldCheckIcon, title: t.flowNodes.platform.title, subtitle: t.flowNodes.platform.subtitle, tile: "bg-primary/15 text-primary", emphasized: true },
  ]

  return (
    <div className="space-y-10">
      <DocsPageHeader
        eyebrow={t.header.eyebrow}
        title={t.header.title}
        badges={t.header.badges}
        icon={CableIcon}
        description={t.header.description}
      />

      <div className="rounded-2xl border bg-muted/20 p-5 sm:p-6">
        <div className="mb-5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t.wholeIdea}
        </div>
        <FlowDiagram nodes={flowNodes} connectorLabels={t.connectorLabels} />
      </div>

      {/* Connection schema */}
      <section id="connect" className="scroll-mt-24 space-y-3">
        <h2 className="font-heading text-xl font-semibold tracking-tight">{t.connection.heading}</h2>
        <DocsFieldTable fields={[...t.connectionFields]} title={t.connection.fieldTableTitle} />
        <Callout variant="warning" title={t.connection.calloutTitle}>
          {t.connection.callout}
        </Callout>
      </section>

      {/* Topic */}
      <section id="topic" className="scroll-mt-24 space-y-3">
        <h2 className="font-heading text-xl font-semibold tracking-tight">{t.topic.heading}</h2>
        <Snippet title={t.topic.snippetTitle} value={MQTT_TOPIC_EXAMPLE} type="MQTT">
          {MQTT_TOPIC_EXAMPLE}
        </Snippet>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t.topic.desc}
        </p>
      </section>

      {/* Message schema — the star */}
      <section id="message" className="scroll-mt-24 space-y-3">
        <h2 className="font-heading text-xl font-semibold tracking-tight">{t.message.heading}</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {t.message.intro}
        </p>
        <DocsFieldTable fields={[...t.payloadFields]} title={t.message.fieldTableTitle} />

        <p className="text-sm text-muted-foreground">
          {t.message.builderPrompt}
        </p>
        <PayloadBuilder />

        <DocsDetails summary={t.message.schemaSummary} description={t.message.schemaDescription}>
          <Snippet title={t.message.schemaSnippetTitle} value={requestBodySchema} type="JSON">
            {requestBodySchema}
          </Snippet>
        </DocsDetails>
      </section>

      <Separator />

      {/* Everything else, collapsed */}
      <DocsDetails summary={t.exampleCode.summary} description={t.exampleCode.description}>
        <Tabs defaultValue="python" className="space-y-3">
          <TabsList>
            <TabsTrigger value="python">Python</TabsTrigger>
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="csharp">C#</TabsTrigger>
          </TabsList>
          <TabsContent value="python" className="space-y-3">
            <Snippet title={t.exampleCode.installLabel} value="pip install paho-mqtt" type="bash">pip install paho-mqtt</Snippet>
            <CodeBlock language="python">{pythonPublisherExample}</CodeBlock>
          </TabsContent>
          <TabsContent value="javascript" className="space-y-3">
            <Snippet title={t.exampleCode.installLabel} value="npm install mqtt" type="bash">npm install mqtt</Snippet>
            <CodeBlock language="javascript">{javascriptPublisherExample}</CodeBlock>
          </TabsContent>
          <TabsContent value="csharp" className="space-y-3">
            <Snippet title={t.exampleCode.installLabel} value="dotnet add package MQTTnet" type="bash">dotnet add package MQTTnet</Snippet>
            <CodeBlock language="csharp">{csharpPublisherExample}</CodeBlock>
          </TabsContent>
        </Tabs>
      </DocsDetails>

      <DocsDetails summary={t.checkIt.summary} description={t.checkIt.description}>
        <SimulatedTerminal command={statusCommand} lines={statusOutput} label={t.checkIt.terminalLabel} />
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t.checkIt.note}
        </p>
      </DocsDetails>

      <p className="text-sm text-muted-foreground">
        {t.footer(
          localizedHref(lang, "/docs/how-it-works"),
          localizedHref(lang, "/docs/developers/mqtt-integration"),
          localizedHref(lang, "/docs/api"),
        )}
      </p>
    </div>
  )
}
