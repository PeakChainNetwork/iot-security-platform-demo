"use client"

import * as React from "react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  getAlerts,
  getAnomalies,
  getDataStreams,
  getPipelineMetrics,
  getSystemHealth,
  getVulnerabilitiesSummary,
  useDashboardWs,
} from "@/features/dashboard"
import { getDevices } from "@/features/devices"
import type {
  AlertRead,
  AnomalyRead,
  DataStreamRead,
  DeviceRead,
  PipelineStageRead,
  SystemHealthRead,
  VulnerabilitySummaryResponse,
} from "@/types/backend-types"

function sevBadge(sev: string) {
  if (sev === "critical") return "destructive"
  if (sev === "high") return "warning"
  if (sev === "medium") return "secondary"
  return "outline"
}

function statusBadge(status: string) {
  if (status === "healthy") return "success"
  if (status === "warning") return "warning"
  return "destructive"
}

export default function DashboardPage() {
  const [kpis, setKpis] = React.useState<SystemHealthRead | null>(null)
  const [pipeline, setPipeline] = React.useState<PipelineStageRead[]>([])
  const [streams, setStreams] = React.useState<DataStreamRead[]>([])
  const [alerts, setAlerts] = React.useState<AlertRead[]>([])
  const [anomalies, setAnomalies] = React.useState<AnomalyRead[]>([])
  const [devices, setDevices] = React.useState<DeviceRead[]>([])
  const [vulnSummary, setVulnSummary] = React.useState<VulnerabilitySummaryResponse | null>(null)

  React.useEffect(() => {
    ;(async () => {
      const [
        k,
        p,
        s,
        a,
        an,
        d,
        v,
      ] = await Promise.all([
        getSystemHealth(),
        getPipelineMetrics(),
        getDataStreams(),
        getAlerts(),
        getAnomalies(),
        getDevices(),
        getVulnerabilitiesSummary(),
      ])
      setKpis(k)
      setPipeline(p)
      setStreams(s)
      setAlerts(a)
      setAnomalies(an)
      setDevices(d)
      setVulnSummary(v)
    })().catch(() => {
      // keep the dashboard resilient; individual sections can still update via WS
    })
  }, [])

  useDashboardWs((env) => {
    switch (env.type) {
      case "kpis":
        setKpis(env.data as SystemHealthRead)
        break
      case "pipeline":
        setPipeline(env.data as PipelineStageRead[])
        break
      case "data_streams":
        setStreams(env.data as DataStreamRead[])
        break
      case "alerts":
        setAlerts(env.data as AlertRead[])
        break
      case "anomalies":
        setAnomalies(env.data as AnomalyRead[])
        break
      case "vulnerabilities_summary":
        setVulnSummary(env.data as VulnerabilitySummaryResponse)
        break
      default:
        break
    }
  })

  return (
    <div className="flex flex-1 flex-col">
      {/* Wazuh sub-header / Query Bar */}
      <div className="bg-wazuh-card border-b border-wazuh-border p-3 flex flex-col sm:flex-row gap-3 items-center justify-between sticky top-0 z-30">
        <div className="flex w-full sm:w-2/3 items-center">
          <div className="flex-1 flex items-center border border-wazuh-border rounded-sm bg-background px-3 h-9">
            <span className="text-muted-foreground text-sm flex-1">Search... (e.g. status: "critical")</span>
            <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">KQL</span>
          </div>
          <Button variant="outline" size="sm" className="ml-2 h-9 rounded-sm border-wazuh-border">
            Update
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 rounded-sm border-wazuh-border whitespace-nowrap">
            Last 24 hours
          </Button>
        </div>
      </div>

      <div className="mx-auto w-full flex-1 p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Security events
          </h1>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          <Card className="rounded-sm shadow-sm border-wazuh-border bg-wazuh-card">
            <CardHeader className="py-3 px-4 border-b border-wazuh-border/50">
              <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Threats detected</CardTitle>
            </CardHeader>
            <CardContent className="p-4 text-3xl font-semibold tabular-nums text-foreground">
              {kpis?.threats_detected ?? "—"}
            </CardContent>
          </Card>
          <Card className="rounded-sm shadow-sm border-wazuh-border bg-wazuh-card">
            <CardHeader className="py-3 px-4 border-b border-wazuh-border/50">
              <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Devices monitored</CardTitle>
            </CardHeader>
            <CardContent className="p-4 text-3xl font-semibold tabular-nums text-foreground">
              {kpis?.devices_monitored ?? devices.length ?? "—"}
            </CardContent>
          </Card>
          <Card className="rounded-sm shadow-sm border-wazuh-border bg-wazuh-card">
            <CardHeader className="py-3 px-4 border-b border-wazuh-border/50">
              <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">System uptime</CardTitle>
            </CardHeader>
            <CardContent className="p-4 text-3xl font-semibold tabular-nums text-foreground">
              {kpis ? `${kpis.system_uptime_pct.toFixed(1)}%` : "—"}
            </CardContent>
          </Card>
          <Card className="rounded-sm shadow-sm border-wazuh-border bg-wazuh-card">
            <CardHeader className="py-3 px-4 border-b border-wazuh-border/50">
              <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Response time</CardTitle>
            </CardHeader>
            <CardContent className="p-4 text-3xl font-semibold tabular-nums text-foreground">
              {kpis ? `${kpis.avg_response_time_ms}ms` : "—"}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-5">
          <Card className="lg:col-span-3 rounded-sm shadow-sm border-wazuh-border bg-wazuh-card flex flex-col">
            <CardHeader className="py-3 px-4 border-b border-wazuh-border/50">
              <CardTitle className="text-sm font-semibold">Data pipeline</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1">
              <div className="grid gap-3 sm:grid-cols-2">
                {pipeline.length === 0 ? (
                  <Empty className="bg-wazuh-card sm:col-span-2">
                    <EmptyHeader>
                      <EmptyTitle>No pipeline metrics yet</EmptyTitle>
                      <EmptyDescription>
                        Start the backend stack and telemetry simulator.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  pipeline.map((s) => (
                    <div key={s.name} className="rounded-sm border border-wazuh-border bg-background p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold">{s.name}</div>
                        <Badge variant={statusBadge(s.status)} className="rounded-sm text-[10px] uppercase">{s.status}</Badge>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <div className="text-muted-foreground mb-1">Throughput</div>
                          <div className="font-mono tabular-nums">{s.throughput}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">Success</div>
                          <div className="font-mono tabular-nums">{s.success_rate}%</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">Latency</div>
                          <div className="font-mono tabular-nums">{s.avg_latency_ms}ms</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 rounded-sm shadow-sm border-wazuh-border bg-wazuh-card flex flex-col">
            <CardHeader className="py-3 px-4 border-b border-wazuh-border/50">
              <CardTitle className="text-sm font-semibold">Data streams</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1">
              <div className="grid gap-3">
                {streams.length === 0 ? (
                  <Empty className="bg-wazuh-card">
                    <EmptyHeader>
                      <EmptyTitle>No streams available</EmptyTitle>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  streams.map((st) => (
                    <div key={st.key} className="rounded-sm border border-wazuh-border bg-background p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold">{st.name}</div>
                        <Badge variant={statusBadge(st.status)} className="rounded-sm text-[10px] uppercase">{st.status}</Badge>
                      </div>
                      <div className="mt-2 text-xl font-semibold tabular-nums">
                        {st.current_value}{" "}
                        <span className="text-xs text-muted-foreground">{st.unit}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2 rounded-sm shadow-sm border-wazuh-border bg-wazuh-card">
            <CardHeader className="py-3 px-4 border-b border-wazuh-border/50">
              <CardTitle className="text-sm font-semibold">Alerts</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-wazuh-border">
                    <TableHead className="h-9 text-xs font-semibold text-muted-foreground">Severity</TableHead>
                    <TableHead className="h-9 text-xs font-semibold text-muted-foreground">Title</TableHead>
                    <TableHead className="h-9 text-xs font-semibold text-muted-foreground">Source</TableHead>
                    <TableHead className="h-9 text-xs font-semibold text-muted-foreground">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                        No alerts match your search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    alerts.slice(0, 8).map((a) => (
                      <TableRow key={a.id} className="border-wazuh-border hover:bg-muted/10">
                        <TableCell className="py-2">
                          <Badge variant={sevBadge(a.severity)} className="rounded-sm text-[10px] uppercase">{a.severity}</Badge>
                        </TableCell>
                        <TableCell className="py-2 text-sm">{a.title}</TableCell>
                        <TableCell className="py-2 text-sm">{a.source}</TableCell>
                        <TableCell className="py-2">
                          <Badge variant="outline" className="rounded-sm text-[10px] uppercase bg-background">{a.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="rounded-sm shadow-sm border-wazuh-border bg-wazuh-card">
            <CardHeader className="py-3 px-4 border-b border-wazuh-border/50">
              <CardTitle className="text-sm font-semibold">Vulnerabilities</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="space-y-2">
                {vulnSummary?.top_10?.length ? (
                  vulnSummary.top_10.slice(0, 5).map((v) => (
                    <div key={v.cve_id} className="flex items-center justify-between gap-3 text-sm border-b border-wazuh-border pb-2 last:border-0 last:pb-0">
                      <div className="font-mono text-xs text-primary">{v.cve_id}</div>
                      <Badge variant="outline" className="rounded-sm bg-background">
                        {v.cvss_score != null ? v.cvss_score.toFixed(1) : "—"}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    No vulnerabilities found.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="rounded-sm shadow-sm border-wazuh-border bg-wazuh-card">
            <CardHeader className="py-3 px-4 border-b border-wazuh-border/50">
              <CardTitle className="text-sm font-semibold">Anomaly detector</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="space-y-2">
                {anomalies.length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    No anomalies detected.
                  </div>
                ) : (
                  anomalies.slice(0, 6).map((a) => (
                    <div key={a.id} className="border-b border-wazuh-border pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <div className="text-sm font-medium">{a.device_id}</div>
                        <Badge variant={sevBadge(a.severity)} className="rounded-sm text-[10px] uppercase">{a.severity}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Score: <span className="font-mono tabular-nums">{a.score.toFixed(2)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 rounded-sm shadow-sm border-wazuh-border bg-wazuh-card flex flex-col">
            <CardHeader className="py-3 px-4 border-b border-wazuh-border/50 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">Agents</CardTitle>
              <Button asChild variant="ghost" size="sm" className="h-6 text-xs text-primary hover:text-primary/80">
                <Link href="/devices">View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-wazuh-border">
                    <TableHead className="h-9 text-xs font-semibold text-muted-foreground">Name</TableHead>
                    <TableHead className="h-9 text-xs font-semibold text-muted-foreground">Type</TableHead>
                    <TableHead className="h-9 text-xs font-semibold text-muted-foreground">Status</TableHead>
                    <TableHead className="h-9 text-xs font-semibold text-muted-foreground">Risk</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                        No agents registered.
                      </TableCell>
                    </TableRow>
                  ) : (
                    devices.slice(0, 6).map((d) => (
                      <TableRow key={d.id} className="border-wazuh-border hover:bg-muted/10 cursor-pointer" onClick={() => window.location.href=`/devices/${encodeURIComponent(d.id)}`}>
                        <TableCell className="py-2 text-sm font-medium text-primary">{d.name}</TableCell>
                        <TableCell className="py-2 text-sm">{d.device_type}</TableCell>
                        <TableCell className="py-2">
                          <Badge variant="outline" className="rounded-sm text-[10px] uppercase bg-background">{d.status}</Badge>
                        </TableCell>
                        <TableCell className="py-2">
                          <div className="text-xs font-mono">{d.risk_score}</div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}