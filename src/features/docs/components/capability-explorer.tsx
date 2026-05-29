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

const CAPABILITIES = [
  {
    key: "devices",
    label: "Devices",
    Icon: CpuIcon,
    blurb: "Every machine with its latest readings and state — plus a live stream per device.",
    endpoints: [
      { method: "GET", path: "/api/v1/devices" },
      { method: "GET", path: "/api/v1/devices/{id}" },
      { method: "WS", path: "/api/v1/ws/telemetry?device_id={id}" },
    ] as Endpoint[],
    preview: (
      <div className="rounded-xl border bg-card p-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm font-medium text-foreground">press-01</span>
          <Badge variant="secondary" className="gap-1">
            <CheckCircle2Icon className="size-3" /> online
          </Badge>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <Stat label="Temp" value="45.8°C" />
          <Stat label="Pressure" value="124.8" />
          <Stat label="Risk" value="24" tone="text-chart-2" />
        </div>
      </div>
    ),
  },
  {
    key: "alerts",
    label: "Alerts",
    Icon: AlertTriangleIcon,
    blurb: "Active and historical alerts when a machine behaves unusually.",
    endpoints: [{ method: "GET", path: "/api/v1/alerts" }] as Endpoint[],
    preview: (
      <div className="space-y-2">
        {[
          { sev: "high", title: "Pressure above threshold", dev: "press-01", time: "14:30" },
          { sev: "medium", title: "Temperature drift", dev: "motor-02", time: "13:58" },
        ].map((a) => (
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
    ),
  },
  {
    key: "vulnerabilities",
    label: "Vulnerabilities",
    Icon: ShieldAlertIcon,
    blurb: "Known CVEs matched to each device, with severity and a fleet-wide summary.",
    endpoints: [
      { method: "GET", path: "/api/v1/devices/{id}/vulnerabilities" },
      { method: "GET", path: "/api/v1/vulnerabilities/summary" },
    ] as Endpoint[],
    preview: (
      <div className="space-y-2">
        {[
          { id: "CVE-2024-3094", sev: "critical", cvss: "9.8" },
          { id: "CVE-2023-44487", sev: "high", cvss: "7.5" },
        ].map((c) => (
          <div key={c.id} className="flex items-center gap-3 rounded-xl border bg-card p-3">
            <Badge variant={c.sev === "critical" ? "destructive" : "secondary"} className="shrink-0 capitalize">
              {c.sev}
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
    label: "Dashboard",
    Icon: GaugeIcon,
    blurb: "Fleet-wide KPIs for your overview widgets, with a live update stream.",
    endpoints: [
      { method: "GET", path: "/api/v1/system/health" },
      { method: "WS", path: "/api/v1/ws/dashboard" },
    ] as Endpoint[],
    preview: (
      <div className="grid grid-cols-3 gap-2">
        <Stat label="Devices monitored" value="12" />
        <Stat label="Active threats" value="1" tone="text-chart-4" />
        <Stat label="System uptime" value="99.9%" tone="text-chart-2" />
      </div>
    ),
  },
] as const

export function CapabilityExplorer() {
  return (
    <Tabs defaultValue="devices" className="space-y-4">
      <TabsList className="flex h-auto flex-wrap">
        {CAPABILITIES.map((c) => {
          const Icon = c.Icon
          return (
            <TabsTrigger key={c.key} value={c.key} className="gap-1.5">
              <Icon className="size-4" />
              {c.label}
            </TabsTrigger>
          )
        })}
      </TabsList>

      {CAPABILITIES.map((c) => (
        <TabsContent key={c.key} value={c.key} className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">{c.blurb}</p>
          <EndpointChips endpoints={[...c.endpoints]} />
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              What you get back
            </div>
            {c.preview}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
