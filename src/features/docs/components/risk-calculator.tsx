"use client"

import * as React from "react"

import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import type { Locale } from "@/lib/i18n/config"

type Strings = {
  high: string
  medium: string
  low: string
  cvssLabel: string
  cvssHint: string
  anomalyLabel: string
  anomalyHint: string
  complianceLabel: string
  complianceHint: string
  riskScore: string
  outOf: string
  breakdown: { cvss: string; anomaly: string; compliance: string }
  formula: string
}

const strings: Record<Locale, Strings> = {
  en: {
    high: "High",
    medium: "Medium",
    low: "Low",
    cvssLabel: "Highest CVSS",
    cvssHint: "severity of known vulnerabilities",
    anomalyLabel: "Anomaly score",
    anomalyHint: "how unusual recent behaviour is",
    complianceLabel: "Compliance score",
    complianceHint: "higher is better",
    riskScore: "Risk score",
    outOf: "/ 100",
    breakdown: { cvss: "CVSS × 0.4", anomaly: "Anomaly × 0.4", compliance: "Compliance × 0.2" },
    formula: "Risk = 0.4·CVSS + 0.4·anomaly + 0.2·(100 − compliance)",
  },
  de: {
    high: "Hoch",
    medium: "Mittel",
    low: "Niedrig",
    cvssLabel: "Höchster CVSS",
    cvssHint: "Schweregrad bekannter Schwachstellen",
    anomalyLabel: "Anomaliewert",
    anomalyHint: "wie ungewöhnlich das jüngste Verhalten ist",
    complianceLabel: "Compliance-Wert",
    complianceHint: "höher ist besser",
    riskScore: "Risikowert",
    outOf: "/ 100",
    breakdown: { cvss: "CVSS × 0,4", anomaly: "Anomalie × 0,4", compliance: "Compliance × 0,2" },
    formula: "Risiko = 0,4·CVSS + 0,4·Anomalie + 0,2·(100 − Compliance)",
  },
}

function riskTone(risk: number, s: Strings) {
  if (risk >= 70) return { text: "text-destructive", bar: "bg-destructive", label: s.high }
  if (risk >= 40) return { text: "text-chart-4", bar: "bg-chart-4", label: s.medium }
  return { text: "text-chart-2", bar: "bg-chart-2", label: s.low }
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

/** Interactive risk-score calculator mirroring Peaksoft EU's scoring formula. */
export function RiskCalculator({ lang }: { lang: Locale }) {
  const s = strings[lang]
  const [cvss, setCvss] = React.useState(7.5)
  const [anomaly, setAnomaly] = React.useState(60)
  const [compliance, setCompliance] = React.useState(80)

  const cvssComponent = Math.min(100, cvss * 10)
  const anomalyComponent = anomaly
  const complianceComponent = 100 - compliance
  const risk = Math.round(0.4 * cvssComponent + 0.4 * anomalyComponent + 0.2 * complianceComponent)
  const tone = riskTone(risk, s)

  const breakdown = [
    { label: s.breakdown.cvss, value: Math.round(0.4 * cvssComponent) },
    { label: s.breakdown.anomaly, value: Math.round(0.4 * anomalyComponent) },
    { label: s.breakdown.compliance, value: Math.round(0.2 * complianceComponent) },
  ]

  return (
    <div className="grid gap-5 rounded-xl border bg-card p-5 lg:grid-cols-2">
      <div className="space-y-5">
        <SliderRow
          label={s.cvssLabel}
          hint={s.cvssHint}
          value={cvss}
          min={0}
          max={10}
          step={0.1}
          display={cvss.toFixed(1)}
          onChange={setCvss}
        />
        <SliderRow
          label={s.anomalyLabel}
          hint={s.anomalyHint}
          value={anomaly}
          min={0}
          max={100}
          step={1}
          display={`${anomaly}`}
          onChange={(v) => setAnomaly(Math.round(v))}
        />
        <SliderRow
          label={s.complianceLabel}
          hint={s.complianceHint}
          value={compliance}
          min={0}
          max={100}
          step={1}
          display={`${compliance}`}
          onChange={(v) => setCompliance(Math.round(v))}
        />
      </div>

      <div className="flex flex-col justify-center gap-3 rounded-xl border bg-muted/20 p-5">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{s.riskScore}</div>
        <div className="flex items-baseline gap-2">
          <span className={cn("font-mono text-4xl font-semibold tabular-nums", tone.text)}>{risk}</span>
          <span className="text-sm text-muted-foreground">{s.outOf} · {tone.label}</span>
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
        <p className="text-[11px] leading-relaxed text-muted-foreground">{s.formula}</p>
      </div>
    </div>
  )
}
