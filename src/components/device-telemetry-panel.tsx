"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import * as Recharts from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { parseBackendDate } from "@/lib/dates"
import { startTelemetryWs } from "@/lib/ws"

type TelemetryMessage = {
  device_id: string
  topic?: string
  timestamp?: string
  metrics?: Record<string, unknown>
  status?: string
}

type ConnectionState = "connecting" | "open" | "closed" | "error"

function parseTs(ts?: string) {
  if (!ts) return null
  return parseBackendDate(ts)
}

function formatValue(v: unknown) {
  if (v === null || v === undefined) return "—"
  if (typeof v === "number") return v.toFixed(2)
  if (typeof v === "boolean") return v ? "Yes" : "No"
  if (typeof v === "string") return v
  return "—"
}

function metricLabel(key: string) {
  switch (key) {
    case "temperature":
      return "Temperature"
    case "pressure":
      return "Pressure"
    case "vibration":
      return "Vibration"
    case "power_draw":
      return "Power draw"
    case "rotational_speed":
      return "Rotational speed"
    default:
      return key.replace(/_/g, " ")
  }
}

function metricUnit(key: string) {
  switch (key) {
    case "temperature":
      return "°C"
    case "pressure":
      return "psi"
    case "vibration":
      return "g"
    case "power_draw":
      return "kW"
    case "rotational_speed":
      return "rpm"
    default:
      return ""
  }
}

function connectionVariant(state: ConnectionState) {
  switch (state) {
    case "open":
      return "default"
    case "connecting":
      return "secondary"
    case "error":
      return "destructive"
    case "closed":
    default:
      return "outline"
  }
}

export function DeviceTelemetryPanel({
  deviceId,
  autoConnect = true,
  hint,
  allowRetry,
}: {
  deviceId: string
  autoConnect?: boolean
  hint?: { label: string; variant?: "default" | "secondary" | "outline" | "destructive" }
  allowRetry?: boolean
}) {
  const [state, setState] = React.useState<ConnectionState>("connecting")
  const [lastMessage, setLastMessage] = React.useState<TelemetryMessage | null>(null)
  const [lastError, setLastError] = React.useState<string | null>(null)
  const [armed, setArmed] = React.useState<boolean>(autoConnect)
  const [series, setSeries] = React.useState<
    Array<{
      t: number
      temperature?: number
      pressure?: number
      vibration?: number
    }>
  >([])

  React.useEffect(() => {
    if (!armed) {
      setState("closed")
      return
    }
    setState("connecting")
    setLastError(null)

    return startTelemetryWs({
      deviceId,
      onStatus: (s) => setState(s),
      onErrorMessage: (msg) => setLastError(msg),
      onMessage: (raw) => {
        const msg = raw as TelemetryMessage
        setLastMessage(msg)
        setLastError(null)
        const ts = parseTs(msg.timestamp)?.getTime()
        const metrics = msg.metrics ?? {}
        const temperature = typeof metrics.temperature === "number" ? metrics.temperature : undefined
        const pressure = typeof metrics.pressure === "number" ? metrics.pressure : undefined
        const vibration = typeof metrics.vibration === "number" ? metrics.vibration : undefined
        if (ts) {
          setSeries((prev) => {
            const next = [...prev, { t: ts, temperature, pressure, vibration }]
            return next.slice(-120)
          })
        }
      },
    })
  }, [armed, deviceId])

  const ts = parseTs(lastMessage?.timestamp ?? undefined)
  const status = lastMessage?.status
  const metrics = lastMessage?.metrics ?? {}
  const primaryKeys = ["temperature", "pressure", "vibration", "power_draw", "rotational_speed"] as const
  const canRetry = allowRetry ?? true

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <CardTitle>Live telemetry</CardTitle>
        <div className="flex items-center gap-2 shrink-0">
          {hint ? (
            <Badge variant={hint.variant ?? "outline"}>{hint.label}</Badge>
          ) : null}
          <Badge variant={connectionVariant(state)}>{state}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!armed ? (
          <div className="rounded-xl border bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="text-sm font-medium">Live telemetry is off</div>
                <div className="text-sm text-muted-foreground">
                  This device is not currently streaming live readings.
                </div>
              </div>
              {canRetry ? (
                <Button size="sm" variant="outline" onClick={() => setArmed(true)}>
                  Retry
                </Button>
              ) : null}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm text-muted-foreground">
                {ts ? (
                  <>
                    Updated{" "}
                    <span className="text-foreground">
                      {ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </span>
                  </>
                ) : (
                  "Waiting for first reading…"
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {status ? <Badge variant="outline">{status}</Badge> : null}
                {lastError ? <Badge variant="destructive">{lastError}</Badge> : null}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs text-muted-foreground">Trends (last 2 minutes)</div>
                <Badge variant="outline">{series.length} pts</Badge>
              </div>
              <div className="rounded-xl border bg-card p-2">
                <ChartContainer
                  id="telemetry-trends"
                  className="h-44 w-full"
                  config={{
                    temperature: { label: "Temperature", theme: { light: "#10b981", dark: "#34d399" } },
                    pressure: { label: "Pressure", theme: { light: "#3b82f6", dark: "#60a5fa" } },
                    vibration: { label: "Vibration", theme: { light: "#f59e0b", dark: "#fbbf24" } },
                  }}
                >
                  <Recharts.LineChart data={series} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                    <Recharts.CartesianGrid vertical={false} />
                    <Recharts.XAxis
                      dataKey="t"
                      type="number"
                      domain={["dataMin", "dataMax"]}
                      tickFormatter={(v) =>
                        new Date(v).toLocaleTimeString([], { minute: "2-digit", second: "2-digit" })
                      }
                      tickLine={false}
                      axisLine={false}
                      minTickGap={24}
                    />
                    <Recharts.YAxis tickLine={false} axisLine={false} width={32} />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          labelFormatter={(v) => String(v)}
                          formatter={(value, name) => (
                            <div className="flex w-full items-center justify-between gap-3">
                              <span className="text-muted-foreground">{String(name)}</span>
                              <span className="font-mono tabular-nums">
                                {typeof value === "number" ? value.toFixed(2) : String(value)}
                              </span>
                            </div>
                          )}
                        />
                      }
                    />
                    <Recharts.Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="var(--color-temperature)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Recharts.Line
                      type="monotone"
                      dataKey="pressure"
                      stroke="var(--color-pressure)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Recharts.Line
                      type="monotone"
                      dataKey="vibration"
                      stroke="var(--color-vibration)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </Recharts.LineChart>
                </ChartContainer>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Key readings</div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
                {primaryKeys.map((k) => {
                  const v = (metrics as any)?.[k]
                  return (
                    <div key={k} className="rounded-xl border bg-card p-4">
                      <div className="text-xs text-muted-foreground">{metricLabel(k)}</div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <div className="text-2xl font-semibold tabular-nums">
                          {formatValue(v)}
                        </div>
                        <div className="text-sm text-muted-foreground">{metricUnit(k)}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

