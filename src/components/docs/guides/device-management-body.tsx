import Link from "next/link"

import { Callout } from "@/components/docs/callout"
import { Diagram } from "@/components/docs/diagram"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ActivityIcon,
  AlertTriangleIcon,
  CpuIcon,
  GlobeIcon,
  LayersIcon,
  NetworkIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
} from "lucide-react"

const statusBadges = [
  { label: "Online / Active", variant: "default" as const, color: "green" },
  { label: "Offline / Inactive", variant: "secondary" as const, color: "gray" },
  { label: "Warning", variant: "outline" as const, color: "amber" },
  { label: "Critical / Compromised", variant: "destructive" as const, color: "red" },
]

const telemetryModes = [
  { label: "Live", condition: "Last seen ≤ 5 min ago", badge: "default" as const },
  { label: "Stale", condition: "Last seen > 5 min ago", badge: "outline" as const },
  { label: "Off", condition: "Device offline", badge: "secondary" as const },
]

const riskThresholds = [
  { range: "≥ 80", meaning: "Critical risk", style: "destructive" },
  { range: "≥ 50", meaning: "Moderate risk", style: "secondary" },
  { range: "< 50", meaning: "Low risk", style: "outline" },
]

const infoCards = [
  { title: "Deployment", fields: ["Location"], icon: GlobeIcon },
  { title: "Asset", fields: ["Manufacturer", "Firmware version"], icon: CpuIcon },
  { title: "Network", fields: ["IP address", "MAC address"], icon: NetworkIcon },
  { title: "Lifecycle", fields: ["Last seen", "Registered date"], icon: LayersIcon },
]

const severityBadges = [
  { level: "Critical", variant: "destructive" as const },
  { level: "High", variant: "secondary" as const },
  { level: "Medium", variant: "outline" as const },
  { level: "Low", variant: "outline" as const },
]

const cveColumns = [
  { name: "CVE ID", description: "Monospace identifier (e.g. CVE-2024-12345)" },
  { name: "Severity", description: "Badge colored by severity level" },
  { name: "CVSS", description: "Numeric score (0.0 – 10.0)" },
  { name: "Description", description: "Short vulnerability summary" },
]

export function DeviceManagementBody() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Guide</Badge>
          <Badge variant="secondary">Devices</Badge>
        </div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Device management</h1>
        <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
          How to browse, understand, and investigate IoT devices in the platform.
        </p>
      </div>

      <Separator />

      {/* Device list page */}
      <section id="device-list" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Overview
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Device list page
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            The{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">/devices</code>{" "}
            page displays all registered IoT devices as cards in a responsive three-column grid.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">What each device card shows</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                "Device name",
                "Device type + internal ID",
                "Status badge",
                "Telemetry mode badge",
                "Risk score (/100)",
                "Compliance score + status badge",
                "Last seen timestamp",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-foreground/30" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ActivityIcon className="size-4 text-muted-foreground" />
                Status badges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              {statusBadges.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <Badge variant={s.variant} className="w-[140px] justify-center text-xs">
                    {s.label}
                  </Badge>
                  <span className="text-xs">{s.color}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CpuIcon className="size-4 text-muted-foreground" />
                Telemetry mode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              {telemetryModes.map((t) => (
                <div key={t.label} className="flex items-center gap-3">
                  <Badge variant={t.badge} className="w-[60px] justify-center text-xs">
                    {t.label}
                  </Badge>
                  <span className="text-xs">{t.condition}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Callout variant="info" title="Live detection">
          A device is considered &quot;live&quot; when its last telemetry reading arrived within
          the last five minutes. After that, the badge switches to &quot;Stale&quot; automatically.
        </Callout>
      </section>

      <Separator />

      {/* Risk and compliance scores */}
      <section id="risk-compliance" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Scoring
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Risk and compliance scores
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            Two complementary scores drive device prioritisation: a risk score (higher is worse) and
            a compliance score (higher is better).
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldAlertIcon className="size-4 text-muted-foreground" />
                Risk score (0–100)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="rounded-lg border bg-muted/30 px-3 py-2">
                <code className="font-mono text-xs text-foreground">
                  Risk = 0.4 × CVSS + 0.4 × Anomaly + 0.2 × (100 − Compliance)
                </code>
              </div>
              <p className="leading-relaxed">
                The CVSS component reflects known vulnerability severity. The anomaly component comes
                from the ML pipeline (0–100). The compliance gap penalises devices that fail
                IEC 62443-4-2 controls.
              </p>
              <div className="space-y-1.5">
                {riskThresholds.map((t) => (
                  <div key={t.range} className="flex items-center gap-3">
                    <Badge variant={t.style as "destructive" | "secondary" | "outline"} className="w-[56px] justify-center text-xs">
                      {t.range}
                    </Badge>
                    <span className="text-xs">{t.meaning}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheckIcon className="size-4 text-muted-foreground" />
                Compliance score (0–100)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p className="leading-relaxed">
                Based on IEC 62443-4-2 controls. A higher score means the device satisfies more
                of the applicable security requirements.
              </p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <Badge variant="default" className="w-[110px] justify-center text-xs">
                    Compliant
                  </Badge>
                  <span className="text-xs">Meets minimum threshold</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="destructive" className="w-[110px] justify-center text-xs">
                    Non-compliant
                  </Badge>
                  <span className="text-xs">Below minimum threshold</span>
                </div>
              </div>
              <Callout variant="default" title="Anomaly score">
                The anomaly score (0–100) is produced by the ML pipeline and reflects how unusual
                recent device behavior is relative to its baseline. It feeds directly into the risk
                formula.
              </Callout>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Device detail page */}
      <section id="device-detail" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Detail view
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Device detail page
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            Clicking a device card navigates to{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">/devices/&#123;id&#125;</code>{" "}
            where you see the full device profile, live telemetry, and security findings.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Page header</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p className="leading-relaxed">
              A breadcrumb trail (<span className="font-medium text-foreground">Devices</span>{" "}
              &gt; <span className="font-medium text-foreground">Device Name</span>) sits at the
              top, followed by the device name, status badge, device type, and a copyable internal
              ID. Risk, compliance, and telemetry mode badges are displayed inline.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {infoCards.map((card) => (
            <Card key={card.title}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <card.icon className="size-3.5 text-muted-foreground" />
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <div className="space-y-1">
                  {card.fields.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-xs">
                      <span className="size-1.5 rounded-full bg-foreground/30" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-3 lg:grid-cols-4">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-base">Live telemetry panel</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              Displays real-time sensor readings as a streaming chart. For details on how telemetry
              flows into the platform, see the{" "}
              <Link
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/90"
                href="/docs/guides/iot-integration-technical"
              >
                integration guide
              </Link>.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Digital twin state</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              Shows the last-known state snapshot of the device twin. Updated each time new
              telemetry arrives. See the{" "}
              <Link
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/90"
                href="/docs/guides/iot-integration-technical"
              >
                integration guide
              </Link>{" "}
              for payload details.
            </CardContent>
          </Card>
        </div>

        <Diagram
          title="Device detail page layout"
          description="Information hierarchy from header through telemetry and security panels."
        >
          <svg width="100%" viewBox="0 0 760 420" role="img">
            <title>Device detail page layout</title>
            <desc>Wireframe showing the device detail page: breadcrumb and header at top, four info cards in a row, telemetry and twin panels side by side, then findings and alerts side by side.</desc>
            <defs>
              <marker id="arr-dd" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M2 1L8 5L2 9" fill="none" stroke="var(--foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </marker>
            </defs>

            {/* Breadcrumb + Header */}
            <rect x="20" y="12" width="720" height="60" rx="10" fill="var(--chart-1)" opacity="0.10" stroke="var(--chart-1)" strokeWidth="1" />
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="36" y="30" dominantBaseline="central">Devices &gt; Device Name</text>
            <text fontSize="14" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="36" y="52" dominantBaseline="central">Header: name · status · type · ID · risk · compliance · telemetry</text>

            <line x1="380" y1="72" x2="380" y2="90" stroke="var(--border)" strokeWidth="1.5" markerEnd="url(#arr-dd)" />

            {/* 4 info cards */}
            <rect x="20" y="92" width="170" height="52" rx="8" fill="var(--chart-3)" opacity="0.12" stroke="var(--chart-3)" strokeWidth="1" />
            <text fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="105" y="112" textAnchor="middle" dominantBaseline="central">Deployment</text>
            <text fontSize="9" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="105" y="128" textAnchor="middle" dominantBaseline="central">location</text>

            <rect x="200" y="92" width="170" height="52" rx="8" fill="var(--chart-5)" opacity="0.12" stroke="var(--chart-5)" strokeWidth="1" />
            <text fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="285" y="112" textAnchor="middle" dominantBaseline="central">Asset</text>
            <text fontSize="9" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="285" y="128" textAnchor="middle" dominantBaseline="central">manufacturer · firmware</text>

            <rect x="380" y="92" width="170" height="52" rx="8" fill="var(--chart-4)" opacity="0.12" stroke="var(--chart-4)" strokeWidth="1" />
            <text fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="465" y="112" textAnchor="middle" dominantBaseline="central">Network</text>
            <text fontSize="9" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="465" y="128" textAnchor="middle" dominantBaseline="central">IP · MAC</text>

            <rect x="560" y="92" width="180" height="52" rx="8" fill="var(--chart-2)" opacity="0.12" stroke="var(--chart-2)" strokeWidth="1" />
            <text fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="650" y="112" textAnchor="middle" dominantBaseline="central">Lifecycle</text>
            <text fontSize="9" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="650" y="128" textAnchor="middle" dominantBaseline="central">last seen · registered</text>

            <line x1="380" y1="144" x2="380" y2="162" stroke="var(--border)" strokeWidth="1.5" markerEnd="url(#arr-dd)" />

            {/* Telemetry (3/4) + Twin (1/4) */}
            <rect x="20" y="164" width="540" height="80" rx="10" fill="var(--chart-2)" opacity="0.10" stroke="var(--chart-2)" strokeWidth="1" />
            <text fontSize="12" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="290" y="196" textAnchor="middle" dominantBaseline="central">Live telemetry panel</text>
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="290" y="216" textAnchor="middle" dominantBaseline="central">streaming charts · 3/4 width</text>

            <rect x="570" y="164" width="170" height="80" rx="10" fill="var(--chart-3)" opacity="0.12" stroke="var(--chart-3)" strokeWidth="1" />
            <text fontSize="12" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="655" y="196" textAnchor="middle" dominantBaseline="central">Digital twin</text>
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="655" y="216" textAnchor="middle" dominantBaseline="central">state snapshot · 1/4</text>

            <line x1="380" y1="244" x2="380" y2="262" stroke="var(--border)" strokeWidth="1.5" markerEnd="url(#arr-dd)" />

            {/* Findings + Alerts side by side */}
            <rect x="20" y="264" width="360" height="80" rx="10" fill="var(--chart-1)" opacity="0.10" stroke="var(--chart-1)" strokeWidth="1" />
            <text fontSize="12" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="200" y="296" textAnchor="middle" dominantBaseline="central">Security findings table</text>
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="200" y="316" textAnchor="middle" dominantBaseline="central">CVE matches via CPE strings</text>

            <rect x="390" y="264" width="350" height="80" rx="10" fill="var(--chart-4)" opacity="0.14" stroke="var(--chart-4)" strokeWidth="1" />
            <text fontSize="12" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="565" y="296" textAnchor="middle" dominantBaseline="central">Recent alerts</text>
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="565" y="316" textAnchor="middle" dominantBaseline="central">ML detections · DPI anomalies</text>

            {/* Legend */}
            <rect x="20" y="370" width="720" height="36" rx="8" fill="var(--chart-1)" opacity="0.08" stroke="var(--chart-1)" strokeWidth="1" strokeDasharray="5 3" />
            <text fontSize="10" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="380" y="390" textAnchor="middle" dominantBaseline="central">
              ↑ header → info cards → telemetry + twin → findings + alerts ↓
            </text>
          </svg>
        </Diagram>
      </section>

      <Separator />

      {/* Security findings */}
      <section id="security-findings" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Vulnerabilities
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Security findings (CVE table)
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            Vulnerabilities matched to the device via CPE (Common Platform Enumeration) strings.
            The platform maps the device&apos;s firmware and software inventory against the NVD
            database.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Table columns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {cveColumns.map((col) => (
                <div key={col.name} className="flex items-start gap-3 text-sm">
                  <code className="mt-0.5 shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                    {col.name}
                  </code>
                  <span className="text-muted-foreground leading-relaxed">{col.description}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldAlertIcon className="size-4 text-muted-foreground" />
              Severity badge mapping
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <div className="flex flex-wrap gap-3">
              {severityBadges.map((s) => (
                <div key={s.level} className="flex items-center gap-2">
                  <Badge variant={s.variant} className="text-xs">{s.level}</Badge>
                  <span className="text-xs">→ {s.variant}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Callout variant="warning" title="CPE matching">
          Findings are only as accurate as the device&apos;s CPE metadata. Ensure firmware version
          and manufacturer fields are kept up to date so the vulnerability scanner can produce
          reliable matches.
        </Callout>
      </section>

      <Separator />

      {/* Device alerts */}
      <section id="device-alerts" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Alerts
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Device alerts
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            Recent alerts specific to the device, sourced from the ML detection pipeline and
            DPI anomaly engine.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangleIcon className="size-4 text-muted-foreground" />
              Alert card structure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="space-y-2">
              {[
                { field: "Title", desc: "Short summary of the alert condition" },
                { field: "Severity badge", desc: "Uses the same destructive / secondary / outline scale as CVE findings" },
                { field: "Description", desc: "Detailed context about what was detected and potential impact" },
              ].map((item) => (
                <div key={item.field} className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-foreground/30" />
                  <div>
                    <span className="font-medium text-foreground">{item.field}</span>
                    <span className="text-muted-foreground"> — {item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-3 sm:grid-cols-2">
          <Callout variant="info" title="ML pipeline alerts">
            Generated when the anomaly model scores a telemetry window above its threshold.
            These alerts include the anomaly score and the metrics that contributed most to the
            deviation.
          </Callout>
          <Callout variant="info" title="DPI anomaly alerts">
            Triggered by deep packet inspection when unusual network patterns are detected,
            such as unexpected outbound connections, protocol violations, or payload anomalies.
          </Callout>
        </div>
      </section>
    </div>
  )
}
