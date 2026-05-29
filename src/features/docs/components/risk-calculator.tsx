"use client"

import * as React from "react"

import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

function riskTone(risk: number) {
  if (risk >= 70) return { text: "text-destructive", bar: "bg-destructive", label: "High" }
  if (risk >= 40) return { text: "text-chart-4", bar: "bg-chart-4", label: "Medium" }
  return { text: "text-chart-2", bar: "bg-chart-2", label: "Low" }
}

function SliderRow({
  label,
  hint,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string
  hint: string
  value: number
  min: number
  max: number
  step: number
  display: string
  onChange: (v: number) => void
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-foreground">{label}</div>
          <div className="text-xs text-muted-foreground">{hint}</div>
        </div>
        <span className="font-mono text-sm text-foreground">{display}</span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(vals) => onChange(vals[0] ?? min)}
        aria-label={label}
      />
    </div>
  )
}

/** Interactive risk-score calculator mirroring the platform's scoring formula. */
export function RiskCalculator() {
  const [cvss, setCvss] = React.useState(7.5)
  const [anomaly, setAnomaly] = React.useState(60)
  const [compliance, setCompliance] = React.useState(80)

  const cvssComponent = Math.min(100, cvss * 10)
  const anomalyComponent = anomaly
  const complianceComponent = 100 - compliance
  const risk = Math.round(0.4 * cvssComponent + 0.4 * anomalyComponent + 0.2 * complianceComponent)
  const tone = riskTone(risk)

  const breakdown = [
    { label: "CVSS × 0.4", value: Math.round(0.4 * cvssComponent) },
    { label: "Anomaly × 0.4", value: Math.round(0.4 * anomalyComponent) },
    { label: "Compliance × 0.2", value: Math.round(0.2 * complianceComponent) },
  ]

  return (
    <div className="grid gap-5 rounded-xl border bg-card p-5 lg:grid-cols-2">
      <div className="space-y-5">
        <SliderRow
          label="Highest CVSS"
          hint="severity of known vulnerabilities"
          value={cvss}
          min={0}
          max={10}
          step={0.1}
          display={cvss.toFixed(1)}
          onChange={setCvss}
        />
        <SliderRow
          label="Anomaly score"
          hint="how unusual recent behaviour is"
          value={anomaly}
          min={0}
          max={100}
          step={1}
          display={`${anomaly}`}
          onChange={(v) => setAnomaly(Math.round(v))}
        />
        <SliderRow
          label="Compliance score"
          hint="higher is better"
          value={compliance}
          min={0}
          max={100}
          step={1}
          display={`${compliance}`}
          onChange={(v) => setCompliance(Math.round(v))}
        />
      </div>

      <div className="flex flex-col justify-center gap-3 rounded-xl border bg-muted/20 p-5">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Risk score</div>
        <div className="flex items-baseline gap-2">
          <span className={cn("font-mono text-4xl font-semibold tabular-nums", tone.text)}>{risk}</span>
          <span className="text-sm text-muted-foreground">/ 100 · {tone.label}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className={cn("h-full rounded-full transition-all duration-300", tone.bar)} style={{ width: `${risk}%` }} />
        </div>
        <div className="mt-1 space-y-1">
          {breakdown.map((b) => (
            <div key={b.label} className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{b.label}</span>
              <span className="font-mono text-foreground">+{b.value}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Risk = 0.4·CVSS + 0.4·anomaly + 0.2·(100 − compliance)
        </p>
      </div>
    </div>
  )
}
