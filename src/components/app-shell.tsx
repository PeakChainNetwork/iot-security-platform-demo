import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"

function NavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Button asChild variant="ghost" size="sm" className="h-9">
      <Link href={href}>{children}</Link>
    </Button>
  )
}

export function AppShell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "min-h-full flex flex-col bg-gradient-to-b from-background via-background to-muted/30",
        className
      )}
    >
      <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              className="font-heading text-sm font-semibold tracking-tight"
            >
              IoT Security
            </Link>
            <Separator orientation="vertical" className="h-5" />
            <nav className="flex items-center gap-1">
              <NavLink href="/devices">Devices</NavLink>
              <NavLink href="/docs">Docs</NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  )
}

