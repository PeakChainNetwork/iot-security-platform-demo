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
import type { Locale } from "@/lib/i18n/config"

type Status = "ok" | "critical"

type Reading = { temp: number; pressure: number; status: Status }

type LogEntry = { id: number; time: string; text: string; level: "info" | "alert" }

type Strings = {
  stages: { title: string; subtitle: string }[]
  high: string
  medium: string
  low: string
  sendReading: string
  injectFault: string
  autoPlay: string
  hintPrefix: string
  hintSuffix: string
  alert: (risk: number) => string
  logAlert: (temp: number, risk: number) => string
  logInfo: (temp: number, pressure: number, risk: number) => string
  liveDashboard: string
  statusCritical: string
  statusOk: string
  temperature: string
  pressure: string
  riskScore: string
  eventLog: string
  noEventsPrefix: string
  noEventsSuffix: string
}

const strings: Record<Locale, Strings> = {
  en: {
    stages: [
      { title: "Your machine", subtitle: "press-01" },
      { title: "Site gateway", subtitle: "forwards" },
      { title: "Platform", subtitle: "checks & scores" },
      { title: "Dashboard", subtitle: "you see it" },
    ],
    high: "High",
    medium: "Medium",
    low: "Low",
    sendReading: "Send a reading",
    injectFault: "Inject fault",
    autoPlay: "Auto-play",
    hintPrefix: "Tap",
    hintSuffix: "and watch it travel.",
    alert: (risk) => `Anomaly detected on press-01 — risk ${risk}/100`,
    logAlert: (temp, risk) => `ALERT · press-01 critical (${temp}°C) → risk ${risk}`,
    logInfo: (temp, pressure, risk) => `Reading received · ${temp}°C, ${pressure} bar → risk ${risk}`,
    liveDashboard: "Live dashboard · press-01",
    statusCritical: "critical",
    statusOk: "ok",
    temperature: "Temperature",
    pressure: "Pressure",
    riskScore: "Risk score",
    eventLog: "Event log",
    noEventsPrefix: "No events yet — tap",
    noEventsSuffix: "to begin.",
  },
  de: {
    stages: [
      { title: "Ihre Maschine", subtitle: "press-01" },
      { title: "Standort-Gateway", subtitle: "leitet weiter" },
      { title: "Plattform", subtitle: "prüft & bewertet" },
      { title: "Dashboard", subtitle: "Sie sehen es" },
    ],
    high: "Hoch",
    medium: "Mittel",
    low: "Niedrig",
    sendReading: "Messwert senden",
    injectFault: "Fehler einschleusen",
    autoPlay: "Automatisch",
    hintPrefix: "Tippen Sie auf",
    hintSuffix: "und sehen Sie zu, wie er wandert.",
    alert: (risk) => `Anomalie auf press-01 erkannt — Risiko ${risk}/100`,
    logAlert: (temp, risk) => `WARNUNG · press-01 kritisch (${temp}°C) → Risiko ${risk}`,
    logInfo: (temp, pressure, risk) => `Messwert empfangen · ${temp}°C, ${pressure} bar → Risiko ${risk}`,
    liveDashboard: "Live-Dashboard · press-01",
    statusCritical: "kritisch",
    statusOk: "ok",
    temperature: "Temperatur",
    pressure: "Druck",
    riskScore: "Risikowert",
    eventLog: "Ereignisprotokoll",
    noEventsPrefix: "Noch keine Ereignisse — tippen Sie auf",
    noEventsSuffix: "um zu beginnen.",
  },
}

const STAGE_ICONS = [CpuIcon, RadioTowerIcon, ActivityIcon, GaugeIcon] as const

const STEP_MS = 300

const rand = (min: number, max: number) => min + Math.random() * (max - min)

function riskTone(risk: number, s: Strings) {
  if (risk >= 70) return { bar: "bg-destructive", text: "text-destructive", label: s.high }
  if (risk >= 40) return { bar: "bg-chart-4", text: "text-chart-4", label: s.medium }
  return { bar: "bg-chart-2", text: "text-chart-2", label: s.low }
}

export function PlatformSimulator({ lang }: { lang: Locale }) {
  const s = strings[lang]
  const stageCount = s.stages.length
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
  const stringsRef = React.useRef(s)

  React.useEffect(() => {
    faultRef.current = fault
  }, [fault])

  React.useEffect(() => {
    stringsRef.current = s
  }, [s])

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

    for (let stage = 0; stage < stageCount; stage += 1) {
      const t = setTimeout(() => {
        setActiveStage(stage)
        if (stage === stageCount - 1) {
          const str = stringsRef.current
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
            setAlert(str.alert(nextRisk))
            pushLog(str.logAlert(next.temp, nextRisk), "alert")
          } else {
            setAlert(null)
            pushLog(str.logInfo(next.temp, next.pressure, nextRisk), "info")
          }
        }
      }, stage * STEP_MS)
      timeoutsRef.current.push(t)
    }

    const tEnd = setTimeout(() => {
      setActiveStage(null)
      setSending(false)
      busyRef.current = false
    }, stageCount * STEP_MS + 350)
    timeoutsRef.current.push(tEnd)
  }, [pushLog, stageCount])

  // Auto-play: send a reading every couple seconds while enabled.
  React.useEffect(() => {
    if (!auto) return
    const iv = setInterval(() => {
      if (!busyRef.current) send()
    }, 2200)
    return () => clearInterval(iv)
  }, [auto, send])

  const tone = riskTone(risk, s)

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card p-3">
        <Button onClick={send} disabled={sending} className="gap-2">
          <SendIcon className="size-4" />
          {s.sendReading}
        </Button>

        <label className="flex items-center gap-2 text-sm">
          <Switch checked={fault} onCheckedChange={(v) => setFault(v)} aria-label={s.injectFault} />
          <span className="text-foreground">{s.injectFault}</span>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <Switch checked={auto} onCheckedChange={(v) => setAuto(v)} aria-label={s.autoPlay} />
          <span className="text-muted-foreground">{s.autoPlay}</span>
        </label>

        <span className="ml-auto text-xs text-muted-foreground">
          {s.hintPrefix} <span className="font-medium text-foreground">{s.sendReading}</span> {s.hintSuffix}
        </span>
      </div>

      {/* Flow */}
      <div className="rounded-xl border bg-muted/20 p-4 sm:p-6">
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          {s.stages.map((stage, i) => {
            const isActive = activeStage === i
            const isPast = activeStage !== null && activeStage > i
            const StageIcon = STAGE_ICONS[i] ?? CpuIcon
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

                {i < stageCount - 1 ? (
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
            <CardTitle className="text-base">{s.liveDashboard}</CardTitle>
            <Badge
              variant={reading.status === "critical" ? "destructive" : "secondary"}
              className="gap-1"
            >
              {reading.status === "critical" ? (
                <AlertTriangleIcon className="size-3" />
              ) : (
                <CheckCircle2Icon className="size-3" />
              )}
              {reading.status === "critical" ? s.statusCritical : s.statusOk}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-card p-3">
                <div className="text-xs text-muted-foreground">{s.temperature}</div>
                <div className="mt-1 font-mono text-lg font-semibold text-foreground">{reading.temp}°C</div>
              </div>
              <div className="rounded-lg border bg-card p-3">
                <div className="text-xs text-muted-foreground">{s.pressure}</div>
                <div className="mt-1 font-mono text-lg font-semibold text-foreground">{reading.pressure} bar</div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{s.riskScore}</span>
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
            <CardTitle className="text-base">{s.eventLog}</CardTitle>
          </CardHeader>
          <CardContent>
            {log.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {s.noEventsPrefix} <span className="font-medium text-foreground">{s.sendReading}</span> {s.noEventsSuffix}
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
