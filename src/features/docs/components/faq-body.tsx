import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { DocsPageHeader } from "@/features/docs/components/docs-page-header"
import { cn } from "@/lib/utils"
import { KeyRoundIcon, LockIcon, ScanSearchIcon, ServerIcon } from "lucide-react"

const security = [
  {
    icon: LockIcon,
    title: "Encrypted in transit",
    desc: "Machine telemetry travels over TLS (secure WebSockets); the dashboard is served over HTTPS.",
  },
  {
    icon: ServerIcon,
    title: "Runs in your environment",
    desc: "The platform ships as containers you run on your own infrastructure — your data stays with you.",
  },
  {
    icon: KeyRoundIcon,
    title: "Access controlled",
    desc: "Every telemetry source authenticates with its own credentials, and the dashboard requires sign-in.",
  },
  {
    icon: ScanSearchIcon,
    title: "Vulnerability-aware",
    desc: "Known CVEs are tracked and matched to your equipment, so risks surface early.",
  },
]

const faqs = [
  {
    q: "Is my data safe?",
    a: "Yes. Telemetry is sent over an encrypted, authenticated connection, and the platform runs on infrastructure you control — nothing is shipped to a third party.",
  },
  {
    q: "Does it run in the cloud or on-premises?",
    a: "Either. The whole platform is containerised, so you can run it on-premises or in your own cloud account. You decide where it lives.",
  },
  {
    q: "Which machines are supported?",
    a: "Any machine that can send readings can be connected — directly if it speaks MQTT, or through a small site gateway that forwards readings for machines that don't. See the connecting your machines guide.",
  },
  {
    q: "How much effort is it to connect a machine?",
    a: "Minimal. A machine (or gateway) sends a small JSON message every few seconds. Most teams wire up a pilot machine in an afternoon.",
  },
  {
    q: "Will it disrupt my equipment?",
    a: "No. The platform only reads telemetry — it observes and scores risk, it does not control your machines.",
  },
  {
    q: "Can I try it before connecting real machines?",
    a: "Yes. A built-in demo feed lets you explore the full dashboard with simulated machines, and there's an interactive sandbox under How it works.",
  },
  {
    q: "How do I get help?",
    a: "Reach out to your PeakSoft contact, and point your technical team at the developer documentation for connection and API details.",
  },
]

export function FaqBody() {
  return (
    <div className="space-y-10">
      <DocsPageHeader
        eyebrow="Documentation"
        title="FAQ & security"
        icon={LockIcon}
        description="Quick answers to the questions we hear most — and how the platform keeps your data safe."
      />

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold tracking-tight">How your data is protected</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {security.map((s) => {
            const Icon = s.icon
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
        <h2 className="font-heading text-xl font-semibold tracking-tight">Frequently asked questions</h2>
        <Accordion type="single" collapsible defaultValue="faq-0">
          {faqs.map((item, i) => (
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
