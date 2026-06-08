import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  CpuIcon,
  GaugeIcon,
  LayersIcon,
  PlayCircleIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
} from "lucide-react"

import { Callout } from "@/features/docs/components/callout"
import { FlowDiagram, type FlowNode } from "@/features/docs/components/diagrams/flow-diagram"
import { DocsPageHeader } from "@/features/docs/components/docs-page-header"
import { PlatformSimulator } from "@/features/docs/components/platform-simulator"
import { RiskCalculator } from "@/features/docs/components/risk-calculator"
import { CveMatcher } from "@/features/docs/components/cve-matcher"
import { localizedHref } from "@/lib/i18n/routing"
import type { Locale } from "@/lib/i18n/config"

type Content = {
  header: { eyebrow: string; title: string; description: string }
  callout: { title: string; body: string }
  flowLabel: string
  flowNodes: {
    machines: { title: string; subtitle: string }
    platform: { title: string; subtitle: string }
    dashboard: { title: string; subtitle: string }
  }
  steps: { title: string; desc: string }[]
  seeItInAction: { title: string; desc: React.ReactNode }
  risk: {
    title: string
    desc: string
    signalsLabel: string
    signalsHint: string
    cvssLabel: string
    cvssIntro: string
  }
  ready: (connectHref: string) => React.ReactNode
}

const content: Record<Locale, Content> = {
  en: {
    header: {
      eyebrow: "Documentation",
      title: "How it works",
      description:
        "Your machines send readings; Peaksoft EU watches them and shows you the live picture. Try it for yourself below.",
    },
    callout: {
      title: "In one sentence",
      body: "Think of it as a control room for your equipment — every machine reports in, and Peaksoft EU raises a hand the moment something looks off.",
    },
    flowLabel: "From your machines to your dashboard",
    flowNodes: {
      machines: { title: "Your machines", subtitle: "send readings" },
      platform: { title: "Peaksoft EU", subtitle: "ingest · score risk · detect" },
      dashboard: { title: "Live dashboard", subtitle: "dashboard · alerts · API" },
    },
    steps: [
      {
        title: "Your machines send readings",
        desc: "Each machine reports its measurements — temperature, pressure, and so on — every few seconds.",
      },
      {
        title: "Peaksoft EU watches them",
        desc: "Readings are checked in real time, scored for risk, and matched against known vulnerabilities.",
      },
      {
        title: "You see it all live",
        desc: "A live dashboard shows every machine's state, and alerts fire the moment something looks wrong.",
      },
    ],
    seeItInAction: {
      title: "See it in action",
      desc: (
        <>
          A hands-on walkthrough of exactly that loop. Tap <strong>Send a reading</strong> and watch it travel
          from a machine to the dashboard — then flip <strong>Inject fault</strong> to see Peaksoft EU react.
          Nothing here touches a real machine; it&apos;s a safe sandbox.
        </>
      ),
    },
    risk: {
      title: "How risk is scored",
      desc: "Each machine gets a single risk score that blends three signals — known vulnerabilities, unusual behaviour, and compliance.",
      signalsLabel: "Score = three signals",
      signalsHint: "Drag the sliders to see how the score reacts.",
      cvssLabel: "Where the CVSS comes from",
      cvssIntro:
        "The CVSS input above isn't guessed — Peaksoft EU matches each machine's profile to known vulnerabilities. Pick a machine to see its matches and how they feed the score:",
    },
    ready: (connectHref) => (
      <>
        Ready to connect your equipment? See{" "}
        <Link href={connectHref} className="text-primary underline underline-offset-4">
          connecting your machines
        </Link>
        .
      </>
    ),
  },
  de: {
    header: {
      eyebrow: "Dokumentation",
      title: "So funktioniert es",
      description:
        "Ihre Maschinen senden Messwerte; Peaksoft EU überwacht sie und zeigt Ihnen das Live-Bild. Probieren Sie es unten selbst aus.",
    },
    callout: {
      title: "In einem Satz",
      body: "Stellen Sie es sich wie einen Leitstand für Ihre Anlagen vor — jede Maschine meldet sich, und Peaksoft EU schlägt Alarm, sobald etwas nicht stimmt.",
    },
    flowLabel: "Von Ihren Maschinen bis zu Ihrem Dashboard",
    flowNodes: {
      machines: { title: "Ihre Maschinen", subtitle: "senden Messwerte" },
      platform: { title: "Peaksoft EU", subtitle: "erfassen · Risiko bewerten · erkennen" },
      dashboard: { title: "Live-Dashboard", subtitle: "Dashboard · Warnungen · API" },
    },
    steps: [
      {
        title: "Ihre Maschinen senden Messwerte",
        desc: "Jede Maschine meldet ihre Messwerte — Temperatur, Druck und so weiter — alle paar Sekunden.",
      },
      {
        title: "Peaksoft EU überwacht sie",
        desc: "Die Messwerte werden in Echtzeit geprüft, nach Risiko bewertet und mit bekannten Schwachstellen abgeglichen.",
      },
      {
        title: "Sie sehen alles live",
        desc: "Ein Live-Dashboard zeigt den Zustand jeder Maschine, und Warnungen werden ausgelöst, sobald etwas verdächtig wirkt.",
      },
    ],
    seeItInAction: {
      title: "In Aktion erleben",
      desc: (
        <>
          Eine praktische Durchführung genau dieses Ablaufs. Tippen Sie auf <strong>Messwert senden</strong> und
          sehen Sie zu, wie er von einer Maschine zum Dashboard wandert — schalten Sie dann{" "}
          <strong>Fehler einschleusen</strong> ein, um zu sehen, wie Peaksoft EU reagiert. Nichts davon berührt
          eine echte Maschine; es ist eine sichere Sandbox.
        </>
      ),
    },
    risk: {
      title: "Wie das Risiko bewertet wird",
      desc: "Jede Maschine erhält einen einzigen Risikowert, der drei Signale vereint — bekannte Schwachstellen, ungewöhnliches Verhalten und Compliance.",
      signalsLabel: "Wert = drei Signale",
      signalsHint: "Verschieben Sie die Regler, um zu sehen, wie der Wert reagiert.",
      cvssLabel: "Woher der CVSS-Wert kommt",
      cvssIntro:
        "Der CVSS-Wert oben ist nicht geraten — Peaksoft EU gleicht das Profil jeder Maschine mit bekannten Schwachstellen ab. Wählen Sie eine Maschine, um ihre Treffer zu sehen und wie sie in den Wert einfließen:",
    },
    ready: (connectHref) => (
      <>
        Bereit, Ihre Anlagen anzubinden? Siehe{" "}
        <Link href={connectHref} className="text-primary underline underline-offset-4">
          Maschinen anbinden
        </Link>
        .
      </>
    ),
  },
}

function SectionHeader({
  icon: Icon,
  title,
  tile,
  children,
}: {
  icon: LucideIcon
  title: string
  tile: string
  children?: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${tile}`}>
          <Icon className="size-5" aria-hidden />
        </div>
        <div role="heading" aria-level={2} className="font-heading text-xl font-semibold tracking-tight text-foreground">
          {title}
        </div>
      </div>
      {children ? (
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{children}</p>
      ) : null}
    </div>
  )
}

export function HowItWorksBody({ lang }: { lang: Locale }) {
  const t = content[lang]
  const flowNodes: FlowNode[] = [
    { icon: CpuIcon, title: t.flowNodes.machines.title, subtitle: t.flowNodes.machines.subtitle, tile: "bg-chart-3/15 text-chart-3" },
    { icon: ShieldCheckIcon, title: t.flowNodes.platform.title, subtitle: t.flowNodes.platform.subtitle, tile: "bg-primary/15 text-primary", emphasized: true },
    { icon: GaugeIcon, title: t.flowNodes.dashboard.title, subtitle: t.flowNodes.dashboard.subtitle, tile: "bg-chart-2/15 text-chart-2" },
  ]

  return (
    <div className="space-y-10">
      <DocsPageHeader
        eyebrow={t.header.eyebrow}
        title={t.header.title}
        description={t.header.description}
        icon={LayersIcon}
      />

      <Callout variant="tip" title={t.callout.title}>
        {t.callout.body}
      </Callout>

      <div className="rounded-2xl border bg-muted/20 p-5 sm:p-6">
        <div className="mb-5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t.flowLabel}
        </div>
        <FlowDiagram nodes={flowNodes} connectorLabels={["MQTT", "REST / WS"]} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {t.steps.map((step, i) => (
          <div key={step.title} className="rounded-xl border bg-card p-4">
            <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
              {i + 1}
            </span>
            <div className="mt-2 text-sm font-medium text-foreground">{step.title}</div>
            <div className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.desc}</div>
          </div>
        ))}
      </div>

      {/* See it in action — interactive sandbox */}
      <section id="see-it-in-action" className="scroll-mt-24 space-y-4 rounded-2xl border bg-card/30 p-5 sm:p-6">
        <SectionHeader icon={PlayCircleIcon} title={t.seeItInAction.title} tile="bg-chart-2/15 text-chart-2">
          {t.seeItInAction.desc}
        </SectionHeader>
        <PlatformSimulator lang={lang} />
      </section>

      {/* How risk is scored */}
      <section id="risk-scoring" className="scroll-mt-24 space-y-5 rounded-2xl border bg-card/30 p-5 sm:p-6">
        <SectionHeader icon={ShieldAlertIcon} title={t.risk.title} tile="bg-chart-4/15 text-chart-4">
          {t.risk.desc}
        </SectionHeader>

        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t.risk.signalsLabel}
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{t.risk.signalsHint}</p>
          <RiskCalculator lang={lang} />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t.risk.cvssLabel}
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{t.risk.cvssIntro}</p>
          <CveMatcher lang={lang} />
        </div>
      </section>

      <p className="text-sm text-muted-foreground">{t.ready(localizedHref(lang, "/docs/connect"))}</p>
    </div>
  )
}
