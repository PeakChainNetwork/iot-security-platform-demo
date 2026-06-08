import Link from "next/link"

import { Callout } from "@/features/docs/components/callout"
import { DocsDetails } from "@/features/docs/components/docs-details"
import { DocsPageHeader } from "@/features/docs/components/docs-page-header"
import { MigrationPhaseExplorer } from "@/features/docs/components/migration-phase-explorer"
import { ArrowRightIcon, CheckCircle2Icon, RadioIcon } from "lucide-react"
import { localizedHref } from "@/lib/i18n/routing"
import type { Locale } from "@/lib/i18n/config"

type Content = {
  header: { eyebrow: string; title: string; badges: string[]; description: string }
  bigIdea: { title: string; body: React.ReactNode }
  staysSame: { title: string; items: string[] }
  changes: { title: string; items: string[] }
  phases: { title: string; intro: string }
  details: {
    summary: string
    description: string
    checklistLabel: string
    checklist: string[]
    doneLabel: string
    successCriteria: string[]
  }
  footer: (connectHref: string) => React.ReactNode
}

const content: Record<Locale, Content> = {
  en: {
    header: {
      eyebrow: "Guides",
      title: "Rolling out to real machines",
      badges: ["Rollout"],
      description:
        "Swap the demo data for your live machines — at a pace that suits you, with no disruption to the rest of Peaksoft EU.",
    },
    bigIdea: {
      title: "The big idea",
      body: (
        <>
          The demo is just a <strong>data source</strong>. When your real machines take over, Peaksoft EU,
          dashboard, and alerts stay exactly the same — only the source changes.
        </>
      ),
    },
    staysSame: {
      title: "What stays the same",
      items: [
        "The dashboard and live updates.",
        "Risk scoring and alerts.",
        "Every API and WebSocket endpoint.",
      ],
    },
    changes: {
      title: "What changes",
      items: [
        "The demo turns off (or stays for training).",
        "Real machines become the telemetry source.",
        "Machine names map to real physical assets.",
      ],
    },
    phases: {
      title: "Roll out in phases",
      intro:
        "Step through the phases below — watch the fleet switch from demo to live machines while Peaksoft EU keeps running throughout.",
    },
    details: {
      summary: "Rollout checklist & success criteria",
      description: "A quick list to plan and confirm the switch.",
      checklistLabel: "Checklist",
      checklist: [
        "Pick how machines connect (usually a site gateway).",
        "List the machines and give each a stable name.",
        "Agree on units (°C vs °F, bar vs PSI) up front.",
        "Pilot one machine, then roll out in batches.",
      ],
      doneLabel: "Done when…",
      successCriteria: [
        "The dashboard reflects real machine behaviour.",
        "Machine names are stable — no duplicates or resets.",
        "Units and naming are consistent across the fleet.",
        "Turning off the demo doesn't affect real telemetry.",
      ],
    },
    footer: (connectHref) => (
      <>
        Connection details live in{" "}
        <Link href={connectHref} className="text-primary underline underline-offset-4">
          connecting your machines
        </Link>
        .
      </>
    ),
  },
  de: {
    header: {
      eyebrow: "Anleitungen",
      title: "Ausrollen auf echte Maschinen",
      badges: ["Ausrollen"],
      description:
        "Tauschen Sie die Demo-Daten gegen Ihre Live-Maschinen aus — in einem Tempo, das zu Ihnen passt, ohne Störung des übrigen Peaksoft EU.",
    },
    bigIdea: {
      title: "Die Grundidee",
      body: (
        <>
          Die Demo ist nur eine <strong>Datenquelle</strong>. Wenn Ihre echten Maschinen übernehmen, bleiben
          Peaksoft EU, Dashboard und Warnungen genau gleich — nur die Quelle ändert sich.
        </>
      ),
    },
    staysSame: {
      title: "Was gleich bleibt",
      items: [
        "Das Dashboard und die Live-Aktualisierungen.",
        "Risikobewertung und Warnungen.",
        "Jeder API- und WebSocket-Endpunkt.",
      ],
    },
    changes: {
      title: "Was sich ändert",
      items: [
        "Die Demo wird abgeschaltet (oder bleibt für Schulungen).",
        "Echte Maschinen werden zur Telemetrie-Quelle.",
        "Maschinennamen werden echten physischen Anlagen zugeordnet.",
      ],
    },
    phases: {
      title: "In Phasen ausrollen",
      intro:
        "Gehen Sie die Phasen unten durch — beobachten Sie, wie die Flotte von der Demo auf Live-Maschinen umschaltet, während Peaksoft EU durchgehend weiterläuft.",
    },
    details: {
      summary: "Checkliste & Erfolgskriterien für das Ausrollen",
      description: "Eine kurze Liste, um den Umstieg zu planen und zu bestätigen.",
      checklistLabel: "Checkliste",
      checklist: [
        "Wählen Sie, wie Maschinen sich verbinden (meist ein Standort-Gateway).",
        "Listen Sie die Maschinen auf und geben Sie jeder einen stabilen Namen.",
        "Einigen Sie sich vorab auf Einheiten (°C vs. °F, bar vs. PSI).",
        "Starten Sie mit einer Maschine als Pilot, rollen Sie dann in Chargen aus.",
      ],
      doneLabel: "Fertig, wenn …",
      successCriteria: [
        "Das Dashboard spiegelt das echte Maschinenverhalten wider.",
        "Maschinennamen sind stabil — keine Duplikate oder Zurücksetzungen.",
        "Einheiten und Benennung sind über die gesamte Flotte konsistent.",
        "Das Abschalten der Demo beeinflusst die echte Telemetrie nicht.",
      ],
    },
    footer: (connectHref) => (
      <>
        Verbindungsdetails finden Sie unter{" "}
        <Link href={connectHref} className="text-primary underline underline-offset-4">
          Maschinen anbinden
        </Link>
        .
      </>
    ),
  },
}

export function IoTMigrationGuideBody({ lang }: { lang: Locale }) {
  const t = content[lang]
  return (
    <div className="space-y-10">
      <DocsPageHeader
        eyebrow={t.header.eyebrow}
        title={t.header.title}
        badges={t.header.badges}
        icon={RadioIcon}
        description={t.header.description}
      />

      <Callout variant="tip" title={t.bigIdea.title}>
        {t.bigIdea.body}
      </Callout>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <CheckCircle2Icon className="size-4 text-chart-2" />
            {t.staysSame.title}
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {t.staysSame.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <ArrowRightIcon className="size-4 text-chart-4" />
            {t.changes.title}
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {t.changes.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold tracking-tight">{t.phases.title}</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{t.phases.intro}</p>
        <MigrationPhaseExplorer />
      </section>

      <DocsDetails summary={t.details.summary} description={t.details.description}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-sm font-medium text-foreground">{t.details.checklistLabel}</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {t.details.checklist.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">{t.details.doneLabel}</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {t.details.successCriteria.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </DocsDetails>

      <p className="text-sm text-muted-foreground">{t.footer(localizedHref(lang, "/docs/connect"))}</p>
    </div>
  )
}
