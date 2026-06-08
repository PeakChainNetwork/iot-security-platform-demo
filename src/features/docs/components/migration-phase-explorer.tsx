"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon, CpuIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useLocale } from "@/lib/i18n/use-locale"
import type { Locale } from "@/lib/i18n/config"

const FLEET = ["press-01", "motor-02", "pump-03", "mixer-04", "valve-05", "fan-06"]

type Phase = { phase: string; title: string; desc: string; real: number }

type Strings = {
  prevPhase: string
  nextPhase: string
  realMachines: string
  demoTelemetry: string
  liveMachine: string
  demo: string
  phases: Phase[]
}

const strings: Record<Locale, Strings> = {
  en: {
    prevPhase: "Previous phase",
    nextPhase: "Next phase",
    realMachines: "Real machines",
    demoTelemetry: "Demo telemetry",
    liveMachine: "live machine",
    demo: "demo",
    phases: [
      { phase: "Phase 0", title: "Keep the demo", desc: "Demo telemetry runs everywhere. Nothing in production changes yet.", real: 0 },
      { phase: "Phase 1", title: "Pilot one machine", desc: "One real machine is onboarded and validated end to end.", real: 1 },
      { phase: "Phase 2", title: "Parallel run", desc: "Real telemetry for the pilots; the demo fills the rest so the dashboard stays complete.", real: 3 },
      { phase: "Phase 3", title: "Scale out", desc: "The remaining machines are onboarded in batches.", real: 5 },
      { phase: "Phase 4", title: "Retire the demo", desc: "Every machine is real. The demo is switched off (kept only for training).", real: 6 },
    ],
  },
  de: {
    prevPhase: "Vorherige Phase",
    nextPhase: "Nächste Phase",
    realMachines: "Echte Maschinen",
    demoTelemetry: "Demo-Telemetrie",
    liveMachine: "Live-Maschine",
    demo: "Demo",
    phases: [
      { phase: "Phase 0", title: "Demo behalten", desc: "Demo-Telemetrie läuft überall. In der Produktion ändert sich noch nichts.", real: 0 },
      { phase: "Phase 1", title: "Eine Maschine als Pilot", desc: "Eine echte Maschine wird angebunden und durchgängig validiert.", real: 1 },
      { phase: "Phase 2", title: "Parallelbetrieb", desc: "Echte Telemetrie für die Piloten; die Demo füllt den Rest, damit das Dashboard vollständig bleibt.", real: 3 },
      { phase: "Phase 3", title: "Skalieren", desc: "Die verbleibenden Maschinen werden in Chargen angebunden.", real: 5 },
      { phase: "Phase 4", title: "Demo abschalten", desc: "Jede Maschine ist echt. Die Demo wird abgeschaltet (nur für Schulungen behalten).", real: 6 },
    ],
  },
}

export function MigrationPhaseExplorer() {
  const lang = useLocale()
  const s = strings[lang]
  const PHASES = s.phases
  const [phase, setPhase] = React.useState(0)
  const current = PHASES[phase]!
  const realPct = Math.round((current.real / FLEET.length) * 100)

  return (
    <div className="space-y-5">
      {/* Phase selector */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-card p-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPhase((p) => Math.max(0, p - 1))}
          disabled={phase === 0}
          aria-label={s.prevPhase}
        >
          <ChevronLeftIcon className="size-4" />
        </Button>

        <div className="flex flex-1 flex-wrap justify-center gap-1.5">
          {PHASES.map((p, i) => (
            <button
              key={p.phase}
              onClick={() => setPhase(i)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                i === phase
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted/60",
              )}
            >
              {i}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setPhase((p) => Math.min(PHASES.length - 1, p + 1))}
          disabled={phase === PHASES.length - 1}
          aria-label={s.nextPhase}
        >
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>

      {/* Caption */}
      <div className="rounded-xl border bg-card p-4">
        <div className="flex items-baseline justify-between gap-3">
          <div className="text-sm font-semibold text-foreground">{current.title}</div>
          <div className="text-xs font-medium text-muted-foreground">{current.phase}</div>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{current.desc}</p>
      </div>

      {/* Fleet */}
      <div className="rounded-xl border bg-muted/20 p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {FLEET.map((name, i) => {
            const isReal = i < current.real
            return (
              <div
                key={name}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border p-3 transition-all duration-300",
                  isReal ? "border-chart-2/50 bg-chart-2/10" : "border-dashed bg-card",
                )}
              >
                <div
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                    isReal ? "bg-chart-2/15 text-chart-2" : "bg-muted text-muted-foreground",
                  )}
                >
                  <CpuIcon className="size-4" aria-hidden />
                </div>
                <div className="min-w-0">
                  <div className="truncate font-mono text-xs font-medium text-foreground">{name}</div>
                  <div className={cn("text-[11px] font-medium", isReal ? "text-chart-2" : "text-muted-foreground")}>
                    {isReal ? s.liveMachine : s.demo}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Coverage bars */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{s.realMachines}</span>
            <span className="font-medium text-chart-2">{realPct}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-chart-2 transition-all duration-500" style={{ width: `${realPct}%` }} />
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{s.demoTelemetry}</span>
            <span className="font-medium text-muted-foreground">{100 - realPct}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-muted-foreground/40 transition-all duration-500"
              style={{ width: `${100 - realPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
