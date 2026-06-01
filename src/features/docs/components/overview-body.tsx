import Link from "next/link"

import { Callout } from "@/features/docs/components/callout"
import { FlowDiagram, type FlowNode } from "@/features/docs/components/diagrams/flow-diagram"
import { DocsPageHeader } from "@/features/docs/components/docs-page-header"
import { cn } from "@/lib/utils"
import {
  ActivityIcon,
  ArrowRightIcon,
  BellRingIcon,
  CpuIcon,
  GaugeIcon,
  RadioTowerIcon,
  ShieldCheckIcon,
} from "lucide-react"

const flowNodes: FlowNode[] = [
  { icon: CpuIcon, title: "Your machines", subtitle: "send readings", tile: "bg-chart-3/15 text-chart-3" },
  { icon: RadioTowerIcon, title: "Site gateway", subtitle: "collect · forward", tile: "bg-chart-4/15 text-chart-4" },
  { icon: ShieldCheckIcon, title: "Peaksoft EU", subtitle: "watch · score risk", tile: "bg-primary/15 text-primary", emphasized: true },
  { icon: GaugeIcon, title: "You see it live", subtitle: "dashboard · alerts", tile: "bg-chart-2/15 text-chart-2" },
]

const benefits = [
  {
    icon: ActivityIcon,
    title: "See everything live",
    desc: "One dashboard showing the real-time state of every connected machine.",
    tile: "bg-chart-2/10 text-chart-2",
  },
  {
    icon: BellRingIcon,
    title: "Catch problems early",
    desc: "Automatic risk scoring and alerts the moment a machine behaves unusually.",
    tile: "bg-chart-4/10 text-chart-4",
  },
  {
    icon: ShieldCheckIcon,
    title: "Stay secure",
    desc: "Known vulnerabilities are tracked and matched to your equipment.",
    tile: "bg-chart-1/10 text-chart-1",
  },
]

const startHere = [
  { eyebrow: "How it works", title: "The flow in one picture — plus a hands-on sandbox to try.", href: "/docs/how-it-works" },
  // Temporarily hidden — re-enable when ready:
  // { eyebrow: "Tour the dashboard", title: "See the live views you get once machines are connected.", href: "/docs/dashboard-tour" },
  { eyebrow: "Run it locally", title: "Bring the whole platform up with one command.", href: "/docs/run-locally" },
  { eyebrow: "Connecting your machines", title: "What we need from you, and what you get back.", href: "/docs/connect" },
]

export function OverviewBody() {
  return (
    <div className="space-y-10">
      <DocsPageHeader
        eyebrow="Documentation"
        title="Overview"
        icon={ShieldCheckIcon}
        description="Keep an eye on your industrial machines. Each one reports in, Peaksoft EU watches for trouble and scores risk in real time, and you see the live picture — so problems surface before they become downtime."
      />

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold tracking-tight">What it does for you</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {benefits.map((b) => {
            const Icon = b.icon
            return (
              <div key={b.title} className="rounded-xl border bg-card p-5">
                <div className={cn("flex size-10 items-center justify-center rounded-lg", b.tile)}>
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
          Peaksoft EU at a glance
        </div>
        <FlowDiagram nodes={flowNodes} connectorLabels={["", "MQTT", "live"]} />
      </div>

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold tracking-tight">Start here</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {startHere.map((card) => (
            <Link key={card.href} href={card.href} className="group no-underline">
              <div className="flex h-full flex-col rounded-xl border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-muted/40">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {card.eyebrow}
                </div>
                <div className="mt-1.5 flex-1 text-sm font-medium text-foreground">{card.title}</div>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Open
                  <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Callout variant="tip" title="For your technical team">
        Developers can explore every endpoint in the{" "}
        <Link href="/docs/api" className="font-medium text-primary underline underline-offset-4">
          API reference
        </Link>
        .
      </Callout>
    </div>
  )
}
