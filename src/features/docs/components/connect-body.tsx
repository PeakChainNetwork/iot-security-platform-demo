"use client"

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

const flowNodes: FlowNode[] = [
  { icon: CpuIcon, title: "Your machine", subtitle: "reads telemetry", tile: "bg-chart-3/15 text-chart-3" },
  { icon: RadioTowerIcon, title: "MQTT message", subtitle: "site/<id>/telemetry", tile: "bg-chart-5/15 text-chart-5" },
  { icon: ShieldCheckIcon, title: "Peaksoft EU", subtitle: "ingests & scores", tile: "bg-primary/15 text-primary", emphasized: true },
]

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

const payloadFields = [
  {
    name: "timestamp",
    type: "string · ISO 8601",
    meaning: "When the reading was taken (UTC).",
    required: true,
  },
  { name: "temperature", type: "number", meaning: "How hot the machine is." },
  { name: "pressure", type: "number", meaning: "Pressure reading." },
  { name: "vibration", type: "number", meaning: "How much it shakes." },
  { name: "power_draw", type: "number", meaning: "How much power it uses." },
  { name: "rotational_speed", type: "number", meaning: "How fast it spins." },
  { name: "status", type: "ok | warning | critical", meaning: "The machine's own health word." },
] as const

const connectionFields = [
  { name: "endpoint", type: "wss · port 443 · /mqtt", meaning: "Secure address PeakSoft gives you.", required: true },
  { name: "auth", type: "username + password", meaning: "Credentials from PeakSoft. Keep them secret.", required: true },
  { name: "topic", type: `site/${DEVICE_ID_PLACEHOLDER}/telemetry`, meaning: "One stable name per machine.", required: true },
  { name: "delivery", type: "QoS 1 · retain off", meaning: "Keep trying until it arrives.", required: true },
] as const

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

export function ConnectBody() {
  return (
    <div className="space-y-10">
      <DocsPageHeader
        eyebrow="Documentation"
        title="Connecting your machines"
        badges={["MQTT over WSS", "JSON"]}
        icon={CableIcon}
        description="Your machines send a small message every few seconds. Here's what they send and where it goes — your IT team can wire it up in an afternoon."
      />

      <div className="rounded-2xl border bg-muted/20 p-5 sm:p-6">
        <div className="mb-5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          The whole idea
        </div>
        <FlowDiagram nodes={flowNodes} connectorLabels={["publish", "over WSS"]} />
      </div>

      {/* Connection schema */}
      <section id="connect" className="scroll-mt-24 space-y-3">
        <h2 className="font-heading text-xl font-semibold tracking-tight">Connection</h2>
        <DocsFieldTable fields={[...connectionFields]} title="connection contract" />
        <Callout variant="warning" title="Use the secure address only">
          Connect with <code>{MQTT_BROKER_WSS_URL_EXAMPLE}</code> and TLS on. Never use a plain connection.
        </Callout>
      </section>

      {/* Topic */}
      <section id="topic" className="scroll-mt-24 space-y-3">
        <h2 className="font-heading text-xl font-semibold tracking-tight">Topic</h2>
        <Snippet title="Publish to" value={MQTT_TOPIC_EXAMPLE} type="MQTT">
          {MQTT_TOPIC_EXAMPLE}
        </Snippet>
        <p className="text-sm leading-relaxed text-muted-foreground">
          One stable name per machine — letters, numbers, dashes, underscores. Reuse it forever.
        </p>
      </section>

      {/* Message schema — the star */}
      <section id="message" className="scroll-mt-24 space-y-3">
        <h2 className="font-heading text-xl font-semibold tracking-tight">What each machine sends</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Only <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">timestamp</code> is required.
          Add whichever numbers your machine has.
        </p>
        <DocsFieldTable fields={[...payloadFields]} title="telemetry payload" />

        <p className="text-sm text-muted-foreground">
          Build a message — toggle fields and watch the JSON update:
        </p>
        <PayloadBuilder />

        <DocsDetails summary="Full JSON Schema" description="The exact contract for schema validation.">
          <Snippet title="JSON Schema" value={requestBodySchema} type="JSON">
            {requestBodySchema}
          </Snippet>
        </DocsDetails>
      </section>

      <Separator />

      {/* Everything else, collapsed */}
      <DocsDetails summary="Example code" description="Connect and publish every 10 seconds — Python, JavaScript, or C#.">
        <Tabs defaultValue="python" className="space-y-3">
          <TabsList>
            <TabsTrigger value="python">Python</TabsTrigger>
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="csharp">C#</TabsTrigger>
          </TabsList>
          <TabsContent value="python" className="space-y-3">
            <Snippet title="Install" value="pip install paho-mqtt" type="bash">pip install paho-mqtt</Snippet>
            <CodeBlock language="python">{pythonPublisherExample}</CodeBlock>
          </TabsContent>
          <TabsContent value="javascript" className="space-y-3">
            <Snippet title="Install" value="npm install mqtt" type="bash">npm install mqtt</Snippet>
            <CodeBlock language="javascript">{javascriptPublisherExample}</CodeBlock>
          </TabsContent>
          <TabsContent value="csharp" className="space-y-3">
            <Snippet title="Install" value="dotnet add package MQTTnet" type="bash">dotnet add package MQTTnet</Snippet>
            <CodeBlock language="csharp">{csharpPublisherExample}</CodeBlock>
          </TabsContent>
        </Tabs>
      </DocsDetails>

      <DocsDetails summary="Check it works" description="Confirm your first message arrived.">
        <SimulatedTerminal command={statusCommand} lines={statusOutput} label="status check" />
        <p className="text-sm leading-relaxed text-muted-foreground">
          Before your first message the status reads <code>disconnected</code>; after it, <code>connected</code>.
        </p>
      </DocsDetails>

      <p className="text-sm text-muted-foreground">
        New here? See{" "}
        <Link href="/docs/how-it-works" className="text-primary underline underline-offset-4">
          how it works
        </Link>
        . For the full technical reference — broker settings, multi-language code, troubleshooting — see{" "}
        <Link href="/docs/developers/mqtt-integration" className="text-primary underline underline-offset-4">
          MQTT integration
        </Link>
        , and full request/response shapes in the{" "}
        <Link href="/docs/api" className="text-primary underline underline-offset-4">
          API reference
        </Link>
        .
      </p>
    </div>
  )
}
