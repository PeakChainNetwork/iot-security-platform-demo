import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config"

/**
 * Prefix a canonical docs href (`/docs/...`) with a locale.
 *
 * Nav and pager data is authored once with canonical, locale-free hrefs; this
 * helper turns them into the real, locale-prefixed URLs used in `<Link>`.
 */
export function localizedHref(lang: Locale, href: string): string {
  if (href === "/") return `/${lang}`
  return `/${lang}${href}`
}

/**
 * Strip the locale segment off a localized pathname, returning the canonical
 * docs href (e.g. `/de/docs/how-it-works` -> `/docs/how-it-works`).
 */
export function canonicalHref(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean)
  if (segments.length > 0 && isLocale(segments[0])) {
    const rest = segments.slice(1).join("/")
    return rest ? `/${rest}` : "/"
  }
  return pathname
}

/** Read the locale out of a pathname's first segment, defaulting if absent. */
export function localeFromPathname(pathname: string | null | undefined): Locale {
  if (!pathname) return defaultLocale
  const first = pathname.split("/").filter(Boolean)[0]
  return isLocale(first) ? first : defaultLocale
}
