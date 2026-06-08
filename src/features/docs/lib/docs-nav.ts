import { defaultLocale, type Locale } from "@/lib/i18n/config"
import { localizedHref } from "@/lib/i18n/routing"

export type DocsNavItem = {
  title: string
  /** Locale-prefixed href, ready for `<Link>`. */
  href: string
  /** Canonical, locale-free href used for matching and lookups. */
  canonicalHref: string
}

export type DocsNavSection = {
  /** Stable, locale-free section identifier (e.g. for icon lookup). */
  key: string
  title: string
  items: DocsNavItem[]
}

export const DOCS_VERSION = "0.1.0"

/** Doc sets listed in the sidebar version switcher (single source with `DOCS_VERSION`). */
export const DOCS_VERSIONS: string[] = [DOCS_VERSION]

/**
 * Canonical navigation structure — order and (locale-free) hrefs are the single
 * source of truth. Titles are resolved per-locale from the maps below.
 */
type NavSource = {
  section: string
  items: { href: string }[]
}

const navSource: NavSource[] = [
  {
    section: "Documentation",
    items: [
      { href: "/docs" },
      { href: "/docs/how-it-works" },
      // Temporarily hidden — re-enable when ready:
      // { href: "/docs/dashboard-tour" },
      { href: "/docs/run-locally" },
      { href: "/docs/connect" },
      // { href: "/docs/faq" },
    ],
  },
  {
    section: "Guides",
    items: [
      { href: "/docs/guides/iot-migration-guide" },
      { href: "/docs/guides/platform-api" },
    ],
  },
  {
    section: "Developers",
    items: [
      { href: "/docs/developers/mqtt-integration" },
      { href: "/docs/api" },
      { href: "/docs/api/postman" },
    ],
  },
]

/** Section labels per locale. */
const sectionTitles: Record<Locale, Record<string, string>> = {
  en: {
    Documentation: "Documentation",
    Guides: "Guides",
    Developers: "Developers",
  },
  de: {
    Documentation: "Dokumentation",
    Guides: "Anleitungen",
    Developers: "Entwickler",
  },
}

/** Page titles per locale, keyed by canonical href. */
const itemTitles: Record<Locale, Record<string, string>> = {
  en: {
    "/docs": "Overview",
    "/docs/how-it-works": "How it works",
    "/docs/dashboard-tour": "Tour the dashboard",
    "/docs/run-locally": "Run it locally",
    "/docs/connect": "Connecting your machines",
    "/docs/faq": "FAQ & security",
    "/docs/guides/iot-migration-guide": "Rolling out to real machines",
    "/docs/guides/platform-api": "Platform API capabilities",
    "/docs/developers/mqtt-integration": "MQTT integration",
    "/docs/api": "API reference",
    "/docs/api/postman": "Postman collection",
  },
  de: {
    "/docs": "Überblick",
    "/docs/how-it-works": "So funktioniert es",
    "/docs/dashboard-tour": "Rundgang durchs Dashboard",
    "/docs/run-locally": "Lokal ausführen",
    "/docs/connect": "Maschinen anbinden",
    "/docs/faq": "FAQ & Sicherheit",
    "/docs/guides/iot-migration-guide": "Ausrollen auf echte Maschinen",
    "/docs/guides/platform-api": "Funktionen der Plattform-API",
    "/docs/developers/mqtt-integration": "MQTT-Integration",
    "/docs/api": "API-Referenz",
    "/docs/api/postman": "Postman-Collection",
  },
}

function sectionTitle(lang: Locale, key: string): string {
  return sectionTitles[lang][key] ?? sectionTitles[defaultLocale][key] ?? key
}

function itemTitle(lang: Locale, href: string): string {
  return itemTitles[lang][href] ?? itemTitles[defaultLocale][href] ?? href
}

/** Localized page title for a canonical docs href (used for metadata). */
export function getDocsTitle(lang: Locale, canonicalHref: string): string {
  return itemTitle(lang, canonicalHref)
}

/** Build the sidebar navigation with localized titles and locale-prefixed hrefs. */
export function getDocsNav(lang: Locale): DocsNavSection[] {
  return navSource.map((section) => ({
    key: section.section,
    title: sectionTitle(lang, section.section),
    items: section.items.map((item) => ({
      title: itemTitle(lang, item.href),
      href: localizedHref(lang, item.href),
      canonicalHref: item.href,
    })),
  }))
}

/** Flat, ordered nav (localized) for the prev/next pager. */
export function getDocsFlatNav(lang: Locale): Array<DocsNavItem & { section: string }> {
  return getDocsNav(lang).flatMap((s) => s.items.map((item) => ({ ...item, section: s.title })))
}

/** Single best-matching nav href for the current path (longest prefix wins). */
export function getActiveDocsNavHref(pathname: string | null, lang: Locale): string | null {
  if (!pathname) return null
  const normalized = pathname.replace(/\/+$/, "") || "/"
  const items = getDocsNav(lang).flatMap((s) => s.items)
  let best: string | null = null
  let bestLen = -1
  for (const item of items) {
    const h = item.href.replace(/\/+$/, "") || "/"
    const exact = normalized === h
    const nested = normalized.startsWith(`${h}/`)
    if (!exact && !nested) continue
    if (h.length > bestLen) {
      best = item.href
      bestLen = h.length
    }
  }
  return best
}
