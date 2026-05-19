import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function DocsPageHeader({
  eyebrow,
  title,
  description,
  badges,
  icon: Icon,
  className,
  children,
}: {
  eyebrow?: string
  title: string
  description?: React.ReactNode
  badges?: string[]
  icon?: React.ComponentType<{ className?: string }>
  className?: string
  children?: React.ReactNode
}) {
  return (
    <header
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-gradient-to-br from-card via-card to-muted/30 p-6 sm:p-8",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-primary/5 blur-3xl"
      />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-3">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
          ) : null}
          <div className="flex items-start gap-3">
            {Icon ? (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-background/80 shadow-sm">
                <Icon className="size-5 text-primary" />
              </div>
            ) : null}
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h1>
          </div>
          {description ? (
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
              {description}
            </p>
          ) : null}
          {badges && badges.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {badges.map((b) => (
                <Badge key={b} variant="secondary" className="font-normal">
                  {b}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
        {children ? <div className="shrink-0">{children}</div> : null}
      </div>
    </header>
  )
}
