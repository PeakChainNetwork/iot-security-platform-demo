import Link from "next/link"

import { Callout } from "@/components/docs/callout"
import { Diagram } from "@/components/docs/diagram"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle2Icon,
  CircleIcon,
  ArrowRightIcon,
} from "lucide-react"

const phases = [
  {
    phase: "Phase 0",
    title: "Keep simulator for demos",
    desc: "Leave iot-simulator available for rehearsals and training. No production impact.",
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
    desc: "Turning off iot-simulator does not impact real telemetry.",
  },
]

export function IoTMigrationGuideBody() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Migration</Badge>
          <Badge variant="secondary">Overview</Badge>
        </div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          From{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]">
            iot-simulator
          </code>{" "}
          to real machines
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
          Replace the demo data source with live industrial telemetry while
          keeping the rest of the platform unchanged. This guide covers the rollout
          strategy; for protocol-level details see the{" "}
          <Link
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/90"
            href="/docs/guides/iot-integration-technical"
          >
            integration details page
          </Link>.
        </p>
      </div>

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
                <li>Dashboard still receives live updates from the backend.</li>
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
            pipeline that real machines will eventually use.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Diagram
            title="Physical view"
            description="Who talks to whom (in simple terms)."
          >
            <svg width="100%" viewBox="0 0 640 110" role="img" className="text-foreground">
              <title>Current system: physical view</title>
              <desc>Telemetry simulator sends to message hub, which sends to platform backend, which sends to users (dashboard).</desc>
              <defs>
                <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M2 1L8 5L2 9" fill="none" stroke="var(--foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </marker>
              </defs>
              <g><rect x="10" y="28" width="138" height="54" rx="12" fill="var(--chart-2)" opacity="0.16" stroke="var(--chart-2)" strokeWidth="1" /><text fontSize="13" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="79" y="50" textAnchor="middle" dominantBaseline="central">Telemetry Simulator</text><text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="79" y="67" textAnchor="middle" dominantBaseline="central">pretend machines</text></g>
              <line x1="148" y1="55" x2="188" y2="55" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr)" />
              <g><rect x="190" y="28" width="110" height="54" rx="12" fill="var(--chart-5)" opacity="0.14" stroke="var(--chart-5)" strokeWidth="1" /><text fontSize="13" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="245" y="50" textAnchor="middle" dominantBaseline="central">Message Hub</text><text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="245" y="67" textAnchor="middle" dominantBaseline="central">controlled env</text></g>
              <line x1="300" y1="55" x2="342" y2="55" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr)" />
              <g><rect x="344" y="28" width="148" height="54" rx="12" fill="var(--chart-1)" opacity="0.14" stroke="var(--chart-1)" strokeWidth="1" /><text fontSize="13" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="418" y="50" textAnchor="middle" dominantBaseline="central">Platform Backend</text><text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="418" y="67" textAnchor="middle" dominantBaseline="central">ingest · store · stream</text></g>
              <line x1="492" y1="55" x2="534" y2="55" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr)" />
              <g><rect x="536" y="28" width="90" height="54" rx="12" fill="var(--chart-3)" opacity="0.14" stroke="var(--chart-3)" strokeWidth="1" /><text fontSize="13" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="581" y="50" textAnchor="middle" dominantBaseline="central">Dashboard</text><text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="581" y="67" textAnchor="middle" dominantBaseline="central">users</text></g>
            </svg>
          </Diagram>

          <Diagram
            title="Logical view"
            description="What happens to telemetry inside the platform."
          >
            <svg width="100%" viewBox="0 0 640 360" role="img">
              <title>Current system: logical data flow</title>
              <desc>Telemetry is generated, delivered, validated, used to update device state, then optionally stored and pushed live to dashboard.</desc>
              <defs><marker id="arr2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="var(--foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></marker></defs>
              <rect x="200" y="10" width="240" height="48" rx="12" fill="var(--chart-2)" opacity="0.16" stroke="var(--chart-2)" strokeWidth="1" /><text fontSize="13" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="320" y="30" textAnchor="middle" dominantBaseline="central">Telemetry generated</text><text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="320" y="46" textAnchor="middle" dominantBaseline="central">simulated readings</text>
              <line x1="320" y1="58" x2="320" y2="74" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr2)" />
              <rect x="200" y="76" width="240" height="48" rx="12" fill="var(--chart-5)" opacity="0.14" stroke="var(--chart-5)" strokeWidth="1" /><text fontSize="13" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="320" y="96" textAnchor="middle" dominantBaseline="central">Telemetry delivered</text><text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="320" y="112" textAnchor="middle" dominantBaseline="central">to the platform</text>
              <line x1="320" y1="124" x2="320" y2="140" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr2)" />
              <rect x="160" y="142" width="320" height="48" rx="12" fill="var(--chart-1)" opacity="0.12" stroke="var(--chart-1)" strokeWidth="1" /><text fontSize="13" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="320" y="162" textAnchor="middle" dominantBaseline="central">Backend validates &amp; normalises</text><text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="320" y="178" textAnchor="middle" dominantBaseline="central">makes readings consistent</text>
              <line x1="320" y1="190" x2="320" y2="206" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr2)" />
              <rect x="140" y="208" width="360" height="48" rx="12" fill="var(--chart-1)" opacity="0.12" stroke="var(--chart-1)" strokeWidth="1" /><text fontSize="13" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="320" y="228" textAnchor="middle" dominantBaseline="central">Current device state updated</text><text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="320" y="244" textAnchor="middle" dominantBaseline="central">latest reading per machine</text>
              <line x1="220" y1="256" x2="130" y2="256" stroke="var(--border)" strokeWidth="2" /><line x1="130" y1="256" x2="130" y2="290" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr2)" />
              <rect x="50" y="292" width="160" height="48" rx="12" fill="var(--chart-4)" opacity="0.12" stroke="var(--chart-4)" strokeWidth="1" strokeDasharray="4 3" /><text fontSize="13" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="130" y="312" textAnchor="middle" dominantBaseline="central">History stored</text><text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="130" y="328" textAnchor="middle" dominantBaseline="central">optional</text>
              <line x1="420" y1="256" x2="510" y2="256" stroke="var(--border)" strokeWidth="2" /><line x1="510" y1="256" x2="510" y2="290" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr2)" />
              <rect x="430" y="292" width="160" height="48" rx="12" fill="var(--chart-3)" opacity="0.16" stroke="var(--chart-3)" strokeWidth="1" /><text fontSize="13" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="510" y="312" textAnchor="middle" dominantBaseline="central">Live updates pushed</text><text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="510" y="328" textAnchor="middle" dominantBaseline="central">to dashboard</text>
            </svg>
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
          The backend, storage, and dashboard are unchanged. Only the first link in the chain
          — the telemetry source — is swapped.
        </Callout>

        <div className="grid gap-4 lg:grid-cols-2">
          <Diagram title="Physical view" description="New/changed parts highlighted.">
            <svg width="100%" viewBox="0 0 640 130" role="img">
              <title>Target system: physical view</title>
              <desc>Real machines connect to a site gateway which connects to a message hub which connects to platform backend which connects to dashboard.</desc>
              <defs><marker id="arr3" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="var(--foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></marker></defs>
              <g><rect x="6" y="28" width="118" height="64" rx="12" fill="var(--chart-3)" opacity="0.16" stroke="var(--chart-3)" strokeWidth="1" /><text fontSize="13" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="65" y="52" textAnchor="middle" dominantBaseline="central">Real Machines</text><text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="65" y="68" textAnchor="middle" dominantBaseline="central">PLCs · sensors</text><text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="65" y="82" textAnchor="middle" dominantBaseline="central">controllers</text></g>
              <line x1="124" y1="60" x2="142" y2="60" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr3)" />
              <g><rect x="144" y="28" width="120" height="64" rx="12" fill="var(--chart-3)" opacity="0.16" stroke="var(--chart-3)" strokeWidth="1" /><text fontSize="13" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="204" y="48" textAnchor="middle" dominantBaseline="central">Site Gateway</text><text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="204" y="65" textAnchor="middle" dominantBaseline="central">collect + normalise</text><text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="204" y="80" textAnchor="middle" dominantBaseline="central">+ forward</text></g>
              <line x1="264" y1="60" x2="284" y2="60" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr3)" />
              <g><rect x="286" y="34" width="110" height="52" rx="12" fill="var(--chart-5)" opacity="0.14" stroke="var(--chart-5)" strokeWidth="1" /><text fontSize="13" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="341" y="56" textAnchor="middle" dominantBaseline="central">Message Hub</text><text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="341" y="72" textAnchor="middle" dominantBaseline="central">managed</text></g>
              <line x1="396" y1="60" x2="416" y2="60" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr3)" />
              <g><rect x="418" y="34" width="118" height="52" rx="12" fill="var(--chart-1)" opacity="0.14" stroke="var(--chart-1)" strokeWidth="1" /><text fontSize="13" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="477" y="56" textAnchor="middle" dominantBaseline="central">Platform Backend</text><text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="477" y="72" textAnchor="middle" dominantBaseline="central">unchanged</text></g>
              <line x1="536" y1="60" x2="556" y2="60" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr3)" />
              <g><rect x="558" y="34" width="76" height="52" rx="12" fill="var(--chart-2)" opacity="0.14" stroke="var(--chart-2)" strokeWidth="1" /><text fontSize="13" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="596" y="56" textAnchor="middle" dominantBaseline="central">Dashboard</text><text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="596" y="72" textAnchor="middle" dominantBaseline="central">unchanged</text></g>
              <rect x="8" y="106" width="10" height="10" rx="2" fill="var(--chart-3)" opacity="0.16" stroke="var(--chart-3)" strokeWidth="1" /><text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="22" y="116">New / changed</text>
            </svg>
          </Diagram>

          <Diagram title="Logical view" description="Same platform steps; new source at the start.">
            <svg width="100%" viewBox="0 0 640 360" role="img">
              <title>Target system: logical data flow</title>
              <desc>Same logical flow as today — only the first steps change from simulated to real measurements forwarded via a gateway.</desc>
              <defs><marker id="arr4" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="var(--foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></marker></defs>
              <rect x="160" y="10" width="320" height="48" rx="12" fill="var(--chart-3)" opacity="0.16" stroke="var(--chart-3)" strokeWidth="1" /><text fontSize="13" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="320" y="30" textAnchor="middle" dominantBaseline="central">Telemetry measured</text><text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="320" y="46" textAnchor="middle" dominantBaseline="central">real readings from machines</text>
              <line x1="320" y1="58" x2="320" y2="74" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr4)" />
              <rect x="160" y="76" width="320" height="48" rx="12" fill="var(--chart-3)" opacity="0.16" stroke="var(--chart-3)" strokeWidth="1" /><text fontSize="13" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="320" y="96" textAnchor="middle" dominantBaseline="central">Telemetry forwarded</text><text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="320" y="112" textAnchor="middle" dominantBaseline="central">via gateway / connector</text>
              <line x1="320" y1="124" x2="320" y2="140" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr4)" />
              <rect x="160" y="142" width="320" height="48" rx="12" fill="var(--chart-1)" opacity="0.12" stroke="var(--chart-1)" strokeWidth="1" /><text fontSize="13" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="320" y="162" textAnchor="middle" dominantBaseline="central">Backend validates &amp; normalises</text><text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="320" y="178" textAnchor="middle" dominantBaseline="central">unchanged</text>
              <line x1="320" y1="190" x2="320" y2="206" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr4)" />
              <rect x="140" y="208" width="360" height="48" rx="12" fill="var(--chart-1)" opacity="0.12" stroke="var(--chart-1)" strokeWidth="1" /><text fontSize="13" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="320" y="228" textAnchor="middle" dominantBaseline="central">Current device state updated</text><text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="320" y="244" textAnchor="middle" dominantBaseline="central">unchanged</text>
              <line x1="220" y1="256" x2="130" y2="256" stroke="var(--border)" strokeWidth="2" /><line x1="130" y1="256" x2="130" y2="290" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr4)" />
              <rect x="50" y="292" width="160" height="48" rx="12" fill="var(--chart-4)" opacity="0.12" stroke="var(--chart-4)" strokeWidth="1" strokeDasharray="4 3" /><text fontSize="13" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="130" y="312" textAnchor="middle" dominantBaseline="central">History stored</text><text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="130" y="328" textAnchor="middle" dominantBaseline="central">optional</text>
              <line x1="420" y1="256" x2="510" y2="256" stroke="var(--border)" strokeWidth="2" /><line x1="510" y1="256" x2="510" y2="290" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr4)" />
              <rect x="430" y="292" width="160" height="48" rx="12" fill="var(--chart-2)" opacity="0.14" stroke="var(--chart-2)" strokeWidth="1" /><text fontSize="13" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="510" y="312" textAnchor="middle" dominantBaseline="central">Live updates pushed</text><text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="510" y="328" textAnchor="middle" dominantBaseline="central">to dashboard</text>
            </svg>
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
          <svg width="100%" viewBox="0 0 720 200" role="img">
            <title>Migration phases timeline</title>
            <desc>Horizontal timeline showing phases 0 through 4 as overlapping bars. Simulator runs the full length, real machines ramp up as it phases out.</desc>
            {/* Labels column */}
            <text fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="10" y="48" dominantBaseline="central">Simulator</text>
            <text fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="10" y="96" dominantBaseline="central">Real machines</text>
            {/* Time axis */}
            <line x1="120" y1="150" x2="700" y2="150" stroke="var(--border)" strokeWidth="1" />
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="120" y="168" textAnchor="middle">Start</text>
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="700" y="168" textAnchor="end">Done</text>
            <line x1="120" y1="146" x2="120" y2="154" stroke="var(--border)" strokeWidth="1" />
            <line x1="700" y1="146" x2="700" y2="154" stroke="var(--border)" strokeWidth="1" />
            {/* Phase 0 — simulator bar (full length, fades at end) */}
            <rect x="120" y="32" width="480" height="32" rx="8" fill="var(--chart-2)" opacity="0.18" stroke="var(--chart-2)" strokeWidth="1" />
            <rect x="600" y="32" width="100" height="32" rx="8" fill="var(--chart-2)" opacity="0.08" stroke="var(--chart-2)" strokeWidth="1" strokeDasharray="4 3" />
            <text fontSize="10" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="360" y="48" textAnchor="middle" dominantBaseline="central">Phase 0 — simulator active</text>
            <text fontSize="9" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="650" y="48" textAnchor="middle" dominantBaseline="central">retiring</text>
            {/* Phase 1 — pilot (single machine) */}
            <rect x="260" y="80" width="120" height="32" rx="8" fill="var(--chart-3)" opacity="0.18" stroke="var(--chart-3)" strokeWidth="1" />
            <text fontSize="10" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="320" y="96" textAnchor="middle" dominantBaseline="central">Phase 1 — pilot</text>
            {/* Phase 2 — parallel run */}
            <rect x="380" y="80" width="120" height="32" rx="8" fill="var(--chart-3)" opacity="0.24" stroke="var(--chart-3)" strokeWidth="1" />
            <text fontSize="10" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="440" y="96" textAnchor="middle" dominantBaseline="central">Phase 2 — parallel</text>
            {/* Phase 3 — scale out */}
            <rect x="500" y="80" width="120" height="32" rx="8" fill="var(--chart-3)" opacity="0.30" stroke="var(--chart-3)" strokeWidth="1" />
            <text fontSize="10" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="560" y="96" textAnchor="middle" dominantBaseline="central">Phase 3 — scale</text>
            {/* Phase 4 — full production */}
            <rect x="620" y="80" width="80" height="32" rx="8" fill="var(--chart-3)" opacity="0.36" stroke="var(--chart-3)" strokeWidth="1" />
            <text fontSize="10" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="660" y="96" textAnchor="middle" dominantBaseline="central">Phase 4</text>
            {/* Legend */}
            <rect x="120" y="182" width="12" height="12" rx="3" fill="var(--chart-2)" opacity="0.18" stroke="var(--chart-2)" strokeWidth="1" />
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="138" y="192">Simulator</text>
            <rect x="210" y="182" width="12" height="12" rx="3" fill="var(--chart-3)" opacity="0.24" stroke="var(--chart-3)" strokeWidth="1" />
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="228" y="192">Real machines</text>
          </svg>
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
                    <svg width="100%" viewBox="0 0 720 280" role="img">
                      <title>Integration pattern decision tree</title>
                      <desc>Flowchart: How do machines expose data? Branches to direct feed, site gateway, or plant platform connector.</desc>
                      <defs>
                        <marker id="arr-dt" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                          <path d="M2 1L8 5L2 9" fill="none" stroke="var(--foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </marker>
                      </defs>
                      {/* Root question */}
                      <rect x="200" y="12" width="320" height="52" rx="12" fill="var(--chart-1)" opacity="0.14" stroke="var(--chart-1)" strokeWidth="1" />
                      <text fontSize="13" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="360" y="32" textAnchor="middle" dominantBaseline="central">How do machines expose data?</text>
                      <text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="360" y="50" textAnchor="middle" dominantBaseline="central">Pick the path that matches your site</text>
                      {/* Three branches */}
                      <line x1="280" y1="64" x2="120" y2="100" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-dt)" />
                      <line x1="360" y1="64" x2="360" y2="100" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-dt)" />
                      <line x1="440" y1="64" x2="600" y2="100" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-dt)" />
                      {/* Left: native */}
                      <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="180" y="84" textAnchor="middle">Native MQTT / HTTP</text>
                      <rect x="20" y="102" width="200" height="52" rx="12" fill="var(--chart-3)" opacity="0.14" stroke="var(--chart-3)" strokeWidth="1" />
                      <text fontSize="13" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="120" y="122" textAnchor="middle" dominantBaseline="central">Direct feed</text>
                      <text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="120" y="140" textAnchor="middle" dominantBaseline="central">rare — simplest path</text>
                      <line x1="120" y1="154" x2="120" y2="180" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-dt)" />
                      <rect x="10" y="182" width="220" height="80" rx="12" fill="var(--chart-3)" opacity="0.08" stroke="var(--chart-3)" strokeWidth="1" strokeDasharray="4 3" />
                      <text fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="120" y="202" textAnchor="middle" dominantBaseline="central">Machine publishes directly</text>
                      <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="120" y="220" textAnchor="middle" dominantBaseline="central">to factory/&lt;id&gt;/telemetry.</text>
                      <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="120" y="238" textAnchor="middle" dominantBaseline="central">No gateway needed.</text>
                      {/* Center: gateway */}
                      <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="360" y="90" textAnchor="middle">OPC-UA / Modbus / custom</text>
                      <rect x="260" y="102" width="200" height="52" rx="12" fill="var(--chart-3)" opacity="0.14" stroke="var(--chart-3)" strokeWidth="1" />
                      <text fontSize="13" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="360" y="122" textAnchor="middle" dominantBaseline="central">Site gateway</text>
                      <text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="360" y="140" textAnchor="middle" dominantBaseline="central">most common</text>
                      <line x1="360" y1="154" x2="360" y2="180" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-dt)" />
                      <rect x="250" y="182" width="220" height="80" rx="12" fill="var(--chart-5)" opacity="0.08" stroke="var(--chart-5)" strokeWidth="1" strokeDasharray="4 3" />
                      <text fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="360" y="202" textAnchor="middle" dominantBaseline="central">Gateway translates protocols</text>
                      <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="360" y="220" textAnchor="middle" dominantBaseline="central">and normalises units before</text>
                      <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="360" y="238" textAnchor="middle" dominantBaseline="central">publishing to the hub.</text>
                      {/* Right: plant platform */}
                      <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="540" y="84" textAnchor="middle">Historian / SCADA</text>
                      <rect x="500" y="102" width="200" height="52" rx="12" fill="var(--chart-3)" opacity="0.14" stroke="var(--chart-3)" strokeWidth="1" />
                      <text fontSize="13" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="600" y="122" textAnchor="middle" dominantBaseline="central">Platform connector</text>
                      <text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="600" y="140" textAnchor="middle" dominantBaseline="central">enterprise sites</text>
                      <line x1="600" y1="154" x2="600" y2="180" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-dt)" />
                      <rect x="490" y="182" width="220" height="80" rx="12" fill="var(--chart-4)" opacity="0.08" stroke="var(--chart-4)" strokeWidth="1" strokeDasharray="4 3" />
                      <text fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="600" y="202" textAnchor="middle" dominantBaseline="central">Existing platform exports</text>
                      <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="600" y="220" textAnchor="middle" dominantBaseline="central">data via API or file drop.</text>
                      <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="600" y="238" textAnchor="middle" dominantBaseline="central">Adapter bridges to MQTT.</text>
                    </svg>
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
