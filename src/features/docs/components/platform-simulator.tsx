"use client"

import * as React from "react"
import {
  ActivityIcon,
  AlertTriangleIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  CpuIcon,
  GaugeIcon,
  RadioTowerIcon,
  SendIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

type Status = "ok" | "critical"

type Reading = { temp: number; pressure: number; status: Status }

type LogEntry = { id: number; time: string; text: string; level: "info" | "alert" }

const STAGES = [
  { title: "Your machine", subtitle: "press-01", Icon: CpuIcon },
  { title: "Site gateway", subtitle: "forwards", Icon: RadioTowerIcon },
  { title: "Platform", subtitle: "checks & scores", Icon: ActivityIcon },
  { title: "Dashboard", subtitle: "you see it", Icon: GaugeIcon },
] as const

const STEP_MS = 300

const rand = (min: number, max: number) => min + Math.random() * (max - min)

function riskTone(risk: number) {
  if (risk >= 70) return { bar: "bg-destructive", text: "text-destructive", label: "High" }
  if (risk >= 40) return { bar: "bg-chart-4", text: "text-chart-4", label: "Medium" }
  return { bar: "bg-chart-2", text: "text-chart-2", label: "Low" }
}

export function PlatformSimulator() {
  const [activeStage, setActiveStage] = React.useState<number | null>(null)
  const [sending, setSending] = React.useState(false)
  const [fault, setFault] = React.useState(false)
  const [reading, setReading] = React.useState<Reading>({ temp: 45.6, pressure: 124.5, status: "ok" })
  const [risk, setRisk] = React.useState(21)
  const [alert, setAlert] = React.useState<string | null>(null)
  const [log, setLog] = React.useState<LogEntry[]>([])
  const [auto, setAuto] = React.useState(false)

  const faultRef = React.useRef(fault)
  const busyRef = React.useRef(false)
  const timeoutsRef = React.useRef<ReturnType<typeof setTimeout>[]>([])
  const logIdRef = React.useRef(0)

  React.useEffect(() => {
    faultRef.current = fault
  }, [fault])

  // Clear any pending timers on unmount.
  React.useEffect(() => {
    const timeouts = timeoutsRef.current
    return () => timeouts.forEach(clearTimeout)
  }, [])

  const pushLog = React.useCallback((text: string, level: LogEntry["level"]) => {
    const entry: LogEntry = {
      id: (logIdRef.current += 1),
      time: new Date().toLocaleTimeString([], { hour12: false }),
      text,
      level,
    }
    setLog((prev) => [entry, ...prev].slice(0, 5))
  }, [])

  const send = React.useCallback(() => {
    if (busyRef.current) return
    busyRef.current = true
    setSending(true)

    for (let stage = 0; stage < STAGES.length; stage += 1) {
      const t = setTimeout(() => {
        setActiveStage(stage)
        if (stage === STAGES.length - 1) {
          const isFault = faultRef.current
          const next: Reading = {
            temp: Number((isFault ? rand(86, 95) : rand(44, 47)).toFixed(1)),
            pressure: Number((isFault ? rand(170, 190) : rand(122, 127)).toFixed(1)),
            status: isFault ? "critical" : "ok",
          }
          const nextRisk = Math.round(isFault ? rand(78, 92) : rand(15, 28))
          setReading(next)
          setRisk(nextRisk)
          if (isFault) {
            setAlert(`Anomaly detected on press-01 — risk ${nextRisk}/100`)
            pushLog(`ALERT · press-01 critical (${next.temp}°C) → risk ${nextRisk}`, "alert")
          } else {
            setAlert(null)
            pushLog(`Reading received · ${next.temp}°C, ${next.pressure} bar → risk ${nextRisk}`, "info")
          }
        }
      }, stage * STEP_MS)
      timeoutsRef.current.push(t)
    }

    const tEnd = setTimeout(() => {
      setActiveStage(null)
      setSending(false)
      busyRef.current = false
    }, STAGES.length * STEP_MS + 350)
    timeoutsRef.current.push(tEnd)
  }, [pushLog])

  // Auto-play: send a reading every couple seconds while enabled.
  React.useEffect(() => {
    if (!auto) return
    const iv = setInterval(() => {
      if (!busyRef.current) send()
    }, 2200)
    return () => clearInterval(iv)
  }, [auto, send])

  const tone = riskTone(risk)

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card p-3">
        <Button onClick={send} disabled={sending} className="gap-2">
          <SendIcon className="size-4" />
          Send a reading
        </Button>

        <label className="flex items-center gap-2 text-sm">
          <Switch checked={fault} onCheckedChange={(v) => setFault(v)} aria-label="Inject fault" />
          <span className="text-foreground">Inject fault</span>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <Switch checked={auto} onCheckedChange={(v) => setAuto(v)} aria-label="Auto-play" />
          <span className="text-muted-foreground">Auto-play</span>
        </label>

        <span className="ml-auto text-xs text-muted-foreground">
          Tap <span className="font-medium text-foreground">Send a reading</span> and watch it travel.
        </span>
      </div>

      {/* Flow */}
      <div className="rounded-xl border bg-muted/20 p-4 sm:p-6">
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          {STAGES.map((stage, i) => {
            const isActive = activeStage === i
            const isPast = activeStage !== null && activeStage > i
            const StageIcon = stage.Icon
            return (
              <React.Fragment key={stage.title}>
                <div
                  className={cn(
                    "flex flex-1 items-center gap-3 rounded-xl border bg-card p-3 transition-all duration-200",
                    (isActive || isPast) && "border-primary/60 bg-primary/5",
                    isActive && "scale-[1.03] shadow-sm ring-2 ring-primary/40",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors",
                      (isActive || isPast) && "border-primary/50 text-primary",
                    )}
                  >
                    <StageIcon className="size-4" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-foreground">{stage.title}</div>
                    <div className="truncate text-xs text-muted-foreground">{stage.subtitle}</div>
                  </div>
                </div>

                {i < STAGES.length - 1 ? (
                  <ArrowRightIcon
                    className={cn(
                      "mx-auto size-4 shrink-0 rotate-90 text-muted-foreground/40 transition-colors duration-200 sm:rotate-0",
                      isPast && "text-primary",
                    )}
                    aria-hidden
                  />
                ) : null}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Alert banner */}
      {alert ? (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm">
          <AlertTriangleIcon className="size-5 shrink-0 text-destructive" aria-hidden />
          <span className="font-medium text-foreground">{alert}</span>
        </div>
      ) : null}

      {/* Dashboard + log */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
            <CardTitle className="text-base">Live dashboard · press-01</CardTitle>
            <Badge
              variant={reading.status === "critical" ? "destructive" : "secondary"}
              className="gap-1"
            >
              {reading.status === "critical" ? (
                <AlertTriangleIcon className="size-3" />
              ) : (
                <CheckCircle2Icon className="size-3" />
              )}
              {reading.status === "critical" ? "critical" : "ok"}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-card p-3">
                <div className="text-xs text-muted-foreground">Temperature</div>
                <div className="mt-1 font-mono text-lg font-semibold text-foreground">{reading.temp}°C</div>
              </div>
              <div className="rounded-lg border bg-card p-3">
                <div className="text-xs text-muted-foreground">Pressure</div>
                <div className="mt-1 font-mono text-lg font-semibold text-foreground">{reading.pressure} bar</div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Risk score</span>
                <span className={cn("font-medium", tone.text)}>
                  {risk}/100 · {tone.label}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full transition-all duration-500", tone.bar)}
                  style={{ width: `${risk}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Event log</CardTitle>
          </CardHeader>
          <CardContent>
            {log.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No events yet — tap <span className="font-medium text-foreground">Send a reading</span> to begin.
              </p>
            ) : (
              <ul className="space-y-2">
                {log.map((entry) => (
                  <li key={entry.id} className="flex gap-2 text-sm">
                    <span className="shrink-0 font-mono text-xs text-muted-foreground">{entry.time}</span>
                    <span
                      className={cn(
                        "leading-relaxed",
                        entry.level === "alert" ? "text-destructive" : "text-muted-foreground",
                      )}
                    >
                      {entry.text}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
