import * as React from "react"

import { cn } from "@/lib/utils"

export function DocsSection({
  title,
  description,
  children,
  className,
  id,
}: {
  title: string
  description?: React.ReactNode
  children: React.ReactNode
  className?: string
  id?: string
}) {
  return (
    <section id={id} className={cn("scroll-mt-20 space-y-4", className)}>
      <div className="space-y-1">
        <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">{title}</h2>
        {description ? (
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  )
}
