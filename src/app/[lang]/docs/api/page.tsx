import type { Metadata } from "next"
import type { ReactNode } from "react"

import { ApiExplorer } from "@/features/docs/components/api-explorer"
import { asLocale, type Locale } from "@/lib/i18n/config"
import { getDocsTitle } from "@/features/docs/lib/docs-nav"

type ApiPageContent = {
  heading: string
  intro: ReactNode
}

const content: Record<Locale, ApiPageContent> = {
  en: {
    heading: "API Reference",
    intro: (
      <>
        Interactive reference for the IoT Security Platform backend. REST endpoints are loaded from the committed{" "}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">openapi.json</code> snapshot and WebSocket
        streams from{" "}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ws-contracts.json</code>.
        Select an endpoint to view parameters, schemas, and a ready-to-use cURL example.
      </>
    ),
  },
  de: {
    heading: "API-Referenz",
    intro: (
      <>
        Interaktive Referenz für das Backend der IoT Security Platform. REST-Endpunkte werden aus dem committeten{" "}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">openapi.json</code>-Snapshot geladen und
        WebSocket-Streams aus{" "}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ws-contracts.json</code>.
        Wählen Sie einen Endpunkt aus, um Parameter, Schemas und ein einsatzbereites cURL-Beispiel anzuzeigen.
      </>
    ),
  },
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return { title: getDocsTitle(asLocale(lang), "/docs/api") }
}

export default async function DocsApiPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = content[asLocale(lang)]

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            {t.heading}
          </h1>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
          {t.intro}
        </p>
      </div>
      <ApiExplorer />
    </div>
  )
}
