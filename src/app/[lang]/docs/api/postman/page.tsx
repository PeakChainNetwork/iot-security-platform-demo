import type { Metadata } from "next"
import type { ReactNode } from "react"

import { PostmanGuide } from "@/features/docs/components/postman-guide"
import { asLocale, type Locale } from "@/lib/i18n/config"
import { getDocsTitle } from "@/features/docs/lib/docs-nav"

type PostmanPageContent = {
  heading: string
  intro: ReactNode
}

const content: Record<Locale, PostmanPageContent> = {
  en: {
    heading: "Postman Collection",
    intro: (
      <>
        Download two JSON files, import them into Postman, and you get a fully configured workspace with every API
        endpoint, pre-filled request bodies, example responses, and an environment with the{" "}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">base_url</code> variable ready to go.
      </>
    ),
  },
  de: {
    heading: "Postman-Collection",
    intro: (
      <>
        Laden Sie zwei JSON-Dateien herunter, importieren Sie sie in Postman, und Sie erhalten einen vollständig
        konfigurierten Arbeitsbereich mit jedem API-Endpunkt, vorausgefüllten Anfrage-Bodys, Beispielantworten und
        einer Umgebung mit der einsatzbereiten{" "}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">base_url</code>-Variablen.
      </>
    ),
  },
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return { title: getDocsTitle(asLocale(lang), "/docs/api/postman") }
}

export default async function PostmanPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = content[asLocale(lang)]

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          {t.heading}
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
          {t.intro}
        </p>
      </div>
      <PostmanGuide lang={asLocale(lang)} />
    </div>
  )
}
