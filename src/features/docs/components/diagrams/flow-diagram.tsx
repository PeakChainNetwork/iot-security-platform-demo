import type { LucideIcon } from "lucide-react"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type FlowNode = {
  icon: LucideIcon
  title: string
  subtitle?: string
  /** Tailwind classes for the icon tile, e.g. "bg-chart-2/15 text-chart-2". */
  tile?: string
  emphasized?: boolean
}

function Connector({ label }: { label?: string }) {
  return (
    <div className="flex shrink-0 items-center justify-center py-1 sm:flex-1 sm:py-0">
      {/* Mobile: a downward chevron */}
      <ChevronDownIcon className="size-4 text-muted-foreground/60 sm:hidden" aria-hidden />
      {/* Desktop: a gradient track with a travelling pulse */}
      <div className="relative hidden h-px w-full bg-gradient-to-r from-border via-primary/50 to-border sm:block">
        <span className="docs-flow-dot absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
        {label ? (
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  )
}

/**
 * A modern, responsive flow diagram: icon node cards connected by gradient
 * tracks with a travelling "data pulse". Configure with `nodes` (and optional
 * per-gap `connectorLabels`). Reused across the docs to keep a consistent look.
 */
export function FlowDiagram({
  nodes,
  connectorLabels = [],
}: {
  nodes: FlowNode[]
  connectorLabels?: string[]
}) {
  return (
    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
      {nodes.map((node, i) => {
        const Icon = node.icon
        return (
          <div key={node.title} className="contents">
            <div
              className={cn(
                "flex flex-1 items-center gap-3 rounded-2xl border bg-card/80 p-4 shadow-sm backdrop-blur",
                node.emphasized &&
                  "border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-primary/15",
              )}
            >
              <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", node.tile ?? "bg-primary/10 text-primary")}>
                <Icon className="size-5" aria-hidden />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-foreground">{node.title}</div>
                {node.subtitle ? (
                  <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{node.subtitle}</div>
                ) : null}
              </div>
            </div>
            {i < nodes.length - 1 ? <Connector label={connectorLabels[i]} /> : null}
          </div>
        )
      })}
    </div>
  )
}
