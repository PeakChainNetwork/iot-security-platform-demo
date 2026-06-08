"use client"

import * as React from "react"
import { BracesIcon, LockIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { CopyButton } from "@/components/common/copy-button"
import { cn } from "@/lib/utils"
import { useLocale } from "@/lib/i18n/use-locale"
import type { Locale } from "@/lib/i18n/config"

const METRICS = [
  { key: "temperature", value: 45.8 },
  { key: "pressure", value: 124.8 },
  { key: "vibration", value: 2.6 },
  { key: "power_draw", value: 4.0 },
  { key: "rotational_speed", value: 980 },
] as const

const STATUSES = ["ok", "warning", "critical"] as const

type Strings = {
  pickFields: string
  alwaysRequired: string
  copyMessage: string
}

const content: Record<Locale, Strings> = {
  en: {
    pickFields: "Pick the fields to send",
    alwaysRequired: "always required",
    copyMessage: "Copy message",
  },
  de: {
    pickFields: "Wählen Sie die zu sendenden Felder",
    alwaysRequired: "immer erforderlich",
    copyMessage: "Nachricht kopieren",
  },
}

/** Interactive telemetry message builder — toggle fields and see the live JSON. */
export function PayloadBuilder() {
  const lang = useLocale()
  const t = content[lang]
  const [enabled, setEnabled] = React.useState<Record<string, boolean>>({
    temperature: true,
    pressure: true,
    vibration: false,
    power_draw: false,
    rotational_speed: false,
  })
  const [statusOn, setStatusOn] = React.useState(true)
  const [status, setStatus] = React.useState<(typeof STATUSES)[number]>("ok")

  const payload: Record<string, unknown> = { timestamp: "2026-04-07T13:23:26+00:00" }
  for (const m of METRICS) if (enabled[m.key]) payload[m.key] = m.value
  if (statusOn) payload.status = status
  const json = JSON.stringify(payload, null, 2)

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Controls */}
      <div className="space-y-1 rounded-xl border bg-card p-4">
        <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t.pickFields}
        </div>

        <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/30 px-3 py-2">
          <div className="flex items-center gap-2">
            <LockIcon className="size-3.5 text-muted-foreground" aria-hidden />
            <code className="font-mono text-xs text-foreground">timestamp</code>
          </div>
          <Badge variant="secondary" className="text-[10px]">{t.alwaysRequired}</Badge>
        </div>

        {METRICS.map((m) => (
          <label
            key={m.key}
            className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-1.5 hover:bg-muted/40"
          >
            <code className="font-mono text-xs text-foreground">{m.key}</code>
            <Switch
              checked={!!enabled[m.key]}
              onCheckedChange={(v) => setEnabled((s) => ({ ...s, [m.key]: v }))}
              aria-label={m.key}
            />
          </label>
        ))}

        <div className="flex items-center justify-between gap-3 rounded-lg px-3 py-1.5">
          <code className="font-mono text-xs text-foreground">status</code>
          <div className="flex items-center gap-2">
            {statusOn ? (
              <div className="flex gap-1">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={cn(
                      "rounded-md border px-2 py-0.5 text-[11px] transition-colors",
                      status === s
                        ? "border-primary bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted/60",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : null}
            <Switch checked={statusOn} onCheckedChange={setStatusOn} aria-label="status" />
          </div>
        </div>
      </div>

      {/* Live JSON */}
      <div className="overflow-hidden rounded-xl border bg-muted/50">
        <div className="flex items-center justify-between gap-2 border-b border-border/80 px-3 py-2">
          <div className="flex min-w-0 items-center gap-2">
            <BracesIcon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
            <span className="truncate text-sm font-medium text-foreground">message.json</span>
            <Badge variant="outline" className="font-mono text-[11px] text-muted-foreground">JSON</Badge>
          </div>
          <CopyButton value={json} label={t.copyMessage} />
        </div>
        <pre className="overflow-x-auto px-4 py-3 font-mono text-xs leading-relaxed text-foreground">
          <code>{json}</code>
        </pre>
      </div>
    </div>
  )
}
