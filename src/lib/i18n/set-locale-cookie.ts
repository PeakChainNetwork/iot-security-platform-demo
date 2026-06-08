import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/config"

/**
 * Persist the visitor's chosen language so the proxy can honour it on
 * non-prefixed entry URLs (e.g. `/docs`). Client-only — touches `document`.
 */
export function setLocaleCookie(locale: Locale): void {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`
}
