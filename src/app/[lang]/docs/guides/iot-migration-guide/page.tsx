import type { Metadata } from "next"
import { IoTMigrationGuideBody } from "@/features/docs/components/guides/iot-migration-body"
import { getDocsTitle } from "@/features/docs/lib/docs-nav"
import { asLocale } from "@/lib/i18n/config"
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return { title: getDocsTitle(asLocale(lang), "/docs/guides/iot-migration-guide") }
}
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return (
    <div className="docs-prose space-y-8">
      <IoTMigrationGuideBody lang={asLocale(lang)} />
    </div>
  )
}
