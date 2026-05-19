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

export function DocsBreadcrumbs() {
  const pathname = usePathname() ?? "/"
  const meta = getDocsPageMeta(pathname)

  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/">Documentation</BreadcrumbLink>
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
            {meta?.title ?? "Documentation"}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
