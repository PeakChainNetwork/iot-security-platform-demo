import * as React from "react"

import { cn } from "@/lib/utils"

export function DocsRequirementGrid({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn("grid gap-3 sm:grid-cols-2", className)}>{children}</div>
}

export function DocsRequirementCard({
  step,
  title,
  children,
}: {
  step: number | string
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/20">
      <div className="flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {step}
        </span>
        <span className="font-medium text-foreground">{title}</span>
      </div>
      <div className="mt-3 text-sm leading-relaxed text-muted-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs">
        {children}
      </div>
    </div>
  )
}

export function DocsOptionalItem({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl border border-dashed bg-muted/20 p-4">
      <span className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Optional</span>
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
      </div>
    </div>
  )
}
