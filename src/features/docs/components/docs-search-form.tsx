"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"

import { useDocsSearch } from "@/features/docs/components/docs-search-provider"
import { cn } from "@/lib/utils"
import { Kbd } from "@/components/ui/kbd"

function useModKeyLabel() {
  const [mod, setMod] = React.useState("Ctrl")
  React.useEffect(() => {
    const apple =
      /Mac|iPhone|iPod|iPad/i.test(navigator.platform) ||
      (navigator.userAgent.includes("Mac") && !navigator.userAgent.includes("Win"))
    setMod(apple ? "⌘" : "Ctrl")
  }, [])
  return mod
}

export function DocsSearchForm({
  className,
  ...props
}: Omit<React.ComponentProps<"button">, "type" | "onClick">) {
  const { setOpen } = useDocsSearch()
  const mod = useModKeyLabel()

  return (
    <button
      type="button"
      {...props}
      onClick={() => setOpen(true)}
      className={cn(
        "inline-flex h-9 min-w-0 max-w-full shrink-0 items-center gap-2 rounded-3xl border border-border/80 bg-muted/30 px-3 text-left text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30",
        "w-[min(100%,12rem)] sm:w-52 md:w-60",
        className
      )}
    >
      <SearchIcon className="size-4 shrink-0 opacity-60" aria-hidden />
      <span className="min-w-0 flex-1 truncate">Search documentation…</span>
      <span
        className="pointer-events-none hidden shrink-0 items-center gap-0.5 sm:inline-flex"
        aria-hidden
      >
        <Kbd className="h-[1.375rem] min-w-[1.375rem] px-1 font-sans text-[10px]">
          {mod}
        </Kbd>
        <Kbd className="h-[1.375rem] min-w-[1.375rem] px-1 font-sans text-[10px]">
          K
        </Kbd>
      </span>
    </button>
  )
}
