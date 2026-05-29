"use client"

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

const connectionSettings = [
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
]

const handoffItems = [
  "MQTT host or URL",
  "MQTT username",
  "MQTT password",
  "Your approved device IDs",
  "Status-check URL",
]

const onboardingSteps = [
  "Choose or build a gateway application that can read telemetry from your real machines.",
  "Assign a stable device_id to each machine and keep that identifier unchanged over time.",
  "Configure the gateway with the MQTT host, username, password, and WebSocket path /mqtt.",
  "Publish JSON telemetry to site/{device_id}/telemetry using QoS 1 over WSS on port 443.",
  "Verify that the connection is accepted and the status-check endpoint changes to connected after the first valid message.",
]

const pitfalls = [
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
]

const troubleshooting = [
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
]

export function MqttIntegrationBody() {
  return (
    <div className="space-y-10">
      <DocsPageHeader
        eyebrow="Developers"
        title="MQTT integration (technical)"
        badges={["MQTT over WSS", "Payload schema", "Reference publishers"]}
        icon={CableIcon}
        description={
          <>
            The full technical reference for connecting a real-machine gateway to PeakSoft: connection
            settings, topic naming, payload schema, example code, validation, and troubleshooting. For the
            non-technical overview, see{" "}
            <Link
              className="font-medium text-primary underline underline-offset-4 hover:text-primary/90"
              href="/docs/connect"
            >
              connecting your machines
            </Link>
            .
          </>
        }
      />

      <Callout variant="info" title="What you are connecting">
        Your machines usually connect through a small site gateway service that reads local telemetry and
        forwards it to PeakSoft over an authenticated MQTT connection.
      </Callout>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">What you need from PeakSoft</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {handoffItems.map((item) => (
              <div key={item} className="rounded-lg border bg-card p-4 text-sm text-muted-foreground leading-relaxed">
                <div className="font-medium text-foreground">{item}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">What your gateway must do</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {onboardingSteps.map((step, index) => (
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
            Connection
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Exact broker settings
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            Use these settings in your MQTT client or site gateway exactly as shown unless PeakSoft gives
            you a different value.
          </p>
        </div>

        <Snippet title="Broker endpoint" value={MQTT_BROKER_WSS_URL_EXAMPLE} type="MQTT">
          {MQTT_BROKER_WSS_URL_EXAMPLE}
        </Snippet>

        <div className="grid gap-4 lg:grid-cols-2">
          {connectionSettings.map((setting) => (
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

        <Callout variant="warning" title="Required external connection format">
          Use <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{MQTT_BROKER_WSS_URL_EXAMPLE}</code>{" "}
          with TLS enabled. Do not replace this with a plain WebSocket or unsecured MQTT connection.
        </Callout>
      </section>

      <Separator />

      <section id="topic" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Topic
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Publish topic
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            Publish one telemetry stream per machine using the topic pattern below.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <Snippet title="Required topic" value={MQTT_TOPIC_EXAMPLE} type="MQTT">
              {MQTT_TOPIC_EXAMPLE}
            </Snippet>

            <Snippet
              title="Topic examples"
              value={"site/dev-001/telemetry\nsite/press-7/telemetry\nsite/lineA_motor_02/telemetry"}
              type="MQTT"
            >
              {"site/dev-001/telemetry\nsite/press-7/telemetry\nsite/lineA_motor_02/telemetry"}
            </Snippet>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Device ID rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex gap-3">
                <Badge variant="secondary" className="mt-0.5 shrink-0 text-xs">
                  Stable
                </Badge>
                <span className="leading-relaxed">
                  Keep the same <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">device_id</code>{" "}
                  for the same physical machine over time.
                </span>
              </div>
              <div className="flex gap-3">
                <Badge variant="secondary" className="mt-0.5 shrink-0 text-xs">
                  Unique
                </Badge>
                <span className="leading-relaxed">
                  Use one unique ID per physical asset.
                </span>
              </div>
              <div className="flex gap-3">
                <Badge variant="secondary" className="mt-0.5 shrink-0 text-xs">
                  Safe
                </Badge>
                <span className="leading-relaxed">
                  Use letters, numbers, dashes, and underscores only.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Diagram
            title="Topic structure"
            description="Expand to inspect the topic segments and how device IDs fit into the publish path."
          >
            <TopicStructureDiagram />
          </Diagram>
          <Diagram
            title="Message structure"
            description="Expand to review how the MQTT topic and JSON payload work together."
          >
            <MessageContractDiagram />
          </Diagram>
        </div>
      </section>

      <Separator />

      <section id="payload" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Payload
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Telemetry request body schema
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            Each MQTT message must contain a JSON telemetry payload that follows this schema.
          </p>
        </div>

        <Callout variant="default" title="Schema usage">
          MQTT does not use an HTTP request body, but the payload you publish should match this JSON schema.
        </Callout>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Required fields</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="flex gap-3">
                  <code className="mt-0.5 shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-xs">timestamp</code>
                  <span className="leading-relaxed">ISO 8601 timestamp, UTC preferred.</span>
                </div>
                <Separator />
                <div className="leading-relaxed">
                  Include one or more metric fields such as{" "}
                  <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">temperature</code>,{" "}
                  <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">pressure</code>,{" "}
                  <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">vibration</code>,{" "}
                  <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">power_draw</code>, or{" "}
                  <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">rotational_speed</code>.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Optional fields</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">status</code> can be{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ok</code>,{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">warning</code>, or{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">critical</code>.
              </CardContent>
            </Card>

            <Callout variant="info" title="Data formatting">
              Send numeric readings as JSON numbers, keep field names stable, and normalize units before
              publishing.
            </Callout>
          </div>

          <div className="space-y-4">
            <Snippet title="Telemetry schema" value={requestBodySchema} type="JSON">
              {requestBodySchema}
            </Snippet>
            <Snippet title="Example payload" value={examplePayload} type="JSON">
              {examplePayload}
            </Snippet>
          </div>
        </div>
      </section>

      <Separator />

      <section id="publisher-example" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Example
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Reference publishers
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            Use these examples as starting points for your gateway or test script. Each one connects over
            WSS, authenticates with username and password, publishes to{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">site/&lt;device_id&gt;/telemetry</code>,
            and sends JSON telemetry with QoS 1.
          </p>
        </div>

        <p className="text-sm text-muted-foreground">Press Run to see what a publisher prints once connected:</p>
        <SimulatedTerminal command="python publisher.py" lines={publisherRunOutput} label="publisher" />

        <Tabs defaultValue="python" className="space-y-4">
          <TabsList>
            <TabsTrigger value="python">Python</TabsTrigger>
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="csharp">C#</TabsTrigger>
          </TabsList>

          <TabsContent value="python" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Python (`paho-mqtt`)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Snippet title="Install dependency" value="pip install paho-mqtt" type="bash">
                  pip install paho-mqtt
                </Snippet>
                <CodeBlock language="python">{pythonPublisherExample}</CodeBlock>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="javascript" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">JavaScript / Node.js (`mqtt`)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Snippet title="Install dependency" value="npm install mqtt" type="bash">
                  npm install mqtt
                </Snippet>
                <CodeBlock language="javascript">{javascriptPublisherExample}</CodeBlock>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="csharp" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">C# (`MQTTnet`)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Snippet title="Install dependency" value="dotnet add package MQTTnet" type="bash">
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
            Verify
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            How to confirm your connection is working
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            After you send at least one valid telemetry message, the status URL provided by PeakSoft
            should show your real-machine source as connected.
          </p>
        </div>

        <Snippet title="Status check command" value={statusCommand} type="bash">
          {statusCommand}
        </Snippet>

        <div className="grid gap-4 lg:grid-cols-2">
          <DocsResponseExample title="Before the first valid publish" status={200}>
            {disconnectedStatusExample}
          </DocsResponseExample>
          <DocsResponseExample title="After a successful publish" status={200}>
            {connectedStatusExample}
          </DocsResponseExample>
        </div>
      </section>

      <Separator />

      <section id="pitfalls" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Avoid
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Common mistakes
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {pitfalls.map((p) => (
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
            Troubleshooting
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            If the gateway does not connect or send data
          </h2>
        </div>

        <div className="space-y-2">
          {troubleshooting.map((t) => (
            <Card key={t.problem}>
              <CardHeader>
                <CardTitle className="text-base">{t.problem}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                {t.solution}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
