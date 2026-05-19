import { CpuIcon, LayoutDashboardIcon, type LucideIcon } from "lucide-react"

export type AppNavItem = {
  href: string
  label: string
  icon: LucideIcon
  exact?: boolean
}

export const APP_NAV_ITEMS: readonly AppNavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboardIcon, exact: true },
  { href: "/devices", label: "Devices", icon: CpuIcon },
]

export function isNavActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}
