import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n/config"

/**
 * Pick the locale for a request: an explicit `NEXT_LOCALE` cookie (set by the
 * language switcher) wins, otherwise everyone lands on the default locale
 * (German). Browser `Accept-Language` is intentionally NOT used, so German is
 * the consistent first impression; visitors who switch to English have their
 * choice remembered via the cookie.
 */
function detectLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value
  if (isLocale(cookie)) return cookie
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
  // The proxy only READS the cookie; it never writes one, so the default locale
  // is never made "sticky". Only an explicit choice in the language switcher
  // persists a cookie.
  if (pathname === "/docs" || pathname.startsWith("/docs/")) {
    const locale = detectLocale(request)
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/docs", "/docs/:path*", "/en", "/de"],
}
