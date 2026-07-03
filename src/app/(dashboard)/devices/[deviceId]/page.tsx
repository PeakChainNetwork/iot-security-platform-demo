import Link from "next/link"
import { notFound } from "next/navigation"
import { format } from "date-fns"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CopyButton } from "@/components/common/copy-button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DeviceTelemetryPanel } from "@/features/devices/components/device-telemetry-panel"
import { ApiError } from "@/lib/api-client"
import { getDevice } from "@/features/devices"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { minutesSince, parseBackendDate } from "@/lib/dates"

type DeviceSections = {
  sections?: {
    vulnerabilities?: Array<{
      cve_id: string
      severity?: string
      cvss_score?: number | null
      description?: string
    }>
    alerts?: Array<{ id: string; title?: string; severity?: string; description?: string }>
  }
}

function statusBadgeVariant(status: string) {
  const s = status.toLowerCase()
  if (s === "online" || s === "active" || s === "ok") return "success"
  if (s === "offline" || s === "inactive") return "secondary"
  if (s === "warning") return "warning"
  if (s === "critical" || s === "compromised") return "destructive"
  return "outline"
}

function complianceBadgeVariant(complianceStatus: string) {
  const s = complianceStatus.toLowerCase()
  if (s.includes("non-compliant") || s.includes("non compliant") || s === "fail") return "destructive"
  if (s.includes("compliant") || s === "pass") return "default"
  if (s.includes("non") || s === "fail") return "destructive"
  return "secondary"
}

function sevBadge(sev: string) {
  if (sev === "critical") return "destructive"
  if (sev === "high") return "warning"
  if (sev === "medium") return "secondary"
  return "outline"
}

function formatDateTime(iso: string) {
  try {
    const d = parseBackendDate(iso) ?? new Date(iso)
    return format(d, "MMM d, yyyy • HH:mm")
  } catch {
    return iso
  }
}

type TelemetryMode = "on" | "stale" | "off"

function telemetryMode(status: string, lastSeenIso: string): TelemetryMode {
  const s = status.toLowerCase()
  if (s === "offline" || s === "inactive") return "off"
  const mins = minutesSince(lastSeenIso)
  if (mins === null) return "stale"
  return mins <= 5 ? "on" : "stale"
}

function scoreVariant(score: number) {
  if (score >= 80) return "destructive"
  if (score >= 50) return "warning"
  return "outline"
}

function formatField(v: string | null) {
  return v && v.trim().length > 0 ? v : "—"
}

export default async function DeviceDetailsPage({
  params,
}: {
  params: Promise<{ deviceId: string }>
}) {
  const { deviceId } = await params

  let device
  try {
    device = await getDevice(deviceId)
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound()
    throw err
  }

  const tm = telemetryMode(device.status, device.last_seen)

  return (
    <div className="flex flex-1 flex-col">
      <div className="bg-wazuh-card border-b border-wazuh-border p-3 flex items-center sticky top-0 z-30">
        <Breadcrumb>
          <BreadcrumbList className="text-sm">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/devices" className="text-muted-foreground hover:text-foreground">Agents</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[45ch] truncate font-medium text-foreground">
                {device.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mx-auto w-full flex-1 p-4 sm:p-6 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-foreground truncate">
                Agent: {device.name}
              </h1>
              <Badge variant={statusBadgeVariant(device.status)} className="rounded-sm text-[10px] uppercase">{device.status}</Badge>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              <span>{device.device_type}</span>
              <span aria-hidden="true">•</span>
              <span className="text-xs">ID</span>
              <span className="font-mono text-xs text-foreground/80">{device.id}</span>
              <CopyButton value={device.id} label="Copy ID" />
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
             <div className="flex gap-2">
              <Badge variant={scoreVariant(device.risk_score)} className="rounded-sm">
                Risk: {device.risk_score}
              </Badge>
              <Badge variant={complianceBadgeVariant(device.compliance_status)} className="rounded-sm">
                Comp: {device.compliance_score}
              </Badge>
              {tm === "on" ? (
                <Badge variant="default" className="rounded-sm text-[10px] uppercase">Live</Badge>
              ) : tm === "off" ? (
                <Badge variant="secondary" className="rounded-sm text-[10px] uppercase">Offline</Badge>
              ) : (
                <Badge variant="outline" className="rounded-sm text-[10px] uppercase">Stale</Badge>
              )}
             </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-2">
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <Card className="rounded-sm shadow-sm border-wazuh-border bg-wazuh-card">
                  <CardContent className="p-4">
                    <div className="text-xs font-semibold uppercase text-muted-foreground">Deployment</div>
                    <div className="mt-2 text-lg font-semibold leading-tight">
                      {formatField(device.location)}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Location
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-sm shadow-sm border-wazuh-border bg-wazuh-card">
                  <CardContent className="p-4">
                    <div className="text-xs font-semibold uppercase text-muted-foreground">Asset</div>
                    <div className="mt-2 text-lg font-semibold leading-tight truncate">
                      {formatField(device.manufacturer)}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Firmware {formatField(device.firmware_version)}
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-sm shadow-sm border-wazuh-border bg-wazuh-card">
                  <CardContent className="p-4">
                    <div className="text-xs font-semibold uppercase text-muted-foreground mb-3">Network</div>
                    <dl className="space-y-2 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <dt className="text-muted-foreground text-xs">IP address</dt>
                        <dd className="font-mono text-xs">{formatField(device.ip_address)}</dd>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <dt className="text-muted-foreground text-xs">MAC address</dt>
                        <dd className="font-mono text-xs">{formatField(device.mac_address)}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                <Card className="rounded-sm shadow-sm border-wazuh-border bg-wazuh-card">
                  <CardContent className="p-4">
                    <div className="text-xs font-semibold uppercase text-muted-foreground mb-3">Lifecycle</div>
                    <dl className="space-y-2 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <dt className="text-muted-foreground text-xs">Last seen</dt>
                        <dd className="font-mono text-[10px] text-right">{formatDateTime(device.last_seen)}</dd>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <dt className="text-muted-foreground text-xs">Registered</dt>
                        <dd className="font-mono text-[10px] text-right">{formatDateTime(device.registered_at)}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
            </div>
        </div>

        <div className="mt-4 grid gap-4 items-start lg:grid-cols-4">
          <div className="lg:col-span-3">
            <DeviceTelemetryPanel
              deviceId={device.id}
              autoConnect={tm === "on"}
              allowRetry={tm !== "off"}
              hint={
                tm === "on"
                  ? { label: "Live: on", variant: "default" }
                  : tm === "off"
                    ? { label: "Live: off", variant: "secondary" }
                    : { label: "Live: stale", variant: "outline" }
              }
            />
          </div>

          <Card className="lg:col-span-1 self-start rounded-sm shadow-sm border-wazuh-border bg-wazuh-card">
            <CardHeader className="py-3 px-4 border-b border-wazuh-border/50">
              <CardTitle className="text-sm font-semibold">Digital twin state</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground">
                  A curated view of the device’s live operational state.
                </div>
                {Object.keys(device.digital_twin_state ?? {}).length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    No digital twin data yet.
                  </div>
                ) : (
                  <ScrollArea className="rounded-sm border border-wazuh-border bg-background">
                    <div className="p-3">
                      <dl className="space-y-2 text-sm">
                        {Object.entries(device.digital_twin_state ?? {})
                          .slice(0, 12)
                          .map(([k, v]) => (
                            <div key={k} className="flex items-center justify-between gap-3 border-b border-wazuh-border pb-1 last:border-0 last:pb-0">
                              <dt className="text-muted-foreground text-xs">
                                {k.replace(/_/g, " ")}
                              </dt>
                              <dd className="font-mono text-xs text-foreground">
                                {typeof v === "number"
                                  ? v.toFixed(2)
                                  : typeof v === "boolean"
                                    ? v
                                      ? "Yes"
                                      : "No"
                                    : typeof v === "string"
                                      ? v
                                      : "—"}
                              </dd>
                            </div>
                          ))}
                      </dl>
                      {Object.keys(device.digital_twin_state ?? {}).length > 12 ? (
                        <div className="mt-3 text-[10px] text-muted-foreground text-center">
                          Showing the most relevant 12 fields.
                        </div>
                      ) : null}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2 rounded-sm shadow-sm border-wazuh-border bg-wazuh-card">
            <CardHeader className="py-3 px-4 border-b border-wazuh-border/50">
              <CardTitle className="text-sm font-semibold">Security findings</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-wazuh-border">
                    <TableHead className="h-9 text-xs font-semibold text-muted-foreground">CVE</TableHead>
                    <TableHead className="h-9 text-xs font-semibold text-muted-foreground">Severity</TableHead>
                    <TableHead className="h-9 text-xs font-semibold text-muted-foreground">CVSS</TableHead>
                    <TableHead className="h-9 text-xs font-semibold text-muted-foreground">Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {((device as unknown as DeviceSections).sections?.vulnerabilities ?? []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                        No security findings for this device yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    (device as unknown as DeviceSections).sections?.vulnerabilities?.slice(0, 8)?.map((v) => (
                      <TableRow key={v.cve_id} className="border-wazuh-border hover:bg-muted/10">
                        <TableCell className="font-mono text-xs text-primary">{v.cve_id}</TableCell>
                        <TableCell className="py-2">
                          <Badge variant={sevBadge(String(v.severity ?? "unknown").toLowerCase())} className="rounded-sm text-[10px] uppercase">
                            {String(v.severity ?? "unknown")}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {v.cvss_score != null ? Number(v.cvss_score).toFixed(1) : "—"}
                        </TableCell>
                        <TableCell className="whitespace-normal text-xs text-muted-foreground">
                          {String(v.description ?? "")}
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
              <CardTitle className="text-sm font-semibold">Recent alerts</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="space-y-2">
                {((device as unknown as DeviceSections).sections?.alerts ?? []).length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    No alerts for this device yet.
                  </div>
                ) : (
                  ((device as unknown as DeviceSections).sections?.alerts ?? []).slice(0, 6).map((a) => (
                    <div key={a.id} className="border-b border-wazuh-border pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <div className="text-sm font-medium">{a.title}</div>
                        <Badge variant={sevBadge(String(a.severity ?? "low"))} className="rounded-sm text-[10px] uppercase">
                          {String(a.severity ?? "low")}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {String(a.description ?? "")}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
