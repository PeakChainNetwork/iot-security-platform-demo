"use client"

import * as React from "react"
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  CpuIcon,
  GaugeIcon,
  ShieldAlertIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useLocale } from "@/lib/i18n/use-locale"
import type { Locale } from "@/lib/i18n/config"

type Endpoint = { method: "GET" | "WS"; path: string }

function EndpointChips({ endpoints }: { endpoints: Endpoint[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {endpoints.map((e) => (
        <span
          key={e.path}
          className="inline-flex items-center gap-1.5 rounded-md border bg-card px-2 py-1 font-mono text-[11px]"
        >
          <Badge
            variant={e.method === "WS" ? "outline" : "secondary"}
            className="rounded px-1 py-0 text-[10px] font-semibold"
          >
            {e.method}
          </Badge>
          <span className="text-muted-foreground">{e.path}</span>
        </span>
      ))}
    </div>
  )
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={cn("mt-1 font-mono text-lg font-semibold text-foreground", tone)}>{value}</div>
    </div>
  )
}

type Strings = {
  tabs: { devices: string; alerts: string; vulnerabilities: string; dashboard: string }
  whatYouGetBack: string
  online: string
  blurbs: { devices: string; alerts: string; vulnerabilities: string; dashboard: string }
  stats: {
    temp: string
    pressure: string
    risk: string
    devicesMonitored: string
    activeThreats: string
    systemUptime: string
  }
  alertItems: { sev: string; sevLabel: string; title: string; dev: string; time: string }[]
  severityLabels: { critical: string; high: string }
}

const strings: Record<Locale, Strings> = {
  en: {
    tabs: { devices: "Devices", alerts: "Alerts", vulnerabilities: "Vulnerabilities", dashboard: "Dashboard" },
    whatYouGetBack: "What you get back",
    online: "online",
    blurbs: {
      devices: "Every machine with its latest readings and state — plus a live stream per device.",
      alerts: "Active and historical alerts when a machine behaves unusually.",
      vulnerabilities: "Known CVEs matched to each device, with severity and a fleet-wide summary.",
      dashboard: "Fleet-wide KPIs for your overview widgets, with a live update stream.",
    },
    stats: {
      temp: "Temp",
      pressure: "Pressure",
      risk: "Risk",
      devicesMonitored: "Devices monitored",
      activeThreats: "Active threats",
      systemUptime: "System uptime",
    },
    alertItems: [
      { sev: "high", sevLabel: "high", title: "Pressure above threshold", dev: "press-01", time: "14:30" },
      { sev: "medium", sevLabel: "medium", title: "Temperature drift", dev: "motor-02", time: "13:58" },
    ],
    severityLabels: { critical: "critical", high: "high" },
  },
  de: {
    tabs: { devices: "Geräte", alerts: "Warnungen", vulnerabilities: "Schwachstellen", dashboard: "Dashboard" },
    whatYouGetBack: "Was Sie zurückerhalten",
    online: "online",
    blurbs: {
      devices: "Jede Maschine mit ihren neuesten Messwerten und ihrem Zustand — plus einem Live-Stream pro Gerät.",
      alerts: "Aktive und historische Warnungen, wenn sich eine Maschine ungewöhnlich verhält.",
      vulnerabilities: "Bekannte CVEs, die jedem Gerät zugeordnet sind, mit Schweregrad und einer flottenweiten Zusammenfassung.",
      dashboard: "Flottenweite KPIs für Ihre Übersichts-Widgets, mit einem Live-Aktualisierungs-Stream.",
    },
    stats: {
      temp: "Temp.",
      pressure: "Druck",
      risk: "Risiko",
      devicesMonitored: "Überwachte Geräte",
      activeThreats: "Aktive Bedrohungen",
      systemUptime: "System-Verfügbarkeit",
    },
    alertItems: [
      { sev: "high", sevLabel: "hoch", title: "Druck über Schwellenwert", dev: "press-01", time: "14:30" },
      { sev: "medium", sevLabel: "mittel", title: "Temperaturabweichung", dev: "motor-02", time: "13:58" },
    ],
    severityLabels: { critical: "kritisch", high: "hoch" },
  },
}

type Capability = {
  key: string
  label: string
  Icon: typeof CpuIcon
  blurb: string
  endpoints: Endpoint[]
  preview: React.ReactNode
}

function buildCapabilities(s: Strings): Capability[] {
  return [
    {
      key: "devices",
      label: s.tabs.devices,
      Icon: CpuIcon,
      blurb: s.blurbs.devices,
      endpoints: [
        { method: "GET", path: "/api/v1/devices" },
        { method: "GET", path: "/api/v1/devices/{id}" },
        { method: "WS", path: "/api/v1/ws/telemetry?device_id={id}" },
      ],
      preview: (
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm font-medium text-foreground">press-01</span>
            <Badge variant="secondary" className="gap-1">
              <CheckCircle2Icon className="size-3" /> {s.online}
            </Badge>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <Stat label={s.stats.temp} value="45.8°C" />
            <Stat label={s.stats.pressure} value="124.8" />
            <Stat label={s.stats.risk} value="24" tone="text-chart-2" />
          </div>
        </div>
      ),
    },
    {
      key: "alerts",
      label: s.tabs.alerts,
      Icon: AlertTriangleIcon,
      blurb: s.blurbs.alerts,
      endpoints: [{ method: "GET", path: "/api/v1/alerts" }],
      preview: (
        <div className="space-y-2">
          {s.alertItems.map((a) => (
            <div key={a.title} className="flex items-center gap-3 rounded-xl border bg-card p-3">
              <Badge variant={a.sev === "high" ? "destructive" : "secondary"} className="shrink-0 capitalize">
                {a.sevLabel}
              </Badge>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-foreground">{a.title}</div>
                <div className="font-mono text-xs text-muted-foreground">{a.dev}</div>
              </div>
              <div className="shrink-0 font-mono text-xs text-muted-foreground">{a.time}</div>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "vulnerabilities",
      label: s.tabs.vulnerabilities,
      Icon: ShieldAlertIcon,
      blurb: s.blurbs.vulnerabilities,
      endpoints: [
        { method: "GET", path: "/api/v1/devices/{id}/vulnerabilities" },
        { method: "GET", path: "/api/v1/vulnerabilities/summary" },
      ],
      preview: (
        <div className="space-y-2">
          {[
            { id: "CVE-2024-3094", sev: "critical", sevLabel: s.severityLabels.critical, cvss: "9.8" },
            { id: "CVE-2023-44487", sev: "high", sevLabel: s.severityLabels.high, cvss: "7.5" },
          ].map((c) => (
            <div key={c.id} className="flex items-center gap-3 rounded-xl border bg-card p-3">
              <Badge variant={c.sev === "critical" ? "destructive" : "secondary"} className="shrink-0 capitalize">
                {c.sevLabel}
              </Badge>
              <span className="flex-1 font-mono text-sm text-foreground">{c.id}</span>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">CVSS {c.cvss}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "dashboard",
      label: s.tabs.dashboard,
      Icon: GaugeIcon,
      blurb: s.blurbs.dashboard,
      endpoints: [
        { method: "GET", path: "/api/v1/system/health" },
        { method: "WS", path: "/api/v1/ws/dashboard" },
      ],
      preview: (
        <div className="grid grid-cols-3 gap-2">
          <Stat label={s.stats.devicesMonitored} value="12" />
          <Stat label={s.stats.activeThreats} value="1" tone="text-chart-4" />
          <Stat label={s.stats.systemUptime} value="99.9%" tone="text-chart-2" />
        </div>
      ),
    },
  ]
}

export function CapabilityExplorer() {
  const lang = useLocale()
  const s = strings[lang]
  const capabilities = buildCapabilities(s)

  return (
    <Tabs defaultValue="devices" className="space-y-4">
      <TabsList className="flex h-auto flex-wrap">
        {capabilities.map((c) => {
          const Icon = c.Icon
          return (
            <TabsTrigger key={c.key} value={c.key} className="gap-1.5">
              <Icon className="size-4" />
              {c.label}
            </TabsTrigger>
          )
        })}
      </TabsList>

      {capabilities.map((c) => (
        <TabsContent key={c.key} value={c.key} className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">{c.blurb}</p>
          <EndpointChips endpoints={c.endpoints} />
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {s.whatYouGetBack}
            </div>
            {c.preview}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
