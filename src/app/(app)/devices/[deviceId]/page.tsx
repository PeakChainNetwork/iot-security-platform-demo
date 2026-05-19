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
import { CopyButton } from "@/components/copy-button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DeviceTelemetryPanel } from "@/components/device-telemetry-panel"
import { ApiError, getDevice } from "@/lib/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { minutesSince, parseBackendDate } from "@/lib/dates"

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
  if (sev === "high") return "secondary"
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
  if (score >= 50) return "secondary"
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
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/devices">Devices</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[45ch] truncate">
                {device.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading text-2xl font-semibold tracking-tight truncate">
                {device.name}
              </h1>
              <Badge variant={statusBadgeVariant(device.status)}>{device.status}</Badge>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              <span>{device.device_type}</span>
              <span aria-hidden="true">•</span>
              <span className="text-xs">Internal ID</span>
              <span className="font-mono text-xs text-foreground/80">{device.id}</span>
              <CopyButton value={device.id} label="Copy internal ID" />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant={scoreVariant(device.risk_score)}>
                Risk {device.risk_score}/100
              </Badge>
              <Badge variant={complianceBadgeVariant(device.compliance_status)}>
                Compliance {device.compliance_score}/100 • {device.compliance_status}
              </Badge>
              <Badge variant="outline">Last seen {formatDateTime(device.last_seen)}</Badge>
              {tm === "on" ? (
                <Badge variant="default">Live telemetry on</Badge>
              ) : tm === "off" ? (
                <Badge variant="secondary">Telemetry off</Badge>
              ) : (
                <Badge variant="outline">Telemetry stale</Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/devices">Back</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-2">
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="rounded-xl border bg-card p-4">
                  <div className="text-xs text-muted-foreground">Deployment</div>
                  <div className="mt-2 text-lg font-semibold leading-tight">
                    {formatField(device.location)}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Location
                  </div>
                </div>
                <div className="rounded-xl border bg-card p-4">
                  <div className="text-xs text-muted-foreground">Asset</div>
                  <div className="mt-2 text-lg font-semibold leading-tight truncate">
                    {formatField(device.manufacturer)}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Firmware {formatField(device.firmware_version)}
                  </div>
                </div>
                <div className="rounded-xl border bg-card p-4">
                  <div className="text-xs text-muted-foreground">Network</div>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted-foreground">IP address</dt>
                      <dd className="font-mono text-xs">{formatField(device.ip_address)}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted-foreground">MAC address</dt>
                      <dd className="font-mono text-xs">{formatField(device.mac_address)}</dd>
                    </div>
                  </dl>
                </div>
                <div className="rounded-xl border bg-card p-4">
                  <div className="text-xs text-muted-foreground">Lifecycle</div>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted-foreground">Last seen</dt>
                      <dd className="font-mono text-xs">{formatDateTime(device.last_seen)}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted-foreground">Registered</dt>
                      <dd className="font-mono text-xs">{formatDateTime(device.registered_at)}</dd>
                    </div>
                  </dl>
                </div>
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

          <Card className="lg:col-span-1 self-start">
            <CardHeader>
              <CardTitle>Digital twin state</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  A curated view of the device’s live operational state.
                </div>
                {Object.keys(device.digital_twin_state ?? {}).length === 0 ? (
                  <Empty className="bg-card">
                    <EmptyHeader>
                      <EmptyTitle>No digital twin data yet</EmptyTitle>
                      <EmptyDescription>
                        This view fills in once the device reports telemetry.
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent />
                  </Empty>
                ) : (
                  <ScrollArea className="rounded-xl border bg-card">
                    <div className="p-4">
                      <dl className="space-y-3 text-sm">
                        {Object.entries(device.digital_twin_state ?? {})
                          .slice(0, 12)
                          .map(([k, v]) => (
                            <div key={k} className="flex items-center justify-between gap-3">
                              <dt className="text-muted-foreground">
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
                        <div className="mt-4 text-xs text-muted-foreground">
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
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Security findings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Vulnerabilities matched to this device (from backend CPE matching).
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>CVE</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>CVSS</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {((device as any).sections?.vulnerabilities ?? []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8">
                        <div className="text-sm text-muted-foreground">
                          No security findings for this device yet.
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    (device as any).sections?.vulnerabilities?.slice(0, 8)?.map((v: any) => (
                      <TableRow key={v.cve_id}>
                        <TableCell className="font-mono text-xs">{v.cve_id}</TableCell>
                        <TableCell>
                          <Badge variant={sevBadge(String(v.severity ?? "unknown").toLowerCase())}>
                            {String(v.severity ?? "unknown")}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {v.cvss_score != null ? Number(v.cvss_score).toFixed(1) : "—"}
                        </TableCell>
                        <TableCell className="whitespace-normal">
                          {String(v.description ?? "")}
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
              <CardTitle>Recent alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Alerts derived by backend pipeline/DPI sources.
              </div>
              <div className="space-y-2">
                {((device as any).sections?.alerts ?? []).length === 0 ? (
                  <div className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
                    No alerts for this device yet.
                  </div>
                ) : (
                  ((device as any).sections?.alerts ?? []).slice(0, 6).map((a: any) => (
                    <div key={a.id} className="rounded-xl border bg-card p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-medium">{a.title}</div>
                        <Badge variant={sevBadge(String(a.severity ?? "low"))}>
                          {String(a.severity ?? "low")}
                        </Badge>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
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
