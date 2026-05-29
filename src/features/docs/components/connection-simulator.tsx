"use client"

import * as React from "react"
import type { LucideIcon } from "lucide-react"
import {
  CheckCircle2Icon,
  CircleIcon,
  CpuIcon,
  Loader2Icon,
  PlugZapIcon,
  RotateCcwIcon,
  ShieldCheckIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type LogLine = { dir: "out" | "in" | "note"; text: string }

type Step = { title: string; detail: string; logs: LogLine[] }

const DEVICE_ID = "press-01"

const STEPS: Step[] = [
  {
    title: "Open a secure connection",
    detail: "wss · port 443 · /mqtt",
    logs: [
      { dir: "out", text: "CONNECT wss://<broker>:443/mqtt" },
      { dir: "note", text: "TLS handshake ✓" },
      { dir: "in", text: "CONNACK · session accepted (rc=0)" },
    ],
  },
  {
    title: "Authenticate",
    detail: "username + password",
    logs: [
      { dir: "out", text: "auth user=iot_client ••••••" },
      { dir: "in", text: "authenticated" },
    ],
  },
  {
    title: "Publish the first reading",
    detail: `site/${DEVICE_ID}/telemetry`,
    logs: [
      { dir: "out", text: `PUBLISH site/${DEVICE_ID}/telemetry (QoS 1)` },
      { dir: "note", text: `{"timestamp":"2026-04-07T13:23:26+00:00","temperature":45.8,"pressure":124.8,"status":"ok"}` },
      { dir: "in", text: "PUBACK · delivered" },
    ],
  },
  {
    title: "Platform confirms",
    detail: "ingestion status → connected",
    logs: [
      { dir: "out", text: "GET /api/v1/ingestion/status" },
      { dir: "in", text: `{ "sources": { "real_machines": { "status": "connected", "last_device_id": "${DEVICE_ID}" } } }` },
    ],
  },
]

const FACTS = ["client_id: peaksoft-press-01", "QoS 1", "TLS on", "keepalive 60s"]

const STEP_MS = 850

function Node({ icon: Icon, label, tile }: { icon: LucideIcon; label: string; tile: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border bg-card px-3 py-2">
      <div className={cn("flex size-8 items-center justify-center rounded-lg", tile)}>
        <Icon className="size-4" aria-hidden />
      </div>
      <span className="text-xs font-medium text-foreground">{label}</span>
    </div>
  )
}

function LogRow({ line }: { line: LogLine }) {
  const glyph = line.dir === "out" ? "→" : line.dir === "in" ? "←" : "·"
  const glyphClass = line.dir === "out" ? "text-primary" : line.dir === "in" ? "text-chart-2" : "text-muted-foreground/60"
  return (
    <div className="flex gap-2 font-mono text-[11px] leading-relaxed">
      <span className={cn("shrink-0", glyphClass)}>{glyph}</span>
      <span className={cn("break-all", line.dir === "note" ? "text-muted-foreground/80" : "text-muted-foreground")}>
        {line.text}
      </span>
    </div>
  )
}

/** A guided simulation of a machine establishing its connection to the platform. */
export function ConnectionSimulator() {
  const [phase, setPhase] = React.useState<"idle" | "running" | "done">("idle")
  const [doneCount, setDoneCount] = React.useState(0)
  const [active, setActive] = React.useState(-1)
  const timeoutsRef = React.useRef<ReturnType<typeof setTimeout>[]>([])
  const busyRef = React.useRef(false)

  React.useEffect(() => {
    const timeouts = timeoutsRef.current
    return () => timeouts.forEach(clearTimeout)
  }, [])

  const run = () => {
    if (busyRef.current) return
    busyRef.current = true
    setPhase("running")
    setDoneCount(0)
    setActive(-1)
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []

    STEPS.forEach((_, i) => {
      timeoutsRef.current.push(setTimeout(() => setActive(i), i * STEP_MS))
      timeoutsRef.current.push(
        setTimeout(() => {
          setActive(-1)
          setDoneCount(i + 1)
          if (i === STEPS.length - 1) {
            setPhase("done")
            busyRef.current = false
          }
        }, i * STEP_MS + STEP_MS * 0.65),
      )
    })
  }

  const connected = phase === "done"

  return (
    <div className="space-y-4 rounded-xl border bg-card p-5">
      {/* Connection visual */}
      <div className="flex items-center gap-3">
        <Node icon={CpuIcon} label="Your machine" tile="bg-chart-3/15 text-chart-3" />
        <div className="relative h-px flex-1">
          <div
            className={cn(
              "absolute inset-0 border-t transition-colors",
              connected ? "border-chart-2" : phase === "running" ? "border-primary/40" : "border-dashed border-border",
            )}
          />
          {phase === "running" ? (
            <span className="docs-flow-dot absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-primary" />
          ) : null}
        </div>
        <Node icon={ShieldCheckIcon} label="Platform" tile="bg-primary/15 text-primary" />
      </div>

      {/* Connection facts */}
      <div className="flex flex-wrap gap-1.5">
        {FACTS.map((f) => (
          <span key={f} className="rounded-full border bg-background/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
            {f}
          </span>
        ))}
      </div>

      {/* Status + control */}
      <div className="flex items-center justify-between gap-3">
        <Badge variant={connected ? "secondary" : "outline"} className={cn("gap-1", connected && "text-chart-2")}>
          {connected ? <CheckCircle2Icon className="size-3" /> : null}
          {connected ? "connected" : phase === "running" ? "connecting…" : "disconnected"}
        </Badge>
        <Button size="sm" onClick={run} disabled={phase === "running"} className="gap-1.5">
          {phase === "idle" ? (
            <>
              <PlugZapIcon className="size-4" /> Connect machine
            </>
          ) : phase === "running" ? (
            "Connecting…"
          ) : (
            <>
              <RotateCcwIcon className="size-4" /> Connect again
            </>
          )}
        </Button>
      </div>

      {/* Steps with protocol logs */}
      <ol className="space-y-2">
        {STEPS.map((s, i) => {
          const state = i < doneCount ? "done" : i === active ? "running" : "idle"
          return (
            <li key={s.title} className="rounded-lg border bg-background/50 px-3 py-2.5">
              <div className="flex items-center gap-3">
                <span className="shrink-0">
                  {state === "done" ? (
                    <CheckCircle2Icon className="size-4 text-chart-2" />
                  ) : state === "running" ? (
                    <Loader2Icon className="size-4 animate-spin text-primary" />
                  ) : (
                    <CircleIcon className="size-4 text-muted-foreground/40" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className={cn("text-sm", state === "idle" ? "text-muted-foreground" : "font-medium text-foreground")}>
                    {s.title}
                  </div>
                  <div className="font-mono text-[11px] text-muted-foreground">{s.detail}</div>
                </div>
              </div>
              {state !== "idle" ? (
                <div className="mt-2 space-y-0.5 border-l-2 border-muted pl-3 sm:ml-7">
                  {s.logs.map((line, j) => (
                    <LogRow key={j} line={line} />
                  ))}
                </div>
              ) : null}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
