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
  getDevices,
  getPipelineMetrics,
  getSystemHealth,
  getVulnerabilitiesSummary,
} from "@/lib/api"
import type {
  AlertRead,
  AnomalyRead,
  DataStreamRead,
  DeviceRead,
  PipelineStageRead,
  SystemHealthRead,
  VulnerabilitySummaryResponse,
} from "@/lib/backend-types"
import { useDashboardWs } from "@/lib/ws-dashboard"

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
        setKpis(env.data as any)
        break
      case "pipeline":
        setPipeline(env.data as any)
        break
      case "data_streams":
        setStreams(env.data as any)
        break
      case "alerts":
        setAlerts(env.data as any)
        break
      case "anomalies":
        setAnomalies(env.data as any)
        break
      case "vulnerabilities_summary":
        setVulnSummary(env.data as any)
        break
      default:
        break
    }
  })

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              Industrial IoT Cybersecurity Dashboard
            </h1>
            <p className="text-muted-foreground">
              Real-time monitoring across pipeline stages, devices, and detections.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/devices">Open devices</Link>
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Threats detected</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold tabular-nums">
              {kpis?.threats_detected ?? "—"}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Devices monitored</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold tabular-nums">
              {kpis?.devices_monitored ?? devices.length ?? "—"}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>System uptime</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold tabular-nums">
              {kpis ? `${kpis.system_uptime_pct.toFixed(1)}%` : "—"}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Response time</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold tabular-nums">
              {kpis ? `${kpis.avg_response_time_ms}ms` : "—"}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Data pipeline</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {pipeline.length === 0 ? (
                <Empty className="bg-card sm:col-span-2">
                  <EmptyHeader>
                    <EmptyTitle>No pipeline metrics yet</EmptyTitle>
                    <EmptyDescription>
                      Start the backend stack and telemetry simulator to populate live pipeline health.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent />
                </Empty>
              ) : (
                pipeline.map((s) => (
                  <div key={s.name} className="rounded-2xl border bg-card p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium">{s.name}</div>
                      <Badge variant={statusBadge(s.status)}>{s.status}</Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <div className="text-xs text-muted-foreground">Throughput</div>
                        <div className="font-mono tabular-nums">{s.throughput}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Success</div>
                        <div className="font-mono tabular-nums">{s.success_rate}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Latency</div>
                        <div className="font-mono tabular-nums">{s.avg_latency_ms}ms</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Data streams</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {streams.length === 0 ? (
                <Empty className="bg-card">
                  <EmptyHeader>
                    <EmptyTitle>No streams available</EmptyTitle>
                    <EmptyDescription>
                      Stream cards appear once telemetry and pipeline aggregation starts.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent />
                </Empty>
              ) : (
                streams.map((st) => (
                  <div key={st.key} className="rounded-2xl border bg-card p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium">{st.name}</div>
                      <Badge variant={statusBadge(st.status)}>{st.status}</Badge>
                    </div>
                    <div className="mt-2 text-2xl font-semibold tabular-nums">
                      {st.current_value}{" "}
                      <span className="text-sm text-muted-foreground">{st.unit}</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Severity</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8">
                        <div className="text-sm text-muted-foreground">
                          No alerts yet. This section will populate when the backend detects anomalies or DPI events.
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    alerts.slice(0, 8).map((a) => (
                      <TableRow key={a.id}>
                        <TableCell>
                          <Badge variant={sevBadge(a.severity)}>{a.severity}</Badge>
                        </TableCell>
                        <TableCell className="whitespace-normal">{a.title}</TableCell>
                        <TableCell>{a.source}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{a.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vulnerabilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Top CVEs by severity/score.
              </div>
              <Separator />
              <div className="space-y-2">
                {vulnSummary?.top_10?.length ? (
                  vulnSummary.top_10.slice(0, 5).map((v) => (
                    <div key={v.cve_id} className="flex items-center justify-between gap-3">
                      <div className="font-mono text-xs">{v.cve_id}</div>
                      <Badge variant="outline">
                        {v.cvss_score != null ? v.cvss_score.toFixed(1) : "—"}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No vulnerability summary available yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Anomaly detector</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Recent anomalies detected by the pipeline.
              </div>
              <Separator />
              <div className="space-y-2">
                {anomalies.length === 0 ? (
                  <div className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
                    No anomalies detected yet.
                  </div>
                ) : (
                  anomalies.slice(0, 6).map((a) => (
                    <div key={a.id} className="rounded-xl border bg-card p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-medium">{a.device_id}</div>
                        <Badge variant={sevBadge(a.severity)}>{a.severity}</Badge>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Score <span className="font-mono tabular-nums">{a.score.toFixed(2)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Devices</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {devices.length === 0 ? (
                <Empty className="bg-card sm:col-span-2">
                  <EmptyHeader>
                    <EmptyTitle>No devices found</EmptyTitle>
                    <EmptyDescription>
                      Once devices are seeded/registered, they’ll appear here.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent />
                </Empty>
              ) : (
                devices.slice(0, 6).map((d) => (
                  <Link key={d.id} href={`/devices/${encodeURIComponent(d.id)}`} className="block">
                    <div className="rounded-2xl border bg-card p-4 hover:bg-muted/20 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-medium truncate">{d.name}</div>
                          <div className="text-sm text-muted-foreground truncate">{d.device_type}</div>
                        </div>
                        <Badge variant="outline">{d.status}</Badge>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Badge variant="outline">Risk {d.risk_score}</Badge>
                        <Badge variant="outline">Comp {d.compliance_score}</Badge>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
