"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getDocsPager } from "@/features/docs/lib/docs-page-meta"
import { getUiStrings } from "@/lib/i18n/ui"
import { useLocale } from "@/lib/i18n/use-locale"

export function DocsPageFooter() {
  const pathname = usePathname() ?? "/"
  const lang = useLocale()
  const ui = getUiStrings(lang)
  const { prev, next } = getDocsPager(pathname, lang)

  if (!prev && !next) return null

  return (
    <footer className="mt-12 space-y-6">
      <Separator />
      <nav className="grid gap-3 sm:grid-cols-2" aria-label={ui.paginationLabel}>
        {prev ? (
          <Button variant="outline" className="h-auto justify-start px-4 py-3" asChild>
            <Link href={prev.href}>
              <span className="flex w-full flex-col items-start gap-1 text-left">
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowLeftIcon className="size-3.5" aria-hidden />
                  {ui.previous}
                </span>
                <span className="text-sm font-medium text-foreground">{prev.title}</span>
              </span>
            </Link>
          </Button>
        ) : (
          <div />
        )}
        {next ? (
          <Button variant="outline" className="h-auto justify-end px-4 py-3 sm:col-start-2" asChild>
            <Link href={next.href}>
              <span className="flex w-full flex-col items-end gap-1 text-right">
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  {ui.next}
                  <ArrowRightIcon className="size-3.5" aria-hidden />
                </span>
                <span className="text-sm font-medium text-foreground">{next.title}</span>
              </span>
            </Link>
          </Button>
        ) : null}
      </nav>
    </footer>
  )
}
