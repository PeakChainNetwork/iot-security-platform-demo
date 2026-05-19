"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function formatBashDisplay(text: string): string[] {
  const lines = text.trim().replace(/^\$\s*/, "").split("\n")
  return lines.map((line, index) => (index === 0 ? line : `  ${line}`))
}

export function stripShellPrompt(command: string): string {
  return command.trim().replace(/^\$\s*/, "")
}

function ShellSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </p>
  )
}

export function DocsShellCommand({
  value,
  label = "Run this command",
  className,
}: {
  value: string
  label?: string
  className?: string
}) {
  const [copied, setCopied] = React.useState(false)
  const lines = formatBashDisplay(value)
  const copyValue = stripShellPrompt(value)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyValue)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      // ignore
    }
  }

  return (
    <section className={cn("space-y-3", className)}>
      {label ? <ShellSectionLabel>{label}</ShellSectionLabel> : null}
      <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/50 px-3 py-2.5 sm:px-4">
        <pre className="min-w-0 flex-1 overflow-x-auto font-mono text-xs leading-relaxed sm:text-sm">
          <code className="whitespace-pre text-foreground">
            <span className="text-muted-foreground">$</span> {lines[0]}
            {lines.length > 1 ? `\n${lines.slice(1).join("\n")}` : null}
          </code>
        </pre>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 shrink-0 gap-1.5 px-2.5 text-xs"
          onClick={onCopy}
          aria-label="Copy command"
        >
          {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
    </section>
  )
}
