import type { Metadata } from "next"

import { RunLocallyBody } from "@/features/docs/components/run-locally-body"
import { getDocsTitle } from "@/features/docs/lib/docs-nav"
import { asLocale } from "@/lib/i18n/config"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return { title: getDocsTitle(asLocale(lang), "/docs/run-locally") }
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return (
    <div className="docs-prose space-y-8">
      <RunLocallyBody lang={asLocale(lang)} />
    </div>
  )
}
