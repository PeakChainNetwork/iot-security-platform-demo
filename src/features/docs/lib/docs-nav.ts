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
    title: "Documentation",
    items: [
      { title: "Overview", href: "/docs" },
      { title: "How it works", href: "/docs/how-it-works" },
      // Temporarily hidden — re-enable when ready:
      // { title: "Tour the dashboard", href: "/docs/dashboard-tour" },
      { title: "Run it locally", href: "/docs/run-locally" },
      { title: "Connecting your machines", href: "/docs/connect" },
      // { title: "FAQ & security", href: "/docs/faq" },
    ],
  },
  {
    title: "Guides",
    items: [
      { title: "Rolling out to real machines", href: "/docs/guides/iot-migration-guide" },
      { title: "Platform API capabilities", href: "/docs/guides/platform-api" },
    ],
  },
  {
    title: "Developers",
    items: [
      { title: "MQTT integration", href: "/docs/developers/mqtt-integration" },
      { title: "API reference", href: "/docs/api" },
      { title: "Postman collection", href: "/docs/api/postman" },
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
