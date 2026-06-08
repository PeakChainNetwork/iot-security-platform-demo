import Link from "next/link"

import { Callout } from "@/features/docs/components/callout"
import { FlowDiagram, type FlowNode } from "@/features/docs/components/diagrams/flow-diagram"
import { DocsPageHeader } from "@/features/docs/components/docs-page-header"
import { cn } from "@/lib/utils"
import { localizedHref } from "@/lib/i18n/routing"
import type { Locale } from "@/lib/i18n/config"
import {
  ActivityIcon,
  ArrowRightIcon,
  BellRingIcon,
  CpuIcon,
  GaugeIcon,
  RadioTowerIcon,
  ShieldCheckIcon,
} from "lucide-react"

type Content = {
  header: { eyebrow: string; title: string; description: string }
  flowNodes: {
    machines: { title: string; subtitle: string }
    gateway: { title: string; subtitle: string }
    platform: { title: string; subtitle: string }
    dashboard: { title: string; subtitle: string }
  }
  benefitsTitle: string
  benefits: { title: string; desc: string }[]
  glanceLabel: string
  startHereTitle: string
  startHere: { eyebrow: string; title: string; href: string }[]
  open: string
  callout: { title: string; body: (apiHref: string) => React.ReactNode }
}

const content: Record<Locale, Content> = {
  en: {
    header: {
      eyebrow: "Documentation",
      title: "Overview",
      description:
        "Keep an eye on your industrial machines. Each one reports in, Peaksoft EU watches for trouble and scores risk in real time, and you see the live picture — so problems surface before they become downtime.",
    },
    flowNodes: {
      machines: { title: "Your machines", subtitle: "send readings" },
      gateway: { title: "Site gateway", subtitle: "collect · forward" },
      platform: { title: "Peaksoft EU", subtitle: "watch · score risk" },
      dashboard: { title: "You see it live", subtitle: "dashboard · alerts" },
    },
    benefitsTitle: "What it does for you",
    benefits: [
      {
        title: "See everything live",
        desc: "One dashboard showing the real-time state of every connected machine.",
      },
      {
        title: "Catch problems early",
        desc: "Automatic risk scoring and alerts the moment a machine behaves unusually.",
      },
      {
        title: "Stay secure",
        desc: "Known vulnerabilities are tracked and matched to your equipment.",
      },
    ],
    glanceLabel: "Peaksoft EU at a glance",
    startHereTitle: "Start here",
    startHere: [
      { eyebrow: "How it works", title: "The flow in one picture — plus a hands-on sandbox to try.", href: "/docs/how-it-works" },
      // Temporarily hidden — re-enable when ready:
      // { eyebrow: "Tour the dashboard", title: "See the live views you get once machines are connected.", href: "/docs/dashboard-tour" },
      { eyebrow: "Run it locally", title: "Bring the whole platform up with one command.", href: "/docs/run-locally" },
      { eyebrow: "Connecting your machines", title: "What we need from you, and what you get back.", href: "/docs/connect" },
    ],
    open: "Open",
    callout: {
      title: "For your technical team",
      body: (apiHref) => (
        <>
          Developers can explore every endpoint in the{" "}
          <Link href={apiHref} className="font-medium text-primary underline underline-offset-4">
            API reference
          </Link>
          .
        </>
      ),
    },
  },
  de: {
    header: {
      eyebrow: "Dokumentation",
      title: "Überblick",
      description:
        "Behalten Sie Ihre Industriemaschinen im Blick. Jede meldet sich, Peaksoft EU achtet auf Probleme und bewertet das Risiko in Echtzeit, und Sie sehen das Live-Bild — so treten Probleme zutage, bevor sie zu Ausfallzeiten werden.",
    },
    flowNodes: {
      machines: { title: "Ihre Maschinen", subtitle: "senden Messwerte" },
      gateway: { title: "Standort-Gateway", subtitle: "sammeln · weiterleiten" },
      platform: { title: "Peaksoft EU", subtitle: "überwachen · Risiko bewerten" },
      dashboard: { title: "Sie sehen es live", subtitle: "Dashboard · Warnungen" },
    },
    benefitsTitle: "Was es für Sie leistet",
    benefits: [
      {
        title: "Alles live sehen",
        desc: "Ein Dashboard, das den Echtzeitzustand jeder angebundenen Maschine zeigt.",
      },
      {
        title: "Probleme früh erkennen",
        desc: "Automatische Risikobewertung und Warnungen, sobald sich eine Maschine ungewöhnlich verhält.",
      },
      {
        title: "Sicher bleiben",
        desc: "Bekannte Schwachstellen werden verfolgt und Ihren Anlagen zugeordnet.",
      },
    ],
    glanceLabel: "Peaksoft EU auf einen Blick",
    startHereTitle: "Hier starten",
    startHere: [
      { eyebrow: "So funktioniert es", title: "Der Ablauf in einem Bild — plus eine praktische Sandbox zum Ausprobieren.", href: "/docs/how-it-works" },
      // Temporarily hidden — re-enable when ready:
      // { eyebrow: "Rundgang durchs Dashboard", title: "Sehen Sie die Live-Ansichten, die Sie erhalten, sobald Maschinen angebunden sind.", href: "/docs/dashboard-tour" },
      { eyebrow: "Lokal ausführen", title: "Bringen Sie die gesamte Plattform mit einem Befehl zum Laufen.", href: "/docs/run-locally" },
      { eyebrow: "Maschinen anbinden", title: "Was wir von Ihnen benötigen und was Sie zurückbekommen.", href: "/docs/connect" },
    ],
    open: "Öffnen",
    callout: {
      title: "Für Ihr technisches Team",
      body: (apiHref) => (
        <>
          Entwickler können jeden Endpunkt in der{" "}
          <Link href={apiHref} className="font-medium text-primary underline underline-offset-4">
            API-Referenz
          </Link>{" "}
          erkunden.
        </>
      ),
    },
  },
}

export function OverviewBody({ lang }: { lang: Locale }) {
  const t = content[lang]

  const flowNodes: FlowNode[] = [
    { icon: CpuIcon, title: t.flowNodes.machines.title, subtitle: t.flowNodes.machines.subtitle, tile: "bg-chart-3/15 text-chart-3" },
    { icon: RadioTowerIcon, title: t.flowNodes.gateway.title, subtitle: t.flowNodes.gateway.subtitle, tile: "bg-chart-4/15 text-chart-4" },
    { icon: ShieldCheckIcon, title: t.flowNodes.platform.title, subtitle: t.flowNodes.platform.subtitle, tile: "bg-primary/15 text-primary", emphasized: true },
    { icon: GaugeIcon, title: t.flowNodes.dashboard.title, subtitle: t.flowNodes.dashboard.subtitle, tile: "bg-chart-2/15 text-chart-2" },
  ]

  const benefitIcons = [ActivityIcon, BellRingIcon, ShieldCheckIcon]
  const benefitTiles = ["bg-chart-2/10 text-chart-2", "bg-chart-4/10 text-chart-4", "bg-chart-1/10 text-chart-1"]

  return (
    <div className="space-y-10">
      <DocsPageHeader
        eyebrow={t.header.eyebrow}
        title={t.header.title}
        icon={ShieldCheckIcon}
        description={t.header.description}
      />

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold tracking-tight">{t.benefitsTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {t.benefits.map((b, i) => {
            const Icon = benefitIcons[i]
            return (
              <div key={b.title} className="rounded-xl border bg-card p-5">
                <div className={cn("flex size-10 items-center justify-center rounded-lg", benefitTiles[i])}>
                  <Icon className="size-5" aria-hidden />
                </div>
                <div className="mt-4 text-sm font-semibold text-foreground">{b.title}</div>
                <div className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{b.desc}</div>
              </div>
            )
          })}
        </div>
      </section>

      <div className="rounded-2xl border bg-muted/20 p-5 sm:p-6">
        <div className="mb-5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t.glanceLabel}
        </div>
        <FlowDiagram nodes={flowNodes} connectorLabels={["", "MQTT", "live"]} />
      </div>

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold tracking-tight">{t.startHereTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {t.startHere.map((card) => (
            <Link key={card.href} href={localizedHref(lang, card.href)} className="group no-underline">
              <div className="flex h-full flex-col rounded-xl border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-muted/40">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {card.eyebrow}
                </div>
                <div className="mt-1.5 flex-1 text-sm font-medium text-foreground">{card.title}</div>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  {t.open}
                  <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Callout variant="tip" title={t.callout.title}>
        {t.callout.body(localizedHref(lang, "/docs/api"))}
      </Callout>
    </div>
  )
}
