"use client"

import { usePathname, useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { locales, localeNames, type Locale } from "@/lib/i18n/config"
import { getUiStrings } from "@/lib/i18n/ui"
import { setLocaleCookie } from "@/lib/i18n/set-locale-cookie"
import { useLocale } from "@/lib/i18n/use-locale"

/** Replace the locale segment of a docs pathname, keeping the rest of the path. */
function swapLocale(pathname: string, next: Locale): string {
  const segments = pathname.split("/")
  // segments[0] === "" (leading slash); segments[1] is the locale.
  if (segments.length > 1) {
    segments[1] = next
    return segments.join("/")
  }
  return `/${next}/docs`
}

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname() ?? ""
  const current = useLocale()
  const ui = getUiStrings(current)

  function selectLocale(next: Locale) {
    if (next === current) return
    setLocaleCookie(next)
    router.push(swapLocale(pathname, next))
  }

  return (
    <div
      role="group"
      aria-label={ui.selectLanguage}
      className="grid grid-cols-2 gap-1 rounded-lg bg-sidebar-accent/40 p-1"
    >
      {locales.map((locale) => {
        const active = locale === current
        return (
          <button
            key={locale}
            type="button"
            onClick={() => selectLocale(locale)}
            aria-pressed={active}
            className={cn(
              "truncate rounded-md px-2 py-1.5 text-center text-xs font-medium transition-colors",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {localeNames[locale]}
          </button>
        )
      })}
    </div>
  )
}
