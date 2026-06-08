import type { Metadata } from "next"
import { MqttIntegrationBody } from "@/features/docs/components/developers/mqtt-integration-body"
import { getDocsTitle } from "@/features/docs/lib/docs-nav"
import { asLocale } from "@/lib/i18n/config"
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return { title: getDocsTitle(asLocale(lang), "/docs/developers/mqtt-integration") }
}
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return (
    <div className="docs-prose space-y-8">
      <MqttIntegrationBody lang={asLocale(lang)} />
    </div>
  )
}
