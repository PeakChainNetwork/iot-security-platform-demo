import Link from "next/link"

import { Callout } from "@/components/docs/callout"
import { Diagram } from "@/components/docs/diagram"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  LayersIcon,
  ServerIcon,
  MonitorIcon,
  DatabaseIcon,
  RadioIcon,
  ShieldIcon,
  ArrowRightIcon,
  CpuIcon,
  GlobeIcon,
  BrainCircuitIcon,
} from "lucide-react"

const tiers = [
  {
    icon: RadioIcon,
    label: "Sources",
    color: "var(--chart-2)",
    title: "Telemetry sources",
    desc: "PLCs, sensors, gateways, or the iot-simulator publish readings into the message plane (MQTT). Each device is identified by a stable device_id and publishes JSON telemetry on a well-known topic.",
  },
  {
    icon: ServerIcon,
    label: "Core services",
    color: "var(--chart-1)",
    title: "FastAPI backend",
    desc: "The backend ingests telemetry, normalises readings, scores risk, persists state, and fans out live updates over WebSocket hubs. REST endpoints serve synchronous queries for dashboards and integrations.",
  },
  {
    icon: MonitorIcon,
    label: "Experience",
    color: "var(--chart-3)",
    title: "Next.js frontend",
    desc: "The Next.js App Router renders operational dashboards, device detail views, and this documentation site. It consumes the backend REST API and subscribes to WebSocket streams for live data.",
  },
]

const services = [
  {
    icon: ServerIcon,
    name: "IoT Security Backend",
    tech: "FastAPI · Python",
    desc: "Primary API service — REST endpoints, WebSocket hubs, MQTT ingestion, risk scoring, and device management. Entrypoint: main.py.",
    port: "8000",
  },
  {
    icon: DatabaseIcon,
    name: "PostgreSQL",
    tech: "PostgreSQL 15+",
    desc: "Persistent storage for device records, alert history, and telemetry snapshots. Managed via Alembic migrations.",
    port: "5432",
  },
  {
    icon: RadioIcon,
    name: "Mosquitto",
    tech: "Eclipse Mosquitto",
    desc: "Lightweight MQTT broker relaying telemetry from sources to the backend subscriber. Topic pattern: factory/<device_id>/telemetry.",
    port: "1883",
  },
  {
    icon: ShieldIcon,
    name: "Wazuh SIEM",
    tech: "Wazuh multi-node",
    desc: "Security Information and Event Management cluster — indexer, manager, and dashboard nodes provide threat detection, log analysis, and compliance monitoring.",
    port: "443",
  },
  {
    icon: BrainCircuitIcon,
    name: "ML Pipeline",
    tech: "KI-Pipeline · Python",
    desc: "Trains anomaly-detection models on telemetry data for predictive maintenance and risk scoring. Runs as a batch step during setup.",
    port: "—",
  },
  {
    icon: GlobeIcon,
    name: "Next.js UI",
    tech: "Next.js 15 · React",
    desc: "Product dashboard and documentation. Consumes the backend REST API and subscribes to WebSocket streams for real-time updates.",
    port: "3000",
  },
]

const communicationPatterns = [
  {
    protocol: "REST",
    direction: "UI → Backend",
    desc: "Synchronous queries for device lists, alerts, metrics, and system health. All routes under /api/v1/.",
  },
  {
    protocol: "WebSocket",
    direction: "Backend → UI",
    desc: "Two live streams — /api/v1/ws/dashboard for widget updates and /api/v1/ws/telemetry?device_id=… for per-device detail views.",
  },
  {
    protocol: "MQTT",
    direction: "Sources → Backend",
    desc: "Telemetry published on factory/<device_id>/telemetry. Backend subscribes with wildcard factory/+/telemetry.",
  },
  {
    protocol: "SQL",
    direction: "Backend → PostgreSQL",
    desc: "ORM-based queries via SQLAlchemy for device CRUD, alert persistence, and optional telemetry history.",
  },
]

const securityLayers = [
  {
    title: "TLS encryption",
    desc: "All Wazuh cluster communication uses auto-generated SSL certificates. HTTPS for dashboard access.",
  },
  {
    title: "Wazuh SIEM",
    desc: "Multi-node cluster monitors host and container logs, detects intrusions, and enforces compliance rules.",
  },
  {
    title: "Network isolation",
    desc: "Docker Compose networks isolate service-to-service traffic. Only designated ports are exposed to the host.",
  },
  {
    title: "Risk scoring",
    desc: "Backend applies ML-based anomaly detection to telemetry streams, flagging abnormal readings in real time.",
  },
]

export function ArchitectureBody() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Concepts</Badge>
          <Badge variant="secondary">Architecture</Badge>
        </div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Architecture overview
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
          The platform follows a{" "}
          <span className="font-medium text-foreground">classic three-tier</span>{" "}
          pattern adapted for telemetry-heavy workloads: sources publish readings
          into a message plane, core services ingest and score them, and a Next.js
          frontend renders operational dashboards. All components are containerised
          and orchestrated via Docker Compose.
        </p>
      </div>

      {/* Three-tier overview */}
      <section id="tiers" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Foundation
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Three-tier design
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {tiers.map((t) => {
            const Icon = t.icon
            return (
              <div key={t.label} className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2">
                  <div
                    className="flex size-7 items-center justify-center rounded-md"
                    style={{ backgroundColor: t.color, opacity: 0.15 }}
                  >
                    <Icon className="size-4 text-foreground" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t.label}
                  </span>
                </div>
                <div className="mt-2 text-sm font-medium text-foreground">
                  {t.title}
                </div>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {t.desc}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Logical architecture diagram */}
      <Diagram
        title="Logical architecture"
        description="High-level components and data paths across the three tiers."
      >
        <svg width="100%" viewBox="0 0 760 240" role="img" className="text-foreground">
          <title>Logical architecture</title>
          <defs>
            <marker id="arch-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M2 1L8 5L2 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
          </defs>
          {/* Sources tier */}
          <rect x="16" y="20" width="160" height="100" rx="14" fill="var(--chart-2)" opacity="0.12" stroke="var(--chart-2)" />
          <text x="96" y="48" textAnchor="middle" fill="var(--foreground)" style={{ fontSize: 13 }} fontWeight="600">Sources</text>
          <text x="96" y="68" textAnchor="middle" fill="var(--muted-foreground)" style={{ fontSize: 11 }}>PLCs · sensors</text>
          <text x="96" y="84" textAnchor="middle" fill="var(--muted-foreground)" style={{ fontSize: 11 }}>iot-simulator</text>
          <text x="96" y="108" textAnchor="middle" fill="var(--muted-foreground)" style={{ fontSize: 10 }}>MQTT publish</text>
          {/* Arrow to broker */}
          <line x1="176" y1="70" x2="216" y2="70" stroke="currentColor" strokeWidth="2" markerEnd="url(#arch-arrow)" />
          {/* Broker */}
          <rect x="218" y="46" width="100" height="48" rx="12" fill="var(--chart-5)" opacity="0.12" stroke="var(--chart-5)" />
          <text x="268" y="66" textAnchor="middle" fill="var(--foreground)" style={{ fontSize: 12 }} fontWeight="600">Mosquitto</text>
          <text x="268" y="82" textAnchor="middle" fill="var(--muted-foreground)" style={{ fontSize: 10 }}>MQTT broker</text>
          {/* Arrow to backend */}
          <line x1="318" y1="70" x2="358" y2="70" stroke="currentColor" strokeWidth="2" markerEnd="url(#arch-arrow)" />
          {/* Backend */}
          <rect x="360" y="16" width="180" height="148" rx="16" fill="var(--chart-1)" opacity="0.10" stroke="var(--chart-1)" />
          <text x="450" y="42" textAnchor="middle" fill="var(--foreground)" style={{ fontSize: 13 }} fontWeight="600">FastAPI backend</text>
          <text x="450" y="62" textAnchor="middle" fill="var(--muted-foreground)" style={{ fontSize: 11 }}>REST + WS endpoints</text>
          <text x="450" y="78" textAnchor="middle" fill="var(--muted-foreground)" style={{ fontSize: 11 }}>MQTT subscriber</text>
          <text x="450" y="98" textAnchor="middle" fill="var(--muted-foreground)" style={{ fontSize: 11 }}>Risk scoring</text>
          <text x="450" y="114" textAnchor="middle" fill="var(--muted-foreground)" style={{ fontSize: 11 }}>Device management</text>
          <text x="450" y="150" textAnchor="middle" fill="var(--muted-foreground)" style={{ fontSize: 10 }}>Port 8000</text>
          {/* Arrow to UI */}
          <line x1="540" y1="70" x2="580" y2="70" stroke="currentColor" strokeWidth="2" markerEnd="url(#arch-arrow)" />
          {/* Frontend */}
          <rect x="582" y="30" width="160" height="80" rx="14" fill="var(--chart-3)" opacity="0.12" stroke="var(--chart-3)" />
          <text x="662" y="56" textAnchor="middle" fill="var(--foreground)" style={{ fontSize: 13 }} fontWeight="600">Next.js UI</text>
          <text x="662" y="76" textAnchor="middle" fill="var(--muted-foreground)" style={{ fontSize: 11 }}>Dashboard + docs</text>
          <text x="662" y="96" textAnchor="middle" fill="var(--muted-foreground)" style={{ fontSize: 10 }}>Port 3000</text>
          {/* DB below backend */}
          <line x1="450" y1="164" x2="450" y2="188" stroke="currentColor" strokeWidth="2" markerEnd="url(#arch-arrow)" />
          <rect x="380" y="190" width="140" height="40" rx="10" fill="var(--chart-4)" opacity="0.12" stroke="var(--chart-4)" />
          <text x="450" y="208" textAnchor="middle" fill="var(--foreground)" style={{ fontSize: 12 }} fontWeight="600">PostgreSQL</text>
          <text x="450" y="222" textAnchor="middle" fill="var(--muted-foreground)" style={{ fontSize: 10 }}>device state + history</text>
          {/* Wazuh to the left bottom */}
          <rect x="16" y="168" width="160" height="56" rx="12" fill="var(--chart-4)" opacity="0.12" stroke="var(--chart-4)" />
          <text x="96" y="192" textAnchor="middle" fill="var(--foreground)" style={{ fontSize: 12 }} fontWeight="600">Wazuh SIEM</text>
          <text x="96" y="210" textAnchor="middle" fill="var(--muted-foreground)" style={{ fontSize: 10 }}>threat detection · logs</text>
        </svg>
      </Diagram>

      <Separator />

      {/* Service inventory */}
      <section id="services" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <LayersIcon className="size-4 text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Infrastructure
            </p>
          </div>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Service inventory
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            All services run as Docker containers, launched by a single{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">scripts/setup.sh</code>{" "}
            command. Here is what each one does.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = s.icon
            return (
              <Card key={s.name}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 text-muted-foreground" />
                    <CardTitle className="text-sm">{s.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[11px]">{s.tech}</Badge>
                    {s.port !== "—" && (
                      <Badge variant="outline" className="font-mono text-[11px]">:{s.port}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <Separator />

      {/* Communication patterns */}
      <section id="communication" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ArrowRightIcon className="size-4 text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Protocols
            </p>
          </div>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Communication patterns
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            Four distinct protocols connect the components, each chosen for
            its strength in a particular direction.
          </p>
        </div>

        <div className="space-y-2">
          {communicationPatterns.map((c) => (
            <div key={c.protocol} className="flex gap-3 rounded-lg border bg-card p-4">
              <div className="flex shrink-0 items-center gap-2">
                <Badge variant="outline" className="font-mono text-[11px]">{c.protocol}</Badge>
                <span className="text-xs text-muted-foreground">{c.direction}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>

        <Diagram
          title="Communication flow"
          description="Protocols and directions between each component."
        >
          <svg width="100%" viewBox="0 0 720 140" role="img" className="text-foreground">
            <title>Communication flow</title>
            <defs>
              <marker id="comm-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M2 1L8 5L2 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </marker>
            </defs>
            {/* Sources */}
            <rect x="12" y="30" width="110" height="50" rx="12" fill="var(--chart-2)" opacity="0.12" stroke="var(--chart-2)" />
            <text x="67" y="52" textAnchor="middle" fill="var(--foreground)" style={{ fontSize: 12 }} fontWeight="600">Sources</text>
            <text x="67" y="68" textAnchor="middle" fill="var(--muted-foreground)" style={{ fontSize: 10 }}>devices</text>
            {/* MQTT arrow */}
            <line x1="122" y1="55" x2="176" y2="55" stroke="currentColor" strokeWidth="2" markerEnd="url(#comm-arrow)" />
            <text x="149" y="46" textAnchor="middle" fill="var(--muted-foreground)" style={{ fontSize: 9 }}>MQTT</text>
            {/* Broker */}
            <rect x="178" y="34" width="90" height="42" rx="10" fill="var(--chart-5)" opacity="0.12" stroke="var(--chart-5)" />
            <text x="223" y="58" textAnchor="middle" fill="var(--foreground)" style={{ fontSize: 11 }} fontWeight="600">Broker</text>
            {/* MQTT arrow to backend */}
            <line x1="268" y1="55" x2="322" y2="55" stroke="currentColor" strokeWidth="2" markerEnd="url(#comm-arrow)" />
            <text x="295" y="46" textAnchor="middle" fill="var(--muted-foreground)" style={{ fontSize: 9 }}>MQTT</text>
            {/* Backend */}
            <rect x="324" y="22" width="140" height="68" rx="14" fill="var(--chart-1)" opacity="0.10" stroke="var(--chart-1)" />
            <text x="394" y="48" textAnchor="middle" fill="var(--foreground)" style={{ fontSize: 12 }} fontWeight="600">Backend</text>
            <text x="394" y="64" textAnchor="middle" fill="var(--muted-foreground)" style={{ fontSize: 10 }}>FastAPI</text>
            <text x="394" y="80" textAnchor="middle" fill="var(--muted-foreground)" style={{ fontSize: 10 }}>:8000</text>
            {/* REST + WS arrow to UI */}
            <line x1="464" y1="46" x2="536" y2="46" stroke="currentColor" strokeWidth="2" markerEnd="url(#comm-arrow)" />
            <text x="500" y="38" textAnchor="middle" fill="var(--muted-foreground)" style={{ fontSize: 9 }}>REST</text>
            <line x1="464" y1="64" x2="536" y2="64" stroke="currentColor" strokeWidth="2" markerEnd="url(#comm-arrow)" />
            <text x="500" y="78" textAnchor="middle" fill="var(--muted-foreground)" style={{ fontSize: 9 }}>WebSocket</text>
            {/* Frontend */}
            <rect x="538" y="30" width="120" height="50" rx="12" fill="var(--chart-3)" opacity="0.12" stroke="var(--chart-3)" />
            <text x="598" y="52" textAnchor="middle" fill="var(--foreground)" style={{ fontSize: 12 }} fontWeight="600">Next.js UI</text>
            <text x="598" y="68" textAnchor="middle" fill="var(--muted-foreground)" style={{ fontSize: 10 }}>:3000</text>
            {/* SQL arrow down from backend */}
            <line x1="394" y1="90" x2="394" y2="114" stroke="currentColor" strokeWidth="2" markerEnd="url(#comm-arrow)" />
            <text x="414" y="106" textAnchor="start" fill="var(--muted-foreground)" style={{ fontSize: 9 }}>SQL</text>
            <rect x="334" y="116" width="120" height="20" rx="6" fill="var(--chart-4)" opacity="0.12" stroke="var(--chart-4)" />
            <text x="394" y="130" textAnchor="middle" fill="var(--foreground)" style={{ fontSize: 10 }} fontWeight="600">PostgreSQL</text>
          </svg>
        </Diagram>
      </section>

      <Separator />

      {/* Security layers */}
      <section id="security" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldIcon className="size-4 text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Defence
            </p>
          </div>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Security layers
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            Security is layered across the stack, from transport encryption to
            runtime threat detection.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {securityLayers.map((s) => (
            <div key={s.title} className="flex gap-3 rounded-lg border bg-card p-4">
              <ShieldIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">{s.title}</div>
                <div className="mt-1 text-sm text-muted-foreground leading-relaxed">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <Callout variant="info" title="Wazuh dashboard">
          The Wazuh SIEM dashboard is accessible at{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">https://localhost</code>{" "}
          after setup. Log in with <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">admin</code>{" "}
          / <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">SecretPassword</code>.
        </Callout>
      </section>

      <Separator />

      {/* Technology stack */}
      <section id="tech-stack" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CpuIcon className="size-4 text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Stack
            </p>
          </div>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Technology choices
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Backend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div className="flex gap-2">
                <Badge variant="secondary" className="shrink-0 text-[11px]">Language</Badge>
                <span className="leading-relaxed">Python 3.11+</span>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="shrink-0 text-[11px]">Framework</Badge>
                <span className="leading-relaxed">FastAPI with async endpoints</span>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="shrink-0 text-[11px]">ORM</Badge>
                <span className="leading-relaxed">SQLAlchemy + Alembic migrations</span>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="shrink-0 text-[11px]">ML</Badge>
                <span className="leading-relaxed">scikit-learn / custom pipeline</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Frontend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div className="flex gap-2">
                <Badge variant="secondary" className="shrink-0 text-[11px]">Framework</Badge>
                <span className="leading-relaxed">Next.js 15 (App Router)</span>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="shrink-0 text-[11px]">Styling</Badge>
                <span className="leading-relaxed">Tailwind CSS + shadcn/ui</span>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="shrink-0 text-[11px]">State</Badge>
                <span className="leading-relaxed">React hooks + WebSocket streams</span>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="shrink-0 text-[11px]">Docs</Badge>
                <span className="leading-relaxed">MDX pages with custom components</span>
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
          <Link href="/docs/concepts/data-flow" className="group no-underline">
            <div className="rounded-lg border bg-card p-4 transition-colors hover:bg-muted/40">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Concepts
              </div>
              <div className="mt-1 text-sm font-medium text-foreground group-hover:text-foreground">
                Data flow — sequence-style explanation of how telemetry moves through the stack.
              </div>
            </div>
          </Link>
          <Link href="/docs/guides/iot-integration-technical" className="group no-underline">
            <div className="rounded-lg border bg-card p-4 transition-colors hover:bg-muted/40">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Guides
              </div>
              <div className="mt-1 text-sm font-medium text-foreground group-hover:text-foreground">
                IoT integration — MQTT contracts and payload schemas for real hardware.
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
