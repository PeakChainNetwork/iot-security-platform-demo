"use client"

import * as React from "react"

import { DocsSearchForm } from "@/components/docs/docs-search-form"
import { ThemeToggle } from "@/components/theme-toggle"

export function DocsInsetHeader({ children }: { children: React.ReactNode }) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-background px-4">
      <div className="flex min-w-0 flex-1 items-center gap-2">{children}</div>
      <div className="flex shrink-0 items-center gap-2">
        <DocsSearchForm />
        <ThemeToggle />
      </div>
    </header>
  )
}
