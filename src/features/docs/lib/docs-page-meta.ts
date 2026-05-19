import { docsNav } from "@/features/docs/lib/docs-nav"

export type DocsPageMeta = {
  title: string
  description?: string
  section?: string
}

/** Flat nav order for prev/next pager */
export const docsFlatNav = docsNav.flatMap((s) =>
  s.items.map((item) => ({ ...item, section: s.title }))
)

export function getDocsPageMeta(pathname: string): DocsPageMeta | null {
  const normalized = pathname.replace(/\/+$/, "") || "/docs"
  const match = docsFlatNav.find((item) => {
    const href = item.href.replace(/\/+$/, "") || "/docs"
    return normalized === href || normalized.startsWith(`${href}/`)
  })
  if (!match) return null
  return {
    title: match.title,
    section: match.section,
  }
}

export function getDocsPager(pathname: string): {
  prev: (typeof docsFlatNav)[0] | null
  next: (typeof docsFlatNav)[0] | null
} {
  const normalized = pathname.replace(/\/+$/, "") || "/docs"
  const idx = docsFlatNav.findIndex((item) => {
    const href = item.href.replace(/\/+$/, "") || "/docs"
    return normalized === href
  })
  if (idx < 0) return { prev: null, next: null }
  return {
    prev: idx > 0 ? docsFlatNav[idx - 1]! : null,
    next: idx < docsFlatNav.length - 1 ? docsFlatNav[idx + 1]! : null,
  }
}
