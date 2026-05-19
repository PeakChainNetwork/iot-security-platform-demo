"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { docsNav } from "@/features/docs/lib/docs-nav"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

type DocsSearchContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

const DocsSearchContext = React.createContext<DocsSearchContextValue | null>(null)

export function useDocsSearch(): DocsSearchContextValue {
  const ctx = React.useContext(DocsSearchContext)
  if (!ctx) {
    throw new Error("useDocsSearch must be used within DocsSearchProvider")
  }
  return ctx
}

export function DocsSearchProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [open, setOpenState] = React.useState(false)
  const [paletteKey, setPaletteKey] = React.useState(0)

  const setOpen = React.useCallback((next: boolean) => {
    setOpenState(next)
    if (next) {
      setPaletteKey((k) => k + 1)
    }
  }, [])

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "k" && e.key !== "K") return
      if (!(e.metaKey || e.ctrlKey)) return
      const el = e.target as HTMLElement | null
      if (el) {
        const inFormField =
          el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.tagName === "SELECT" ||
          el.isContentEditable
        if (inFormField) {
          const inDocsSearchPalette =
            el.closest("[cmdk-root]") != null || el.hasAttribute("cmdk-input")
          if (!inDocsSearchPalette) return
        }
      }
      if (e.defaultPrevented) return
      e.preventDefault()
      setOpenState((prev) => {
        const next = !prev
        if (next) setPaletteKey((k) => k + 1)
        return next
      })
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  const value = React.useMemo(() => ({ open, setOpen }), [open, setOpen])

  return (
    <DocsSearchContext.Provider value={value}>
      {children}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search documentation"
        description="Fuzzy search across all documentation pages by title or path. Use arrow keys and Enter to open a page."
        showCloseButton={false}
        className="top-[32%] w-[calc(100vw-2.5rem)] max-w-2xl gap-0 p-4 sm:top-[34%] sm:w-[calc(100vw-3rem)] sm:p-6"
      >
        <Command
          key={paletteKey}
          loop
          vimBindings={false}
          className="gap-1 p-2 sm:gap-2 sm:p-3"
        >
          <CommandInput placeholder="Search documentation…" />
          <CommandList>
            <CommandEmpty>No pages found.</CommandEmpty>
            {docsNav.map((section) => (
              <CommandGroup key={section.title} heading={section.title}>
                {section.items.map((item) => (
                  <CommandItem
                    key={item.href}
                    value={`${item.title} ${section.title} ${item.href}`}
                    keywords={[item.href, item.title, section.title]}
                    onSelect={() => {
                      router.push(item.href)
                      setOpen(false)
                    }}
                  >
                    {item.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </DocsSearchContext.Provider>
  )
}
