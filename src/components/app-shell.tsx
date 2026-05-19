"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ShieldCheckIcon,
  LayoutDashboardIcon,
  CpuIcon,
  BookOpenIcon,
  MenuIcon,
  ExternalLinkIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const NAV_ITEMS: readonly {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  exact?: boolean
}[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboardIcon, exact: true },
  { href: "/devices", label: "Devices", icon: CpuIcon },
]

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

function NavLink({
  href,
  active,
  icon: Icon,
  children,
  onClick,
}: {
  href: string
  active: boolean
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <Button
      asChild
      variant="ghost"
      size="sm"
      className={cn(
        "h-9 gap-1.5 font-medium transition-colors",
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <Link href={href} onClick={onClick}>
        <Icon className="size-4" />
        {children}
      </Link>
    </Button>
  )
}

function MobileNav({ pathname }: { pathname: string }) {
  const [open, setOpen] = React.useState(false)
  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="Open menu">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShieldCheckIcon className="size-5 text-primary" />
            IoT Security
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(pathname, href, exact)
            return (
              <Link
                key={href}
                href={href}
                onClick={close}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            )
          })}

          <Separator className="my-3" />

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
          >
            <ExternalLinkIcon className="size-4" />
            GitHub
          </a>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

export function AppShell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col",
        className
      )}
    >
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <MobileNav pathname={pathname} />

            <Link
              href="/"
              className="flex items-center gap-2 font-heading text-sm font-semibold tracking-tight transition-opacity hover:opacity-80"
            >
              <ShieldCheckIcon className="size-5 text-primary" />
              <span className="hidden sm:inline">IoT Security</span>
            </Link>

            <div aria-hidden className="hidden h-5 w-px shrink-0 bg-border md:block" />

            <nav className="hidden items-center gap-1 md:flex">
              {NAV_ITEMS.map(({ href, label, icon, exact }) => (
                <NavLink
                  key={href}
                  href={href}
                  icon={icon}
                  active={isActive(pathname, href, exact)}
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-1">
            <NavLink
              href="/docs"
              icon={BookOpenIcon}
              active={isActive(pathname, "/docs")}
            >
              Docs
            </NavLink>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  )
}
