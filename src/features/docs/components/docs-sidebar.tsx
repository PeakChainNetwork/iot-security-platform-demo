"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookMarkedIcon,
  BracesIcon,
  ChevronRightIcon,
  CompassIcon,
  type LucideIcon,
} from "lucide-react"

import { VersionSwitcher } from "@/features/docs/components/version-switcher"
import { docsNav, DOCS_VERSION, DOCS_VERSIONS, getActiveDocsNavHref } from "@/features/docs/lib/docs-nav"
import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const sectionIcons: Record<string, LucideIcon> = {
  Documentation: BookMarkedIcon,
  Guides: CompassIcon,
  Developers: BracesIcon,
}

export function DocsSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname() ?? ""
  const activeHref = React.useMemo(() => getActiveDocsNavHref(pathname), [pathname])
  const activeSectionIndex = React.useMemo(() => {
    if (!activeHref) return 0
    const idx = docsNav.findIndex((s) => s.items.some((item) => item.href === activeHref))
    return idx >= 0 ? idx : 0
  }, [activeHref])

  return (
    <Sidebar {...props} variant="floating">
      <SidebarHeader className="gap-3">
        <div className="px-2">
          <VersionSwitcher versions={DOCS_VERSIONS} defaultVersion={DOCS_VERSION} />
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {docsNav.map((section, i) => {
          const SectionIcon = sectionIcons[section.title] ?? BookMarkedIcon
          return (
            <Collapsible
              key={section.title}
              title={section.title}
              defaultOpen={activeSectionIndex === i}
              className="group/collapsible"
            >
              <SidebarGroup>
                <SidebarGroupLabel
                  asChild
                  className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <CollapsibleTrigger className="flex w-full items-center gap-2">
                    <SectionIcon className="size-4 shrink-0 opacity-70" aria-hidden />
                    <span className="truncate">{section.title}</span>
                    <ChevronRightIcon className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent className="ml-3 border-l border-sidebar-border pl-2 pr-2">
                    <SidebarMenu>
                      {section.items.map((item) => {
                        const isActive = activeHref !== null && item.href === activeHref
                        return (
                          <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                              asChild
                              isActive={isActive}
                              className={cn(
                                "rounded-md transition-colors",
                                isActive &&
                                  "data-active:!bg-sidebar-accent data-active:!text-sidebar-accent-foreground data-active:hover:!bg-sidebar-accent data-active:font-medium"
                              )}
                            >
                              <Link href={item.href}>{item.title}</Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          )
        })}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
