import Link from "next/link"

import { Callout } from "@/features/docs/components/callout"
import { FlowDiagram, type FlowNode } from "@/features/docs/components/diagrams/flow-diagram"
import { DocsPageHeader } from "@/features/docs/components/docs-page-header"
import { PlatformSimulator } from "@/features/docs/components/platform-simulator"
import { RiskCalculator } from "@/features/docs/components/risk-calculator"
import { CveMatcher } from "@/features/docs/components/cve-matcher"
import { Separator } from "@/components/ui/separator"
import { CpuIcon, GaugeIcon, LayersIcon, ShieldCheckIcon } from "lucide-react"

const flowNodes: FlowNode[] = [
  { icon: CpuIcon, title: "Your machines", subtitle: "send readings", tile: "bg-chart-3/15 text-chart-3" },
  { icon: ShieldCheckIcon, title: "Peaksoft EU", subtitle: "ingest · score risk · detect", tile: "bg-primary/15 text-primary", emphasized: true },
  { icon: GaugeIcon, title: "Live dashboard", subtitle: "dashboard · alerts · API", tile: "bg-chart-2/15 text-chart-2" },
]

const steps = [
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
]

export function HowItWorksBody() {
  return (
    <div className="space-y-10">
      <DocsPageHeader
        eyebrow="Documentation"
        title="How it works"
        description="Your machines send readings; Peaksoft EU watches them and shows you the live picture. Try it for yourself below."
        icon={LayersIcon}
      />

      <Callout variant="tip" title="In one sentence">
        Think of it as a control room for your equipment — every machine reports in, and Peaksoft EU
        raises a hand the moment something looks off.
      </Callout>

      <div className="rounded-2xl border bg-muted/20 p-5 sm:p-6">
        <div className="mb-5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          From your machines to your dashboard
        </div>
        <FlowDiagram nodes={flowNodes} connectorLabels={["MQTT", "REST / WS"]} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {steps.map((step, i) => (
          <div key={step.title} className="rounded-xl border bg-card p-4">
            <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
              {i + 1}
            </span>
            <div className="mt-2 text-sm font-medium text-foreground">{step.title}</div>
            <div className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.desc}</div>
          </div>
        ))}
      </div>

      <Separator />

      {/* See it in action — interactive sandbox */}
      <section id="see-it-in-action" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <h2 className="font-heading text-xl font-semibold tracking-tight">See it in action</h2>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            A hands-on walkthrough of exactly that loop. Tap <strong>Send a reading</strong> and watch it travel
            from a machine to the dashboard — then flip <strong>Inject fault</strong> to see Peaksoft EU react.
            Nothing here touches a real machine; it&apos;s a safe sandbox.
          </p>
        </div>

        <PlatformSimulator />
      </section>

      <Separator />

      <section id="risk-scoring" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <h2 className="font-heading text-xl font-semibold tracking-tight">How risk is scored</h2>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Each machine gets a single risk score that blends three signals — known vulnerabilities,
            unusual behaviour, and compliance. Drag the sliders to see how the score reacts.
          </p>
        </div>
        <RiskCalculator />

        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          The CVSS input above isn&apos;t guessed — Peaksoft EU matches each machine&apos;s profile to known
          vulnerabilities. Pick a machine to see its matches and how they feed the score:
        </p>
        <CveMatcher />
      </section>

      <p className="text-sm text-muted-foreground">
        Ready to connect your equipment? See{" "}
        <Link href="/docs/connect" className="text-primary underline underline-offset-4">
          connecting your machines
        </Link>
        .
      </p>
    </div>
  )
}
