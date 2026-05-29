import Link from "next/link"

import { Callout } from "@/features/docs/components/callout"
import { DocsDetails } from "@/features/docs/components/docs-details"
import { DocsPageHeader } from "@/features/docs/components/docs-page-header"
import { MigrationPhaseExplorer } from "@/features/docs/components/migration-phase-explorer"
import { ArrowRightIcon, CheckCircle2Icon, RadioIcon } from "lucide-react"

const checklist = [
  "Pick how machines connect (usually a site gateway).",
  "List the machines and give each a stable name.",
  "Agree on units (°C vs °F, bar vs PSI) up front.",
  "Pilot one machine, then roll out in batches.",
]

const successCriteria = [
  "The dashboard reflects real machine behaviour.",
  "Machine names are stable — no duplicates or resets.",
  "Units and naming are consistent across the fleet.",
  "Turning off the demo doesn't affect real telemetry.",
]

export function IoTMigrationGuideBody() {
  return (
    <div className="space-y-10">
      <DocsPageHeader
        eyebrow="Guides"
        title="Rolling out to real machines"
        badges={["Rollout"]}
        icon={RadioIcon}
        description="Swap the demo data for your live machines — at a pace that suits you, with no disruption to the rest of the platform."
      />

      <Callout variant="tip" title="The big idea">
        The demo is just a <strong>data source</strong>. When your real machines take over, the platform,
        dashboard, and alerts stay exactly the same — only the source changes.
      </Callout>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <CheckCircle2Icon className="size-4 text-chart-2" />
            What stays the same
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>The dashboard and live updates.</li>
            <li>Risk scoring and alerts.</li>
            <li>Every API and WebSocket endpoint.</li>
          </ul>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <ArrowRightIcon className="size-4 text-chart-4" />
            What changes
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>The demo turns off (or stays for training).</li>
            <li>Real machines become the telemetry source.</li>
            <li>Machine names map to real physical assets.</li>
          </ul>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold tracking-tight">Roll out in phases</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Step through the phases below — watch the fleet switch from demo to live machines while the platform
          keeps running throughout.
        </p>
        <MigrationPhaseExplorer />
      </section>

      <DocsDetails summary="Rollout checklist & success criteria" description="A quick list to plan and confirm the switch.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-sm font-medium text-foreground">Checklist</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {checklist.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">Done when…</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {successCriteria.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </DocsDetails>

      <p className="text-sm text-muted-foreground">
        Connection details live in{" "}
        <Link href="/docs/connect" className="text-primary underline underline-offset-4">
          connecting your machines
        </Link>
        .
      </p>
    </div>
  )
}
