"use client"

import * as React from "react"
import { BracesIcon, FileCodeIcon } from "lucide-react"

import { DocsShellCommand } from "@/components/docs/docs-shell-command"
import { Badge } from "@/components/ui/badge"
import { CopyButton } from "@/components/copy-button"

function isShellType(type?: string) {
  return type === "shell" || type === "bash" || type === "sh"
}

export function Snippet({
  title,
  value,
  children,
  type,
}: {
  title: string
  value: string
  children?: React.ReactNode
  type?: string
}) {
  if (isShellType(type)) {
    const command =
      typeof children === "string"
        ? children
        : children == null || children === ""
          ? value
          : value
    return <DocsShellCommand label={title} value={command.trim()} />
  }

  const Icon = type === "JSON" || type === "json" ? BracesIcon : FileCodeIcon

  return (
    <div className="overflow-hidden rounded-xl border bg-muted/50">
      <div className="flex items-center justify-between gap-2 border-b border-border/80 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <Icon className="size-3.5 shrink-0 text-muted-foreground" />
          <div className="truncate text-sm font-medium text-foreground">{title}</div>
          {type ? (
            <Badge variant="outline" className="font-mono text-[11px] text-muted-foreground">
              {type}
            </Badge>
          ) : null}
        </div>
        <CopyButton value={value} label={`Copy ${title}`} />
      </div>
      <div className="whitespace-pre-wrap px-4 py-3 font-mono text-xs leading-relaxed text-foreground">
        {children ?? value}
      </div>
    </div>
  )
}
