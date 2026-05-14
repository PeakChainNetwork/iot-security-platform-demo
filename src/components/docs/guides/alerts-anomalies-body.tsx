import Link from "next/link"
import {
  ActivityIcon,
  AlertTriangleIcon,
  BellIcon,
  BrainCircuitIcon,
  RadioIcon,
  SearchIcon,
  ShieldAlertIcon,
  SirenIcon,
} from "lucide-react"

import { Callout } from "@/components/docs/callout"
import { Diagram } from "@/components/docs/diagram"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const alertProperties = [
  { field: "id", type: "string", desc: "Unique identifier for the alert" },
  { field: "severity", type: "enum", desc: "critical, high, medium, or low" },
  { field: "title", type: "string", desc: "Short description of the security event" },
  { field: "description", type: "string", desc: "Detailed explanation of what was detected" },
  { field: "source", type: "string", desc: "Origin of the alert (pipeline, DPI, or Wazuh)" },
  { field: "status", type: "enum", desc: "active or dismissed" },
  { field: "device_id", type: "string | null", desc: "Optional link to a specific device" },
]

const severityLevels = [
  {
    level: "Critical",
    badge: "destructive" as const,
    action: "Immediate action required",
    examples: [
      "Active exploitation detected",
      "Critical infrastructure compromise",
      "Anomaly score \u2265 70",
    ],
  },
  {
    level: "High",
    badge: "secondary" as const,
    action: "Significant risk — investigate promptly",
    examples: [
      "High-CVSS vulnerability matched",
      "Suspicious traffic pattern",
    ],
  },
  {
    level: "Medium",
    badge: "secondary" as const,
    action: "Investigate when possible",
    examples: [
      "Unusual metric deviations",
      "Moderate anomaly score (30\u201369)",
    ],
  },
  {
    level: "Low",
    badge: "outline" as const,
    action: "Informational",
    examples: [
      "Minor policy violations",
      "Low-confidence detections",
    ],
  },
]

const alertSources = [
  {
    name: "ML Pipeline (KI-Pipeline)",
    icon: BrainCircuitIcon,
    desc: "The 6-stage anomaly detection pipeline scores telemetry events using Isolation Forest. When the anomaly score crosses thresholds, an alert is created.",
    thresholds: [
      { range: "Score < 30", severity: "Low" },
      { range: "Score 30\u201369", severity: "Medium" },
      { range: "Score \u2265 70", severity: "Critical" },
    ],
  },
  {
    name: "Deep Packet Inspection (DPI)",
    icon: SearchIcon,
    desc: "Rules-based inspection of MQTT and Modbus traffic for protocol violations and suspicious patterns.",
    detections: [
      "Oversized MQTT payloads",
      "Invalid MQTT message schemas",
      "Unauthorized Modbus function codes",
      "Out-of-range register values",
    ],
  },
  {
    name: "Wazuh SIEM",
    icon: ShieldAlertIcon,
    desc: "External alerts from the Wazuh security manager forwarded into the platform.",
    detections: [
      "Brute force attempts",
      "RTSP attacks",
      "Protocol impersonation",
    ],
  },
]

const anomalyFeatures = [
  "Event frequency",
  "Payload statistics",
  "Temperature/pressure mean + stddev",
  "Shannon entropy",
  "Error ratios",
  "New destination ratios",
]

export function AlertsAnomaliesBody() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Guide</Badge>
          <Badge variant="secondary">Alerts</Badge>
          <Badge variant="secondary">Anomalies</Badge>
        </div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Alerts and anomaly detection
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
          How security alerts are generated, how anomalies are scored, and what the severity levels mean.
        </p>
      </div>

      <Separator />

      {/* Alert Overview */}
      <section id="alert-overview" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Fundamentals
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Alert overview
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            Alerts represent security events that need attention. They appear in two places in the platform.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ActivityIcon className="size-4 text-muted-foreground" />
                Dashboard alerts table
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              Global view of all alerts across the platform. Columns include severity, title, source,
              and status. Supports filtering and sorting to prioritise the most important events.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <RadioIcon className="size-4 text-muted-foreground" />
                Device detail alerts card
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              Per-device view showing alerts specific to a single device. Displays title, severity badge,
              and a detailed description of each event.
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Alert properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alertProperties.map((prop) => (
                <div key={prop.field} className="flex items-baseline gap-3 text-sm">
                  <code className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                    {prop.field}
                  </code>
                  <span className="shrink-0 text-xs text-muted-foreground">({prop.type})</span>
                  <span className="text-muted-foreground leading-relaxed">{prop.desc}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Severity Levels */}
      <section id="severity-levels" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Classification
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Severity levels
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            Four severity levels determine how urgently an alert should be addressed. Each level maps
            to a distinct badge color in the UI.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {severityLevels.map((s) => (
            <Card key={s.level}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Badge variant={s.badge}>{s.level}</Badge>
                  <span className="text-sm font-normal text-muted-foreground">{s.action}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {s.examples.map((ex) => (
                    <li key={ex} className="flex items-start gap-2">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span className="leading-relaxed">{ex}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Callout variant="info" title="Badge colour mapping">
          Critical alerts use a red/destructive badge. High alerts appear as amber on the dashboard
          and secondary on the device detail page. Medium alerts use a gray/secondary badge.
          Low alerts use an outline badge.
        </Callout>
      </section>

      <Separator />

      {/* Alert Sources */}
      <section id="alert-sources" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Origins
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Alert sources
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            Three main sources generate alerts in the platform, each covering a different layer of
            the security stack.
          </p>
        </div>

        <div className="grid gap-4">
          {alertSources.map((source) => (
            <Card key={source.name}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <source.icon className="size-4 text-muted-foreground" />
                  {source.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">{source.desc}</p>
                {"thresholds" in source && source.thresholds && (
                  <div className="grid gap-2 sm:grid-cols-3">
                    {source.thresholds.map((t) => (
                      <div
                        key={t.range}
                        className="flex items-center justify-between rounded-lg border bg-muted/20 px-3 py-2 text-sm"
                      >
                        <span className="font-mono text-xs text-muted-foreground">{t.range}</span>
                        <Badge
                          variant={
                            t.severity === "Critical"
                              ? "destructive"
                              : t.severity === "Low"
                                ? "outline"
                                : "secondary"
                          }
                        >
                          {t.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
                {"detections" in source && source.detections && (
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {source.detections.map((d) => (
                      <li key={d} className="flex items-start gap-2">
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground/50" />
                        <span className="leading-relaxed">{d}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Anomaly Detection */}
      <section id="anomaly-detection" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Machine Learning
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Anomaly detection
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            The anomaly detector card on the dashboard shows recent anomalies, each with a device ID,
            severity badge, and anomaly score.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BrainCircuitIcon className="size-4 text-muted-foreground" />
                Anomaly scoring
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                The anomaly score (0&ndash;100) represents how unusual a telemetry pattern is.
                It is generated by the Isolation Forest ML model in the pipeline.
              </p>
              <p>
                The model analyses features extracted from a 60-second sliding window:
              </p>
              <ul className="space-y-1">
                {anomalyFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangleIcon className="size-4 text-muted-foreground" />
                Explainability (SHAP)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                Each anomaly includes SHAP (SHapley Additive exPlanations) values that explain which
                input features contributed most to the anomaly score.
              </p>
              <p>
                This makes the ML model&apos;s decisions transparent and auditable, allowing
                operators to understand <em>why</em> a particular telemetry pattern was flagged rather
                than just <em>that</em> it was flagged.
              </p>
            </CardContent>
          </Card>
        </div>

        <Callout variant="info" title="Sliding window">
          Features are computed over a 60-second sliding window. Short bursts of unusual activity
          that fall within a single window are captured, but rapid fluctuations across window
          boundaries may be smoothed.
        </Callout>
      </section>

      <Separator />

      {/* Alert Lifecycle */}
      <section id="alert-lifecycle" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Workflow
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Alert lifecycle
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            How alerts move through the system from creation to resolution.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex gap-3 rounded-lg border bg-card p-4">
            <SirenIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium text-foreground">Created as active</div>
              <div className="mt-1 text-sm text-muted-foreground leading-relaxed">
                When a source detects a security event, the alert is created with{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">status: active</code>.
              </div>
            </div>
          </div>
          <div className="flex gap-3 rounded-lg border bg-card p-4">
            <BellIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium text-foreground">Real-time delivery</div>
              <div className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Both dashboard and device detail update in real-time via WebSocket using the{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">alerts</code>{" "}
                envelope type.
              </div>
            </div>
          </div>
          <div className="flex gap-3 rounded-lg border bg-card p-4">
            <ActivityIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium text-foreground">Dismissal</div>
              <div className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Alerts can be dismissed via{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                  POST /alerts/&#123;id&#125;/dismiss
                </code>{" "}
                to mark them as resolved.
              </div>
            </div>
          </div>
        </div>

        <Diagram
          title="Alert generation flow"
          description="From raw sensor data through the pipeline stages to alert delivery on the dashboard."
        >
          <svg width="100%" viewBox="0 0 900 340" role="img">
            <title>Alert generation flow</title>
            <desc>
              Sensor data flows through Kafka to the pipeline stages (Validate, Normalize, Features,
              ML Score, Alert Decision), then if the anomaly score exceeds the threshold, an alert
              is created and pushed to the dashboard via Kafka and WebSocket.
            </desc>
            <defs>
              <marker
                id="arr-alert"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path
                  d="M2 1L8 5L2 9"
                  fill="none"
                  stroke="var(--foreground)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </marker>
              <marker
                id="arr-alert-g"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path
                  d="M2 1L8 5L2 9"
                  fill="none"
                  stroke="var(--chart-3)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </marker>
            </defs>

            {/* Row 1: Sensor Data */}
            <rect x="20" y="20" width="140" height="50" rx="12" fill="var(--chart-3)" opacity="0.16" stroke="var(--chart-3)" strokeWidth="1" />
            <text fontSize="12" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="90" y="40" textAnchor="middle" dominantBaseline="central">Sensor Data</text>
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="90" y="56" textAnchor="middle" dominantBaseline="central">telemetry events</text>

            <line x1="160" y1="45" x2="190" y2="45" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-alert)" />

            {/* Kafka ingress */}
            <rect x="192" y="20" width="180" height="50" rx="12" fill="var(--chart-5)" opacity="0.14" stroke="var(--chart-5)" strokeWidth="1" />
            <text fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="282" y="38" textAnchor="middle" dominantBaseline="central">Kafka</text>
            <text fontSize="10" fontFamily="var(--font-mono)" fill="var(--muted-foreground)" x="282" y="56" textAnchor="middle" dominantBaseline="central">iot.telemetry.raw</text>

            <line x1="282" y1="70" x2="282" y2="100" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-alert)" />

            {/* Row 2: Pipeline stages */}
            <rect x="40" y="102" width="820" height="66" rx="14" fill="var(--chart-1)" opacity="0.06" stroke="var(--chart-1)" strokeWidth="1" strokeDasharray="5 3" />
            <text fontSize="9" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--chart-1)" x="60" y="114">PIPELINE STAGES</text>

            <rect x="60" y="122" width="110" height="36" rx="8" fill="var(--chart-1)" opacity="0.12" stroke="var(--chart-1)" strokeWidth="1" />
            <text fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="115" y="140" textAnchor="middle" dominantBaseline="central">Validate</text>

            <line x1="170" y1="140" x2="196" y2="140" stroke="var(--border)" strokeWidth="1.5" markerEnd="url(#arr-alert)" />

            <rect x="198" y="122" width="110" height="36" rx="8" fill="var(--chart-1)" opacity="0.12" stroke="var(--chart-1)" strokeWidth="1" />
            <text fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="253" y="140" textAnchor="middle" dominantBaseline="central">Normalize</text>

            <line x1="308" y1="140" x2="334" y2="140" stroke="var(--border)" strokeWidth="1.5" markerEnd="url(#arr-alert)" />

            <rect x="336" y="122" width="110" height="36" rx="8" fill="var(--chart-1)" opacity="0.12" stroke="var(--chart-1)" strokeWidth="1" />
            <text fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="391" y="140" textAnchor="middle" dominantBaseline="central">Features</text>

            <line x1="446" y1="140" x2="472" y2="140" stroke="var(--border)" strokeWidth="1.5" markerEnd="url(#arr-alert)" />

            <rect x="474" y="122" width="110" height="36" rx="8" fill="var(--chart-4)" opacity="0.14" stroke="var(--chart-4)" strokeWidth="1" />
            <text fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="529" y="140" textAnchor="middle" dominantBaseline="central">ML Score</text>

            <line x1="584" y1="140" x2="610" y2="140" stroke="var(--border)" strokeWidth="1.5" markerEnd="url(#arr-alert)" />

            <rect x="612" y="122" width="134" height="36" rx="8" fill="var(--chart-4)" opacity="0.14" stroke="var(--chart-4)" strokeWidth="1" />
            <text fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="679" y="140" textAnchor="middle" dominantBaseline="central">Alert Decision</text>

            <line x1="746" y1="140" x2="770" y2="140" stroke="var(--border)" strokeWidth="1.5" markerEnd="url(#arr-alert)" />

            {/* Decision diamond area */}
            <rect x="772" y="120" width="74" height="40" rx="8" fill="var(--destructive)" opacity="0.08" stroke="var(--destructive)" strokeWidth="1" />
            <text fontSize="9" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--destructive)" x="809" y="136" textAnchor="middle" dominantBaseline="central">score &gt;</text>
            <text fontSize="9" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--destructive)" x="809" y="150" textAnchor="middle" dominantBaseline="central">threshold?</text>

            {/* Yes path down */}
            <line x1="809" y1="168" x2="809" y2="198" stroke="var(--destructive)" opacity="0.6" strokeWidth="1.5" markerEnd="url(#arr-alert)" />
            <text fontSize="9" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="822" y="186">yes</text>

            {/* Alert Created */}
            <rect x="720" y="200" width="160" height="44" rx="12" fill="var(--destructive)" opacity="0.08" stroke="var(--destructive)" strokeWidth="1" />
            <text fontSize="12" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="800" y="216" textAnchor="middle" dominantBaseline="central">Alert Created</text>
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="800" y="234" textAnchor="middle" dominantBaseline="central">severity assigned</text>

            {/* Down to Kafka egress */}
            <line x1="800" y1="244" x2="800" y2="270" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-alert)" />

            {/* Row 3: Kafka egress + WebSocket */}
            <rect x="520" y="272" width="200" height="50" rx="12" fill="var(--chart-5)" opacity="0.14" stroke="var(--chart-5)" strokeWidth="1" />
            <text fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="620" y="290" textAnchor="middle" dominantBaseline="central">Kafka</text>
            <text fontSize="10" fontFamily="var(--font-mono)" fill="var(--muted-foreground)" x="620" y="308" textAnchor="middle" dominantBaseline="central">security.anomaly.alerts</text>

            <line x1="800" y1="272" x2="800" y2="297" stroke="var(--border)" strokeWidth="0" />
            <line x1="720" y1="297" x2="520" y2="297" stroke="var(--border)" strokeWidth="2" markerStart="url(#arr-alert)" />

            <rect x="740" y="272" width="140" height="50" rx="12" fill="var(--chart-2)" opacity="0.12" stroke="var(--chart-2)" strokeWidth="1" />
            <text fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="810" y="290" textAnchor="middle" dominantBaseline="central">WebSocket push</text>
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="810" y="308" textAnchor="middle" dominantBaseline="central">real-time</text>

            {/* Arrows to dashboard */}
            <line x1="520" y1="297" x2="390" y2="297" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-alert)" />

            <rect x="200" y="272" width="190" height="50" rx="12" fill="var(--chart-2)" opacity="0.14" stroke="var(--chart-2)" strokeWidth="1" />
            <text fontSize="12" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="295" y="290" textAnchor="middle" dominantBaseline="central">Dashboard / Device</text>
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="295" y="308" textAnchor="middle" dominantBaseline="central">alerts table &amp; cards</text>
          </svg>
        </Diagram>

        <Callout variant="warning" title="Pipeline dependency">
          The ML-based alert path requires all six pipeline stages to be running. If the pipeline
          is down, only DPI and Wazuh alerts will be generated. See the{" "}
          <Link
            className="font-medium text-primary underline underline-offset-4"
            href="/docs/guides/live-telemetry"
          >
            live telemetry guide
          </Link>{" "}
          for pipeline health checks.
        </Callout>
      </section>
    </div>
  )
}
