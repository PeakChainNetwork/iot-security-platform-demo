import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { DocsPageHeader } from "@/features/docs/components/docs-page-header"
import { cn } from "@/lib/utils"
import type { Locale } from "@/lib/i18n/config"
import { KeyRoundIcon, LockIcon, ScanSearchIcon, ServerIcon } from "lucide-react"

type Content = {
  header: { eyebrow: string; title: string; description: string }
  securityTitle: string
  security: { title: string; desc: string }[]
  faqsTitle: string
  faqs: { q: string; a: string }[]
}

const content: Record<Locale, Content> = {
  en: {
    header: {
      eyebrow: "Documentation",
      title: "FAQ & security",
      description:
        "Quick answers to the questions we hear most, and how Peaksoft EU keeps your data safe.",
    },
    securityTitle: "How your data is protected",
    security: [
      {
        title: "Encrypted in transit",
        desc: "Machine telemetry travels over TLS (secure WebSockets); the dashboard is served over HTTPS.",
      },
      {
        title: "Runs in your environment",
        desc: "Peaksoft EU ships as containers you run on your own infrastructure, your data stays with you.",
      },
      {
        title: "Access controlled",
        desc: "Every telemetry source authenticates with its own credentials, and the dashboard requires sign-in.",
      },
      {
        title: "Vulnerability-aware",
        desc: "Known CVEs are tracked and matched to your equipment, so risks surface early.",
      },
    ],
    faqsTitle: "Frequently asked questions",
    faqs: [
      {
        q: "Is my data safe?",
        a: "Yes. Telemetry is sent over an encrypted, authenticated connection, and Peaksoft EU runs on infrastructure you control, nothing is shipped to a third party.",
      },
      {
        q: "Does it run in the cloud or on-premises?",
        a: "Either. The whole platform is containerised, so you can run it on-premises or in your own cloud account. You decide where it lives.",
      },
      {
        q: "Which machines are supported?",
        a: "Any machine that can send readings can be connected, directly if it speaks MQTT, or through a small site gateway that forwards readings for machines that don't. See the connecting your machines guide.",
      },
      {
        q: "How much effort is it to connect a machine?",
        a: "Minimal. A machine (or gateway) sends a small JSON message every few seconds. Most teams wire up a pilot machine in an afternoon.",
      },
      {
        q: "Will it disrupt my equipment?",
        a: "No. Peaksoft EU only reads telemetry, it observes and scores risk, it does not control your machines.",
      },
      {
        q: "Can I try it before connecting real machines?",
        a: "Yes. A built-in demo feed lets you explore the full dashboard with simulated machines, and there's an interactive sandbox under How it works.",
      },
      {
        q: "How do I get help?",
        a: "Reach out to your PeakSoft contact, and point your technical team at the developer documentation for connection and API details.",
      },
    ],
  },
  de: {
    header: {
      eyebrow: "Dokumentation",
      title: "FAQ & Sicherheit",
      description:
        "Schnelle Antworten auf die häufigsten Fragen, und wie Peaksoft EU Ihre Daten schützt.",
    },
    securityTitle: "Wie Ihre Daten geschützt werden",
    security: [
      {
        title: "Verschlüsselt bei der Übertragung",
        desc: "Maschinen-Telemetrie wird über TLS (sichere WebSockets) übertragen; das Dashboard wird über HTTPS bereitgestellt.",
      },
      {
        title: "Läuft in Ihrer Umgebung",
        desc: "Peaksoft EU wird als Container ausgeliefert, die Sie auf Ihrer eigenen Infrastruktur betreiben, Ihre Daten bleiben bei Ihnen.",
      },
      {
        title: "Zugriffskontrolliert",
        desc: "Jede Telemetriequelle authentifiziert sich mit eigenen Zugangsdaten, und das Dashboard erfordert eine Anmeldung.",
      },
      {
        title: "Schwachstellenbewusst",
        desc: "Bekannte CVEs werden verfolgt und Ihren Anlagen zugeordnet, sodass Risiken früh zutage treten.",
      },
    ],
    faqsTitle: "Häufig gestellte Fragen",
    faqs: [
      {
        q: "Sind meine Daten sicher?",
        a: "Ja. Telemetrie wird über eine verschlüsselte, authentifizierte Verbindung gesendet, und Peaksoft EU läuft auf einer Infrastruktur, die Sie kontrollieren, nichts wird an Dritte weitergegeben.",
      },
      {
        q: "Läuft es in der Cloud oder On-Premises?",
        a: "Beides. Die gesamte Plattform ist containerisiert, sodass Sie sie On-Premises oder in Ihrem eigenen Cloud-Konto betreiben können. Sie entscheiden, wo sie läuft.",
      },
      {
        q: "Welche Maschinen werden unterstützt?",
        a: "Jede Maschine, die Messwerte senden kann, lässt sich anbinden, direkt, wenn sie MQTT spricht, oder über ein kleines Standort-Gateway, das Messwerte für Maschinen weiterleitet, die das nicht können. Siehe die Anleitung Maschinen anbinden.",
      },
      {
        q: "Wie viel Aufwand ist es, eine Maschine anzubinden?",
        a: "Minimal. Eine Maschine (oder ein Gateway) sendet alle paar Sekunden eine kleine JSON-Nachricht. Die meisten Teams binden eine Pilotmaschine an einem Nachmittag an.",
      },
      {
        q: "Wird es meine Anlagen stören?",
        a: "Nein. Peaksoft EU liest nur Telemetrie, es beobachtet und bewertet das Risiko, es steuert Ihre Maschinen nicht.",
      },
      {
        q: "Kann ich es ausprobieren, bevor ich echte Maschinen anbinde?",
        a: "Ja. Ein integrierter Demo-Feed lässt Sie das vollständige Dashboard mit simulierten Maschinen erkunden, und unter So funktioniert es gibt es eine interaktive Sandbox.",
      },
      {
        q: "Wie erhalte ich Hilfe?",
        a: "Wenden Sie sich an Ihren PeakSoft-Ansprechpartner und verweisen Sie Ihr technisches Team für Verbindungs- und API-Details auf die Entwicklerdokumentation.",
      },
    ],
  },
}

export function FaqBody({ lang }: { lang: Locale }) {
  const t = content[lang]

  const securityIcons = [LockIcon, ServerIcon, KeyRoundIcon, ScanSearchIcon]

  return (
    <div className="space-y-10">
      <DocsPageHeader
        eyebrow={t.header.eyebrow}
        title={t.header.title}
        icon={LockIcon}
        description={t.header.description}
      />

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold tracking-tight">{t.securityTitle}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {t.security.map((s, i) => {
            const Icon = securityIcons[i]
            return (
              <div key={s.title} className="flex gap-3 rounded-xl border bg-card p-4">
                <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg bg-chart-1/10 text-chart-1")}>
                  <Icon className="size-4" aria-hidden />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground">{s.title}</div>
                  <div className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{s.desc}</div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold tracking-tight">{t.faqsTitle}</h2>
        <Accordion type="single" collapsible defaultValue="faq-0">
          {t.faqs.map((item, i) => (
            <AccordionItem key={item.q} value={`faq-${i}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">{item.a}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  )
}
