"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Search, User, HelpCircle } from "lucide-react"

import { APP_NAV_ITEMS, isNavActive } from "@/lib/nav-config"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/common/theme-toggle"

export function WazuhLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = React.useState(true)

  // Determine if it's mobile to initially close the sidebar
  React.useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }, [])

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-wazuh-bg text-foreground font-sans">
      {/* Top Header */}
      <header className="flex h-12 shrink-0 items-center justify-between bg-wazuh-header px-4 text-wazuh-header-foreground z-50">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-wazuh-header-foreground hover:bg-white/20 hover:text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          <Link href="/" className="font-semibold tracking-wide flex items-center gap-2 text-white hover:opacity-90">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-white/20">
              <span className="text-xs font-bold text-white"></span>
            </div>
            IoT Security
          </Link>
        </div>

        <div className="flex-1 max-w-xl mx-4 hidden md:flex items-center"></div>

        <div className="flex items-center gap-2 [&_button]:text-white [&_button:hover]:bg-white/20 [&_button:hover]:text-white">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20 hover:text-white">
            <HelpCircle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20 hover:text-white">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            "flex flex-col bg-wazuh-sidebar text-wazuh-sidebar-foreground border-r border-wazuh-border transition-all duration-300 z-40 relative",
            sidebarOpen ? "w-64" : "w-0 overflow-hidden md:w-[50px] md:overflow-visible"
          )}
        >
          <nav className="flex-1 space-y-1 p-2 overflow-y-auto overflow-x-hidden">
            {APP_NAV_ITEMS.map((item) => {
              const active = isNavActive(pathname, item.href, item.exact)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors whitespace-nowrap",
                    active
                      ? "bg-muted text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <item.icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "")} />
                  <span className={cn("transition-opacity duration-200", !sidebarOpen && "md:opacity-0")}>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="p-2 border-t border-wazuh-border">
            <Link
              href="/docs"
              className={cn(
                "flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors whitespace-nowrap",
                "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
              title={!sidebarOpen ? "Documentation" : undefined}
            >
              <HelpCircle className="h-4 w-4 shrink-0" />
              <span className={cn("transition-opacity duration-200", !sidebarOpen && "md:opacity-0")}>Documentation</span>
            </Link>
          </div>
        </aside>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-wazuh-bg">
          {children}
        </main>
      </div>
    </div>
  )
}
