import Link from "next/link"
import { formatDistanceToNowStrict } from "date-fns"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  if (mode === "on") return <Badge variant="default">Live telemetry</Badge>
  if (mode === "off") return <Badge variant="secondary">Telemetry off</Badge>
  return <Badge variant="outline">Telemetry stale</Badge>
}

function scoreTone(score: number) {
  if (score >= 80) return "text-destructive"
  if (score >= 50) return "text-foreground"
  return "text-muted-foreground"
}

function DeviceCard({ device }: { device: DeviceRead }) {
  const tm = telemetryMode(device)
  return (
    <Link
      href={`/devices/${encodeURIComponent(device.id)}`}
      className="block focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 rounded-xl"
    >
      <Card className="h-full transition-colors hover:bg-muted/20">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <CardTitle className="truncate">{device.name}</CardTitle>
              <CardDescription className="truncate">
                {device.device_type} • {device.id}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <Badge variant={statusBadgeVariant(device.status)}>{device.status}</Badge>
              {telemetryBadge(tm)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Risk score</div>
              <div className={`font-medium tabular-nums ${scoreTone(device.risk_score)}`}>
                {device.risk_score}/100
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Compliance</div>
              <div className="flex items-center gap-2">
                <div className="font-medium tabular-nums">{device.compliance_score}/100</div>
                <Badge variant={complianceBadgeVariant(device.compliance_status)}>
                  {device.compliance_status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            Last seen: <span className="text-foreground">{timeAgo(device.last_seen)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
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
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <div className="mb-8 space-y-2">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Devices
          </h1>
          <p className="text-muted-foreground">
            All registered IoT devices from the security backend.
          </p>
        </div>

        {error ? (
          <Empty className="bg-card">
            <EmptyHeader>
              <EmptyTitle>Couldn't load devices</EmptyTitle>
              <EmptyDescription>{error}</EmptyDescription>
              <EmptyDescription>
                Check that the backend is running and{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">{BACKEND_BASE_URL_ENV_VAR}</code>{" "}
                is set correctly.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <a href="/devices">
                <Badge variant="outline">Retry</Badge>
              </a>
            </EmptyContent>
          </Empty>
        ) : devices.length === 0 ? (
          <Empty className="bg-card">
            <EmptyHeader>
              <EmptyTitle>No devices found</EmptyTitle>
              <EmptyDescription>
                The backend returned an empty list. Register devices or start the
                simulator pipeline.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent />
          </Empty>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {devices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
