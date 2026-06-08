"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getUiStrings } from "@/lib/i18n/ui"
import { useLocale } from "@/lib/i18n/use-locale"

export function CopyButton({
  value,
  label,
}: {
  value: string
  label?: string
}) {
  const ui = getUiStrings(useLocale())
  const resolvedLabel = label ?? ui.copy
  const [copied, setCopied] = React.useState(false)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      // ignore
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onCopy}
            aria-label={resolvedLabel}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={6}>{copied ? ui.copied : resolvedLabel}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

