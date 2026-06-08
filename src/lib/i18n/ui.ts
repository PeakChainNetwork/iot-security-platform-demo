import { defaultLocale, type Locale } from "@/lib/i18n/config"

/**
 * Chrome / UI strings that live outside page content — sidebar, header,
 * footer pager, breadcrumb, language switcher. Page prose is co-located with
 * each page's body component instead.
 */
export type UiStrings = {
  brand: string
  breadcrumbDocs: string
  breadcrumbProduct: string
  searchPlaceholder: string
  searchTitle: string
  searchDescription: string
  searchEmpty: string
  paginationLabel: string
  previous: string
  next: string
  language: string
  selectLanguage: string
  copy: string
  copied: string
  copyCommand: string
  runThisCommand: string
  forDevelopers: string
}

const ui: Record<Locale, UiStrings> = {
  en: {
    brand: "Documentation",
    breadcrumbDocs: "Documentation",
    breadcrumbProduct: "IoT Security Platform",
    searchPlaceholder: "Search documentation…",
    searchTitle: "Search documentation",
    searchDescription:
      "Fuzzy search across all documentation pages by title or path. Use arrow keys and Enter to open a page.",
    searchEmpty: "No pages found.",
    paginationLabel: "Documentation pagination",
    previous: "Previous",
    next: "Next",
    language: "Language",
    selectLanguage: "Select language",
    copy: "Copy",
    copied: "Copied",
    copyCommand: "Copy command",
    runThisCommand: "Run this command",
    forDevelopers: "For developers",
  },
  de: {
    brand: "Dokumentation",
    breadcrumbDocs: "Dokumentation",
    breadcrumbProduct: "IoT-Sicherheitsplattform",
    searchPlaceholder: "Dokumentation durchsuchen…",
    searchTitle: "Dokumentation durchsuchen",
    searchDescription:
      "Unscharfe Suche über alle Dokumentationsseiten nach Titel oder Pfad. Mit den Pfeiltasten navigieren und mit Enter eine Seite öffnen.",
    searchEmpty: "Keine Seiten gefunden.",
    paginationLabel: "Seitennavigation der Dokumentation",
    previous: "Zurück",
    next: "Weiter",
    language: "Sprache",
    selectLanguage: "Sprache wählen",
    copy: "Kopieren",
    copied: "Kopiert",
    copyCommand: "Befehl kopieren",
    runThisCommand: "Diesen Befehl ausführen",
    forDevelopers: "Für Entwickler",
  },
}

export function getUiStrings(lang: Locale): UiStrings {
  return ui[lang] ?? ui[defaultLocale]
}
