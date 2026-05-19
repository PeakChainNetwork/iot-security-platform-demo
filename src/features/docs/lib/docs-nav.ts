export type DocsNavItem = {
  title: string
  href: string
}

export type DocsNavSection = {
  title: string
  items: DocsNavItem[]
}

export const DOCS_VERSION = "0.1.0"

/** Doc sets listed in the sidebar version switcher (single source with `DOCS_VERSION`). */
export const DOCS_VERSIONS: string[] = [DOCS_VERSION]

export const docsNav: DocsNavSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Prerequisites", href: "/docs/getting-started/prerequisites" },
      { title: "Credentials & access", href: "/docs/getting-started/installation" },
      { title: "Verification", href: "/docs/getting-started/verification" },
    ],
  },
  {
    title: "Concepts",
    items: [
      { title: "How it works", href: "/docs/concepts/architecture" },
      { title: "Data flow", href: "/docs/concepts/data-flow" },
    ],
  },
  {
    title: "Guides",
    items: [
      { title: "MQTT integration", href: "/docs/guides/iot-integration-technical" },
      { title: "Migration rollout", href: "/docs/guides/iot-migration-guide" },
      { title: "Platform API capabilities", href: "/docs/guides/platform-api" },
    ],
  },
  {
    title: "API Reference",
    items: [
      { title: "REST & WebSockets", href: "/docs/api" },
      { title: "Postman Collection", href: "/docs/api/postman" },
    ],
  },
]

/** Single best-matching nav href for the current path (longest prefix wins). */
export function getActiveDocsNavHref(pathname: string | null): string | null {
  if (!pathname) return null
  const normalized = pathname.replace(/\/+$/, "") || "/"
  const items = docsNav.flatMap((s) => s.items)
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
