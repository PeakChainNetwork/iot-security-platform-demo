import * as React from "react"

import { cn } from "@/lib/utils"

export function DocsVerificationFlow({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <ol className={cn("docs-verification-flow list-none space-y-8 p-0", className)}>
      {children}
    </ol>
  )
}

export function DocsVerificationStep({
  step,
  title,
  children,
}: {
  step: number
  title: string
  children: React.ReactNode
}) {
  return (
    <li className="space-y-3">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground"
          aria-hidden
        >
          {step}
        </span>
        <p className="docs-verification-step-title m-0 text-sm font-semibold leading-none text-foreground">
          {title}
        </p>
      </div>

      <div className="space-y-6 rounded-xl border bg-card p-5 sm:p-6">{children}</div>
    </li>
  )
}

export function DocsVerificationCriteria({
  note,
  children,
}: {
  note?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4 border-t border-border/80 pt-6">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        What to look for in the response
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
      {note ? <p className="text-xs leading-relaxed text-muted-foreground">{note}</p> : null}
    </section>
  )
}

export function DocsVerificationCriterion({
  label,
  value,
  success,
}: {
  label: string
  value: React.ReactNode
  success?: boolean
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="rounded-lg border bg-muted/40 px-3 py-2 font-mono text-xs text-foreground">
        {success ? (
          <span className="inline-flex items-center gap-2">
            <span className="size-1.5 shrink-0 rounded-full bg-chart-3" aria-hidden />
            {value}
          </span>
        ) : (
          value
        )}
      </div>
    </div>
  )
}
