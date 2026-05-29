import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type DocsField = {
  /** The JSON field name. */
  name: string
  /** Short type label, e.g. "string", "number", "ok | warning | critical". */
  type: string
  /** Plain-English explanation of what the field is. */
  meaning?: React.ReactNode
  /** Whether the field must always be present. */
  required?: boolean
}

/**
 * A modern, scannable schema view: one row per field with its name, a type
 * pill, a required/optional marker, and a short plain-English description.
 * Replaces raw JSON Schema blocks. Optionally wrapped with a title caption.
 */
export function DocsFieldTable({
  fields,
  title,
}: {
  fields: DocsField[]
  title?: string
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      {title ? (
        <div className="border-b bg-muted/30 px-4 py-2.5 font-mono text-xs font-medium text-muted-foreground">
          {title}
        </div>
      ) : null}
      <div className="divide-y">
        {fields.map((field) => (
          <div
            key={field.name}
            className="px-4 py-3 transition-colors hover:bg-muted/30"
          >
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <code className="font-mono text-sm font-medium text-foreground">
                {field.name}
              </code>
              <Badge
                variant="outline"
                className="rounded-md font-mono text-[11px] font-normal text-muted-foreground"
              >
                {field.type}
              </Badge>
              <span
                className={cn(
                  "text-[11px] font-medium uppercase tracking-wide",
                  field.required ? "text-chart-4" : "text-muted-foreground/70",
                )}
              >
                {field.required ? "required" : "optional"}
              </span>
            </div>
            {field.meaning ? (
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {field.meaning}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
