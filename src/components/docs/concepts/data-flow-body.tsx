import Link from "next/link"

import { Callout } from "@/components/docs/callout"
import { Diagram } from "@/components/docs/diagram"
import { Snippet } from "@/components/docs/snippet"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ArrowDownIcon,
  ActivityIcon,
  ZapIcon,
  DatabaseIcon,
  RadioIcon,
  MonitorIcon,
} from "lucide-react"

const stages = [
  {
    step: 1,
    icon: RadioIcon,
    color: "var(--chart-2)",
    title: "Ingress",
    subtitle: "MQTT telemetry arrives",
    desc: "Devices (or the iot-simulator) publish JSON payloads on factory/<device_id>/telemetry. The Mosquitto broker relays messages to all subscribers, including the backend's MQTT listener.",
    detail: "Each message includes a timestamp, one or more numeric metrics (temperature, pressure, vibration, etc.), and an optional status field.",
  },
  {
    step: 2,
    icon: ZapIcon,
    color: "var(--chart-1)",
    title: "Normalisation",
    subtitle: "Parse, validate, enrich",
    desc: "The backend parses incoming JSON, validates required fields, correlates the device_id with known device records, and enriches the reading with risk/compliance context from the ML pipeline.",
    detail: "Invalid or malformed payloads are dropped with a log entry. Recognised devices get their current-state snapshot updated atomically.",
  },
  {
    step: 3,
    icon: DatabaseIcon,
    color: "var(--chart-4)",
    title: "Persistence (optional)",
    subtitle: "Store for audit & history",
    desc: "When history storage is enabled, normalised readings are written to PostgreSQL for long-term retention. This enables historical charts, compliance audits, and ML model retraining.",
    detail: "The write is asynchronous and non-blocking — live streaming is never delayed by database I/O.",
  },
  {
    step: 4,
    icon: ActivityIcon,
    color: "var(--chart-3)",
    title: "Live serving",
    subtitle: "REST queries + WebSocket push",
    desc: "REST endpoints serve synchronous queries (device list, alerts, system health). WebSocket hubs push incremental updates to subscribed dashboard clients in real time.",
    detail: "Two WebSocket streams: /api/v1/ws/dashboard for widget-level updates and /api/v1/ws/telemetry?device_id=… for per-device detail views.",
  },
]

const wsStreams = [
  {
    endpoint: "/api/v1/ws/dashboard",
    purpose: "Widget updates",
    desc: "Pushes aggregated changes for the home dashboard — device count, alert summary, system health KPIs. Clients receive a JSON envelope on every meaningful state change.",
  },
  {
    endpoint: "/api/v1/ws/telemetry",
    purpose: "Per-device stream",
    desc: "Streams individual telemetry readings for a specific device_id. Used by device detail views to render live charts without polling.",
  },
]

const exampleEnvelope = `{
  "type": "telemetry",
  "device_id": "dev-001",
  "timestamp": "2026-04-07T13:23:26.009Z",
  "data": {
    "temperature": 45.849,
    "pressure": 124.801,
    "vibration": 2.646,
    "power_draw": 3.968,
    "rotational_speed": 980.389,
    "status": "ok"
  }
}`

const restEndpoints = [
  {
    method: "GET",
    path: "/api/v1/devices",
    desc: "List all known devices with their latest state snapshot.",
  },
  {
    method: "GET",
    path: "/api/v1/devices/{id}",
    desc: "Single device detail including digital twin sections and recent readings.",
  },
  {
    method: "GET",
    path: "/api/v1/alerts",
    desc: "Active and historical alerts triggered by risk-scoring rules.",
  },
  {
    method: "GET",
    path: "/api/v1/metrics/summary",
    desc: "Aggregated metrics for the dashboard overview widgets.",
  },
  {
    method: "GET",
    path: "/api/v1/system/health",
    desc: "System KPI-style fields — uptime, connected devices, pipeline throughput.",
  },
]

export function DataFlowBody() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Concepts</Badge>
          <Badge variant="secondary">Data flow</Badge>
        </div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Data flow
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
          Telemetry and control data move through the stack in predictable stages:
          from device ingress through normalisation and optional persistence to
          real-time serving via REST and WebSocket. Understanding this pipeline is
          key to debugging latency, adding new metrics, or integrating real hardware.
        </p>
      </div>

      {/* Pipeline overview diagram */}
      <Diagram
        title="Pipeline overview"
        description="End-to-end path from telemetry source to dashboard."
      >
        <svg width="100%" viewBox="0 0 760 320" role="img" className="text-foreground">
          <title>Data flow pipeline</title>
          <defs>
            <marker id="df-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M2 1L8 5L2 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
          </defs>
          {/* Step 1 — Ingress */}
          <rect x="240" y="10" width="280" height="48" rx="12" fill="var(--chart-2)" opacity="0.14" stroke="var(--chart-2)" />
          <text x="300" y="30" textAnchor="middle" fill="var(--foreground)" style={{ fontSize: 11 }} fontWeight="700">1</text>
          <text x="380" y="30" textAnchor="middle" fill="var(--foreground)" style={{ fontSize: 13 }} fontWeight="600">Ingress</text>
          <text x="380" y="48" textAnchor="middle" fill="var(--muted-foreground)" style={{ fontSize: 11 }}>MQTT telemetry arrives at broker</text>
          <line x1="380" y1="58" x2="380" y2="78" stroke="currentColor" strokeWidth="2" markerEnd="url(#df-arrow)" />
          {/* Step 2 — Normalisation */}
          <rect x="240" y="80" width="280" height="48" rx="12" fill="var(--chart-1)" opacity="0.12" stroke="var(--chart-1)" />
          <text x="300" y="100" textAnchor="middle" fill="var(--foreground)" style={{ fontSize: 11 }} fontWeight="700">2</text>
          <text x="380" y="100" textAnchor="middle" fill="var(--foreground)" style={{ fontSize: 13 }} fontWeight="600">Normalisation</text>
          <text x="380" y="118" textAnchor="middle" fill="var(--muted-foreground)" style={{ fontSize: 11 }}>validate · enrich · score risk</text>
          <line x1="380" y1="128" x2="380" y2="148" stroke="currentColor" strokeWidth="2" markerEnd="url(#df-arrow)" />
          {/* Step 3 — State update */}
          <rect x="220" y="150" width="320" height="48" rx="12" fill="var(--chart-5)" opacity="0.12" stroke="var(--chart-5)" />
          <text x="280" y="170" textAnchor="middle" fill="var(--foreground)" style={{ fontSize: 11 }} fontWeight="700">3</text>
          <text x="380" y="170" textAnchor="middle" fill="var(--foreground)" style={{ fontSize: 13 }} fontWeight="600">Device state updated</text>
          <text x="380" y="188" textAnchor="middle" fill="var(--muted-foreground)" style={{ fontSize: 11 }}>latest reading per machine</text>
          {/* Fork — left to persistence, right to live push */}
          <line x1="300" y1="198" x2="160" y2="198" stroke="currentColor" strokeWidth="2" />
          <line x1="160" y1="198" x2="160" y2="242" stroke="currentColor" strokeWidth="2" markerEnd="url(#df-arrow)" />
          <line x1="460" y1="198" x2="600" y2="198" stroke="currentColor" strokeWidth="2" />
          <line x1="600" y1="198" x2="600" y2="242" stroke="currentColor" strokeWidth="2" markerEnd="url(#df-arrow)" />
          {/* Persistence (optional) */}
          <rect x="60" y="244" width="200" height="56" rx="12" fill="var(--chart-4)" opacity="0.14" stroke="var(--chart-4)" strokeDasharray="5 4" />
          <text x="160" y="266" textAnchor="middle" fill="var(--foreground)" style={{ fontSize: 12 }} fontWeight="600">Persistence</text>
          <text x="160" y="286" textAnchor="middle" fill="var(--muted-foreground)" style={{ fontSize: 10 }}>PostgreSQL · optional</text>
          {/* Live serving */}
          <rect x="500" y="244" width="200" height="56" rx="12" fill="var(--chart-3)" opacity="0.14" stroke="var(--chart-3)" />
          <text x="600" y="266" textAnchor="middle" fill="var(--foreground)" style={{ fontSize: 12 }} fontWeight="600">Live serving</text>
          <text x="600" y="286" textAnchor="middle" fill="var(--muted-foreground)" style={{ fontSize: 10 }}>REST + WebSocket → Dashboard</text>
        </svg>
      </Diagram>

      <Separator />

      {/* Detailed stages */}
      <section id="stages" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ArrowDownIcon className="size-4 text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Stage by stage
            </p>
          </div>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Pipeline stages
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            Each telemetry reading passes through these four stages from ingress
            to the user&apos;s screen.
          </p>
        </div>

        <div className="space-y-3">
          {stages.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.step} className="rounded-lg border bg-card p-4">
                <div className="flex gap-3">
                  <div className="flex shrink-0 flex-col items-center gap-1">
                    <span
                      className="flex size-8 items-center justify-center rounded-full text-xs font-bold text-foreground"
                      style={{ backgroundColor: s.color, opacity: 0.18 }}
                    >
                      {s.step}
                    </span>
                    <Icon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{s.title}</span>
                      <span className="text-xs text-muted-foreground">— {s.subtitle}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                    <p className="text-xs text-muted-foreground/80 leading-relaxed">{s.detail}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <Separator />

      {/* WebSocket streams */}
      <section id="websockets" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ActivityIcon className="size-4 text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Real-time
            </p>
          </div>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            WebSocket streams
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            The dashboard subscribes to live data through two persistent streams.
            Both deliver JSON envelopes over standard WebSocket connections.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {wsStreams.map((s) => (
            <Card key={s.endpoint}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-[11px]">WS</Badge>
                  <CardTitle className="text-sm">{s.purpose}</CardTitle>
                </div>
                <code className="mt-1 block rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
                  {s.endpoint}
                </code>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Snippet title="Example WebSocket envelope" value={exampleEnvelope} type="JSON">
          {exampleEnvelope}
        </Snippet>

        <Callout variant="info" title="Digital twin">
          Device detail responses may embed structured &quot;sections&quot; describing
          twin state and findings. See the{" "}
          <Link
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/90"
            href="/docs/api"
          >
            API reference
          </Link>{" "}
          for response shapes.
        </Callout>
      </section>

      <Separator />

      {/* REST endpoints */}
      <section id="rest" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MonitorIcon className="size-4 text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Synchronous
            </p>
          </div>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Key REST endpoints
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            These endpoints serve the dashboard&apos;s initial data load and
            user-triggered actions. All are prefixed with the backend base URL.
          </p>
        </div>

        <div className="space-y-2">
          {restEndpoints.map((e) => (
            <div key={e.path} className="flex gap-3 rounded-lg border bg-card p-4">
              <Badge
                variant={e.method === "GET" ? "secondary" : "outline"}
                className="mt-0.5 shrink-0 font-mono text-[11px]"
              >
                {e.method}
              </Badge>
              <div className="min-w-0">
                <code className="text-sm font-medium text-foreground">{e.path}</code>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{e.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Callout variant="default" title="Full reference">
          For complete request/response schemas, query parameters, and cURL examples,
          see the interactive{" "}
          <Link
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/90"
            href="/docs/api"
          >
            API reference
          </Link>.
        </Callout>
      </section>

      <Separator />

      {/* Data paths comparison */}
      <section id="paths" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Real-time vs historical
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Two data paths
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            The platform serves data through two complementary paths, each optimised
            for its access pattern.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <ZapIcon className="size-4 text-muted-foreground" />
                <CardTitle className="text-sm">Real-time path</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground leading-relaxed">
              <p>
                Telemetry flows from MQTT through the backend directly to WebSocket
                clients. Latency is typically under one second from device publish
                to dashboard render.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="outline" className="text-[11px]">MQTT → Backend</Badge>
                <Badge variant="outline" className="text-[11px]">Backend → WebSocket</Badge>
                <Badge variant="outline" className="text-[11px]">sub-second</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <DatabaseIcon className="size-4 text-muted-foreground" />
                <CardTitle className="text-sm">Historical path</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground leading-relaxed">
              <p>
                Normalised readings are optionally persisted to PostgreSQL.
                REST endpoints then serve historical queries for charts, exports,
                and compliance audits.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="outline" className="text-[11px]">Backend → PostgreSQL</Badge>
                <Badge variant="outline" className="text-[11px]">REST query</Badge>
                <Badge variant="outline" className="text-[11px]">optional</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Related reading */}
      <section id="related" className="scroll-mt-24 space-y-3">
        <h2 className="font-heading text-xl font-semibold tracking-tight">
          Related reading
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/docs/concepts/architecture" className="group no-underline">
            <div className="rounded-lg border bg-card p-4 transition-colors hover:bg-muted/40">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Concepts
              </div>
              <div className="mt-1 text-sm font-medium text-foreground group-hover:text-foreground">
                Architecture — component overview, service inventory, and security layers.
              </div>
            </div>
          </Link>
          <Link href="/docs/guides/iot-integration-technical" className="group no-underline">
            <div className="rounded-lg border bg-card p-4 transition-colors hover:bg-muted/40">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Guides
              </div>
              <div className="mt-1 text-sm font-medium text-foreground group-hover:text-foreground">
                IoT integration — payload contracts, topic rules, and verification steps.
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
