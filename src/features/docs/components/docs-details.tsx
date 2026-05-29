"use client"

import * as React from "react"
import { ChevronRightIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

/**
 * A collapsed-by-default "for developers" disclosure. Keeps the simple page
 * readable while tucking deep detail (full schemas, extra code, edge cases)
 * one layer down. Use for content that most readers can safely skip.
 */
export function DocsDetails({
  summary = "For developers",
  description,
  children,
  defaultOpen = false,
}: {
  summary?: string
  description?: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  return (
    <Collapsible
      defaultOpen={defaultOpen}
      className="group/details rounded-xl border bg-card"
    >
      <CollapsibleTrigger
        className={cn(
          "flex w-full items-start gap-3 rounded-xl px-4 py-3 text-left",
          "transition-colors hover:bg-muted/40",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        <ChevronRightIcon
          className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]/details:rotate-90"
          aria-hidden
        />
        <span className="min-w-0">
          <span className="block text-sm font-medium text-foreground">{summary}</span>
          {description ? (
            <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">
              {description}
            </span>
          ) : null}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-4 border-t px-4 py-4">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  )
}
