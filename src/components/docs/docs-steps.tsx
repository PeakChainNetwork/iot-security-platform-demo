import * as React from "react"

import { cn } from "@/lib/utils"

export function DocsSteps({ children, className }: { children: React.ReactNode; className?: string }) {
  return <ol className={cn("relative space-y-4", className)}>{children}</ol>
}

export function DocsStep({
  step,
  title,
  children,
}: {
  step: number
  title: string
  children: React.ReactNode
}) {
  return (
    <li className="relative flex gap-4 rounded-xl border bg-card p-4 pl-5">
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
        aria-hidden
      >
        {step}
      </span>
      <div className="min-w-0 space-y-1 pt-0.5">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <div className="text-sm leading-relaxed text-muted-foreground [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4">
          {children}
        </div>
      </div>
    </li>
  )
}
