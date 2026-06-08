import type { Metadata } from "next"

import { PlatformApiBody } from "@/features/docs/components/guides/platform-api-body"
import { getDocsTitle } from "@/features/docs/lib/docs-nav"
import { asLocale } from "@/lib/i18n/config"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return { title: getDocsTitle(asLocale(lang), "/docs/guides/platform-api") }
}

export default async function PlatformApiGuidePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <PlatformApiBody lang={asLocale(lang)} />
}
