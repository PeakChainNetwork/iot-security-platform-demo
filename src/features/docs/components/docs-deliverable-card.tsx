import * as React from "react"
import type { LucideIcon } from "lucide-react"

import { type DocsIconName, resolveDocsIcon } from "@/features/docs/components/docs-icons"
import { cn } from "@/lib/utils"

export function DocsDeliverableGrid({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2", className)}>{children}</div>
  )
}

export function DocsDeliverableCard({
  title,
  icon,
  optional,
  children,
}: {
  title: string
  icon: DocsIconName | LucideIcon
  optional?: boolean
  children: React.ReactNode
}) {
  const Icon = resolveDocsIcon(icon)
  return (
    <div
      className={cn(
        "flex gap-4 rounded-xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/25 hover:bg-muted/20",
        optional && "border-dashed bg-muted/15 hover:bg-muted/25"
      )}
    >
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-primary/5 text-primary"
        aria-hidden
      >
        <Icon className="size-5" />
      </div>
      <div className="min-w-0 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {optional ? (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Optional
            </span>
          ) : null}
        </div>
        <div className="text-sm leading-relaxed text-muted-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_code]:text-foreground">
          {children}
        </div>
      </div>
    </div>
  )
}
