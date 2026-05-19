"use client"

import * as React from "react"
import Link from "next/link"

import { DocsPageHeader } from "@/components/docs/docs-page-header"
import { Callout } from "@/components/docs/callout"
import { Diagram } from "@/components/docs/diagram"
import { HighLevelFlowDiagram } from "@/components/docs/diagrams/high-level-flow-diagram"
import { MessageContractDiagram } from "@/components/docs/diagrams/message-contract-diagram"
import { MqttPipelineDiagram } from "@/components/docs/diagrams/mqtt-pipeline-diagram"
import { TopicStructureDiagram } from "@/components/docs/diagrams/topic-structure-diagram"
import { TroubleshootingTreeDiagram } from "@/components/docs/diagrams/troubleshooting-tree-diagram"
import { Snippet } from "@/components/docs/snippet"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle2Icon,
  TerminalIcon,
  WrenchIcon,
  CableIcon,
} from "lucide-react"

const examplePayload = `{
  "timestamp": "2026-04-07T13:23:26.009702+00:00",
  "temperature": 45.849,
  "pressure": 124.801,
  "vibration": 2.646,
  "power_draw": 3.968,
  "rotational_speed": 980.389,
  "status": "ok"
}`

const pitfalls = [
  {
    title: "Rotating IDs",
    desc: "A new device_id every reboot breaks history and device pages. Use a stable asset identifier.",
  },
  {
    title: "Missing timestamps",
    desc: "Without valid timestamps, ordering and charts become unreliable. Use ISO 8601 UTC.",
  },
  {
    title: "Mixed units",
    desc: "Inconsistent units across machines lead to misleading comparisons and false alerts.",
  },
]

const troubleshooting = [
  {
    problem: "No messages on the hub",
    solution: "Check gateway connection, topic naming, and whether the publisher is running.",
  },
  {
    problem: "Hub has data but UI is empty",
    solution: "Check MQTT broker connectivity and topic naming and the device_id used by the UI.",
  },
  {
    problem: "Intermittent updates",
    solution: "Reduce publish bursts, add buffering, and verify the expected update rate.",
  },
]

export function IoTIntegrationTechnicalBody() {
  return (
    <div className="space-y-10">
      <DocsPageHeader
        eyebrow="Guides"
        title="Using real machines (integration details)"
        badges={["MQTT ingestion", "Payload contract"]}
        icon={CableIcon}
        description={
          <>
            MQTT topic, JSON payload, and ingestion checks for real machines via your site gateway. For
            the rollout strategy, see the{" "}
            <Link
              className="font-medium text-primary underline underline-offset-4 hover:text-primary/90"
              href="/guides/iot-migration-guide"
            >
              migration guide
            </Link>
            .
          </>
        }
      />

      {/* System diagrams */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Diagram title="System view" description="Where real telemetry enters and how it reaches the API.">
          <MqttPipelineDiagram />
        </Diagram>

        <Diagram title="Message contract" description="Topic path and JSON payload shape.">
          <MessageContractDiagram />
        </Diagram>
      </div>

      <Separator />

      {/* High-level flow */}
      <section id="flow" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Architecture
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            High-level flow (what stays the same)
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            Real machines publish telemetry to the message hub. The platform ingests readings and pushes live updates to the dashboard and API.
          </p>
        </div>

        <Diagram
          title="High-level flow diagram"
          description="Real machines → gateway → hub → platform → UI, with optional history storage."
        >
          <HighLevelFlowDiagram />
        </Diagram>

        <Callout variant="default" title="Migration guide">
          If you want the rollout strategy and stakeholder overview, start with{" "}
          <Link className="font-medium text-primary underline underline-offset-4" href="/guides/iot-migration-guide">
            the migration guide
          </Link>.
        </Callout>
      </section>

      <Separator />

      {/* What you must implement */}
      <section id="requirements" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Requirements
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            What you must implement
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex gap-3 rounded-lg border bg-card p-4">
            <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="text-sm text-muted-foreground leading-relaxed">
              Publish telemetry for each machine using a stable{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">device_id</code>.
            </div>
          </div>
          <div className="flex gap-3 rounded-lg border bg-card p-4">
            <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="text-sm text-muted-foreground leading-relaxed">
              Send timestamps and metrics as JSON on the correct topic.
            </div>
          </div>
          <div className="flex gap-3 rounded-lg border bg-card p-4">
            <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="text-sm text-muted-foreground leading-relaxed">
              Maintain a reasonable update rate (e.g., 1–5 Hz for live dashboards).
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* MQTT topic contract */}
      <section id="topic" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            MQTT
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Topic contract
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            The platform listens using a wildcard equivalent to{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">site/+/telemetry</code>.
          </p>
        </div>

        <Diagram
          title="Topic structure breakdown"
          description="Each segment has a fixed role. The platform listens using a wildcard for the middle segment."
        >
          <TopicStructureDiagram />
        </Diagram>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <Snippet
              title="Publish topic"
              value="site/<device_id>/telemetry"
              type="MQTT"
            >
              site/&lt;device_id&gt;/telemetry
            </Snippet>

            <Snippet
              title="Topic examples"
              value={"site/dev-001/telemetry\nsite/press-7/telemetry\nsite/lineA_motor_02/telemetry"}
              type="MQTT"
            >
              {"site/dev-001/telemetry\nsite/press-7/telemetry\nsite/lineA_motor_02/telemetry"}
            </Snippet>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                Device identity rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex gap-3">
                <Badge variant="secondary" className="mt-0.5 shrink-0 text-xs">Stable</Badge>
                <span className="leading-relaxed">
                  A machine&apos;s <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">device_id</code>{" "}
                  must not change over time (even across reboots).
                </span>
              </div>
              <div className="flex gap-3">
                <Badge variant="secondary" className="mt-0.5 shrink-0 text-xs">Unique</Badge>
                <span className="leading-relaxed">
                  One ID per physical asset. No reuse across different machines.
                </span>
              </div>
              <div className="flex gap-3">
                <Badge variant="secondary" className="mt-0.5 shrink-0 text-xs">Safe</Badge>
                <span className="leading-relaxed">
                  Use letters, numbers, dash, and underscore only. Avoid spaces and slashes.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Callout variant="default" title="Parallel pilot">
          During rollout, demo traffic may still use <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">factory/&lt;device_id&gt;/telemetry</code>.
          Your production machines must publish to <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">site/&lt;device_id&gt;/telemetry</code>.
        </Callout>
      </section>

      <Separator />

      {/* Payload contract */}
      <section id="payload" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            JSON
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Payload contract
          </h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Required fields</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="flex gap-3">
                  <code className="mt-0.5 shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-xs">timestamp</code>
                  <span className="leading-relaxed">ISO 8601 recommended (UTC preferred).</span>
                </div>
                <Separator />
                <div className="leading-relaxed">
                  One or more metric keys such as{" "}
                  <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">temperature</code>,{" "}
                  <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">pressure</code>,{" "}
                  <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">vibration</code>,{" "}
                  <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">power_draw</code>,{" "}
                  <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">rotational_speed</code>.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Optional fields</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">status</code>{" "}
                — one of{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ok</code>,{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">warning</code>,{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">critical</code>.
              </CardContent>
            </Card>

            <Callout variant="info" title="Units & normalisation">
              If your site uses different units or names, normalise them in your gateway before publish so the platform receives consistent values across all machines.
            </Callout>
          </div>

          <Snippet title="Example payload" value={examplePayload} type="JSON">
            {examplePayload}
          </Snippet>
        </div>
      </section>

      <Separator />

      {/* Common pitfalls */}
      <section id="pitfalls" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Watch out
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Common pitfalls
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {pitfalls.map((p) => (
            <Callout key={p.title} variant="warning" title={p.title}>
              {p.desc}
            </Callout>
          ))}
        </div>
      </section>

      <Separator />

      <Callout variant="info" title="End-to-end checks">
        Run the ordered checklist on{" "}
        <Link href="/getting-started/verification" className="font-medium text-primary underline underline-offset-4">
          Verification
        </Link>
        {" "}(health, ingestion status, MQTT publish, REST, WebSocket).
      </Callout>

      <Separator />

      {/* Troubleshooting */}
      <section id="troubleshoot" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <WrenchIcon className="size-4 text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Help
            </p>
          </div>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Troubleshooting
          </h2>
        </div>

        <Diagram
          title="Troubleshooting decision tree"
          description="No data on the dashboard? Follow this path to isolate the issue."
        >
          <TroubleshootingTreeDiagram />
        </Diagram>

        <div className="space-y-2">
          {troubleshooting.map((t) => (
            <div key={t.problem} className="flex gap-3 rounded-lg border bg-card p-4">
              <TerminalIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">{t.problem}</div>
                <div className="mt-1 text-sm text-muted-foreground leading-relaxed">{t.solution}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
