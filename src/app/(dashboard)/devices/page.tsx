import Link from "next/link"
import { formatDistanceToNowStrict } from "date-fns"
import { Search, Filter, RefreshCw, Download, Columns } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { ApiError } from "@/lib/api-client"
import { BACKEND_BASE_URL_ENV_VAR } from "@/lib/platform-constants"
import { getDevices } from "@/features/devices"
import type { DeviceRead } from "@/types/backend-types"
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

function timeAgo(iso: string) {
  try {
    const d = parseBackendDate(iso)
    if (!d) return iso
    return formatDistanceToNowStrict(d, { addSuffix: true })
  } catch {
    return iso
  }
}

type TelemetryMode = "on" | "stale" | "off"

function telemetryMode(device: DeviceRead): TelemetryMode {
  const s = device.status.toLowerCase()
  if (s === "offline" || s === "inactive") return "off"
  const mins = minutesSince(device.last_seen)
  if (mins === null) return "stale"
  return mins <= 5 ? "on" : "stale"
}

function telemetryBadge(mode: TelemetryMode) {
  if (mode === "on") return <Badge variant="default" className="rounded-sm text-[10px] uppercase">Live</Badge>
  if (mode === "off") return <Badge variant="secondary" className="rounded-sm text-[10px] uppercase">Off</Badge>
  return <Badge variant="outline" className="rounded-sm text-[10px] uppercase">Stale</Badge>
}

export default async function DevicesPage() {
  let devices: DeviceRead[] = []
  let error: string | null = null

  try {
    devices = await getDevices()
  } catch (err) {
    if (err instanceof ApiError) {
      error = err.message
    } else {
      error = "Could not reach the backend. Make sure the server is running."
    }
  }

  return (
    <div className="flex flex-1 flex-col">

      <div className="mx-auto w-full flex-1 p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Agents
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 rounded-sm border-wazuh-border text-muted-foreground hidden sm:flex">
              <RefreshCw className="h-3 w-3 mr-2" />
              Refresh
            </Button>
            <Button variant="default" size="sm" className="h-8 rounded-sm bg-wazuh-header text-white hover:bg-wazuh-header/90 hidden sm:flex">
              Deploy new agent
            </Button>
          </div>
        </div>

        {error ? (
          <Empty className="bg-wazuh-card border-wazuh-border">
            <EmptyHeader>
              <EmptyTitle>Couldn&apos;t load agents</EmptyTitle>
              <EmptyDescription>{error}</EmptyDescription>
              <EmptyDescription>
                Check that the backend is running and{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">{BACKEND_BASE_URL_ENV_VAR}</code>{" "}
                is set correctly.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Link href="/devices">
                <Button variant="outline" className="rounded-sm">Retry</Button>
              </Link>
            </EmptyContent>
          </Empty>
        ) : devices.length === 0 ? (
          <Empty className="bg-wazuh-card border-wazuh-border">
            <EmptyHeader>
              <EmptyTitle>No agents found</EmptyTitle>
              <EmptyDescription>
                The backend returned an empty list. Register agents or start the
                simulator pipeline.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent />
          </Empty>
        ) : (
          <Card className="rounded-sm shadow-sm border-wazuh-border bg-wazuh-card">
            <div className="border-b border-wazuh-border/50 p-2 flex items-center justify-between bg-muted/10">
              <div className="text-sm text-muted-foreground pl-2">{devices.length} agents matching the search</div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <Columns className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-wazuh-border">
                    <TableHead className="h-10 text-xs font-semibold text-muted-foreground uppercase">Name</TableHead>
                    <TableHead className="h-10 text-xs font-semibold text-muted-foreground uppercase">ID</TableHead>
                    <TableHead className="h-10 text-xs font-semibold text-muted-foreground uppercase">Status</TableHead>
                    <TableHead className="h-10 text-xs font-semibold text-muted-foreground uppercase">Type</TableHead>
                    <TableHead className="h-10 text-xs font-semibold text-muted-foreground uppercase">Risk</TableHead>
                    <TableHead className="h-10 text-xs font-semibold text-muted-foreground uppercase">Compliance</TableHead>
                    <TableHead className="h-10 text-xs font-semibold text-muted-foreground uppercase">Telemetry</TableHead>
                    <TableHead className="h-10 text-xs font-semibold text-muted-foreground uppercase text-right pr-4">Last Seen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devices.map((device) => {
                    const tm = telemetryMode(device)
                    return (
                      <TableRow key={device.id} className="border-wazuh-border hover:bg-muted/10">
                        <TableCell className="py-2.5 text-sm font-medium text-primary">
                          <Link href={`/devices/${encodeURIComponent(device.id)}`} className="hover:underline">
                            {device.name}
                          </Link>
                        </TableCell>
                        <TableCell className="py-2.5 text-xs text-muted-foreground font-mono">{device.id.substring(0, 8)}...</TableCell>
                        <TableCell className="py-2.5">
                          <Badge variant={statusBadgeVariant(device.status)} className="rounded-sm text-[10px] uppercase">
                            {device.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2.5 text-sm">{device.device_type}</TableCell>
                        <TableCell className="py-2.5 font-mono text-xs">{device.risk_score}</TableCell>
                        <TableCell className="py-2.5">
                          <Badge variant={complianceBadgeVariant(device.compliance_status)} className="rounded-sm text-[10px] uppercase bg-background">
                            {device.compliance_status}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2.5">
                          {telemetryBadge(tm)}
                        </TableCell>
                        <TableCell className="py-2.5 text-right text-xs text-muted-foreground pr-4 whitespace-nowrap">
                          {timeAgo(device.last_seen)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
