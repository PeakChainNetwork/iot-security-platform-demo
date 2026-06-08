"use client"

import { usePathname } from "next/navigation"

import { localeFromPathname } from "@/lib/i18n/routing"
import type { Locale } from "@/lib/i18n/config"

/** Active locale for client components, derived from the URL's first segment. */
export function useLocale(): Locale {
  const pathname = usePathname()
  return localeFromPathname(pathname)
}
