"use client"

import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getDocsPageMeta } from "@/features/docs/lib/docs-page-meta"
import { getUiStrings } from "@/lib/i18n/ui"
import { useLocale } from "@/lib/i18n/use-locale"

export function DocsBreadcrumbs() {
  const pathname = usePathname() ?? "/"
  const lang = useLocale()
  const ui = getUiStrings(lang)
  const meta = getDocsPageMeta(pathname, lang)

  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href={`/${lang}/docs`}>{ui.breadcrumbDocs}</BreadcrumbLink>
        </BreadcrumbItem>
        {meta?.section ? (
          <>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden lg:block">
              <span className="truncate text-muted-foreground">{meta.section}</span>
            </BreadcrumbItem>
          </>
        ) : null}
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem className="min-w-0">
          <BreadcrumbPage className="truncate font-normal text-foreground">
            {meta?.title ?? ui.breadcrumbDocs}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
