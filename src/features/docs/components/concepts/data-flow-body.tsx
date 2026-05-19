import Link from "next/link"

import { Diagram } from "@/features/docs/components/diagram"
import { DataFlowDiagram } from "@/features/docs/components/diagrams/data-flow-diagram"
import { DocsEndpointTable } from "@/features/docs/components/docs-endpoint-table"
import { DocsPageHeader } from "@/features/docs/components/docs-page-header"
import { DocsResponseExample } from "@/features/docs/components/docs-response-example"
import { DocsSection } from "@/features/docs/components/docs-section"
import { Snippet } from "@/features/docs/components/snippet"
import { ArrowLeftRightIcon } from "lucide-react"

const restEndpoints = [
  { method: "GET", path: "/health", desc: "Liveness check." },
  { method: "GET", path: "/api/v1/ingestion/status", desc: "MQTT source connection state." },
  { method: "GET", path: "/api/v1/devices", desc: "All devices with latest twin snapshot." },
  { method: "GET", path: "/api/v1/devices/{id}", desc: "One device with alerts and anomalies." },
  { method: "GET", path: "/api/v1/alerts", desc: "Fleet alerts." },
  { method: "GET", path: "/api/v1/devices/{id}/vulnerabilities", desc: "CVE findings for a device." },
  { method: "GET", path: "/api/v1/system/health", desc: "Fleet KPIs for dashboard widgets." },
]

const wsStreams = [
  { path: "/api/v1/ws/telemetry?device_id={id}", desc: "Live metrics for one device (JSON per message)." },
  { path: "/api/v1/ws/dashboard", desc: "Aggregated dashboard widget updates." },
]

const healthExample = `{
  "status": "healthy",
  "service": "iot-security-backend"
}`

const ingestionExample = `{
  "mqtt_broker": { "connected": true, "host": "mqtt.example", "port": 1883 },
  "sources": {
    "real_machines": {
      "status": "connected",
      "topic_pattern": "site/+/telemetry",
      "message_count": 42,
      "last_message_at": "2026-05-18T14:30:00+00:00",
      "last_device_id": "press-01"
    }
  }
}`

const deviceExample = `{
  "id": "press-01",
  "name": "Hydraulic press 01",
  "status": "online",
  "last_seen": "2026-05-18T14:30:00+00:00",
  "risk_score": 24,
  "digital_twin_state": {
    "temperature": 45.8,
    "pressure": 124.8,
    "status": "ok"
  }
}`

export function DataFlowBody() {
  return (
    <div className="space-y-10">
      <DocsPageHeader
        eyebrow="Concepts"
        title="Data flow"
        description="Publish telemetry on MQTT; read state and streams over HTTPS and WSS on your API base URL."
        icon={ArrowLeftRightIcon}
      />

      <Diagram title="Inputs and outputs" description="One write path in; REST and WebSocket read paths out.">
        <DataFlowDiagram />
      </Diagram>

      <DocsSection title="MQTT input" description="JSON payload contract is defined in the MQTT integration guide.">
        <Snippet
          title="Example publish"
          value={`mosquitto_pub -h <mqtt-host> -p 1883 \\
  -t 'site/<device_id>/telemetry' \\
  -m '{"timestamp":"2026-05-18T14:30:00+00:00","temperature":25.0,"pressure":100.0,"status":"ok"}'`}
          type="shell"
        />
        <p className="text-sm text-muted-foreground">
          Details:{" "}
          <Link href="/guides/iot-integration-technical" className="text-primary underline underline-offset-4">
            MQTT integration
          </Link>
        </p>
      </DocsSection>

      <DocsSection title="REST endpoints">
        <DocsEndpointTable rows={restEndpoints} />
        <DocsResponseExample title="GET /health" status={200}>
          {healthExample}
        </DocsResponseExample>
        <DocsResponseExample title="GET /api/v1/ingestion/status" status={200}>
          {ingestionExample}
        </DocsResponseExample>
        <DocsResponseExample title="GET /api/v1/devices/{id}" status={200}>
          {deviceExample}
        </DocsResponseExample>
        <p className="text-sm text-muted-foreground">
          Full schemas:{" "}
          <Link href="/api" className="text-primary underline underline-offset-4">
            API reference
          </Link>
        </p>
      </DocsSection>

      <DocsSection title="WebSocket streams" description="Connect with wss://&lt;api-host&gt; plus the path below.">
        <div className="space-y-3">
          {wsStreams.map((s) => (
            <div key={s.path} className="rounded-xl border border-chart-2/20 bg-chart-2/5 p-4">
              <code className="font-mono text-xs text-foreground">{s.path}</code>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </DocsSection>
    </div>
  )
}
