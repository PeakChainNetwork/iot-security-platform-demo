/**
 * Locale configuration for the docs site.
 *
 * The docs route tree lives under `app/[lang]/docs/**`, so every docs URL is
 * prefixed with a locale (`/en/docs/...`, `/de/docs/...`). This file is the
 * single source of truth for which locales exist and is safe to import from
 * both server and client components.
 */

export const locales = ["en", "de"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

/** Narrow an arbitrary string to a supported `Locale`. */
export function isLocale(value: string | undefined | null): value is Locale {
  return value != null && (locales as readonly string[]).includes(value)
}

/** Coerce any value to a valid locale, falling back to the default. */
export function asLocale(value: string | undefined | null): Locale {
  return isLocale(value) ? value : defaultLocale
}

/** Full language names, shown in the language switcher menu. */
export const localeNames: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
}

/** Short codes, shown on the switcher trigger. */
export const localeShort: Record<Locale, string> = {
  en: "EN",
  de: "DE",
}

/** Cookie that remembers the visitor's last chosen language. */
export const LOCALE_COOKIE = "NEXT_LOCALE"
