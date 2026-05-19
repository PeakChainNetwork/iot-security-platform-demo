import Link from "next/link"

import { Diagram } from "@/features/docs/components/diagram"
import { PlatformApiDiagram } from "@/features/docs/components/diagrams/platform-api-diagram"
import { DocsEndpointTable } from "@/features/docs/components/docs-endpoint-table"
import { DocsPageHeader } from "@/features/docs/components/docs-page-header"
import { DocsResponseExample } from "@/features/docs/components/docs-response-example"
import { DocsSection } from "@/features/docs/components/docs-section"
import { BracesIcon } from "lucide-react"

const deviceRows = [
  { method: "GET", path: "/api/v1/devices", desc: "List devices with latest twin state." },
  { method: "GET", path: "/api/v1/devices/{id}", desc: "Device detail, alerts, anomalies." },
  { method: "GET", path: "/api/v1/devices/{id}/telemetry", desc: "Historical metric rows." },
]

const alertRows = [
  { method: "GET", path: "/api/v1/alerts", desc: "Active and historical alerts." },
]

const vulnRows = [
  { method: "GET", path: "/api/v1/devices/{id}/vulnerabilities", desc: "CVEs matched to device profile." },
  { method: "GET", path: "/api/v1/vulnerabilities/summary", desc: "Fleet vulnerability counts." },
]

const dashboardRows = [
  { method: "GET", path: "/api/v1/system/health", desc: "Fleet KPIs (devices monitored, threats, health)." },
  { method: "WS", path: "/api/v1/ws/dashboard", desc: "Live widget stream." },
  { method: "WS", path: "/api/v1/ws/telemetry?device_id={id}", desc: "Per-device live metrics." },
]

const alertExample = `{
  "id": "alert-9f2c",
  "device_id": "press-01",
  "severity": "high",
  "title": "Pressure above threshold",
  "timestamp_ms": 1716042620000
}`

const wsTelemetryExample = `{
  "device_id": "press-01",
  "timestamp": "2026-05-18T14:30:00+00:00",
  "metrics": {
    "temperature": 45.8,
    "pressure": 124.8,
    "status": "ok"
  }
}`

export function PlatformApiBody() {
  return (
    <div className="space-y-10">
      <DocsPageHeader
        eyebrow="Guides"
        title="Platform API capabilities"
        description="REST and WebSocket surfaces grouped by what you read back after MQTT telemetry is ingested."
        icon={BracesIcon}
      />

      <Diagram title="Read paths after ingest" description="Telemetry enters once; these endpoints expose the processed state.">
        <PlatformApiDiagram />
      </Diagram>

      <DocsSection id="devices" title="Devices & live telemetry">
        <DocsEndpointTable rows={deviceRows} />
        <DocsResponseExample title="GET /api/v1/devices/{id}" status={200}>
          {`{
  "id": "press-01",
  "status": "online",
  "last_seen": "2026-05-18T14:30:00+00:00",
  "risk_score": 24,
  "digital_twin_state": { "temperature": 45.8, "pressure": 124.8, "status": "ok" }
}`}
        </DocsResponseExample>
        <DocsResponseExample title="WebSocket /api/v1/ws/telemetry" status={101}>
          {wsTelemetryExample}
        </DocsResponseExample>
      </DocsSection>

      <DocsSection id="alerts" title="Alerts & anomalies">
        <DocsEndpointTable rows={alertRows} />
        <DocsResponseExample title="GET /api/v1/alerts (item)" status={200}>
          {alertExample}
        </DocsResponseExample>
        <p className="text-sm text-muted-foreground">
          Per-device <code className="rounded bg-muted px-1 font-mono text-xs">risk_score</code> and anomaly fields are on the device detail response.
        </p>
      </DocsSection>

      <DocsSection id="vulnerabilities" title="Vulnerability tracking">
        <DocsEndpointTable rows={vulnRows} />
      </DocsSection>

      <DocsSection id="dashboard" title="Dashboard KPIs">
        <DocsEndpointTable rows={dashboardRows} />
      </DocsSection>

      <p className="text-sm text-muted-foreground">
        Interactive schemas and try-it requests:{" "}
        <Link href="/api" className="text-primary underline underline-offset-4">
          API reference
        </Link>
        . Postman collection:{" "}
        <Link href="/api/postman" className="text-primary underline underline-offset-4">
          import guide
        </Link>
        .
      </p>
    </div>
  )
}
