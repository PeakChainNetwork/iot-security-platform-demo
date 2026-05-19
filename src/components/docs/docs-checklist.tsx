import * as React from "react"
import { CheckCircle2Icon, CircleDashedIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export function DocsChecklist({ children, className }: { children: React.ReactNode; className?: string }) {
  return <ul className={cn("space-y-3", className)}>{children}</ul>
}

export function DocsChecklistItem({
  title,
  children,
  done,
}: {
  title: string
  children?: React.ReactNode
  done?: boolean
}) {
  const Icon = done ? CheckCircle2Icon : CircleDashedIcon
  return (
    <li className="flex gap-3 rounded-xl border bg-card p-4">
      <Icon
        className={cn("mt-0.5 size-5 shrink-0", done ? "text-primary" : "text-muted-foreground")}
        aria-hidden
      />
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {children ? (
          <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
        ) : null}
      </div>
    </li>
  )
}
