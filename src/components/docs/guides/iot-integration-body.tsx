"use client"

import * as React from "react"
import Link from "next/link"

import { Callout } from "@/components/docs/callout"
import { Diagram } from "@/components/docs/diagram"
import { Snippet } from "@/components/docs/snippet"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle2Icon,
  TerminalIcon,
  WrenchIcon,
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
    solution: "Check backend connectivity to the hub and the device_id used by the UI.",
  },
  {
    problem: "Intermittent updates",
    solution: "Reduce publish bursts, add buffering, and verify the expected update rate.",
  },
]

export function IoTIntegrationTechnicalBody() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Integration</Badge>
          <Badge variant="secondary">MQTT ingestion</Badge>
          <Badge variant="secondary">Payload contract</Badge>
        </div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Using real machines (integration details)
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
          This page defines the minimum integration contract required to replace{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">iot-simulator</code>{" "}
          with real machines (or a site gateway) while keeping the backend and dashboard unchanged.
          For the rollout strategy, see the{" "}
          <Link
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/90"
            href="/docs/guides/iot-migration-guide"
          >
            migration guide
          </Link>.
        </p>
      </div>

      {/* System diagrams */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Diagram
          title="System view"
          description="Where real telemetry enters, and how it reaches the dashboard."
        >
          <svg width="100%" viewBox="0 0 640 130" role="img">
            <title>Integration system view</title>
            <desc>Real machines flow through a gateway to the message hub, then to backend and dashboard.</desc>
            <defs><marker id="arr-int-1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="var(--foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></marker></defs>
            <g><rect x="8" y="28" width="124" height="64" rx="12" fill="var(--chart-3)" opacity="0.16" stroke="var(--chart-3)" strokeWidth="1" /><text fontSize="13" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="70" y="52" textAnchor="middle" dominantBaseline="central">Real machines</text><text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="70" y="70" textAnchor="middle" dominantBaseline="central">sensors · PLCs</text></g>
            <line x1="132" y1="60" x2="154" y2="60" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-int-1)" />
            <g><rect x="156" y="28" width="130" height="64" rx="12" fill="var(--chart-4)" opacity="0.14" stroke="var(--chart-4)" strokeWidth="1" /><text fontSize="13" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="221" y="50" textAnchor="middle" dominantBaseline="central">Site gateway</text><text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="221" y="70" textAnchor="middle" dominantBaseline="central">collect · map · forward</text></g>
            <line x1="286" y1="60" x2="308" y2="60" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-int-1)" />
            <g><rect x="310" y="34" width="112" height="52" rx="12" fill="var(--chart-5)" opacity="0.14" stroke="var(--chart-5)" strokeWidth="1" /><text fontSize="13" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="366" y="56" textAnchor="middle" dominantBaseline="central">Message hub</text><text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="366" y="72" textAnchor="middle" dominantBaseline="central">telemetry relay</text></g>
            <line x1="422" y1="60" x2="444" y2="60" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-int-1)" />
            <g><rect x="446" y="34" width="124" height="52" rx="12" fill="var(--chart-1)" opacity="0.12" stroke="var(--chart-1)" strokeWidth="1" /><text fontSize="13" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="508" y="56" textAnchor="middle" dominantBaseline="central">Backend</text><text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="508" y="72" textAnchor="middle" dominantBaseline="central">ingest · stream</text></g>
            <line x1="570" y1="60" x2="592" y2="60" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-int-1)" />
            <g><rect x="594" y="34" width="38" height="52" rx="12" fill="var(--chart-2)" opacity="0.14" stroke="var(--chart-2)" strokeWidth="1" /><text fontSize="12" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="613" y="56" textAnchor="middle" dominantBaseline="central">UI</text><text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="613" y="72" textAnchor="middle" dominantBaseline="central">dash</text></g>
          </svg>
        </Diagram>

        <Diagram
          title="Message contract"
          description="What the backend expects for topic naming and payload shape."
        >
          <svg width="100%" viewBox="0 0 640 220" role="img">
            <title>Integration message contract</title>
            <desc>A topic box shows the expected path, and a payload box shows required and optional fields.</desc>
            <g><rect x="18" y="18" width="604" height="74" rx="14" fill="var(--chart-3)" opacity="0.14" stroke="var(--chart-3)" strokeWidth="1" /><text x="42" y="44" fontSize="12" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)">Topic</text><text x="42" y="68" fontSize="13" fontWeight="600" fontFamily="var(--font-mono)" fill="var(--foreground)">factory/&lt;device_id&gt;/telemetry</text></g>
            <g><rect x="18" y="108" width="604" height="94" rx="14" fill="var(--chart-1)" opacity="0.12" stroke="var(--chart-1)" strokeWidth="1" /><text x="42" y="132" fontSize="12" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)">Payload (JSON)</text><text x="42" y="156" fontSize="12" fontFamily="var(--font-sans)" fill="var(--muted-foreground)">Required: timestamp + one or more metrics (temperature, pressure, vibration, ...)</text><text x="42" y="178" fontSize="12" fontFamily="var(--font-sans)" fill="var(--muted-foreground)">Optional: status (&apos;ok&apos;, &apos;warning&apos;, …)</text></g>
          </svg>
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
            Real machines publish telemetry to the message hub. The platform backend subscribes,
            validates/normalises, optionally stores, then pushes live updates to the dashboard.
          </p>
        </div>

        <Diagram
          title="High-level flow diagram"
          description="Real machines → gateway → hub → backend → UI, with optional history storage."
        >
          <svg width="100%" viewBox="0 0 760 190" role="img">
            <title>High-level flow diagram</title>
            <desc>Real machines connect through a site gateway to a message hub, then the backend streams to UI and optionally stores history.</desc>
            <defs><marker id="arr-flow-1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="var(--foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></marker></defs>
            <g><rect x="18" y="24" width="150" height="56" rx="14" fill="var(--chart-3)" opacity="0.16" stroke="var(--chart-3)" strokeWidth="1" /><text x="93" y="47" fontSize="13" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" textAnchor="middle" dominantBaseline="central">Real machines</text><text x="93" y="66" fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" textAnchor="middle" dominantBaseline="central">measurements</text></g>
            <line x1="168" y1="52" x2="210" y2="52" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-flow-1)" />
            <g><rect x="212" y="24" width="160" height="56" rx="14" fill="var(--chart-4)" opacity="0.14" stroke="var(--chart-4)" strokeWidth="1" /><text x="292" y="47" fontSize="13" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" textAnchor="middle" dominantBaseline="central">Site gateway</text><text x="292" y="66" fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" textAnchor="middle" dominantBaseline="central">map · forward</text></g>
            <line x1="372" y1="52" x2="414" y2="52" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-flow-1)" />
            <g><rect x="416" y="28" width="150" height="48" rx="14" fill="var(--chart-5)" opacity="0.14" stroke="var(--chart-5)" strokeWidth="1" /><text x="491" y="52" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" textAnchor="middle" dominantBaseline="central">Message hub</text></g>
            <line x1="566" y1="52" x2="608" y2="52" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-flow-1)" />
            <g><rect x="610" y="28" width="132" height="48" rx="14" fill="var(--chart-1)" opacity="0.12" stroke="var(--chart-1)" strokeWidth="1" /><text x="676" y="52" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" textAnchor="middle" dominantBaseline="central">Backend</text></g>
            <line x1="676" y1="76" x2="676" y2="110" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-flow-1)" />
            <g><rect x="596" y="112" width="160" height="54" rx="14" fill="var(--chart-2)" opacity="0.14" stroke="var(--chart-2)" strokeWidth="1" /><text x="676" y="136" fontSize="13" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" textAnchor="middle" dominantBaseline="central">Dashboard (UI)</text><text x="676" y="154" fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" textAnchor="middle" dominantBaseline="central">live updates</text></g>
            <line x1="676" y1="76" x2="494" y2="134" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-flow-1)" />
            <g><rect x="340" y="112" width="180" height="54" rx="14" fill="var(--chart-4)" opacity="0.12" stroke="var(--chart-4)" strokeWidth="1" strokeDasharray="5 4" /><text x="430" y="136" fontSize="13" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" textAnchor="middle" dominantBaseline="central">History storage</text><text x="430" y="154" fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" textAnchor="middle" dominantBaseline="central">optional</text></g>
          </svg>
        </Diagram>

        <Callout variant="default" title="Migration guide">
          If you want the rollout strategy and stakeholder overview, start with{" "}
          <Link className="font-medium text-primary underline underline-offset-4" href="/docs/guides/iot-migration-guide">
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
            The backend subscribes using a wildcard equivalent to{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">factory/+/telemetry</code>.
          </p>
        </div>

        <Diagram
          title="Topic structure breakdown"
          description="Each segment has a fixed role. The backend subscribes using a wildcard for the middle segment."
        >
          <svg width="100%" viewBox="0 0 700 170" role="img">
            <title>MQTT topic structure breakdown</title>
            <desc>Visual breakdown of factory/device_id/telemetry showing each segment and wildcard matching.</desc>
            {/* Segment boxes */}
            <rect x="60" y="16" width="150" height="48" rx="10" fill="var(--chart-3)" opacity="0.14" stroke="var(--chart-3)" strokeWidth="1" />
            <text fontSize="15" fontWeight="700" fontFamily="var(--font-mono)" fill="var(--foreground)" x="135" y="36" textAnchor="middle" dominantBaseline="central">factory</text>
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="135" y="52" textAnchor="middle" dominantBaseline="central">Namespace (fixed)</text>
            <text fontSize="18" fontWeight="400" fontFamily="var(--font-mono)" fill="var(--muted-foreground)" x="225" y="40" textAnchor="middle" dominantBaseline="central">/</text>
            <rect x="245" y="16" width="200" height="48" rx="10" fill="var(--chart-4)" opacity="0.14" stroke="var(--chart-4)" strokeWidth="1" />
            <text fontSize="15" fontWeight="700" fontFamily="var(--font-mono)" fill="var(--foreground)" x="345" y="36" textAnchor="middle" dominantBaseline="central">&lt;device_id&gt;</text>
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="345" y="52" textAnchor="middle" dominantBaseline="central">Stable machine identifier</text>
            <text fontSize="18" fontWeight="400" fontFamily="var(--font-mono)" fill="var(--muted-foreground)" x="460" y="40" textAnchor="middle" dominantBaseline="central">/</text>
            <rect x="480" y="16" width="160" height="48" rx="10" fill="var(--chart-1)" opacity="0.12" stroke="var(--chart-1)" strokeWidth="1" />
            <text fontSize="15" fontWeight="700" fontFamily="var(--font-mono)" fill="var(--foreground)" x="560" y="36" textAnchor="middle" dominantBaseline="central">telemetry</text>
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="560" y="52" textAnchor="middle" dominantBaseline="central">Message type (fixed)</text>
            {/* Wildcard match */}
            <rect x="60" y="90" width="580" height="42" rx="10" fill="var(--chart-5)" opacity="0.10" stroke="var(--chart-5)" strokeWidth="1" strokeDasharray="5 3" />
            <text fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="100" y="112" dominantBaseline="central">Backend subscribes:</text>
            <text fontSize="14" fontWeight="700" fontFamily="var(--font-mono)" fill="var(--foreground)" x="260" y="112" dominantBaseline="central">factory / + / telemetry</text>
            <text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="480" y="112" dominantBaseline="central">+ matches any device</text>
            {/* Brace from wildcard to device_id */}
            <line x1="345" y1="64" x2="345" y2="88" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="3 2" />
            {/* Examples */}
            <text fontSize="11" fontFamily="var(--font-mono)" fill="var(--muted-foreground)" x="60" y="155">factory/dev-001/telemetry</text>
            <text fontSize="11" fontFamily="var(--font-mono)" fill="var(--muted-foreground)" x="300" y="155">factory/press-7/telemetry</text>
            <text fontSize="11" fontFamily="var(--font-mono)" fill="var(--muted-foreground)" x="530" y="155">factory/lineA_motor_02/telemetry</text>
          </svg>
        </Diagram>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <Snippet
              title="Publish topic"
              value="factory/<device_id>/telemetry"
              type="MQTT"
            >
              factory/&lt;device_id&gt;/telemetry
            </Snippet>

            <Snippet
              title="Topic examples"
              value={"factory/dev-001/telemetry\nfactory/press-7/telemetry\nfactory/lineA_motor_02/telemetry"}
              type="MQTT"
            >
              {"factory/dev-001/telemetry\nfactory/press-7/telemetry\nfactory/lineA_motor_02/telemetry"}
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
              If your site uses different units or names, normalise them in the gateway so the
              backend receives consistent values across all machines.
            </Callout>
          </div>

          <Snippet title="Example payload" value={examplePayload} type="JSON">
            {examplePayload}
          </Snippet>
        </div>
      </section>

      <Separator />

      {/* Payload validation flow */}
      <section id="validation" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Backend internals
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Payload validation flow
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            What happens when a message arrives at the backend. Invalid payloads are rejected early.
          </p>
        </div>

        <Diagram
          title="Validation pipeline"
          description="Each incoming message passes through these stages before reaching the dashboard."
        >
          <svg width="100%" viewBox="0 0 700 380" role="img">
            <title>Payload validation flow</title>
            <desc>Vertical flowchart: message arrives, parse JSON, check timestamp, check metrics, normalise, update state, push to WebSocket. Failures branch to reject.</desc>
            <defs>
              <marker id="arr-vf" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M2 1L8 5L2 9" fill="none" stroke="var(--foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </marker>
              <marker id="arr-vf-r" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M2 1L8 5L2 9" fill="none" stroke="var(--destructive)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </marker>
            </defs>
            {/* Step 1: Message arrives */}
            <rect x="220" y="10" width="260" height="42" rx="10" fill="var(--chart-3)" opacity="0.14" stroke="var(--chart-3)" strokeWidth="1" />
            <text fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="350" y="32" textAnchor="middle" dominantBaseline="central">Message arrives from hub</text>
            <line x1="350" y1="52" x2="350" y2="70" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-vf)" />
            {/* Step 2: Parse JSON */}
            <rect x="220" y="72" width="260" height="42" rx="10" fill="var(--chart-1)" opacity="0.12" stroke="var(--chart-1)" strokeWidth="1" />
            <text fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="350" y="93" textAnchor="middle" dominantBaseline="central">Parse JSON</text>
            <line x1="480" y1="93" x2="540" y2="93" stroke="var(--destructive)" opacity="0.6" strokeWidth="1.5" markerEnd="url(#arr-vf-r)" />
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="510" y="84">fail</text>
            <rect x="542" y="78" width="120" height="30" rx="8" fill="var(--destructive)" opacity="0.08" stroke="var(--destructive)" strokeWidth="1" />
            <text fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--destructive)" x="602" y="93" textAnchor="middle" dominantBaseline="central">Reject (malformed)</text>
            <line x1="350" y1="114" x2="350" y2="132" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-vf)" />
            {/* Step 3: Has timestamp? */}
            <rect x="220" y="134" width="260" height="42" rx="10" fill="var(--chart-1)" opacity="0.12" stroke="var(--chart-1)" strokeWidth="1" />
            <text fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="350" y="155" textAnchor="middle" dominantBaseline="central">Has valid timestamp?</text>
            <line x1="480" y1="155" x2="540" y2="155" stroke="var(--destructive)" opacity="0.6" strokeWidth="1.5" markerEnd="url(#arr-vf-r)" />
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="510" y="146">no</text>
            <rect x="542" y="140" width="120" height="30" rx="8" fill="var(--destructive)" opacity="0.08" stroke="var(--destructive)" strokeWidth="1" />
            <text fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--destructive)" x="602" y="155" textAnchor="middle" dominantBaseline="central">Reject (400)</text>
            <line x1="350" y1="176" x2="350" y2="194" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-vf)" />
            {/* Step 4: Has metrics? */}
            <rect x="220" y="196" width="260" height="42" rx="10" fill="var(--chart-1)" opacity="0.12" stroke="var(--chart-1)" strokeWidth="1" />
            <text fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="350" y="217" textAnchor="middle" dominantBaseline="central">Has at least one metric?</text>
            <line x1="480" y1="217" x2="540" y2="217" stroke="var(--destructive)" opacity="0.6" strokeWidth="1.5" markerEnd="url(#arr-vf-r)" />
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="510" y="208">no</text>
            <rect x="542" y="202" width="120" height="30" rx="8" fill="var(--destructive)" opacity="0.08" stroke="var(--destructive)" strokeWidth="1" />
            <text fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--destructive)" x="602" y="217" textAnchor="middle" dominantBaseline="central">Reject (400)</text>
            <line x1="350" y1="238" x2="350" y2="256" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-vf)" />
            {/* Step 5: Normalise */}
            <rect x="220" y="258" width="260" height="42" rx="10" fill="var(--chart-5)" opacity="0.12" stroke="var(--chart-5)" strokeWidth="1" />
            <text fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="350" y="279" textAnchor="middle" dominantBaseline="central">Normalise units &amp; update state</text>
            <line x1="350" y1="300" x2="350" y2="318" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-vf)" />
            {/* Step 6: Push */}
            <rect x="220" y="320" width="260" height="42" rx="10" fill="var(--chart-2)" opacity="0.14" stroke="var(--chart-2)" strokeWidth="1" />
            <text fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="350" y="341" textAnchor="middle" dominantBaseline="central">Push to WebSocket streams</text>
          </svg>
        </Diagram>
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

      {/* Verification */}
      <section id="verify" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Acceptance checks
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Verification
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            Run these three checks in order to validate the full end-to-end path.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              step: 1,
              label: "Confirm telemetry exists on the hub",
              title: "Subscribe to all telemetry topics",
              command: "mosquitto_sub -t 'factory/+/telemetry' -v",
              display: "$ mosquitto_sub -t 'factory/+/telemetry' -v",
              hint: "Run inside the Mosquitto container.",
              expected:
                "You see JSON messages for your machine IDs arriving at the intended rate.",
            },
            {
              step: 2,
              label: "Confirm live stream works",
              title: "Connect to the WebSocket stream",
              command: `websocat "ws://<backend-host>:8000/api/v1/ws/telemetry?device_id=<device_id>"`,
              display: `$ websocat "ws://<backend-host>:8000/api/v1/ws/telemetry?device_id=<device_id>"`,
              hint: "Replace <backend-host> and <device_id> with your values.",
              expected:
                "JSON messages arrive continuously and match your published telemetry.",
            },
            {
              step: 3,
              label: "Confirm dashboard updates",
              title: "Open the dashboard in a browser",
              command: null,
              display: null,
              hint: null,
              expected:
                "Device cards show recent activity, charts update without refresh, and the device detail page shows correct measurements with a live graph.",
            },
          ].map((check, i) => (
            <div key={check.step} className="space-y-2">
              {i > 0 && <Separator />}
              <div className="flex items-center gap-2 pt-1">
                <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                  {check.step}
                </span>
                <span className="text-sm font-medium text-foreground">{check.label}</span>
              </div>
              {check.command != null && check.display != null && (
                <Snippet title={check.title} value={check.command} type="shell">
                  {check.display}
                </Snippet>
              )}
              {check.hint != null && (
                <p className="text-xs text-muted-foreground italic">{check.hint}</p>
              )}
              <div className="flex gap-2 rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm">
                <CheckCircle2Icon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground leading-relaxed">
                  <span className="font-medium text-foreground">Expected:</span>{" "}
                  {check.expected}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Security boundaries */}
      <section id="security" className="scroll-mt-24 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Security
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Trust zones &amp; transport security
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            Where encryption sits in the telemetry chain. Each boundary crossing should use TLS.
          </p>
        </div>

        <Diagram
          title="Security boundary diagram"
          description="TLS zones from factory floor to browser, showing where encryption is required vs optional."
        >
          <svg width="100%" viewBox="0 0 760 220" role="img">
            <title>Security boundary diagram</title>
            <desc>Horizontal diagram showing four trust zones: factory floor, DMZ broker, backend, and browser, with TLS annotations on each link.</desc>
            <defs>
              <marker id="arr-sec" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M2 1L8 5L2 9" fill="none" stroke="var(--foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </marker>
            </defs>
            {/* Zone 1: Factory floor */}
            <rect x="10" y="20" width="180" height="140" rx="12" fill="none" stroke="var(--chart-3)" strokeWidth="1" strokeDasharray="6 3" opacity="0.5" />
            <text fontSize="9" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--chart-3)" x="100" y="14" textAnchor="middle">FACTORY FLOOR</text>
            <rect x="30" y="42" width="140" height="42" rx="10" fill="var(--chart-3)" opacity="0.14" stroke="var(--chart-3)" strokeWidth="1" />
            <text fontSize="12" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="100" y="58" textAnchor="middle" dominantBaseline="central">Machines</text>
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="100" y="74" textAnchor="middle" dominantBaseline="central">PLCs · sensors</text>
            <rect x="30" y="100" width="140" height="42" rx="10" fill="var(--chart-4)" opacity="0.14" stroke="var(--chart-4)" strokeWidth="1" />
            <text fontSize="12" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="100" y="116" textAnchor="middle" dominantBaseline="central">Site Gateway</text>
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="100" y="132" textAnchor="middle" dominantBaseline="central">collect · forward</text>
            {/* Link 1: factory to DMZ */}
            <line x1="190" y1="105" x2="230" y2="105" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-sec)" />
            <rect x="192" y="150" width="70" height="22" rx="6" fill="var(--chart-3)" opacity="0.12" stroke="var(--chart-3)" strokeWidth="1" />
            <text fontSize="9" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="227" y="162" textAnchor="middle" dominantBaseline="central">TLS optional</text>
            {/* Zone 2: DMZ */}
            <rect x="232" y="20" width="150" height="140" rx="12" fill="none" stroke="var(--chart-5)" strokeWidth="1" strokeDasharray="6 3" opacity="0.5" />
            <text fontSize="9" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--chart-5)" x="307" y="14" textAnchor="middle">DMZ</text>
            <rect x="252" y="68" width="110" height="52" rx="10" fill="var(--chart-5)" opacity="0.14" stroke="var(--chart-5)" strokeWidth="1" />
            <text fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="307" y="88" textAnchor="middle" dominantBaseline="central">Message Hub</text>
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="307" y="106" textAnchor="middle" dominantBaseline="central">MQTT broker</text>
            {/* Link 2: DMZ to backend */}
            <line x1="382" y1="94" x2="420" y2="94" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-sec)" />
            <rect x="380" y="150" width="70" height="22" rx="6" fill="var(--chart-1)" opacity="0.12" stroke="var(--chart-1)" strokeWidth="1" />
            <text fontSize="9" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="415" y="162" textAnchor="middle" dominantBaseline="central">TLS required</text>
            {/* Zone 3: Backend */}
            <rect x="422" y="20" width="160" height="140" rx="12" fill="none" stroke="var(--chart-1)" strokeWidth="1" strokeDasharray="6 3" opacity="0.5" />
            <text fontSize="9" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--chart-1)" x="502" y="14" textAnchor="middle">BACKEND</text>
            <rect x="442" y="48" width="120" height="42" rx="10" fill="var(--chart-1)" opacity="0.10" stroke="var(--chart-1)" strokeWidth="1" />
            <text fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="502" y="64" textAnchor="middle" dominantBaseline="central">API Server</text>
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="502" y="80" textAnchor="middle" dominantBaseline="central">REST + WS</text>
            <rect x="442" y="104" width="120" height="36" rx="10" fill="var(--chart-4)" opacity="0.12" stroke="var(--chart-4)" strokeWidth="1" />
            <text fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="502" y="122" textAnchor="middle" dominantBaseline="central">Database</text>
            {/* Link 3: backend to browser */}
            <line x1="582" y1="80" x2="620" y2="80" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-sec)" />
            <rect x="590" y="150" width="80" height="22" rx="6" fill="var(--chart-2)" opacity="0.12" stroke="var(--chart-2)" strokeWidth="1" />
            <text fontSize="9" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="630" y="162" textAnchor="middle" dominantBaseline="central">HTTPS / WSS</text>
            {/* Zone 4: Browser */}
            <rect x="622" y="20" width="126" height="140" rx="12" fill="none" stroke="var(--chart-2)" strokeWidth="1" strokeDasharray="6 3" opacity="0.5" />
            <text fontSize="9" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--chart-2)" x="685" y="14" textAnchor="middle">CLIENT</text>
            <rect x="642" y="62" width="86" height="52" rx="10" fill="var(--chart-2)" opacity="0.14" stroke="var(--chart-2)" strokeWidth="1" />
            <text fontSize="12" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="685" y="82" textAnchor="middle" dominantBaseline="central">Browser</text>
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="685" y="100" textAnchor="middle" dominantBaseline="central">dashboard</text>
            {/* Legend */}
            <rect x="10" y="192" width="12" height="12" rx="3" fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 2" />
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="28" y="202">Trust zone boundary</text>
          </svg>
        </Diagram>

        <Callout variant="warning" title="Production deployments">
          In production, all inter-zone links should use TLS. The &quot;TLS optional&quot; label on the
          factory floor link applies only when machines and gateway are on an isolated network segment.
        </Callout>
      </section>

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
          <svg width="100%" viewBox="0 0 720 310" role="img">
            <title>Troubleshooting decision tree</title>
            <desc>Flowchart starting from no data on dashboard, checking hub, backend, and device ID at each step.</desc>
            <defs>
              <marker id="arr-ts" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M2 1L8 5L2 9" fill="none" stroke="var(--foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </marker>
            </defs>
            {/* Start */}
            <rect x="230" y="10" width="260" height="42" rx="10" fill="var(--destructive)" opacity="0.08" stroke="var(--destructive)" strokeWidth="1" />
            <text fontSize="12" fontWeight="700" fontFamily="var(--font-sans)" fill="var(--foreground)" x="360" y="32" textAnchor="middle" dominantBaseline="central">No data on the dashboard?</text>
            <line x1="360" y1="52" x2="360" y2="72" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-ts)" />
            {/* Check 1: hub */}
            <rect x="230" y="74" width="260" height="42" rx="10" fill="var(--chart-1)" opacity="0.12" stroke="var(--chart-1)" strokeWidth="1" />
            <text fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="360" y="95" textAnchor="middle" dominantBaseline="central">Run mosquitto_sub — messages?</text>
            {/* No branch */}
            <line x1="490" y1="95" x2="560" y2="95" stroke="var(--border)" strokeWidth="1.5" markerEnd="url(#arr-ts)" />
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="525" y="86">No</text>
            <rect x="562" y="78" width="148" height="36" rx="8" fill="var(--chart-2)" opacity="0.12" stroke="var(--chart-2)" strokeWidth="1" />
            <text fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="636" y="92" textAnchor="middle" dominantBaseline="central">Check gateway /</text>
            <text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="636" y="106" textAnchor="middle" dominantBaseline="central">publisher config</text>
            {/* Yes branch */}
            <line x1="360" y1="116" x2="360" y2="138" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-ts)" />
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="375" y="130">Yes</text>
            {/* Check 2: backend */}
            <rect x="230" y="140" width="260" height="42" rx="10" fill="var(--chart-1)" opacity="0.12" stroke="var(--chart-1)" strokeWidth="1" />
            <text fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="360" y="161" textAnchor="middle" dominantBaseline="central">Backend logs show forwarding?</text>
            <line x1="490" y1="161" x2="560" y2="161" stroke="var(--border)" strokeWidth="1.5" markerEnd="url(#arr-ts)" />
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="525" y="152">No</text>
            <rect x="562" y="144" width="148" height="36" rx="8" fill="var(--chart-5)" opacity="0.12" stroke="var(--chart-5)" strokeWidth="1" />
            <text fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="636" y="158" textAnchor="middle" dominantBaseline="central">Check backend →</text>
            <text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="636" y="172" textAnchor="middle" dominantBaseline="central">hub connection</text>
            <line x1="360" y1="182" x2="360" y2="204" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-ts)" />
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="375" y="196">Yes</text>
            {/* Check 3: device ID */}
            <rect x="230" y="206" width="260" height="42" rx="10" fill="var(--chart-1)" opacity="0.12" stroke="var(--chart-1)" strokeWidth="1" />
            <text fontSize="12" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="360" y="227" textAnchor="middle" dominantBaseline="central">Device ID in UI matches topic?</text>
            <line x1="490" y1="227" x2="560" y2="227" stroke="var(--border)" strokeWidth="1.5" markerEnd="url(#arr-ts)" />
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="525" y="218">No</text>
            <rect x="562" y="210" width="148" height="36" rx="8" fill="var(--chart-3)" opacity="0.12" stroke="var(--chart-3)" strokeWidth="1" />
            <text fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="636" y="224" textAnchor="middle" dominantBaseline="central">Fix device_id</text>
            <text fontSize="11" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="636" y="238" textAnchor="middle" dominantBaseline="central">mismatch</text>
            <line x1="360" y1="248" x2="360" y2="270" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arr-ts)" />
            <text fontSize="10" fontFamily="var(--font-sans)" fill="var(--muted-foreground)" x="375" y="262">Yes</text>
            {/* Final: network */}
            <rect x="230" y="272" width="260" height="36" rx="10" fill="var(--chart-3)" opacity="0.12" stroke="var(--chart-3)" strokeWidth="1" />
            <text fontSize="11" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--foreground)" x="360" y="290" textAnchor="middle" dominantBaseline="central">Check network / WebSocket connectivity</text>
          </svg>
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
