import Link from "next/link"

import { DocsPageHeader } from "@/components/docs/docs-page-header"
import { Callout } from "@/components/docs/callout"
import { Diagram } from "@/components/docs/diagram"
import { IntegrationPatternDiagram } from "@/components/docs/diagrams/integration-pattern-diagram"
import { MigrationPhaseTimelineDiagram } from "@/components/docs/diagrams/migration-phase-timeline-diagram"
import { MqttPipelineDiagram } from "@/components/docs/diagrams/mqtt-pipeline-diagram"
import { SimulatorPipelineDiagram } from "@/components/docs/diagrams/simulator-pipeline-diagram"
import { VerticalFlowDiagram } from "@/components/docs/diagrams/vertical-flow-diagram"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle2Icon,
  CircleIcon,
  ArrowRightIcon,
  RadioIcon,
} from "lucide-react"

const LOGICAL_FLOW_STEPS_SIM = [
  { title: "Telemetry generated", subtitle: "simulated readings", chart: 2 as const },
  { title: "Telemetry delivered", subtitle: "to the platform", chart: 5 as const },
  { title: "Platform processes readings", subtitle: "normalise metrics", chart: 1 as const },
  { title: "Device state updated", subtitle: "latest per machine", chart: 1 as const },
]

const LOGICAL_FLOW_STEPS_REAL = [
  { title: "Telemetry measured", subtitle: "real machine readings", chart: 3 as const },
  { title: "Telemetry forwarded", subtitle: "via site gateway", chart: 3 as const },
  { title: "Platform processes readings", subtitle: "unchanged", chart: 1 as const },
  { title: "Device state updated", subtitle: "unchanged", chart: 1 as const },
]

const LOGICAL_FLOW_BRANCHES = [
  {
    fromIndex: 3,
    items: [
      { side: "left" as const, title: "History stored", subtitle: "optional", chart: 4 as const },
      { side: "right" as const, title: "Live updates", subtitle: "WebSocket / UI", chart: 3 as const },
    ],
  },
]

const phases = [
  {
    phase: "Phase 0",
    title: "Keep simulator for demos",
    desc: "Leave demo telemetry available for rehearsals and training. No production impact.",
  },
  {
    phase: "Phase 1",
    title: "Pilot — one machine",
    desc: "Onboard a single machine or line. Validate end-to-end flow before expanding.",
  },
  {
    phase: "Phase 2",
    title: "Parallel run",
    desc: "Real telemetry for pilot machines; simulator fills the rest so the dashboard stays complete.",
  },
  {
    phase: "Phase 3",
    title: "Scale out",
    desc: "Onboard remaining machines in batches. Monitor throughput and error rates at each step.",
  },
  {
    phase: "Phase 4",
    title: "Retire simulator",
    desc: "Disable in production once all real machines are onboarded; keep for test/training environments.",
  },
]

const checklist = [
  {
    title: "Choose the integration pattern",
    desc: "Direct machine feed (rare), site gateway (common), or existing plant data platform.",
  },
  {
    title: "Define the device inventory",
    desc: "List machines, locations, and available measurements. Assign stable machine IDs that won't rotate on reboot.",
  },
  {
    title: "Align on measurement definitions",
    desc: "Confirm units (°C vs °F, PSI vs bar) and sampling rates before any code changes.",
  },
  {
    title: "Run the pilot",
    desc: "Onboard one machine and validate current state updates and live trends on the dashboard.",
  },
  {
    title: "Scale the rollout",
    desc: "Onboard in batches. Keep the simulator available to fill gaps during rollout if helpful.",
  },
  {
    title: "Decommission the simulator (optional)",
    desc: "Disable in production once all real machines are onboarded; keep for test/training if desired.",
  },
]

const successCriteria = [
  {
    title: "Live updates reflect reality",
    desc: "Dashboard shows real machine behaviour within expected delay.",
  },
  {
    title: "Stable device identities",
    desc: "No duplicate or rotating machine IDs over time.",
  },
  {
    title: "Consistent measurements",
    desc: "Units and naming are uniform across all machines.",
  },
  {
    title: "History works as expected",
    desc: "Optional reporting and audit trails behave correctly.",
  },
  {
    title: "Simulator is silent",
    desc: "Turning off demo telemetry does not impact real telemetry.",
  },
]

export function IoTMigrationGuideBody() {
  return (
    <div className="space-y-10">
      <DocsPageHeader
        eyebrow="Guides"
        title="From demo telemetry to real machines"
        badges={["Rollout", "Parallel run"]}
        icon={RadioIcon}
        description={
          <>
            Replace the demo data source with live industrial telemetry while keeping the rest of the
            platform unchanged. For protocol-level details see the{" "}
            <Link
              className="font-medium text-primary underline underline-offset-4 hover:text-primary/90"
              href="/guides/iot-integration-technical"
            >
              integration details page
            </Link>
            .
          </>
        }
      />

      {/* Executive summary */}
      <Card id="summary" className="scroll-mt-24">
        <CardHeader>
          <CardTitle>Executive summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <Callout variant="info" title="Key idea">
            The simulator is only a <span className="font-medium text-foreground">data source</span>.
            Real machines can become the new data source with minimal change to the platform.
          </Callout>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <CheckCircle2Icon className="size-4 text-muted-foreground" />
                What stays the same
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                <li>Backend still ingests, stores (optional), and streams live updates.</li>
                <li>Dashboard still receives live updates from the platform.</li>
                <li>All API endpoints, WebSocket streams, and alerting remain unchanged.</li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <ArrowRightIcon className="size-4 text-muted-foreground" />
                What changes
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                <li>The simulator is turned off (or kept only for demos/testing).</li>
                <li>Real machines (or a site gateway) become the telemetry source.</li>
                <li>Device IDs map to real physical assets instead of simulated ones.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current state */}
      <section id="today" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Current state
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            How the system works today
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            The simulator produces fake machine readings and feeds them through the same
            MQTT topic and payload that real machines will use.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Diagram title="Physical view" description="Who talks to whom (in simple terms).">
            <SimulatorPipelineDiagram />
          </Diagram>

          <Diagram title="Logical view" description="What happens to telemetry inside the platform.">
            <VerticalFlowDiagram steps={LOGICAL_FLOW_STEPS_SIM} branches={LOGICAL_FLOW_BRANCHES} />
          </Diagram>
        </div>
      </section>

      <Separator />

      {/* Target state */}
      <section id="future" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Target state
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            How the system works with real machines
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            Real machines rarely communicate directly with platforms. A{" "}
            <span className="font-medium text-foreground">site gateway</span>{" "}
            (or connector) collects signals and forwards them in a platform-friendly format.
          </p>
        </div>

        <Callout variant="info" title="Key insight">
          The platform, and dashboard are unchanged. Only the first link in the chain
          — the telemetry source — is swapped.
        </Callout>

        <div className="grid gap-4 lg:grid-cols-2">
          <Diagram title="Physical view" description="New/changed parts highlighted.">
            <MqttPipelineDiagram />
          </Diagram>

          <Diagram title="Logical view" description="Same platform steps; new source at the start.">
            <VerticalFlowDiagram steps={LOGICAL_FLOW_STEPS_REAL} branches={LOGICAL_FLOW_BRANCHES} />
          </Diagram>
        </div>
      </section>

      <Separator />

      {/* Migration phases */}
      <section id="phases" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Recommended approach
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Migration phases
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            Keep the platform unchanged and replace only the telemetry source. Roll out at a
            pace that matches site readiness.
          </p>
        </div>

        <Diagram
          title="Phase timeline"
          description="How the phases overlap — simulator runs alongside real machines during the transition."
        >
          <MigrationPhaseTimelineDiagram />
        </Diagram>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {phases.map((p, i) => (
            <div key={p.phase} className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                  {i}
                </span>
                <span className="text-xs font-medium text-muted-foreground">{p.phase}</span>
              </div>
              <div className="mt-2 text-sm font-medium text-foreground">{p.title}</div>
              <div className="mt-1 text-sm text-muted-foreground leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Migration checklist */}
      <section id="checklist" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Step-by-step
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Migration checklist
          </h2>
        </div>

        <div className="space-y-2">
          {checklist.map((item, i) => (
            <div key={item.title}>
              <div className="flex gap-3 rounded-lg border bg-card p-4">
                <div className="flex size-6 shrink-0 items-center justify-center">
                  <CircleIcon className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground">
                    <span className="mr-2 text-xs text-muted-foreground">{i + 1}.</span>
                    {item.title}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.desc}</div>
                </div>
              </div>
              {i === 0 && (
                <div className="mt-3">
                  <Diagram
                    title="Integration pattern decision tree"
                    description="How do your machines expose data? Pick the pattern that fits."
                  >
                    <IntegrationPatternDiagram />
                  </Diagram>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Success criteria */}
      <section id="success" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Done when
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Success criteria
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {successCriteria.map((s) => (
            <div key={s.title} className="flex gap-3 rounded-lg border bg-card p-4">
              <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">{s.title}</div>
                <div className="mt-1 text-sm text-muted-foreground leading-relaxed">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
