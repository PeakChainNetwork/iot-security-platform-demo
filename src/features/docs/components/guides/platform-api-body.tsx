import Link from "next/link"

import { FlowDiagram, type FlowNode } from "@/features/docs/components/diagrams/flow-diagram"
import { CapabilityExplorer } from "@/features/docs/components/capability-explorer"
import { DocsPageHeader } from "@/features/docs/components/docs-page-header"
import { BracesIcon, LayoutDashboardIcon, ShieldCheckIcon } from "lucide-react"
import { localizedHref } from "@/lib/i18n/routing"
import type { Locale } from "@/lib/i18n/config"

type Content = {
  header: { eyebrow: string; title: string; description: string }
  flowNodes: {
    platform: { title: string; subtitle: string }
    api: { title: string; subtitle: string }
    apps: { title: string; subtitle: string }
  }
  readPathsLabel: string
  connectorLabels: [string, string]
  footer: (apiHref: string, postmanHref: string) => React.ReactNode
}

const content: Record<Locale, Content> = {
  en: {
    header: {
      eyebrow: "Guides",
      title: "What you can read back",
      description:
        "Once telemetry is flowing, Peaksoft EU exposes it through simple REST and live WebSocket endpoints. Tap a capability to see what you get back.",
    },
    flowNodes: {
      platform: { title: "Peaksoft EU", subtitle: "processed state" },
      api: { title: "REST / WebSocket", subtitle: "endpoints & streams" },
      apps: { title: "Your apps", subtitle: "dashboard · integrations" },
    },
    readPathsLabel: "Read paths after ingest",
    connectorLabels: ["read", "deliver"],
    footer: (apiHref, postmanHref) => (
      <>
        Full schemas, parameters, and try-it requests are in the{" "}
        <Link href={apiHref} className="text-primary underline underline-offset-4">
          API reference
        </Link>
        , or import the{" "}
        <Link href={postmanHref} className="text-primary underline underline-offset-4">
          Postman collection
        </Link>
        .
      </>
    ),
  },
  de: {
    header: {
      eyebrow: "Anleitungen",
      title: "Was Sie auslesen können",
      description:
        "Sobald Telemetrie fließt, stellt Peaksoft EU sie über einfache REST- und Live-WebSocket-Endpunkte bereit. Tippen Sie auf eine Funktion, um zu sehen, was Sie zurückerhalten.",
    },
    flowNodes: {
      platform: { title: "Peaksoft EU", subtitle: "verarbeiteter Zustand" },
      api: { title: "REST / WebSocket", subtitle: "Endpunkte & Streams" },
      apps: { title: "Ihre Apps", subtitle: "Dashboard · Integrationen" },
    },
    readPathsLabel: "Lesepfade nach dem Erfassen",
    connectorLabels: ["lesen", "liefern"],
    footer: (apiHref, postmanHref) => (
      <>
        Vollständige Schemas, Parameter und Try-it-Anfragen finden Sie in der{" "}
        <Link href={apiHref} className="text-primary underline underline-offset-4">
          API-Referenz
        </Link>
        , oder importieren Sie die{" "}
        <Link href={postmanHref} className="text-primary underline underline-offset-4">
          Postman-Collection
        </Link>
        .
      </>
    ),
  },
}

export function PlatformApiBody({ lang }: { lang: Locale }) {
  const t = content[lang]
  const flowNodes: FlowNode[] = [
    { icon: ShieldCheckIcon, title: t.flowNodes.platform.title, subtitle: t.flowNodes.platform.subtitle, tile: "bg-primary/15 text-primary", emphasized: true },
    { icon: BracesIcon, title: t.flowNodes.api.title, subtitle: t.flowNodes.api.subtitle, tile: "bg-chart-1/15 text-chart-1" },
    { icon: LayoutDashboardIcon, title: t.flowNodes.apps.title, subtitle: t.flowNodes.apps.subtitle, tile: "bg-chart-2/15 text-chart-2" },
  ]

  return (
    <div className="space-y-10">
      <DocsPageHeader
        eyebrow={t.header.eyebrow}
        title={t.header.title}
        icon={BracesIcon}
        description={t.header.description}
      />

      <div className="rounded-2xl border bg-muted/20 p-5 sm:p-6">
        <div className="mb-5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t.readPathsLabel}
        </div>
        <FlowDiagram nodes={flowNodes} connectorLabels={t.connectorLabels} />
      </div>

      <CapabilityExplorer />

      <p className="text-sm text-muted-foreground">
        {t.footer(localizedHref(lang, "/docs/api"), localizedHref(lang, "/docs/api/postman"))}
      </p>
    </div>
  )
}
