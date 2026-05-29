"use client"

import * as React from "react"
import { CheckIcon, CopyIcon, PlayIcon, RotateCcwIcon, TerminalIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type TerminalLine = {
  text: string
  tone?: "default" | "muted" | "success" | "header" | "warn"
}

const TONE: Record<NonNullable<TerminalLine["tone"]>, string> = {
  default: "text-zinc-100",
  muted: "text-zinc-400",
  success: "text-emerald-400",
  header: "font-semibold text-cyan-300",
  warn: "text-amber-400",
}

/**
 * A safe, click-to-run terminal simulation: shows a command and, on "Run",
 * streams pre-scripted output line by line. No real process is executed.
 */
export function SimulatedTerminal({
  command,
  lines,
  label = "Terminal",
  stepMs = 220,
}: {
  command: string
  lines: TerminalLine[]
  label?: string
  stepMs?: number
}) {
  const [shown, setShown] = React.useState(0)
  const [status, setStatus] = React.useState<"idle" | "running" | "done">("idle")
  const [copied, setCopied] = React.useState(false)
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const run = () => {
    if (status === "running") return
    setShown(0)
    setStatus("running")
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setShown((n) => {
        const next = n + 1
        if (next >= lines.length) {
          if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
          }
          setStatus("done")
        }
        return Math.min(next, lines.length)
      })
    }, stepMs)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      // ignore
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-sm">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-red-500/80" />
          <span className="size-2.5 rounded-full bg-amber-500/80" />
          <span className="size-2.5 rounded-full bg-emerald-500/80" />
        </span>
        <span className="ml-1 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400">
          <TerminalIcon className="size-3.5" aria-hidden />
          {label}
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-100"
            aria-label="Copy command"
          >
            {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            onClick={run}
            disabled={status === "running"}
            className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-300 transition-colors hover:bg-emerald-500/25 disabled:opacity-60"
          >
            {status === "idle" ? (
              <>
                <PlayIcon className="size-3.5" /> Run
              </>
            ) : status === "running" ? (
              "Running…"
            ) : (
              <>
                <RotateCcwIcon className="size-3.5" /> Run again
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output */}
      <div
        className="max-h-80 overflow-y-auto px-4 py-3 font-mono text-xs leading-relaxed"
        aria-live="polite"
      >
        <div className="text-zinc-100">
          <span className="text-emerald-400">$</span> {command}
        </div>
        {status !== "idle" ? (
          <div className="mt-2 space-y-0.5">
            {lines.slice(0, shown).map((line, i) => (
              <div key={i} className={cn(TONE[line.tone ?? "default"])}>
                {line.text || " "}
              </div>
            ))}
            {status === "running" ? (
              <span className="inline-block h-3.5 w-2 animate-pulse bg-zinc-300 align-middle" aria-hidden />
            ) : null}
          </div>
        ) : (
          <div className="mt-2 text-zinc-500">Press Run to preview the output (simulation — nothing is executed).</div>
        )}
      </div>
    </div>
  )
}
