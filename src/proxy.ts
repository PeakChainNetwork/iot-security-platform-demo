import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { locales, defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n/config"

/**
 * Pick the best locale for a request: the `NEXT_LOCALE` cookie wins, otherwise
 * the first supported language from the `Accept-Language` header, otherwise the
 * default. Kept dependency-free (no negotiator) since we only have two locales.
 */
function detectLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value
  if (isLocale(cookie)) return cookie

  const header = request.headers.get("accept-language")
  if (header) {
    const ranked = header
      .split(",")
      .map((part) => {
        const [tag, q] = part.trim().split(";q=")
        return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 }
      })
      .sort((a, b) => b.q - a.q)
    for (const { tag } of ranked) {
      const base = tag.split("-")[0]
      const hit = locales.find((l) => l === base)
      if (hit) return hit
    }
  }

  return defaultLocale
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl

  // Bare locale root (e.g. `/de`) → that locale's docs home.
  if (isLocale(pathname.slice(1)) && !pathname.slice(1).includes("/")) {
    const url = request.nextUrl.clone()
    url.pathname = `/${pathname.slice(1)}/docs`
    return NextResponse.redirect(url)
  }

  // Non-prefixed docs paths (`/docs`, `/docs/...`) → add the detected locale.
  if (pathname === "/docs" || pathname.startsWith("/docs/")) {
    const locale = detectLocale(request)
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}${pathname}`
    const response = NextResponse.redirect(url)
    response.cookies.set(LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 })
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/docs", "/docs/:path*", "/en", "/de"],
}
