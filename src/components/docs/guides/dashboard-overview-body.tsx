import Link from "next/link"

import { Callout } from "@/components/docs/callout"
import { Diagram } from "@/components/docs/diagram"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ActivityIcon,
  AlertTriangleIcon,
  GaugeIcon,
  LayersIcon,
  MonitorIcon,
  RadioIcon,
  ShieldAlertIcon,
  WifiIcon,
} from "lucide-react"

const kpiCards = [
  {
    label: "Threats detected",
    field: "threats_detected",
    description: "Total count of threats identified across all monitored devices.",
    example: "12",
  },
  {
    label: "Devices monitored",
    field: "devices_monitored",
    description: "Number of IoT devices actively reporting telemetry.",
    example: "48",
  },
  {
    label: "System uptime",
    field: "system_uptime_pct",
    description: "Platform availability as a percentage, e.g. 99.9%.",
    example: "99.9%",
  },
  {
    label: "Response time",
    field: "avg_response_time_ms",
    description: "Average API response latency in milliseconds.",
    example: "42ms",
  },
]

const pipelineStages = [
  { name: "Kafka Consumer", desc: "Ingests raw events from the message bus." },
  { name: "Schema Validator", desc: "Rejects payloads that don't match the expected schema." },
  { name: "Event Normalizer", desc: "Maps heterogeneous formats into a unified event model." },
  { name: "Feature Extractor", desc: "Derives rolling statistics and features for ML scoring." },
  { name: "ML Scorer", desc: "Runs anomaly/threat models and attaches risk scores." },
  { name: "Alert Decision", desc: "Evaluates scores against thresholds and emits alerts." },
]

const dataStreams = [
  { name: "Vision Systems", unit: "fps" },
  { name: "Quality Control", unit: "ppm" },
  { name: "Sensors", unit: "readings/s" },
  { name: "Network Traffic", unit: "Mbps" },
]

const severityVariants: Record<string, { variant: "destructive" | "outline" | "secondary"; color: string }> = {
  critical: { variant: "destructive", color: "text-red-600" },
  high: { variant: "outline", color: "text-amber-600" },
  medium: { variant: "secondary", color: "text-foreground" },
  low: { variant: "outline", color: "text-muted-foreground" },
}

const alertColumns = [
  { header: "Severity", desc: "Badge colored by level — critical (red), high (amber), medium (muted), low (outline)." },
  { header: "Title", desc: "Short description of the threat or policy violation." },
  { header: "Source", desc: "The device or subsystem that originated the alert." },
  { header: "Status", desc: "Whether the alert is active or has been dismissed by an operator." },
]

const wsDataTypes = [
  { type: "kpis", desc: "Refreshed KPI card values." },
  { type: "pipeline", desc: "Updated stage throughput, success rate, and latency." },
  { type: "data_streams", desc: "Current stream values and status." },
  { type: "alerts", desc: "New or updated alert entries." },
  { type: "anomalies", desc: "Newly detected anomaly events." },
  { type: "vulnerabilities_summary", desc: "Top CVEs and CVSS score changes." },
]

export function DashboardOverviewBody() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Guide</Badge>
          <Badge variant="secondary">Dashboard</Badge>
        </div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Dashboard overview
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
          The main dashboard at{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">/</code>{" "}
          is the primary interface for security operators. It surfaces KPIs, pipeline health,
          live data streams, alerts, anomalies, vulnerabilities, and device status — all
          updated in real-time via WebSocket.
        </p>
      </div>

      {/* Dashboard layout diagram */}
      <Diagram
        title="Dashboard layout"
        description="How the main sections are arranged on the page, from top to bottom."
      >
        <svg width="100%" viewBox="0 0 720 420" role="img">
          <title>Dashboard layout overview</title>
          <desc>Top-to-bottom layout: KPI row, then pipeline and streams side-by-side, then alerts and vulnerabilities side-by-side, then anomalies and devices side-by-side.</desc>
          <defs>
            <marker id="arr-dl" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M2 1L8 5L2 9" fill="none" stroke="var(--foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
          </defs>
          {/* Row 1: KPIs */}
          <rect x="20" y="16" width="680" height="52" rx="12" fill="var(--chart-1)" opacity="0.12" stroke="var(--chart-1)" strokeWidth="1" />
          <text fontSize="13" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="360" y="36" textAnchor="middle" dominantBaseline="central">KPI Cards</text>
          <text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="360" y="54" textAnchor="middle" dominantBaseline="central">Threats · Devices · Uptime · Response time</text>
          <line x1="360" y1="68" x2="360" y2="90" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-dl)" />
          {/* Row 2: Pipeline (3/5) + Streams (2/5) */}
          <rect x="20" y="92" width="400" height="72" rx="12" fill="var(--chart-2)" opacity="0.12" stroke="var(--chart-2)" strokeWidth="1" />
          <text fontSize="13" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="220" y="118" textAnchor="middle" dominantBaseline="central">Data Pipeline</text>
          <text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="220" y="138" textAnchor="middle" dominantBaseline="central">6 stages · status · throughput · latency</text>
          <text fontSize="10" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="220" y="154" textAnchor="middle" dominantBaseline="central">3/5 width</text>
          <rect x="430" y="92" width="270" height="72" rx="12" fill="var(--chart-3)" opacity="0.12" stroke="var(--chart-3)" strokeWidth="1" />
          <text fontSize="13" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="565" y="118" textAnchor="middle" dominantBaseline="central">Data Streams</text>
          <text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="565" y="138" textAnchor="middle" dominantBaseline="central">4 streams · value · unit</text>
          <text fontSize="10" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="565" y="154" textAnchor="middle" dominantBaseline="central">2/5 width</text>
          <line x1="360" y1="164" x2="360" y2="186" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-dl)" />
          {/* Row 3: Alerts + Vulnerabilities */}
          <rect x="20" y="188" width="400" height="72" rx="12" fill="var(--destructive)" opacity="0.08" stroke="var(--destructive)" strokeWidth="1" />
          <text fontSize="13" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="220" y="214" textAnchor="middle" dominantBaseline="central">Alerts Table</text>
          <text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="220" y="234" textAnchor="middle" dominantBaseline="central">Severity · Title · Source · Status</text>
          <rect x="430" y="188" width="270" height="72" rx="12" fill="var(--chart-4)" opacity="0.12" stroke="var(--chart-4)" strokeWidth="1" />
          <text fontSize="13" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="565" y="214" textAnchor="middle" dominantBaseline="central">Vulnerability Summary</text>
          <text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="565" y="234" textAnchor="middle" dominantBaseline="central">Top CVEs · CVSS scores</text>
          <line x1="360" y1="260" x2="360" y2="282" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-dl)" />
          {/* Row 4: Anomalies + Devices */}
          <rect x="20" y="284" width="400" height="72" rx="12" fill="var(--chart-2)" opacity="0.14" stroke="var(--chart-2)" strokeWidth="1" />
          <text fontSize="13" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="220" y="310" textAnchor="middle" dominantBaseline="central">Anomaly Detector</text>
          <text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="220" y="330" textAnchor="middle" dominantBaseline="central">Device ID · Severity · Anomaly score</text>
          <rect x="430" y="284" width="270" height="72" rx="12" fill="var(--chart-3)" opacity="0.12" stroke="var(--chart-3)" strokeWidth="1" />
          <text fontSize="13" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="565" y="310" textAnchor="middle" dominantBaseline="central">Device Grid</text>
          <text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="565" y="330" textAnchor="middle" dominantBaseline="central">Up to 6 devices · risk · compliance</text>
          {/* WebSocket annotation */}
          <rect x="20" y="376" width="680" height="32" rx="10" fill="var(--chart-1)" opacity="0.06" stroke="var(--chart-1)" strokeWidth="1" strokeDasharray="5 3" />
          <text fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="360" y="392" textAnchor="middle" dominantBaseline="central">WebSocket /api/v1/ws/dashboard — all sections update in real-time</text>
        </svg>
      </Diagram>

      <Separator />

      {/* Section 1: KPI Cards */}
      <section id="kpi-cards" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Top row
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            KPI cards
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            Four key performance indicators shown as cards across the top of the dashboard.
            Values come from the{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">SystemHealthRead</code>{" "}
            response model.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {kpiCards.map((kpi) => (
            <div key={kpi.field} className="rounded-lg border bg-card p-4">
              <div className="text-xs text-muted-foreground">{kpi.label}</div>
              <div className="mt-2 text-lg font-semibold">{kpi.example}</div>
              <div className="mt-1 text-sm text-muted-foreground">{kpi.description}</div>
              <code className="mt-2 block rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                {kpi.field}
              </code>
            </div>
          ))}
        </div>

        <Callout variant="info" title="Live values">
          KPI cards refresh automatically via WebSocket. A brief loading skeleton is shown while
          the initial data loads.
        </Callout>
      </section>

      <Separator />

      {/* Section 2: Data Pipeline */}
      <section id="data-pipeline" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <LayersIcon className="size-4 text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Pipeline health
            </p>
          </div>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Data pipeline
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            Displayed in a 2-column grid occupying the left 3/5 of the row. Each card represents
            a processing stage and shows its current health.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pipelineStages.map((stage) => (
            <Card key={stage.name}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm">
                  {stage.name}
                  <Badge variant="secondary" className="text-xs">healthy</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-muted-foreground">
                <p className="leading-relaxed">{stage.desc}</p>
                <div className="flex flex-wrap gap-3 pt-1 text-xs">
                  <span><span className="font-medium text-foreground">Throughput</span> events/s</span>
                  <span><span className="font-medium text-foreground">Success</span> %</span>
                  <span><span className="font-medium text-foreground">Latency</span> ms</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Callout variant="warning" title="Status badges">
          Each stage shows a colored status badge:{" "}
          <span className="font-medium text-green-600">healthy</span> (green),{" "}
          <span className="font-medium text-amber-600">warning</span> (amber), or{" "}
          <span className="font-medium text-red-600">critical</span> (red). A critical stage
          means data may not be reaching downstream consumers.
        </Callout>
      </section>

      <Separator />

      {/* Section 3: Data Streams */}
      <section id="data-streams" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <RadioIcon className="size-4 text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Live feeds
            </p>
          </div>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Data streams
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            Shown in the right 2/5 column alongside the pipeline. Each card displays a stream
            name, its current status, and the latest measured value with its unit.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {dataStreams.map((stream) => (
            <div key={stream.name} className="flex items-center justify-between rounded-lg border bg-card p-4">
              <div>
                <div className="text-sm font-medium text-foreground">{stream.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">Unit: {stream.unit}</div>
              </div>
              <Badge variant="secondary" className="text-xs">active</Badge>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Section 4: Alerts Table */}
      <section id="alerts" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <AlertTriangleIcon className="size-4 text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Security events
            </p>
          </div>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Alerts table
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            Lists active and recent alerts in a tabular layout. New alerts appear at the top
            as they arrive over WebSocket.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Table columns</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {alertColumns.map((col) => (
              <div key={col.header} className="flex gap-3">
                <Badge variant="secondary" className="mt-0.5 shrink-0 text-xs">{col.header}</Badge>
                <span className="leading-relaxed">{col.desc}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(severityVariants).map(([level, cfg]) => (
            <div key={level} className="rounded-lg border bg-card p-4 text-center">
              <Badge variant={cfg.variant} className={`text-xs ${cfg.color}`}>
                {level}
              </Badge>
              <div className="mt-2 text-xs text-muted-foreground">
                {level === "critical" && "Immediate action required"}
                {level === "high" && "Investigate promptly"}
                {level === "medium" && "Review when possible"}
                {level === "low" && "Informational only"}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Section 5: Anomaly Detector */}
      <section id="anomalies" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ActivityIcon className="size-4 text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              ML-driven
            </p>
          </div>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Anomaly detector
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            Displays recent anomalies detected by the ML scoring pipeline. Each card shows the
            originating device, severity, and a numeric anomaly score from 0 (normal) to
            100 (highly anomalous).
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs text-muted-foreground">Device ID</div>
            <div className="mt-1 text-sm font-medium text-foreground">
              The unique identifier of the device that triggered the anomaly.
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs text-muted-foreground">Severity</div>
            <div className="mt-1 text-sm font-medium text-foreground">
              Colored badge matching the alert severity scale (critical, high, medium, low).
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs text-muted-foreground">Anomaly score</div>
            <div className="mt-1 text-sm font-medium text-foreground">
              0–100 score where higher values indicate greater deviation from baseline behaviour.
            </div>
          </div>
        </div>

        <Callout variant="info" title="Score interpretation">
          Scores below 30 are typically noise. Scores above 70 warrant investigation. The
          threshold for alert generation is configurable per device type.
        </Callout>
      </section>

      <Separator />

      {/* Section 6: Vulnerability Summary */}
      <section id="vulnerabilities" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldAlertIcon className="size-4 text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              CVE tracking
            </p>
          </div>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Vulnerability summary
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            Shows the top known CVEs affecting monitored devices. Each entry displays the CVE ID
            in monospace and a CVSS score badge color-coded by severity.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">CVE ID</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              Displayed in{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">monospace</code>{" "}
              format (e.g.{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">CVE-2026-1234</code>).
              Links to the full vulnerability detail when available.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">CVSS score</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              A numeric badge from 0.0 to 10.0. Scores 9.0+ are{" "}
              <span className="font-medium text-red-600">critical</span>, 7.0–8.9 are{" "}
              <span className="font-medium text-amber-600">high</span>, 4.0–6.9 are{" "}
              <span className="font-medium text-foreground">medium</span>, and below 4.0 are{" "}
              <span className="font-medium text-muted-foreground">low</span>.
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Section 7: Device Grid */}
      <section id="devices" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MonitorIcon className="size-4 text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Fleet overview
            </p>
          </div>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Device grid
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            Shows up to 6 device cards, each linking to the device detail page. Gives operators
            an at-a-glance view of the most relevant devices.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Card fields</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex gap-3">
              <Badge variant="secondary" className="mt-0.5 shrink-0 text-xs">Name</Badge>
              <span className="leading-relaxed">Human-readable device name.</span>
            </div>
            <div className="flex gap-3">
              <Badge variant="secondary" className="mt-0.5 shrink-0 text-xs">Type</Badge>
              <span className="leading-relaxed">Device category (sensor, camera, PLC, etc.).</span>
            </div>
            <div className="flex gap-3">
              <Badge variant="secondary" className="mt-0.5 shrink-0 text-xs">Status</Badge>
              <span className="leading-relaxed">
                Online/offline badge. Offline devices are flagged for attention.
              </span>
            </div>
            <div className="flex gap-3">
              <Badge variant="secondary" className="mt-0.5 shrink-0 text-xs">Risk</Badge>
              <span className="leading-relaxed">
                Numeric risk score (0–100). Higher values indicate more exposure.
              </span>
            </div>
            <div className="flex gap-3">
              <Badge variant="secondary" className="mt-0.5 shrink-0 text-xs">Compliance</Badge>
              <span className="leading-relaxed">
                Compliance score (0–100). Shows how well the device meets security policies.
              </span>
            </div>
          </CardContent>
        </Card>

        <Callout variant="default" title="Detail pages">
          Clicking a device card navigates to{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">/devices/[id]</code>{" "}
          where full telemetry history, configuration, and vulnerability details are available.
        </Callout>
      </section>

      <Separator />

      {/* Section 8: Real-time Updates */}
      <section id="websocket" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <WifiIcon className="size-4 text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Live connection
            </p>
          </div>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Real-time updates (WebSocket)
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            All dashboard widgets subscribe to a single WebSocket endpoint at{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">/api/v1/ws/dashboard</code>.
            The connection uses exponential backoff for automatic reconnection if dropped.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {wsDataTypes.map((ws) => (
            <div key={ws.type} className="rounded-lg border bg-card p-4">
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{ws.type}</code>
              <div className="mt-2 text-sm text-muted-foreground leading-relaxed">{ws.desc}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <GaugeIcon className="size-4 text-muted-foreground" />
                Connection behaviour
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground leading-relaxed">
              <p>
                On page load the dashboard opens a WebSocket to{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">/api/v1/ws/dashboard</code>.
                The server pushes new data as JSON messages tagged with a{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">type</code>{" "}
                field matching the categories above.
              </p>
              <p>
                If the connection drops, the client retries with exponential backoff starting at
                1 second, doubling up to a maximum of 30 seconds between attempts.
              </p>
            </CardContent>
          </Card>

          <Callout variant="warning" title="Stale data indicator">
            If the WebSocket has been disconnected for more than 10 seconds, the dashboard
            shows a connection warning banner. Data displayed may be stale until the
            connection is restored.
          </Callout>
        </div>
      </section>
    </div>
  )
}
