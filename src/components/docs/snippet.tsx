"use client"

import { TerminalIcon, FileCodeIcon, BracesIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { CopyButton } from "@/components/copy-button"
import { cn } from "@/lib/utils"

const typeIcons: Record<string, React.ElementType> = {
  shell: TerminalIcon,
  bash: TerminalIcon,
  sh: TerminalIcon,
  json: BracesIcon,
  JSON: BracesIcon,
}

export function Snippet({
  title,
  value,
  children,
  type,
}: {
  title: string
  value: string
  children: React.ReactNode
  type?: string
}) {
  const isShell = type === "shell" || type === "bash" || type === "sh"
  const Icon = type ? typeIcons[type] ?? FileCodeIcon : FileCodeIcon

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div
        className={cn(
          "flex items-center justify-between gap-2 border-b px-3 py-2",
          isShell && "bg-muted/40"
        )}
      >
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
      <div
        className={cn(
          "whitespace-pre-wrap px-4 py-3 font-mono text-xs leading-relaxed text-muted-foreground",
          isShell ? "bg-muted/20" : "bg-muted/30"
        )}
      >
        {children}
      </div>
    </div>
  )
}
