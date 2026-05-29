import * as React from "react"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { ArrowRightIcon } from "lucide-react"

import { type DocsIconName, resolveDocsIcon } from "@/features/docs/components/docs-icons"
import { cn } from "@/lib/utils"

export function DocsNavCard({
  href,
  eyebrow,
  title,
  description,
  icon,
  className,
}: {
  href: string
  eyebrow: string
  title: string
  description: string
  icon?: DocsIconName | LucideIcon
  className?: string
}) {
  const iconEl = icon
    ? React.createElement(resolveDocsIcon(icon), { className: "size-5", "aria-hidden": true })
    : null
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col rounded-xl border bg-card p-5 no-underline shadow-sm transition-all",
        "hover:border-primary/30 hover:bg-muted/30 hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
          <p className="text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
            {title}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
        {iconEl ? (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-background/80 text-primary">
            {iconEl}
          </div>
        ) : null}
      </div>
      <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
        Read guide
        <ArrowRightIcon className="size-3.5" aria-hidden />
      </span>
    </Link>
  )
}
