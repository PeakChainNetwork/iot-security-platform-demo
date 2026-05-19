"use client"

import * as React from "react"
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type JsonLike =
  | null
  | boolean
  | number
  | string
  | JsonLike[]
  | { [key: string]: JsonLike }

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v)
}

function formatScalar(v: unknown) {
  if (v === null || v === undefined) return "—"
  if (typeof v === "string") return v
  if (typeof v === "number") return Number.isFinite(v) ? v.toString() : String(v)
  if (typeof v === "boolean") return v ? "true" : "false"
  if (v instanceof Date) return v.toISOString()
  return String(v)
}

function previewValue(v: unknown) {
  if (v === null) return "null"
  if (Array.isArray(v)) return `Array(${v.length})`
  if (isPlainObject(v)) return `Object(${Object.keys(v).length})`
  if (typeof v === "string") return v.length > 40 ? `${v.slice(0, 40)}…` : v
  return formatScalar(v)
}

function typeBadge(v: unknown) {
  if (v === null) return "null"
  if (Array.isArray(v)) return "array"
  if (isPlainObject(v)) return "object"
  return typeof v
}

function Row({
  label,
  value,
  depth,
}: {
  label: string
  value: unknown
  depth: number
}) {
  const isExpandable = Array.isArray(value) || isPlainObject(value)
  const [open, setOpen] = React.useState(false)

  return (
    <div className="border-b last:border-b-0">
      <div
        className={cn(
          "flex items-start gap-3 py-2",
          depth === 0 ? "px-3" : "px-3"
        )}
        style={{ paddingLeft: 12 + depth * 14 }}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {isExpandable ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => setOpen((v) => !v)}
                className="-ml-1"
                aria-label={open ? "Collapse" : "Expand"}
              >
                {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
              </Button>
            ) : (
              <span className="inline-block w-6" aria-hidden="true" />
            )}

            <div className="text-sm font-medium break-words">{label}</div>
            <Badge variant="outline" className="h-5">
              {typeBadge(value)}
            </Badge>
          </div>
          <div className="mt-1 text-xs text-muted-foreground break-words">
            {isExpandable ? previewValue(value) : formatScalar(value)}
          </div>
        </div>
      </div>

      {isExpandable && open ? (
        <div className="pb-2">
          <ObjectInspector value={value as JsonLike} depth={depth + 1} />
        </div>
      ) : null}
    </div>
  )
}

export function ObjectInspector({
  value,
  depth = 0,
  maxItems = 60,
}: {
  value: JsonLike
  depth?: number
  maxItems?: number
}) {
  if (value === null || value === undefined) {
    return (
      <div className="px-3 py-3 text-sm text-muted-foreground">No data.</div>
    )
  }

  if (Array.isArray(value)) {
    const shown = value.slice(0, maxItems)
    return (
      <div className="rounded-lg border bg-card">
        {shown.map((item, idx) => (
          <Row key={idx} label={`[${idx}]`} value={item} depth={depth} />
        ))}
        {value.length > shown.length ? (
          <div
            className="px-3 py-2 text-xs text-muted-foreground"
            style={{ paddingLeft: 12 + depth * 14 }}
          >
            Showing first {shown.length} of {value.length} items.
          </div>
        ) : null}
      </div>
    )
  }

  if (typeof value === "object") {
    const entries = Object.entries(value)
    const shown = entries.slice(0, maxItems)
    return (
      <div className="rounded-lg border bg-card">
        {shown.map(([k, v]) => (
          <Row key={k} label={k} value={v} depth={depth} />
        ))}
        {entries.length > shown.length ? (
          <div
            className="px-3 py-2 text-xs text-muted-foreground"
            style={{ paddingLeft: 12 + depth * 14 }}
          >
            Showing first {shown.length} of {entries.length} fields.
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card px-3 py-3 text-sm">
      {formatScalar(value)}
    </div>
  )
}
