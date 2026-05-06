"use client"

import * as React from "react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ExpandIcon } from "lucide-react"

function CodeBlock({ children }: { children: string }) {
  return (
    <div className="rounded-xl border bg-card p-4 font-mono text-xs text-muted-foreground whitespace-pre-wrap">
      {children}
    </div>
  )
}

function Diagram({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-base">{title}</CardTitle>
            <div className="mt-1 text-sm text-muted-foreground">{description}</div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="shrink-0">
                <ExpandIcon />
                Expand
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl">
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
              </DialogHeader>
              <div className="rounded-xl border bg-card p-3 sm:p-4">
                <div className="mx-auto w-full max-w-[1000px]">{children}</div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border bg-card p-3 sm:p-4">{children}</div>
      </CardContent>
    </Card>
  )
}

export default function IoTIntegrationTechnicalPage() {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/docs">Back to Docs</Link>
        </Button>
        <Badge variant="outline">Integration</Badge>
      </div>

      <div className="mb-8 space-y-3">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Integration contract
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Using real machines (integration details)
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground leading-6">
          This page defines the minimum integration contract required to replace{" "}
          <span className="font-mono text-[0.95em] text-foreground">iot-simulator</span> with real
          machines (or a site gateway) while keeping the backend and dashboard unchanged.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Badge variant="secondary">MQTT ingestion</Badge>
          <Badge variant="secondary">Device identity</Badge>
          <Badge variant="secondary">Payload contract</Badge>
          <Badge variant="secondary">Verification</Badge>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Diagram
          title="System view"
          description="Where real telemetry enters, and how it reaches the dashboard."
        >
          <svg width="100%" viewBox="0 0 640 130" role="img">
            <title>Integration system view</title>
            <desc>
              Real machines flow through a gateway to the message hub, then to backend and
              dashboard.
            </desc>
            <defs>
              <marker
                id="arr-int-1"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path
                  d="M2 1L8 5L2 9"
                  fill="none"
                  stroke="var(--foreground)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </marker>
            </defs>

            <g>
              <rect
                x="8"
                y="28"
                width="124"
                height="64"
                rx="12"
                fill="var(--chart-3)"
                opacity="0.16"
                stroke="var(--chart-3)"
                strokeWidth="1"
              />
              <text
                fontSize="13"
                fontWeight="700"
                fontFamily="var(--font-sans)"
                fill="var(--foreground)"
                x="70"
                y="52"
                textAnchor="middle"
                dominantBaseline="central"
              >
                Real machines
              </text>
              <text
                fontSize="11"
                fontFamily="var(--font-sans)"
                fill="var(--muted-foreground)"
                x="70"
                y="70"
                textAnchor="middle"
                dominantBaseline="central"
              >
                sensors · PLCs
              </text>
            </g>

            <line
              x1="132"
              y1="60"
              x2="154"
              y2="60"
              stroke="var(--border)"
              strokeWidth="2"
              markerEnd="url(#arr-int-1)"
            />

            <g>
              <rect
                x="156"
                y="28"
                width="130"
                height="64"
                rx="12"
                fill="var(--chart-4)"
                opacity="0.14"
                stroke="var(--chart-4)"
                strokeWidth="1"
              />
              <text
                fontSize="13"
                fontWeight="700"
                fontFamily="var(--font-sans)"
                fill="var(--foreground)"
                x="221"
                y="50"
                textAnchor="middle"
                dominantBaseline="central"
              >
                Site gateway
              </text>
              <text
                fontSize="11"
                fontFamily="var(--font-sans)"
                fill="var(--muted-foreground)"
                x="221"
                y="70"
                textAnchor="middle"
                dominantBaseline="central"
              >
                collect · map · forward
              </text>
            </g>

            <line
              x1="286"
              y1="60"
              x2="308"
              y2="60"
              stroke="var(--border)"
              strokeWidth="2"
              markerEnd="url(#arr-int-1)"
            />

            <g>
              <rect
                x="310"
                y="34"
                width="112"
                height="52"
                rx="12"
                fill="var(--muted)"
                stroke="var(--border)"
                strokeWidth="1"
              />
              <text
                fontSize="13"
                fontWeight="600"
                fontFamily="var(--font-sans)"
                fill="var(--foreground)"
                x="366"
                y="56"
                textAnchor="middle"
                dominantBaseline="central"
              >
                Message hub
              </text>
              <text
                fontSize="11"
                fontFamily="var(--font-sans)"
                fill="var(--muted-foreground)"
                x="366"
                y="72"
                textAnchor="middle"
                dominantBaseline="central"
              >
                telemetry relay
              </text>
            </g>

            <line
              x1="422"
              y1="60"
              x2="444"
              y2="60"
              stroke="var(--border)"
              strokeWidth="2"
              markerEnd="url(#arr-int-1)"
            />

            <g>
              <rect
                x="446"
                y="34"
                width="124"
                height="52"
                rx="12"
                fill="var(--chart-1)"
                opacity="0.12"
                stroke="var(--chart-1)"
                strokeWidth="1"
              />
              <text
                fontSize="13"
                fontWeight="600"
                fontFamily="var(--font-sans)"
                fill="var(--foreground)"
                x="508"
                y="56"
                textAnchor="middle"
                dominantBaseline="central"
              >
                Backend
              </text>
              <text
                fontSize="11"
                fontFamily="var(--font-sans)"
                fill="var(--muted-foreground)"
                x="508"
                y="72"
                textAnchor="middle"
                dominantBaseline="central"
              >
                ingest · stream
              </text>
            </g>

            <line
              x1="570"
              y1="60"
              x2="592"
              y2="60"
              stroke="var(--border)"
              strokeWidth="2"
              markerEnd="url(#arr-int-1)"
            />

            <g>
              <rect
                x="594"
                y="34"
                width="38"
                height="52"
                rx="12"
                fill="var(--chart-2)"
                opacity="0.12"
                stroke="var(--border)"
                strokeWidth="1"
              />
              <text
                fontSize="12"
                fontWeight="700"
                fontFamily="var(--font-sans)"
                fill="var(--foreground)"
                x="613"
                y="56"
                textAnchor="middle"
                dominantBaseline="central"
              >
                UI
              </text>
              <text
                fontSize="10"
                fontFamily="var(--font-sans)"
                fill="var(--muted-foreground)"
                x="613"
                y="72"
                textAnchor="middle"
                dominantBaseline="central"
              >
                dash
              </text>
            </g>
          </svg>
        </Diagram>

        <Diagram
          title="Message contract"
          description="What the backend expects for topic naming and payload shape."
        >
          <svg width="100%" viewBox="0 0 640 220" role="img">
            <title>Integration message contract</title>
            <desc>
              A topic box shows the expected path, and a payload box shows required and optional
              fields.
            </desc>
            <g>
              <rect
                x="18"
                y="18"
                width="604"
                height="74"
                rx="14"
                fill="var(--chart-3)"
                opacity="0.10"
                stroke="var(--border)"
                strokeWidth="1"
              />
              <text
                x="42"
                y="44"
                fontSize="12"
                fontWeight="700"
                fontFamily="var(--font-sans)"
                fill="var(--foreground)"
              >
                Topic
              </text>
              <text
                x="42"
                y="68"
                fontSize="13"
                fontWeight="600"
                fontFamily="var(--font-mono)"
                fill="var(--foreground)"
              >
                factory/&lt;device_id&gt;/telemetry
              </text>
            </g>

            <g>
              <rect
                x="18"
                y="108"
                width="604"
                height="94"
                rx="14"
                fill="var(--chart-1)"
                opacity="0.08"
                stroke="var(--border)"
                strokeWidth="1"
              />
              <text
                x="42"
                y="132"
                fontSize="12"
                fontWeight="700"
                fontFamily="var(--font-sans)"
                fill="var(--foreground)"
              >
                Payload (JSON)
              </text>
              <text
                x="42"
                y="156"
                fontSize="12"
                fontFamily="var(--font-sans)"
                fill="var(--muted-foreground)"
              >
                Required: timestamp + one or more metrics (temperature, pressure, vibration, ...)
              </text>
              <text
                x="42"
                y="178"
                fontSize="12"
                fontFamily="var(--font-sans)"
                fill="var(--muted-foreground)"
              >
                Optional: status ("ok", "warning", ...)
              </text>
            </g>
          </svg>
        </Diagram>
      </div>

      <Separator className="my-8" />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>High-level flow (what stays the same)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Real machines publish telemetry to the message hub. The platform backend subscribes,
              validates/normalises, optionally stores, then pushes live updates to the dashboard.
            </p>
            <Diagram
              title="High-level flow diagram"
              description="Real machines → gateway → hub → backend → UI, with optional history storage."
            >
              <svg width="100%" viewBox="0 0 760 190" role="img">
                <title>High-level flow diagram</title>
                <desc>
                  Real machines connect through a site gateway to a message hub, then the backend
                  streams to UI and optionally stores history.
                </desc>
                <defs>
                  <marker
                    id="arr-flow-1"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path
                      d="M2 1L8 5L2 9"
                      fill="none"
                      stroke="var(--foreground)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </marker>
                </defs>

                <g>
                  <rect
                    x="18"
                    y="24"
                    width="150"
                    height="56"
                    rx="14"
                    fill="var(--chart-3)"
                    opacity="0.16"
                    stroke="var(--chart-3)"
                    strokeWidth="1"
                  />
                  <text
                    x="93"
                    y="47"
                    fontSize="13"
                    fontWeight="700"
                    fontFamily="var(--font-sans)"
                    fill="var(--foreground)"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    Real machines
                  </text>
                  <text
                    x="93"
                    y="66"
                    fontSize="11"
                    fontFamily="var(--font-sans)"
                    fill="var(--muted-foreground)"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    measurements
                  </text>
                </g>

                <line
                  x1="168"
                  y1="52"
                  x2="210"
                  y2="52"
                  stroke="var(--border)"
                  strokeWidth="2"
                  markerEnd="url(#arr-flow-1)"
                />

                <g>
                  <rect
                    x="212"
                    y="24"
                    width="160"
                    height="56"
                    rx="14"
                    fill="var(--chart-4)"
                    opacity="0.14"
                    stroke="var(--chart-4)"
                    strokeWidth="1"
                  />
                  <text
                    x="292"
                    y="47"
                    fontSize="13"
                    fontWeight="700"
                    fontFamily="var(--font-sans)"
                    fill="var(--foreground)"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    Site gateway
                  </text>
                  <text
                    x="292"
                    y="66"
                    fontSize="11"
                    fontFamily="var(--font-sans)"
                    fill="var(--muted-foreground)"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    map · forward
                  </text>
                </g>

                <line
                  x1="372"
                  y1="52"
                  x2="414"
                  y2="52"
                  stroke="var(--border)"
                  strokeWidth="2"
                  markerEnd="url(#arr-flow-1)"
                />

                <g>
                  <rect
                    x="416"
                    y="28"
                    width="150"
                    height="48"
                    rx="14"
                    fill="var(--muted)"
                    stroke="var(--border)"
                    strokeWidth="1"
                  />
                  <text
                    x="491"
                    y="52"
                    fontSize="13"
                    fontWeight="600"
                    fontFamily="var(--font-sans)"
                    fill="var(--foreground)"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    Message hub
                  </text>
                </g>

                <line
                  x1="566"
                  y1="52"
                  x2="608"
                  y2="52"
                  stroke="var(--border)"
                  strokeWidth="2"
                  markerEnd="url(#arr-flow-1)"
                />

                <g>
                  <rect
                    x="610"
                    y="28"
                    width="132"
                    height="48"
                    rx="14"
                    fill="var(--chart-1)"
                    opacity="0.12"
                    stroke="var(--chart-1)"
                    strokeWidth="1"
                  />
                  <text
                    x="676"
                    y="52"
                    fontSize="13"
                    fontWeight="600"
                    fontFamily="var(--font-sans)"
                    fill="var(--foreground)"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    Backend
                  </text>
                </g>

                <line
                  x1="676"
                  y1="76"
                  x2="676"
                  y2="110"
                  stroke="var(--border)"
                  strokeWidth="2"
                  markerEnd="url(#arr-flow-1)"
                />

                <g>
                  <rect
                    x="596"
                    y="112"
                    width="160"
                    height="54"
                    rx="14"
                    fill="var(--chart-2)"
                    opacity="0.12"
                    stroke="var(--border)"
                    strokeWidth="1"
                  />
                  <text
                    x="676"
                    y="136"
                    fontSize="13"
                    fontWeight="700"
                    fontFamily="var(--font-sans)"
                    fill="var(--foreground)"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    Dashboard (UI)
                  </text>
                  <text
                    x="676"
                    y="154"
                    fontSize="11"
                    fontFamily="var(--font-sans)"
                    fill="var(--muted-foreground)"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    live updates
                  </text>
                </g>

                <line
                  x1="676"
                  y1="76"
                  x2="494"
                  y2="134"
                  stroke="var(--border)"
                  strokeWidth="2"
                  markerEnd="url(#arr-flow-1)"
                />

                <g>
                  <rect
                    x="340"
                    y="112"
                    width="180"
                    height="54"
                    rx="14"
                    fill="var(--muted)"
                    stroke="var(--border)"
                    strokeWidth="1"
                    strokeDasharray="5 4"
                  />
                  <text
                    x="430"
                    y="136"
                    fontSize="13"
                    fontWeight="700"
                    fontFamily="var(--font-sans)"
                    fill="var(--foreground)"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    History storage
                  </text>
                  <text
                    x="430"
                    y="154"
                    fontSize="11"
                    fontFamily="var(--font-sans)"
                    fill="var(--muted-foreground)"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    optional
                  </text>
                </g>
              </svg>
            </Diagram>
            <div className="rounded-xl border bg-muted/40 p-4">
              <div className="font-medium text-foreground">Migration guide</div>
              <div className="mt-1">
                If you want the rollout and stakeholder overview, start with{" "}
                <Link className="underline underline-offset-4" href="/docs/iot-migration-guide">
                  the migration guide
                </Link>
                .
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What you must implement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div>
              - Publish telemetry for each machine using a stable{" "}
              <span className="font-mono text-xs text-foreground">device_id</span>.
            </div>
            <div>- Send timestamps and metrics as JSON.</div>
            <div>- Maintain a reasonable update rate (e.g., 1–5 Hz for live dashboards).</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>MQTT topic contract</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="space-y-2">
              <div className="font-medium text-foreground">Publish topic</div>
              <CodeBlock>{"factory/<device_id>/telemetry"}</CodeBlock>
              <div>
                The backend subscribes using a wildcard equivalent to{" "}
                <span className="font-mono text-xs text-foreground">factory/+/telemetry</span>.
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="font-medium text-foreground">Device identity rules</div>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <span className="font-medium text-foreground">Stable</span>: a machine’s{" "}
                  <span className="font-mono text-xs text-foreground">device_id</span> must not
                  change over time.
                </li>
                <li>
                  <span className="font-medium text-foreground">Unique</span>: one ID per physical
                  asset (no reuse across different machines).
                </li>
                <li>
                  <span className="font-medium text-foreground">Safe characters</span>: use
                  letters/numbers/dash/underscore. Avoid spaces and slashes.
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Examples</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="font-medium text-foreground">Topic examples</div>
            <CodeBlock>
              {"factory/dev-001/telemetry\nfactory/press-7/telemetry\nfactory/lineA_motor_02/telemetry"}
            </CodeBlock>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Payload contract (JSON)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="space-y-2">
              <div className="font-medium text-foreground">Required fields</div>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <span className="font-mono text-xs text-foreground">timestamp</span>: ISO 8601
                  recommended (UTC preferred).
                </li>
                <li>
                  One or more metric keys such as{" "}
                  <span className="font-mono text-xs text-foreground">
                    temperature, pressure, vibration, power_draw, rotational_speed
                  </span>
                  .
                </li>
              </ul>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="font-medium text-foreground">Optional fields</div>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <span className="font-mono text-xs text-foreground">status</span>:{" "}
                  <span className="font-mono text-xs text-foreground">ok</span>,{" "}
                  <span className="font-mono text-xs text-foreground">warning</span>, etc.
                </li>
              </ul>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="font-medium text-foreground">Example payload</div>
              <CodeBlock>
                {`{
  "timestamp": "2026-04-07T13:23:26.009702+00:00",
  "temperature": 45.849,
  "pressure": 124.801,
  "vibration": 2.646,
  "power_draw": 3.968,
  "rotational_speed": 980.389,
  "status": "ok"
}`}
              </CodeBlock>
            </div>

            <div className="rounded-xl border bg-muted/40 p-4">
              <div className="font-medium text-foreground">Units &amp; normalisation</div>
              <div className="mt-1 leading-6">
                If your site uses different units or names, normalise them in the gateway so the
                backend receives consistent values across all machines.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common pitfalls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div>- Rotating IDs (new ID every reboot) → breaks history and device pages.</div>
            <div>- Missing/invalid timestamps → makes ordering and charts unreliable.</div>
            <div>- Mixed units across machines → misleading comparisons and alerting.</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Verification (acceptance checks)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="space-y-2">
              <div className="font-medium text-foreground">1) Confirm telemetry exists on the hub</div>
              <CodeBlock>{`# inside the Mosquitto container
mosquitto_sub -t 'factory/+/telemetry' -v`}</CodeBlock>
              <div>
                Expected: you see messages for your machine IDs at the intended rate.
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="font-medium text-foreground">2) Confirm live stream works</div>
              <CodeBlock>{`websocat "ws://<backend-host>:8000/api/v1/ws/telemetry?device_id=<device_id>"`}</CodeBlock>
              <div>
                Expected: JSON messages arrive continuously and match your published telemetry.
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="font-medium text-foreground">3) Confirm dashboard updates</div>
              <div>
                Expected: device cards show recent activity, and charts/telemetry panels update
                without refresh.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Troubleshooting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">No messages on the hub</span>: check
              gateway connection, topic naming, and whether the publisher is running.
            </div>
            <div>
              <span className="font-medium text-foreground">Hub has data but UI is empty</span>:
              check backend connectivity to the hub and the machine ID used by the UI.
            </div>
            <div>
              <span className="font-medium text-foreground">Intermittent updates</span>: reduce
              publish bursts, add buffering, and verify the expected update rate.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

