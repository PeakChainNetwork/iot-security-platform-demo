"use client"

import * as React from "react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CopyButton } from "@/components/copy-button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExpandIcon } from "lucide-react"

function Snippet({
  title,
  value,
  children,
  type,
}: {
  title: string
  value: string
  children: React.ReactNode
  type?: string
}) {
  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center justify-between gap-2 border-b px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="truncate text-sm font-medium text-foreground">{title}</div>
          {type ? (
            <Badge variant="outline" className="font-mono text-[11px] text-muted-foreground">
              {type}
            </Badge>
          ) : null}
        </div>
        <CopyButton value={value} label={`Copy ${title}`} />
      </div>
      <div className="bg-muted/30 px-3 py-2 font-mono text-xs text-muted-foreground">
        {children}
      </div>
    </div>
  )
}

function SwaggerExample({
  label,
  type,
  value,
  children,
}: {
  label: string
  type: string
  value: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="truncate text-sm font-medium text-foreground">{label}</div>
          <Badge variant="outline" className="font-mono text-[11px] text-muted-foreground">
            {type}
          </Badge>
        </div>
        <CopyButton value={value} label={`Copy ${label}`} />
      </div>
      <div className="border-t bg-muted/20 px-3 py-2">
        <div className="font-mono text-xs text-muted-foreground whitespace-pre-wrap">
          {children}
        </div>
      </div>
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

export default function DocsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <div className="mb-8 space-y-2">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Docs</h1>
          <p className="text-muted-foreground">
            Overview and implementation reference for the IoT simulation + live telemetry demo.
          </p>
        </div>

        <div className="mb-6 grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Migration guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                A migration guide that explains how to move from the demo{" "}
                <span className="font-mono text-xs text-foreground">iot-simulator</span> to real
                machines—using the same platform pipeline.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button asChild>
                  <Link href="/docs/iot-migration-guide">Open migration guide</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/docs/iot-integration-technical">Integration details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>What to read first</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div>
                For demos and stakeholders: <span className="font-medium text-foreground">Overview</span>.
              </div>
              <div>
                For implementers: <span className="font-medium text-foreground">Implementation details</span>.
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="gap-6">
          <TabsList variant="line" className="w-full justify-start gap-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="implementation">Implementation details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader className="space-y-1">
                  <CardTitle>At a glance</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    A live factory demo that shows monitoring without connecting real machines.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border bg-card p-4">
                      <div className="text-foreground font-medium">Simulator</div>
                      <div className="mt-1 leading-6">Generates realistic device readings.</div>
                    </div>
                    <div className="rounded-xl border bg-card p-4">
                      <div className="text-foreground font-medium">Message hub</div>
                      <div className="mt-1 leading-6">
                        Carries device telemetry into the platform.
                      </div>
                    </div>
                    <div className="rounded-xl border bg-card p-4">
                      <div className="text-foreground font-medium">Backend</div>
                      <div className="mt-1 leading-6">
                        Keeps latest state and streams live updates.
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border bg-muted/40 p-4">
                    <div className="font-medium text-foreground">Quick note</div>
                    <div className="mt-1 text-sm text-muted-foreground leading-6">
                      If a card is empty, it usually means{" "}
                      <span className="font-medium text-foreground">no signal yet</span>, not a
                      platform error.
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle>Quick demo</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Open the device inventory, then drill into any online device.
                  </p>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <Button asChild className="w-full">
                    <Link href="/devices">Open Devices</Link>
                  </Button>
                  <div className="rounded-xl border bg-card p-4 text-muted-foreground">
                    <div className="font-medium text-foreground">Tip</div>
                    <div className="mt-1 leading-6">
                      Give it a few seconds after startup—live readings arrive continuously.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Diagram
                title="Telemetry flow"
                description="How readings move from devices into the dashboard."
              >
                <svg width="100%" viewBox="0 0 720 150" role="img">
                  <title>Telemetry flow</title>
                  <desc>Simulator publishes telemetry, backend processes it, UI receives live updates.</desc>
                  <defs>
                    <marker
                      id="arr-docs-flow"
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
                      y="42"
                      width="150"
                      height="60"
                      rx="14"
                      fill="var(--chart-2)"
                      opacity="0.14"
                      stroke="var(--chart-2)"
                      strokeWidth="1"
                    />
                    <text
                      x="93"
                      y="68"
                      fontSize="13"
                      fontWeight="700"
                      fontFamily="var(--font-sans)"
                      fill="var(--foreground)"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      Simulator
                    </text>
                    <text
                      x="93"
                      y="88"
                      fontSize="11"
                      fontFamily="var(--font-sans)"
                      fill="var(--muted-foreground)"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      generates readings
                    </text>
                  </g>

                  <line
                    x1="168"
                    y1="72"
                    x2="220"
                    y2="72"
                    stroke="var(--border)"
                    strokeWidth="2"
                    markerEnd="url(#arr-docs-flow)"
                  />

                  <g>
                    <rect
                      x="222"
                      y="46"
                      width="140"
                      height="52"
                      rx="14"
                      fill="var(--muted)"
                      stroke="var(--border)"
                      strokeWidth="1"
                    />
                    <text
                      x="292"
                      y="72"
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
                    x1="362"
                    y1="72"
                    x2="414"
                    y2="72"
                    stroke="var(--border)"
                    strokeWidth="2"
                    markerEnd="url(#arr-docs-flow)"
                  />

                  <g>
                    <rect
                      x="416"
                      y="42"
                      width="160"
                      height="60"
                      rx="14"
                      fill="var(--chart-1)"
                      opacity="0.12"
                      stroke="var(--chart-1)"
                      strokeWidth="1"
                    />
                    <text
                      x="496"
                      y="68"
                      fontSize="13"
                      fontWeight="700"
                      fontFamily="var(--font-sans)"
                      fill="var(--foreground)"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      Backend
                    </text>
                    <text
                      x="496"
                      y="88"
                      fontSize="11"
                      fontFamily="var(--font-sans)"
                      fill="var(--muted-foreground)"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      validate · store · stream
                    </text>
                  </g>

                  <line
                    x1="576"
                    y1="72"
                    x2="628"
                    y2="72"
                    stroke="var(--border)"
                    strokeWidth="2"
                    markerEnd="url(#arr-docs-flow)"
                  />

                  <g>
                    <rect
                      x="630"
                      y="42"
                      width="72"
                      height="60"
                      rx="14"
                      fill="var(--chart-3)"
                      opacity="0.12"
                      stroke="var(--border)"
                      strokeWidth="1"
                    />
                    <text
                      x="666"
                      y="70"
                      fontSize="12"
                      fontWeight="800"
                      fontFamily="var(--font-sans)"
                      fill="var(--foreground)"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      UI
                    </text>
                    <text
                      x="666"
                      y="90"
                      fontSize="10"
                      fontFamily="var(--font-sans)"
                      fill="var(--muted-foreground)"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      live
                    </text>
                  </g>
                </svg>
              </Diagram>

              <Diagram
                title="Where to click"
                description="The common demo path through the product."
              >
                <svg width="100%" viewBox="0 0 720 150" role="img">
                  <title>Where to click flow</title>
                  <desc>Dashboard leads to Devices, then to Device details.</desc>
                  <defs>
                    <marker
                      id="arr-docs-nav"
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
                      x="38"
                      y="42"
                      width="180"
                      height="60"
                      rx="14"
                      fill="var(--chart-1)"
                      opacity="0.10"
                      stroke="var(--border)"
                      strokeWidth="1"
                    />
                    <text
                      x="128"
                      y="70"
                      fontSize="13"
                      fontWeight="800"
                      fontFamily="var(--font-sans)"
                      fill="var(--foreground)"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      Dashboard
                    </text>
                    <text
                      x="128"
                      y="90"
                      fontSize="11"
                      fontFamily="var(--font-sans)"
                      fill="var(--muted-foreground)"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      status overview
                    </text>
                  </g>

                  <line
                    x1="218"
                    y1="72"
                    x2="276"
                    y2="72"
                    stroke="var(--border)"
                    strokeWidth="2"
                    markerEnd="url(#arr-docs-nav)"
                  />

                  <g>
                    <rect
                      x="278"
                      y="42"
                      width="180"
                      height="60"
                      rx="14"
                      fill="var(--chart-3)"
                      opacity="0.12"
                      stroke="var(--border)"
                      strokeWidth="1"
                    />
                    <text
                      x="368"
                      y="70"
                      fontSize="13"
                      fontWeight="800"
                      fontFamily="var(--font-sans)"
                      fill="var(--foreground)"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      Devices
                    </text>
                    <text
                      x="368"
                      y="90"
                      fontSize="11"
                      fontFamily="var(--font-sans)"
                      fill="var(--muted-foreground)"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      inventory
                    </text>
                  </g>

                  <line
                    x1="458"
                    y1="72"
                    x2="516"
                    y2="72"
                    stroke="var(--border)"
                    strokeWidth="2"
                    markerEnd="url(#arr-docs-nav)"
                  />

                  <g>
                    <rect
                      x="518"
                      y="42"
                      width="184"
                      height="60"
                      rx="14"
                      fill="var(--chart-2)"
                      opacity="0.12"
                      stroke="var(--border)"
                      strokeWidth="1"
                    />
                    <text
                      x="610"
                      y="70"
                      fontSize="13"
                      fontWeight="800"
                      fontFamily="var(--font-sans)"
                      fill="var(--foreground)"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      Device details
                    </text>
                    <text
                      x="610"
                      y="90"
                      fontSize="11"
                      fontFamily="var(--font-sans)"
                      fill="var(--muted-foreground)"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      live telemetry
                    </text>
                  </g>
                </svg>
              </Diagram>
            </div>

            <Card>
              <CardHeader className="space-y-1">
                <CardTitle>Where to click</CardTitle>
                <p className="text-sm text-muted-foreground">
                  The three screens most people use during a demo.
                </p>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                <div className="rounded-xl border bg-card p-4">
                  <div className="text-foreground font-medium">Dashboard</div>
                  <div className="mt-1 leading-6">“Is the system healthy right now?”</div>
                </div>
                <div className="rounded-xl border bg-card p-4">
                  <div className="text-foreground font-medium">Devices</div>
                  <div className="mt-1 leading-6">“Which assets are active?”</div>
                </div>
                <div className="rounded-xl border bg-card p-4">
                  <div className="text-foreground font-medium">Device details</div>
                  <div className="mt-1 leading-6">“What’s happening on this one device?”</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="implementation" className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-2">
              <Diagram
                title="Architecture flow"
                description="How telemetry moves through the platform and reaches the UI."
              >
                <svg width="100%" viewBox="0 0 720 180" role="img">
                  <title>Architecture flow</title>
                  <desc>
                    Simulator publishes to message hub, backend ingests and optionally stores, UI
                    receives live updates.
                  </desc>
                  <defs>
                    <marker
                      id="arr-docs-impl-arch"
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
                      y="28"
                      width="150"
                      height="60"
                      rx="14"
                      fill="var(--chart-2)"
                      opacity="0.14"
                      stroke="var(--chart-2)"
                      strokeWidth="1"
                    />
                    <text
                      x="93"
                      y="54"
                      fontSize="13"
                      fontWeight="800"
                      fontFamily="var(--font-sans)"
                      fill="var(--foreground)"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      Simulator
                    </text>
                    <text
                      x="93"
                      y="74"
                      fontSize="11"
                      fontFamily="var(--font-sans)"
                      fill="var(--muted-foreground)"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      publish telemetry
                    </text>
                  </g>

                  <line
                    x1="168"
                    y1="58"
                    x2="220"
                    y2="58"
                    stroke="var(--border)"
                    strokeWidth="2"
                    markerEnd="url(#arr-docs-impl-arch)"
                  />

                  <g>
                    <rect
                      x="222"
                      y="32"
                      width="140"
                      height="52"
                      rx="14"
                      fill="var(--muted)"
                      stroke="var(--border)"
                      strokeWidth="1"
                    />
                    <text
                      x="292"
                      y="58"
                      fontSize="13"
                      fontWeight="700"
                      fontFamily="var(--font-sans)"
                      fill="var(--foreground)"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      Message hub
                    </text>
                  </g>

                  <line
                    x1="362"
                    y1="58"
                    x2="414"
                    y2="58"
                    stroke="var(--border)"
                    strokeWidth="2"
                    markerEnd="url(#arr-docs-impl-arch)"
                  />

                  <g>
                    <rect
                      x="416"
                      y="28"
                      width="170"
                      height="60"
                      rx="14"
                      fill="var(--chart-1)"
                      opacity="0.12"
                      stroke="var(--chart-1)"
                      strokeWidth="1"
                    />
                    <text
                      x="501"
                      y="54"
                      fontSize="13"
                      fontWeight="800"
                      fontFamily="var(--font-sans)"
                      fill="var(--foreground)"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      Backend
                    </text>
                    <text
                      x="501"
                      y="74"
                      fontSize="11"
                      fontFamily="var(--font-sans)"
                      fill="var(--muted-foreground)"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      validate · persist · stream
                    </text>
                  </g>

                  <line
                    x1="586"
                    y1="58"
                    x2="638"
                    y2="58"
                    stroke="var(--border)"
                    strokeWidth="2"
                    markerEnd="url(#arr-docs-impl-arch)"
                  />

                  <g>
                    <rect
                      x="640"
                      y="28"
                      width="62"
                      height="60"
                      rx="14"
                      fill="var(--chart-3)"
                      opacity="0.12"
                      stroke="var(--border)"
                      strokeWidth="1"
                    />
                    <text
                      x="671"
                      y="56"
                      fontSize="12"
                      fontWeight="900"
                      fontFamily="var(--font-sans)"
                      fill="var(--foreground)"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      UI
                    </text>
                    <text
                      x="671"
                      y="76"
                      fontSize="10"
                      fontFamily="var(--font-sans)"
                      fill="var(--muted-foreground)"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      live
                    </text>
                  </g>

                  <line
                    x1="501"
                    y1="88"
                    x2="501"
                    y2="132"
                    stroke="var(--border)"
                    strokeWidth="2"
                    markerEnd="url(#arr-docs-impl-arch)"
                  />

                  <g>
                    <rect
                      x="418"
                      y="134"
                      width="166"
                      height="36"
                      rx="12"
                      fill="var(--muted)"
                      stroke="var(--border)"
                      strokeWidth="1"
                      strokeDasharray="5 4"
                    />
                    <text
                      x="501"
                      y="152"
                      fontSize="12"
                      fontWeight="700"
                      fontFamily="var(--font-sans)"
                      fill="var(--foreground)"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      Optional: history storage
                    </text>
                  </g>
                </svg>
              </Diagram>

              <Diagram
                title="Endpoints & streams"
                description="The main REST endpoints and live streams used by the UI."
              >
                <svg width="100%" viewBox="0 0 720 180" role="img">
                  <title>Endpoints and streams</title>
                  <desc>
                    Devices list and details are fetched via REST, live telemetry is received via
                    streams.
                  </desc>
                  <defs>
                    <marker
                      id="arr-docs-impl-api"
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
                      y="34"
                      width="170"
                      height="54"
                      rx="14"
                      fill="var(--chart-3)"
                      opacity="0.12"
                      stroke="var(--border)"
                      strokeWidth="1"
                    />
                    <text
                      x="103"
                      y="58"
                      fontSize="13"
                      fontWeight="900"
                      fontFamily="var(--font-sans)"
                      fill="var(--foreground)"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      UI
                    </text>
                    <text
                      x="103"
                      y="76"
                      fontSize="11"
                      fontFamily="var(--font-sans)"
                      fill="var(--muted-foreground)"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      pages + charts
                    </text>
                  </g>

                  <line
                    x1="188"
                    y1="61"
                    x2="246"
                    y2="61"
                    stroke="var(--border)"
                    strokeWidth="2"
                    markerEnd="url(#arr-docs-impl-api)"
                  />

                  <g>
                    <rect
                      x="248"
                      y="24"
                      width="210"
                      height="74"
                      rx="14"
                      fill="var(--chart-1)"
                      opacity="0.12"
                      stroke="var(--chart-1)"
                      strokeWidth="1"
                    />
                    <text
                      x="353"
                      y="50"
                      fontSize="13"
                      fontWeight="800"
                      fontFamily="var(--font-sans)"
                      fill="var(--foreground)"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      Backend API
                    </text>
                    <text
                      x="265"
                      y="74"
                      fontSize="11"
                      fontFamily="var(--font-mono)"
                      fill="var(--foreground)"
                    >
                      GET /api/v1/devices
                    </text>
                    <text
                      x="265"
                      y="92"
                      fontSize="11"
                      fontFamily="var(--font-mono)"
                      fill="var(--foreground)"
                    >
                      GET /api/v1/devices/&lt;id&gt;
                    </text>
                  </g>

                  <line
                    x1="458"
                    y1="61"
                    x2="512"
                    y2="61"
                    stroke="var(--border)"
                    strokeWidth="2"
                    markerEnd="url(#arr-docs-impl-api)"
                  />

                  <g>
                    <rect
                      x="514"
                      y="24"
                      width="188"
                      height="74"
                      rx="14"
                      fill="var(--chart-2)"
                      opacity="0.12"
                      stroke="var(--border)"
                      strokeWidth="1"
                    />
                    <text
                      x="608"
                      y="48"
                      fontSize="13"
                      fontWeight="900"
                      fontFamily="var(--font-sans)"
                      fill="var(--foreground)"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      Live streams
                    </text>
                    <text
                      x="528"
                      y="72"
                      fontSize="11"
                      fontFamily="var(--font-mono)"
                      fill="var(--foreground)"
                    >
                      WS /api/v1/ws/telemetry
                    </text>
                    <text
                      x="528"
                      y="90"
                      fontSize="11"
                      fontFamily="var(--font-mono)"
                      fill="var(--foreground)"
                    >
                      WS /api/v1/ws/dashboard
                    </text>
                  </g>

                  <g>
                    <rect
                      x="248"
                      y="120"
                      width="454"
                      height="40"
                      rx="14"
                      fill="var(--muted)"
                      stroke="var(--border)"
                      strokeWidth="1"
                    />
                    <text
                      x="475"
                      y="140"
                      fontSize="12"
                      fontWeight="700"
                      fontFamily="var(--font-sans)"
                      fill="var(--foreground)"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      Rule of thumb: REST for pages, streams for live updates
                    </text>
                  </g>
                </svg>
              </Diagram>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Architecture</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <p className="text-muted-foreground">
                    Telemetry flows MQTT → backend ingestion/persistence → WebSockets to the frontend.
                  </p>
                  <Diagram
                    title="Flow summary"
                    description="Simulator → message hub → backend → (optional) database, plus live updates to the UI."
                  >
                    <svg width="100%" viewBox="0 0 720 180" role="img">
                      <title>Flow summary</title>
                      <desc>
                        iot-simulator publishes to message hub, backend ingests and optionally stores,
                        then streams to the UI.
                      </desc>
                      <defs>
                        <marker
                          id="arr-docs-arch-summary"
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
                          y="28"
                          width="160"
                          height="60"
                          rx="14"
                          fill="var(--chart-2)"
                          opacity="0.14"
                          stroke="var(--chart-2)"
                          strokeWidth="1"
                        />
                        <text
                          x="98"
                          y="54"
                          fontSize="13"
                          fontWeight="900"
                          fontFamily="var(--font-sans)"
                          fill="var(--foreground)"
                          textAnchor="middle"
                          dominantBaseline="central"
                        >
                          iot-simulator
                        </text>
                        <text
                          x="98"
                          y="74"
                          fontSize="11"
                          fontFamily="var(--font-sans)"
                          fill="var(--muted-foreground)"
                          textAnchor="middle"
                          dominantBaseline="central"
                        >
                          publishes telemetry
                        </text>
                      </g>

                      <line
                        x1="178"
                        y1="58"
                        x2="234"
                        y2="58"
                        stroke="var(--border)"
                        strokeWidth="2"
                        markerEnd="url(#arr-docs-arch-summary)"
                      />

                      <g>
                        <rect
                          x="236"
                          y="32"
                          width="160"
                          height="52"
                          rx="14"
                          fill="var(--muted)"
                          stroke="var(--border)"
                          strokeWidth="1"
                        />
                        <text
                          x="316"
                          y="58"
                          fontSize="13"
                          fontWeight="800"
                          fontFamily="var(--font-sans)"
                          fill="var(--foreground)"
                          textAnchor="middle"
                          dominantBaseline="central"
                        >
                          Message hub
                        </text>
                      </g>

                      <line
                        x1="396"
                        y1="58"
                        x2="452"
                        y2="58"
                        stroke="var(--border)"
                        strokeWidth="2"
                        markerEnd="url(#arr-docs-arch-summary)"
                      />

                      <g>
                        <rect
                          x="454"
                          y="28"
                          width="170"
                          height="60"
                          rx="14"
                          fill="var(--chart-1)"
                          opacity="0.12"
                          stroke="var(--chart-1)"
                          strokeWidth="1"
                        />
                        <text
                          x="539"
                          y="54"
                          fontSize="13"
                          fontWeight="900"
                          fontFamily="var(--font-sans)"
                          fill="var(--foreground)"
                          textAnchor="middle"
                          dominantBaseline="central"
                        >
                          Backend
                        </text>
                        <text
                          x="539"
                          y="74"
                          fontSize="11"
                          fontFamily="var(--font-sans)"
                          fill="var(--muted-foreground)"
                          textAnchor="middle"
                          dominantBaseline="central"
                        >
                          ingest · validate · stream
                        </text>
                      </g>

                      <line
                        x1="539"
                        y1="88"
                        x2="539"
                        y2="130"
                        stroke="var(--border)"
                        strokeWidth="2"
                        markerEnd="url(#arr-docs-arch-summary)"
                      />

                      <g>
                        <rect
                          x="442"
                          y="132"
                          width="194"
                          height="36"
                          rx="12"
                          fill="var(--muted)"
                          stroke="var(--border)"
                          strokeWidth="1"
                          strokeDasharray="5 4"
                        />
                        <text
                          x="539"
                          y="150"
                          fontSize="12"
                          fontWeight="700"
                          fontFamily="var(--font-sans)"
                          fill="var(--foreground)"
                          textAnchor="middle"
                          dominantBaseline="central"
                        >
                          Optional: history storage
                        </text>
                      </g>

                      <line
                        x1="624"
                        y1="58"
                        x2="674"
                        y2="58"
                        stroke="var(--border)"
                        strokeWidth="2"
                        markerEnd="url(#arr-docs-arch-summary)"
                      />

                      <g>
                        <rect
                          x="676"
                          y="28"
                          width="28"
                          height="60"
                          rx="14"
                          fill="var(--chart-3)"
                          opacity="0.12"
                          stroke="var(--border)"
                          strokeWidth="1"
                        />
                        <text
                          x="690"
                          y="56"
                          fontSize="12"
                          fontWeight="900"
                          fontFamily="var(--font-sans)"
                          fill="var(--foreground)"
                          textAnchor="middle"
                          dominantBaseline="central"
                        >
                          UI
                        </text>
                        <text
                          x="690"
                          y="76"
                          fontSize="10"
                          fontFamily="var(--font-sans)"
                          fill="var(--muted-foreground)"
                          textAnchor="middle"
                          dominantBaseline="central"
                        >
                          live
                        </text>
                      </g>
                    </svg>
                  </Diagram>

                  <Separator />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <SwaggerExample
                      label="MQTT topic"
                      type="string"
                      value={"factory/<device_id>/telemetry"}
                    >
                      factory/&lt;device_id&gt;/telemetry
                    </SwaggerExample>

                    <SwaggerExample
                      label="Example payload"
                      type="application/json"
                      value={`{
  "timestamp": "2026-04-07T13:23:26.009702+00:00",
  "temperature": 45.8,
  "pressure": 124.8,
  "vibration": 2.6,
  "power_draw": 4.0,
  "rotational_speed": 980.4,
  "status": "ok"
}`}
                    >
                      <pre className="whitespace-pre-wrap">
                        {
                          "{\n  \"timestamp\": \"2026-04-07T13:23:26.009702+00:00\",\n  \"temperature\": 45.8,\n  \"pressure\": 124.8,\n  \"vibration\": 2.6,\n  \"power_draw\": 4.0,\n  \"rotational_speed\": 980.4,\n  \"status\": \"ok\"\n}"
                        }
                      </pre>
                    </SwaggerExample>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="font-medium text-foreground">Key endpoints</div>
                    <div className="grid gap-2">
                      {[
                        {
                          label: "List devices",
                          value: "GET /api/v1/devices",
                        },
                        {
                          label: "Device details",
                          value: "GET /api/v1/devices/<id>",
                        },
                        {
                          label: "Per-device live telemetry",
                          value: "WS /api/v1/ws/telemetry?device_id=<id>",
                        },
                        {
                          label: "Dashboard live updates",
                          value: "WS /api/v1/ws/dashboard",
                        },
                      ].map((e) => (
                        <div
                          key={e.value}
                          className="flex items-center justify-between gap-3 rounded-xl border bg-card px-3 py-2"
                        >
                          <div className="min-w-0">
                            <div className="text-xs text-muted-foreground">{e.label}</div>
                            <div className="font-mono text-xs text-foreground truncate">
                              {e.value}
                            </div>
                          </div>
                          <CopyButton value={e.value} label={`Copy ${e.label}`} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="font-medium">UI sections → data sources</div>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                      <li>
                        <span className="font-medium text-foreground">Dashboard KPIs / pipeline / streams / alerts / anomalies</span>:
                        initial load via REST, then live updates via <span className="font-mono text-xs">WS /api/v1/ws/dashboard</span>.
                      </li>
                      <li>
                        <span className="font-medium text-foreground">Devices list</span>:
                        <span className="font-mono text-xs">GET /api/v1/devices</span> (fast list view).
                      </li>
                      <li>
                        <span className="font-medium text-foreground">Device details</span>:
                        <span className="font-mono text-xs">GET /api/v1/devices/&lt;id&gt;</span> for sections (digital twin + findings),
                        and live readings via <span className="font-mono text-xs">WS /api/v1/ws/telemetry</span>.
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="font-medium">How to interpret “empty”</div>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                      <li>
                        <span className="font-medium text-foreground">No live telemetry</span>:
                        device is offline/stale or no publisher is sending MQTT for that device ID.
                      </li>
                      <li>
                        <span className="font-medium text-foreground">No alerts/anomalies</span>:
                        backend has not detected anything above thresholds yet.
                      </li>
                      <li>
                        <span className="font-medium text-foreground">No security findings</span>:
                        vulnerability sync/matching has not linked CVEs to the device CPE.
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>CLI verification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <Snippet
                    title="Backend health"
                    value={"curl -fsS http://localhost:8000/health"}
                  >
                    <div className="font-mono text-xs text-muted-foreground whitespace-pre-wrap">
                      curl -fsS http://localhost:8000/health
                    </div>
                  </Snippet>

                  <Snippet
                    title="WebSocket telemetry (device)"
                    value={
                      "while true; do echo ping; sleep 1; done | \\\n" +
                      '  websocat -v "ws://localhost:8000/api/v1/ws/telemetry?device_id=dev-001"'
                    }
                  >
                    <div className="font-mono text-xs text-muted-foreground whitespace-pre-wrap">
                      {
                        'while true; do echo ping; sleep 1; done | \\\n  websocat -v "ws://localhost:8000/api/v1/ws/telemetry?device_id=dev-001"'
                      }
                    </div>
                  </Snippet>

                  <Snippet
                    title="Dashboard stream"
                    value={'websocat -v "ws://localhost:8000/api/v1/ws/dashboard"'}
                  >
                    <div className="font-mono text-xs text-muted-foreground whitespace-pre-wrap">
                      websocat -v "ws://localhost:8000/api/v1/ws/dashboard"
                    </div>
                  </Snippet>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>UI reference</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-xl border bg-card p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-foreground font-medium">Dashboard</div>
                        <Badge variant="outline" className="font-mono text-[11px]">
                          /
                        </Badge>
                      </div>
                      <div className="mt-2 space-y-1 leading-6">
                        <div>
                          <span className="font-medium text-foreground">KPIs</span>: quick health
                          and activity signals.
                        </div>
                        <div>
                          <span className="font-medium text-foreground">Pipeline</span>: whether
                          data is flowing and responsive.
                        </div>
                        <div>
                          <span className="font-medium text-foreground">Detections</span>: alerts,
                          anomalies, and vulnerabilities summary.
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border bg-card p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-foreground font-medium">Devices</div>
                        <Badge variant="outline" className="font-mono text-[11px]">
                          /devices
                        </Badge>
                      </div>
                      <div className="mt-2 space-y-1 leading-6">
                        <div>
                          <span className="font-medium text-foreground">Status</span>: online,
                          offline, warning.
                        </div>
                        <div>
                          <span className="font-medium text-foreground">Telemetry</span>: live vs
                          stale based on recency.
                        </div>
                        <div>
                          <span className="font-medium text-foreground">Last seen</span>: when the
                          latest reading arrived.
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border bg-card p-4 sm:col-span-2 xl:col-span-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-foreground font-medium">Device details</div>
                        <Badge variant="outline" className="font-mono text-[11px]">
                          /devices/&lt;id&gt;
                        </Badge>
                      </div>
                      <div className="mt-2 space-y-1 leading-6">
                        <div>
                          <span className="font-medium text-foreground">Live telemetry</span>:
                          realtime readings + trends.
                        </div>
                        <div>
                          <span className="font-medium text-foreground">Current state</span>:
                          digital twin snapshot.
                        </div>
                        <div>
                          <span className="font-medium text-foreground">Findings</span>: CVEs and
                          alerts linked to this device.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border bg-muted/40 p-4">
                    <div className="font-medium text-foreground">Interpreting empty sections</div>
                    <div className="mt-1 leading-6">
                      Empty usually means <span className="font-medium text-foreground">no data yet</span>{" "}
                      (offline device, no publisher, or just started). If you need the contract,
                      see{" "}
                      <Link
                        className="underline underline-offset-4"
                        href="/docs/iot-integration-technical"
                      >
                        Integration details
                      </Link>
                      .
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Troubleshooting</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="rounded-xl border bg-card p-4">
                    <div className="font-medium text-foreground">No live telemetry</div>
                    <div className="mt-1 leading-6">
                      Check there is a publisher for the device ID, and the backend is connected
                      to the message hub.
                    </div>
                  </div>

                  <div className="rounded-xl border bg-card p-4">
                    <div className="font-medium text-foreground">Dashboard not updating</div>
                    <div className="mt-1 leading-6">
                      Verify the live stream{" "}
                      <span className="font-mono text-xs text-foreground">
                        WS /api/v1/ws/dashboard
                      </span>{" "}
                      and check backend logs.
                    </div>
                  </div>

                  <div className="rounded-xl border bg-card p-4">
                    <div className="font-medium text-foreground">Findings are empty</div>
                    <div className="mt-1 leading-6">
                      Findings appear after vulnerability sync and device matching (can take some
                      time in a fresh environment).
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

