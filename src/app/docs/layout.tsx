import type { Metadata } from "next"

import { DocsInsetHeader } from "@/features/docs/components/docs-inset-header"
import { DocsSearchProvider } from "@/features/docs/components/docs-search-provider"
import { DocsSidebar } from "@/features/docs/components/docs-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export const metadata: Metadata = {
  title: {
    default: "Documentation",
    template: "%s · Docs · IoT Security Platform",
  },
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="docs-shell flex h-dvh max-h-dvh min-h-0 w-full flex-col overflow-hidden bg-background">
      <SidebarProvider className="group/sidebar-wrapper flex h-full min-h-0 w-full flex-1 overflow-hidden has-data-[variant=inset]:bg-sidebar">
        <DocsSearchProvider>
          <DocsSidebar />
          <SidebarInset className="min-h-0 overflow-hidden">
            <DocsInsetHeader>
              <SidebarTrigger className="-ml-1 shrink-0" />
              <Separator
                orientation="vertical"
                className="mr-2 shrink-0 data-vertical:h-4 data-vertical:self-auto"
              />
              <Breadcrumb className="min-w-0">
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/docs">Documentation</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem className="min-w-0">
                    <BreadcrumbPage className="truncate font-normal text-muted-foreground">
                      IoT Security Platform
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </DocsInsetHeader>
            <div className="docs-scroll min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
              <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 p-4 lg:max-w-5xl">
                <article className="docs-main min-w-0 font-sans">{children}</article>
              </div>
            </div>
          </SidebarInset>
        </DocsSearchProvider>
      </SidebarProvider>
    </div>
  )
}