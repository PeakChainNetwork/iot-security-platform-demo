import { getDocsFlatNav, type DocsNavItem } from "@/features/docs/lib/docs-nav"
import type { Locale } from "@/lib/i18n/config"

export type DocsPageMeta = {
  title: string
  description?: string
  section?: string
}

type FlatNavItem = DocsNavItem & { section: string }

export function getDocsPageMeta(pathname: string, lang: Locale): DocsPageMeta | null {
  const flat = getDocsFlatNav(lang)
  const normalized = pathname.replace(/\/+$/, "") || `/${lang}/docs`
  const match = flat.find((item) => {
    const href = item.href.replace(/\/+$/, "")
    return normalized === href || normalized.startsWith(`${href}/`)
  })
  if (!match) return null
  return {
    title: match.title,
    section: match.section,
  }
}

export function getDocsPager(
  pathname: string,
  lang: Locale
): {
  prev: FlatNavItem | null
  next: FlatNavItem | null
} {
  const flat = getDocsFlatNav(lang)
  const normalized = pathname.replace(/\/+$/, "")
  const idx = flat.findIndex((item) => {
    const href = item.href.replace(/\/+$/, "")
    return normalized === href
  })
  if (idx < 0) return { prev: null, next: null }
  return {
    prev: idx > 0 ? flat[idx - 1]! : null,
    next: idx < flat.length - 1 ? flat[idx + 1]! : null,
  }
}
