import Link from "next/link"
import {
  ActivityIcon,
  GaugeIcon,
  RadioIcon,
  RefreshCwIcon,
  SignalIcon,
  ThermometerIcon,
  TimerIcon,
  WifiIcon,
  WifiOffIcon,
} from "lucide-react"

import { Callout } from "@/components/docs/callout"
import { Diagram } from "@/components/docs/diagram"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const telemetryModes = [
  {
    mode: "Live (on)",
    icon: SignalIcon,
    badge: "Live telemetry on",
    badgeVariant: "default" as const,
    condition: "Device is online AND last seen ≤ 5 minutes ago.",
    behavior: "WebSocket auto-connects. Chart updates in real time.",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    mode: "Stale",
    icon: TimerIcon,
    badge: "Telemetry stale",
    badgeVariant: "outline" as const,
    condition: "Device is online but last seen > 5 minutes ago.",
    behavior: "WebSocket is disconnected. User can manually trigger reconnect.",
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    mode: "Off",
    icon: WifiOffIcon,
    badge: "Telemetry off",
    badgeVariant: "secondary" as const,
    condition: "Device is offline or inactive.",
    behavior: "WebSocket is disabled. Panel is non-interactive.",
    color: "text-muted-foreground",
  },
]

const keyMetrics = [
  {
    name: "Temperature",
    unit: "°C",
    icon: ThermometerIcon,
    description: "Sensor temperature reading.",
    abnormal: "Consistently above 60 °C or sudden spikes may indicate overheating or sensor faults.",
  },
  {
    name: "Pressure",
    unit: "bar",
    icon: GaugeIcon,
    description: "Operating pressure of the device.",
    abnormal: "Values outside the device-specific acceptable range warrant investigation.",
  },
  {
    name: "Vibration",
    unit: "mm/s",
    icon: ActivityIcon,
    description: "Mechanical vibration intensity.",
    abnormal: "Sudden increases often signal bearing wear, misalignment, or imminent hardware failure.",
  },
]

const reconnectSteps = [
  { delay: "500 ms", attempt: 1 },
  { delay: "1 s", attempt: 2 },
  { delay: "2 s", attempt: 3 },
  { delay: "4 s", attempt: 4 },
  { delay: "8 s", attempt: 5 },
  { delay: "16 s", attempt: 6 },
  { delay: "30 s (cap)", attempt: 7 },
]

const twinFields = [
  { field: "temperature", type: "number", example: "47.23" },
  { field: "pressure", type: "number", example: "124.80" },
  { field: "status", type: "string", example: "ok" },
  { field: "power_draw", type: "number", example: "3.97" },
  { field: "rotational_speed", type: "number", example: "980.39" },
  { field: "vibration", type: "number", example: "2.65" },
]

export function LiveTelemetryBody() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Guide</Badge>
          <Badge variant="secondary">Telemetry</Badge>
          <Badge variant="secondary">Digital twin</Badge>
        </div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Live telemetry and digital twin
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
          How real-time sensor data streams to the device detail page and keeps the digital twin in sync.
        </p>
      </div>

      <Separator />

      {/* Section 1: Telemetry Panel Overview */}
      <section id="telemetry-panel" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Dashboard
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Telemetry panel overview
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            The device detail page splits into a live telemetry chart (three-quarter width) and a
            digital twin panel (one-quarter width). The chart uses Recharts to render time-series
            data streamed over a WebSocket connection.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <RadioIcon className="size-4 text-muted-foreground" />
                Real-time chart
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              A Recharts line chart displays time-series data for temperature, pressure, and
              vibration. Each metric is rendered as a separate series with its own axis scale.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <WifiIcon className="size-4 text-muted-foreground" />
                WebSocket transport
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              Data arrives via{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                /api/v1/ws/telemetry?device_id=&#123;id&#125;
              </code>
              . The panel auto-connects when the device is in &ldquo;live&rdquo; mode and supports
              manual retry when telemetry is stale.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <RefreshCwIcon className="size-4 text-muted-foreground" />
                Auto &amp; manual modes
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              When the device is &ldquo;on&rdquo;, the WebSocket connects automatically. When
              telemetry is stale, a reconnect button appears. When the device is off, the panel is
              disabled.
            </CardContent>
          </Card>
        </div>

        <Callout variant="info" title="Tracked metrics">
          The default chart tracks three metrics: <strong>temperature</strong> (°C),{" "}
          <strong>pressure</strong> (bar), and <strong>vibration</strong> (mm/s). Additional metrics
          may appear depending on the device type and ingestion protocol.
        </Callout>
      </section>

      <Separator />

      {/* Section 2: Telemetry Modes */}
      <section id="telemetry-modes" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Connection states
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Telemetry modes
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            Three modes determine how the WebSocket behaves on the device detail page. The boundary
            between &ldquo;live&rdquo; and &ldquo;stale&rdquo; is a 5-minute threshold since the
            device was last seen.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {telemetryModes.map((m) => (
            <Card key={m.mode}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <m.icon className={`size-4 ${m.color}`} />
                  {m.mode}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Badge variant={m.badgeVariant} className="text-xs">
                    {m.badge}
                  </Badge>
                </div>
                <div className="leading-relaxed">
                  <span className="font-medium text-foreground">Condition:</span> {m.condition}
                </div>
                <div className="leading-relaxed">
                  <span className="font-medium text-foreground">Behavior:</span> {m.behavior}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Callout variant="default" title="5-minute threshold">
          The threshold is evaluated against the device&apos;s{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">last_seen</code>{" "}
          timestamp. If the device was seen within the last 5 minutes and is marked online, mode is
          &ldquo;live&rdquo;. Beyond 5 minutes, mode switches to &ldquo;stale&rdquo;.
        </Callout>
      </section>

      <Separator />

      {/* Section 3: WebSocket Connection Lifecycle */}
      <section id="websocket-lifecycle" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Transport
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            WebSocket connection lifecycle
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            The managed WebSocket handles connection establishment, keepalive pings, and automatic
            reconnection with exponential backoff.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Connection flow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex gap-3">
                  <Badge variant="secondary" className="mt-0.5 shrink-0 text-xs">Open</Badge>
                  <span className="leading-relaxed">
                    Connects to{" "}
                    <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                      ws(s)://backend/api/v1/ws/telemetry?device_id=X
                    </code>
                  </span>
                </div>
                <Separator />
                <div className="flex gap-3">
                  <Badge variant="secondary" className="mt-0.5 shrink-0 text-xs">Ping</Badge>
                  <span className="leading-relaxed">
                    Sends keepalive pings every 25 seconds to prevent idle timeouts.
                  </span>
                </div>
                <Separator />
                <div className="flex gap-3">
                  <Badge variant="secondary" className="mt-0.5 shrink-0 text-xs">Close</Badge>
                  <span className="leading-relaxed">
                    Clean cleanup on component unmount. Closes the socket and cancels any pending
                    reconnect timers.
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status indicators</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                The connection exposes four status values:{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">connecting</code>,{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">open</code>,{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">closed</code>, and{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">error</code>.
                The UI reflects each state with appropriate visual feedback.
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reconnection backoff schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {reconnectSteps.map((s) => (
                  <div key={s.attempt} className="flex items-center gap-3 text-sm">
                    <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                      {s.attempt}
                    </span>
                    <div className="h-1.5 flex-1 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-chart-1 opacity-60"
                        style={{ width: `${Math.min((s.attempt / 7) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="w-20 text-right font-mono text-xs text-muted-foreground">
                      {s.delay}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                Exponential backoff with jitter: 500 ms → 1 s → 2 s → 4 s → &hellip; capped at 30 s.
                Jitter prevents reconnection storms when many clients disconnect simultaneously.
              </p>
            </CardContent>
          </Card>
        </div>

        <Callout variant="warning" title="Cleanup on unmount">
          The WebSocket hook cleans up on component unmount. Navigating away from the device detail
          page closes the connection and cancels any pending reconnect attempts.
        </Callout>
      </section>

      <Separator />

      {/* Section 4: Key Metrics */}
      <section id="key-metrics" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Measurements
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Key metrics
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            Each telemetry metric has defined units and abnormal-value guidance. Additional metrics
            may appear depending on device type and protocol (MQTT or Modbus).
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {keyMetrics.map((m) => (
            <Card key={m.name}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <m.icon className="size-4 text-muted-foreground" />
                  {m.name}
                  <Badge variant="outline" className="ml-auto text-xs font-mono">
                    {m.unit}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                <p>{m.description}</p>
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">
                  <span className="font-medium text-foreground">Abnormal: </span>
                  {m.abnormal}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Callout variant="info" title="Protocol-specific metrics">
          Devices connected via MQTT may publish custom metric keys beyond the defaults. Modbus
          devices expose register-mapped values that the backend translates to named metrics.
        </Callout>
      </section>

      <Separator />

      {/* Section 5: Digital Twin State */}
      <section id="digital-twin" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            State mirror
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Digital twin state
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            The digital twin panel occupies the right quarter of the device detail page. It shows a
            curated key-value view of the device&apos;s live operational state, updated in real time
            from MQTT telemetry and Modbus polling.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Common twin fields</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {twinFields.map((f) => (
                  <div key={f.field} className="flex items-center justify-between gap-3 text-sm">
                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                      {f.field}
                    </code>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {f.type}
                      </Badge>
                      <span className="w-16 text-right font-mono text-xs text-muted-foreground">
                        {f.example}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Display rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex gap-3">
                  <Badge variant="secondary" className="mt-0.5 shrink-0 text-xs">Limit</Badge>
                  <span className="leading-relaxed">
                    Shows up to 12 most relevant fields from the twin state.
                  </span>
                </div>
                <Separator />
                <div className="flex gap-3">
                  <Badge variant="secondary" className="mt-0.5 shrink-0 text-xs">Numbers</Badge>
                  <span className="leading-relaxed">
                    Numeric values formatted to 2 decimal places.
                  </span>
                </div>
                <Separator />
                <div className="flex gap-3">
                  <Badge variant="secondary" className="mt-0.5 shrink-0 text-xs">Booleans</Badge>
                  <span className="leading-relaxed">
                    Boolean values displayed as &ldquo;Yes&rdquo; / &ldquo;No&rdquo;.
                  </span>
                </div>
              </CardContent>
            </Card>

            <Callout variant="info" title="Storage format">
              The twin state is persisted as a JSON object in the{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                digital_twin_state
              </code>{" "}
              field on the device record. The backend updates this field on every incoming telemetry
              message.
            </Callout>
          </div>
        </div>
      </section>

      <Separator />

      {/* Section 6: Data Flow */}
      <section id="data-flow" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Architecture
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Data flow
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            Telemetry data flows from physical sensors through the ingestion pipeline to both the
            Kafka stream and the WebSocket hub, which pushes updates to the browser.
          </p>
        </div>

        <Diagram
          title="Telemetry data flow"
          description="End-to-end path from sensor to browser chart, passing through the message broker, backend services, and Kafka."
        >
          <svg width="100%" viewBox="0 0 820 260" role="img">
            <title>Telemetry data flow diagram</title>
            <desc>Sensor to MQTT Broker or Modbus TCP to Backend MQTT/Modbus Service, which fans out to Kafka and WebSocket Hub, then to Browser Recharts chart.</desc>
            <defs>
              <marker id="arr-tdf" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M2 1L8 5L2 9" fill="none" stroke="var(--foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </marker>
            </defs>

            {/* Sensor */}
            <rect x="10" y="80" width="100" height="56" rx="12" fill="var(--chart-3)" opacity="0.16" stroke="var(--chart-3)" strokeWidth="1" />
            <text fontSize="12" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="60" y="102" textAnchor="middle" dominantBaseline="central">Sensor</text>
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="60" y="120" textAnchor="middle" dominantBaseline="central">measurements</text>

            {/* Arrow: Sensor → Broker */}
            <line x1="110" y1="108" x2="140" y2="108" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-tdf)" />

            {/* MQTT Broker / Modbus */}
            <rect x="142" y="70" width="130" height="76" rx="12" fill="var(--chart-4)" opacity="0.14" stroke="var(--chart-4)" strokeWidth="1" />
            <text fontSize="12" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="207" y="96" textAnchor="middle" dominantBaseline="central">MQTT Broker</text>
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="207" y="114" textAnchor="middle" dominantBaseline="central">or Modbus TCP</text>
            <text fontSize="9" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="207" y="132" textAnchor="middle" dominantBaseline="central">ingestion layer</text>

            {/* Arrow: Broker → Backend Service */}
            <line x1="272" y1="108" x2="302" y2="108" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-tdf)" />

            {/* Backend Service */}
            <rect x="304" y="76" width="150" height="64" rx="12" fill="var(--chart-1)" opacity="0.12" stroke="var(--chart-1)" strokeWidth="1" />
            <text fontSize="12" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="379" y="100" textAnchor="middle" dominantBaseline="central">Backend Service</text>
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="379" y="118" textAnchor="middle" dominantBaseline="central">MQTT / Modbus handler</text>

            {/* Fan out: Backend → Kafka (upper) */}
            <line x1="454" y1="96" x2="510" y2="46" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-tdf)" />

            {/* Fan out: Backend → WebSocket Hub (lower) */}
            <line x1="454" y1="120" x2="510" y2="170" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-tdf)" />

            {/* Kafka */}
            <rect x="512" y="18" width="160" height="56" rx="12" fill="var(--chart-5)" opacity="0.14" stroke="var(--chart-5)" strokeWidth="1" />
            <text fontSize="12" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="592" y="38" textAnchor="middle" dominantBaseline="central">Kafka</text>
            <text fontSize="10" fontFamily="var(--font-mono)" fill="var(--muted-foreground)" x="592" y="56" textAnchor="middle" dominantBaseline="central">iot.telemetry.raw</text>

            {/* Arrow: Kafka → Pipeline */}
            <line x1="672" y1="46" x2="710" y2="46" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-tdf)" />

            {/* Pipeline */}
            <rect x="712" y="22" width="96" height="48" rx="12" fill="var(--chart-4)" opacity="0.12" stroke="var(--chart-4)" strokeWidth="1" strokeDasharray="5 3" />
            <text fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="760" y="42" textAnchor="middle" dominantBaseline="central">Pipeline</text>
            <text fontSize="9" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="760" y="56" textAnchor="middle" dominantBaseline="central">process</text>

            {/* WebSocket Hub */}
            <rect x="512" y="146" width="160" height="56" rx="12" fill="var(--chart-2)" opacity="0.14" stroke="var(--chart-2)" strokeWidth="1" />
            <text fontSize="12" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="592" y="166" textAnchor="middle" dominantBaseline="central">WebSocket Hub</text>
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="592" y="184" textAnchor="middle" dominantBaseline="central">real-time push</text>

            {/* Arrow: WS Hub → Browser */}
            <line x1="672" y1="174" x2="710" y2="174" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-tdf)" />

            {/* Browser */}
            <rect x="712" y="148" width="96" height="56" rx="12" fill="var(--chart-2)" opacity="0.14" stroke="var(--chart-2)" strokeWidth="1" />
            <text fontSize="12" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="760" y="168" textAnchor="middle" dominantBaseline="central">Browser</text>
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="760" y="186" textAnchor="middle" dominantBaseline="central">Recharts</text>

            {/* Labels on fan-out */}
            <text fontSize="9" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="470" y="58" textAnchor="middle">store</text>
            <text fontSize="9" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="470" y="152" textAnchor="middle">stream</text>
          </svg>
        </Diagram>

        <Diagram
          title="Digital twin update path"
          description="How incoming telemetry updates the persisted digital twin state and reaches the panel."
        >
          <svg width="100%" viewBox="0 0 760 110" role="img">
            <title>Digital twin update path</title>
            <desc>MQTT/Modbus message arrives, backend updates digital_twin_state JSON, device detail API returns latest twin, panel renders key-value pairs.</desc>
            <defs>
              <marker id="arr-tw" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M2 1L8 5L2 9" fill="none" stroke="var(--foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </marker>
            </defs>

            {/* Step 1: Message arrives */}
            <rect x="10" y="26" width="150" height="52" rx="12" fill="var(--chart-4)" opacity="0.14" stroke="var(--chart-4)" strokeWidth="1" />
            <text fontSize="11" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="85" y="44" textAnchor="middle" dominantBaseline="central">MQTT / Modbus</text>
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="85" y="62" textAnchor="middle" dominantBaseline="central">message arrives</text>

            <line x1="160" y1="52" x2="192" y2="52" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-tw)" />

            {/* Step 2: Backend updates */}
            <rect x="194" y="22" width="176" height="60" rx="12" fill="var(--chart-1)" opacity="0.12" stroke="var(--chart-1)" strokeWidth="1" />
            <text fontSize="11" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="282" y="42" textAnchor="middle" dominantBaseline="central">Backend updates</text>
            <text fontSize="10" fontFamily="var(--font-mono)" fill="var(--muted-foreground)" x="282" y="60" textAnchor="middle" dominantBaseline="central">digital_twin_state</text>

            <line x1="370" y1="52" x2="402" y2="52" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-tw)" />

            {/* Step 3: API returns */}
            <rect x="404" y="22" width="170" height="60" rx="12" fill="var(--chart-3)" opacity="0.12" stroke="var(--chart-3)" strokeWidth="1" />
            <text fontSize="11" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="489" y="42" textAnchor="middle" dominantBaseline="central">Device detail API</text>
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="489" y="60" textAnchor="middle" dominantBaseline="central">returns latest twin</text>

            <line x1="574" y1="52" x2="606" y2="52" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-tw)" />

            {/* Step 4: Panel renders */}
            <rect x="608" y="22" width="140" height="60" rx="12" fill="var(--chart-2)" opacity="0.14" stroke="var(--chart-2)" strokeWidth="1" />
            <text fontSize="11" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="678" y="42" textAnchor="middle" dominantBaseline="central">Twin panel</text>
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="678" y="60" textAnchor="middle" dominantBaseline="central">key-value render</text>
          </svg>
        </Diagram>

        <Callout variant="info" title="Related guides">
          For details on the ingestion contract and payload format, see the{" "}
          <Link
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/90"
            href="/docs/guides/iot-integration-technical"
          >
            integration technical guide
          </Link>
          . For the rollout strategy, see the{" "}
          <Link
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/90"
            href="/docs/guides/iot-migration-guide"
          >
            migration guide
          </Link>
          .
        </Callout>
      </section>
    </div>
  )
}
