import Link from "next/link"
import type { LucideIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Callout } from "@/features/docs/components/callout"
import { DocsPageHeader } from "@/features/docs/components/docs-page-header"
import { cn } from "@/lib/utils"
import { localizedHref } from "@/lib/i18n/routing"
import type { Locale } from "@/lib/i18n/config"
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  CpuIcon,
  ExternalLinkIcon,
  GaugeIcon,
  LayoutDashboardIcon,
} from "lucide-react"

type Section = {
  icon: LucideIcon
  title: string
  desc: string
  preview: React.ReactNode
  href: string
  cta: string
}

type Content = {
  header: { eyebrow: string; title: string; description: string; openDashboard: string }
  callout: {
    title: string
    body: (runLocallyHref: string) => React.ReactNode
  }
  kpis: { threats: string; devices: string; uptime: string; response: string }
  detail: { temp: string; pressure: string; risk: string }
  sections: Section[]
  footer: (apiHref: string) => React.ReactNode
}

function Kpi({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={cn("mt-1 font-mono text-lg font-semibold text-foreground", tone)}>{value}</div>
    </div>
  )
}

function RiskBar({ value, tone }: { value: number; tone: string }) {
  return (
    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
      <div className={cn("h-full rounded-full", tone)} style={{ width: `${value}%` }} />
    </div>
  )
}

const DEVICE_ROWS = [
  { name: "press-01", status: "online", risk: 24, tone: "bg-chart-2" },
  { name: "motor-02", status: "alert", risk: 86, tone: "bg-destructive" },
  { name: "pump-03", status: "online", risk: 31, tone: "bg-chart-2" },
]

const ALERTS = [
  { sev: "high", title: "Pressure above threshold", dev: "motor-02", time: "14:30" },
  { sev: "medium", title: "Temperature drift", dev: "press-01", time: "13:58" },
]

function OverviewPreview({ kpis }: { kpis: Content["kpis"] }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <Kpi label={kpis.threats} value="1" tone="text-chart-4" />
      <Kpi label={kpis.devices} value="12" />
      <Kpi label={kpis.uptime} value="99.9%" tone="text-chart-2" />
      <Kpi label={kpis.response} value="42ms" />
    </div>
  )
}

function DeviceListPreview() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card divide-y">
      {DEVICE_ROWS.map((d) => (
        <div key={d.name} className="flex items-center gap-3 px-3 py-2.5">
          <CpuIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <span className="flex-1 font-mono text-xs font-medium text-foreground">{d.name}</span>
          <Badge variant={d.status === "alert" ? "destructive" : "secondary"} className="text-[10px] capitalize">
            {d.status}
          </Badge>
          <RiskBar value={d.risk} tone={d.tone} />
        </div>
      ))}
    </div>
  )
}

function DeviceDetailPreview({ detail }: { detail: Content["detail"] }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm font-medium text-foreground">press-01</span>
        <Badge variant="secondary" className="gap-1">
          <CheckCircle2Icon className="size-3" /> online
        </Badge>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <Kpi label={detail.temp} value="45.8°C" />
        <Kpi label={detail.pressure} value="124.8" />
        <Kpi label={detail.risk} value="24" tone="text-chart-2" />
      </div>
    </div>
  )
}

function AlertsPreview() {
  return (
    <div className="space-y-2">
      {ALERTS.map((a) => (
        <div key={a.title} className="flex items-center gap-3 rounded-xl border bg-card p-3">
          <Badge variant={a.sev === "high" ? "destructive" : "secondary"} className="shrink-0 capitalize">
            {a.sev}
          </Badge>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-foreground">{a.title}</div>
            <div className="font-mono text-xs text-muted-foreground">{a.dev}</div>
          </div>
          <div className="shrink-0 font-mono text-xs text-muted-foreground">{a.time}</div>
        </div>
      ))}
    </div>
  )
}

const content: Record<Locale, Content> = {
  en: {
    header: {
      eyebrow: "Documentation",
      title: "Tour the dashboard",
      description: "A quick look at the live views Peaksoft EU gives you once machines are connected.",
      openDashboard: "Open the dashboard",
    },
    callout: {
      title: "This is the real thing",
      body: (runLocallyHref) => (
        <>
          The dashboard is part of this app — the panels below mirror it. It shows live data once it&apos;s
          pointed at a running backend (see{" "}
          <Link href={runLocallyHref} className="font-medium text-primary underline underline-offset-4">
            run it locally
          </Link>
          ).
        </>
      ),
    },
    kpis: {
      threats: "Threats detected",
      devices: "Devices monitored",
      uptime: "System uptime",
      response: "Response time",
    },
    detail: { temp: "Temp", pressure: "Pressure", risk: "Risk" },
    sections: [
      {
        icon: GaugeIcon,
        title: "Dashboard overview",
        desc: "The home screen: live KPIs (threats, devices monitored, uptime, response time) above pipeline health, alerts, top vulnerabilities, and recent anomalies — the whole fleet at a glance.",
        preview: null,
        href: "/",
        cta: "Open the dashboard",
      },
      {
        icon: CpuIcon,
        title: "Devices",
        desc: "Every connected machine with its status, risk, and compliance score, so the ones needing attention stand out. Click any machine to drill in.",
        preview: <DeviceListPreview />,
        href: "/devices",
        cta: "Open devices",
      },
      {
        icon: LayoutDashboardIcon,
        title: "Device detail",
        desc: "Open a machine to see its live telemetry, current risk score, and recent history — the full picture for one asset.",
        preview: null,
        href: "/devices",
        cta: "Browse devices",
      },
      {
        icon: AlertTriangleIcon,
        title: "Alerts & anomalies",
        desc: "When a machine behaves unusually, it shows up here with its severity, source, and the anomaly score that triggered it.",
        preview: <AlertsPreview />,
        href: "/",
        cta: "Open the dashboard",
      },
    ],
    footer: (apiHref) => (
      <>
        Want the data behind these views? See{" "}
        <Link href={apiHref} className="text-primary underline underline-offset-4">
          platform API capabilities
        </Link>
        .
      </>
    ),
  },
  de: {
    header: {
      eyebrow: "Dokumentation",
      title: "Rundgang durchs Dashboard",
      description:
        "Ein kurzer Blick auf die Live-Ansichten, die Ihnen Peaksoft EU bietet, sobald Maschinen angebunden sind.",
      openDashboard: "Dashboard öffnen",
    },
    callout: {
      title: "Das ist die echte Anwendung",
      body: (runLocallyHref) => (
        <>
          Das Dashboard ist Teil dieser App — die Panels unten spiegeln es wider. Es zeigt Live-Daten, sobald es
          auf ein laufendes Backend verweist (siehe{" "}
          <Link href={runLocallyHref} className="font-medium text-primary underline underline-offset-4">
            lokal ausführen
          </Link>
          ).
        </>
      ),
    },
    kpis: {
      threats: "Erkannte Bedrohungen",
      devices: "Überwachte Geräte",
      uptime: "Systemverfügbarkeit",
      response: "Antwortzeit",
    },
    detail: { temp: "Temp.", pressure: "Druck", risk: "Risiko" },
    sections: [
      {
        icon: GaugeIcon,
        title: "Dashboard-Übersicht",
        desc: "Der Startbildschirm: Live-KPIs (Bedrohungen, überwachte Geräte, Verfügbarkeit, Antwortzeit) über dem Zustand der Pipeline, Warnungen, den wichtigsten Schwachstellen und den jüngsten Anomalien — die gesamte Flotte auf einen Blick.",
        preview: null,
        href: "/",
        cta: "Dashboard öffnen",
      },
      {
        icon: CpuIcon,
        title: "Geräte",
        desc: "Jede angebundene Maschine mit ihrem Status, Risiko und Compliance-Wert, damit die Maschinen, die Aufmerksamkeit benötigen, hervorstechen. Klicken Sie auf eine Maschine, um in die Details zu gelangen.",
        preview: <DeviceListPreview />,
        href: "/devices",
        cta: "Geräte öffnen",
      },
      {
        icon: LayoutDashboardIcon,
        title: "Gerätedetails",
        desc: "Öffnen Sie eine Maschine, um ihre Live-Telemetrie, den aktuellen Risikowert und den jüngsten Verlauf zu sehen — das vollständige Bild für eine einzelne Anlage.",
        preview: null,
        href: "/devices",
        cta: "Geräte durchsuchen",
      },
      {
        icon: AlertTriangleIcon,
        title: "Warnungen & Anomalien",
        desc: "Wenn sich eine Maschine ungewöhnlich verhält, erscheint sie hier mit ihrem Schweregrad, ihrer Quelle und dem Anomaliewert, der sie ausgelöst hat.",
        preview: <AlertsPreview />,
        href: "/",
        cta: "Dashboard öffnen",
      },
    ],
    footer: (apiHref) => (
      <>
        Möchten Sie die Daten hinter diesen Ansichten? Siehe{" "}
        <Link href={apiHref} className="text-primary underline underline-offset-4">
          Funktionen der Plattform-API
        </Link>
        .
      </>
    ),
  },
}

export function DashboardTourBody({ lang }: { lang: Locale }) {
  const t = content[lang]
  const previews: React.ReactNode[] = [
    <OverviewPreview key="overview" kpis={t.kpis} />,
    t.sections[1].preview,
    <DeviceDetailPreview key="detail" detail={t.detail} />,
    t.sections[3].preview,
  ]

  return (
    <div className="space-y-10">
      <DocsPageHeader
        eyebrow={t.header.eyebrow}
        title={t.header.title}
        icon={LayoutDashboardIcon}
        description={t.header.description}
      >
        <Button asChild>
          <Link href={localizedHref(lang, "/")}>
            {t.header.openDashboard}
            <ArrowRightIcon className="size-4" />
          </Link>
        </Button>
      </DocsPageHeader>

      <Callout variant="tip" title={t.callout.title}>
        {t.callout.body(localizedHref(lang, "/docs/run-locally"))}
      </Callout>

      <div className="space-y-8">
        {t.sections.map((s, i) => {
          const Icon = s.icon
          return (
            <section key={s.title} className="grid items-start gap-5 lg:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-background text-primary">
                    <Icon className="size-4" aria-hidden />
                  </div>
                  <div
                    role="heading"
                    aria-level={2}
                    className="font-heading text-lg font-semibold tracking-tight text-foreground"
                  >
                    {s.title}
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                <Link
                  href={localizedHref(lang, s.href)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  <ExternalLinkIcon className="size-3.5" aria-hidden />
                  {s.cta}
                </Link>
              </div>
              <div className="rounded-2xl border bg-muted/20 p-4">{previews[i]}</div>
            </section>
          )
        })}
      </div>

      <p className="text-sm text-muted-foreground">
        {t.footer(localizedHref(lang, "/docs/guides/platform-api"))}
      </p>
    </div>
  )
}
