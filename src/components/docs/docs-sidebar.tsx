"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { VersionSwitcher } from "@/components/version-switcher"
import { docsNav, DOCS_VERSION, DOCS_VERSIONS, getActiveDocsNavHref } from "@/lib/docs-nav"
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
import { ChevronRightIcon } from "lucide-react"

export function DocsSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname() ?? ""
  const activeHref = React.useMemo(() => getActiveDocsNavHref(pathname), [pathname])

  return (
    <Sidebar {...props} variant="floating">
      <SidebarHeader className="gap-2 ">
        <div className="px-2">
          <VersionSwitcher versions={DOCS_VERSIONS} defaultVersion={DOCS_VERSION} />
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {docsNav.map((section, i) => (
          <Collapsible
            key={section.title}
            title={section.title}
            defaultOpen={i === 0}
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <CollapsibleTrigger>
                  {section.title}{" "}
                  <ChevronRightIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
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
                              "rounded-md",
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
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
