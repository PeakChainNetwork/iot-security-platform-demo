import type { Metadata } from "next"

import { HowItWorksBody } from "@/features/docs/components/how-it-works-body"
import { getDocsTitle } from "@/features/docs/lib/docs-nav"
import { asLocale } from "@/lib/i18n/config"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  return { title: getDocsTitle(asLocale(lang), "/docs/how-it-works") }
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return (
    <div className="docs-prose space-y-8">
      <HowItWorksBody lang={asLocale(lang)} />
    </div>
  )
}
