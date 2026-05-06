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

function TocLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      className="block rounded-lg px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {children}
    </a>
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

export default function IoTMigrationGuidePage() {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/docs">Back to Docs</Link>
        </Button>
        <Badge variant="outline">Migration</Badge>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0 space-y-10">
          <div className="space-y-3">
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Migration guide
            </p>
            <h1 className="font-heading text-3xl font-semibold tracking-tight">
              From{" "}
              <span className="font-mono text-[0.95em] font-medium">
                iot-simulator
              </span>{" "}
              to real machines
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground leading-6">
              Replace the demo data source with live industrial telemetry while
              keeping the rest of the platform unchanged.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="secondary">Overview</Badge>
              <Badge variant="secondary">Architecture overview</Badge>
              <Badge variant="secondary">Migration checklist</Badge>
            </div>
          </div>

          <Card id="summary" className="scroll-mt-24">
            <CardHeader>
              <CardTitle>Executive summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Key idea:</span>{" "}
                the simulator is only a <span className="font-medium">data source</span>.
                Real machines can become the new data source with minimal change to
                the platform.
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border bg-card p-4">
                  <div className="text-foreground font-medium">What stays the same</div>
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    <li>Backend still ingests, stores (optional), and streams live updates.</li>
                    <li>Dashboard still receives live updates from the backend.</li>
                  </ul>
                </div>
                <div className="rounded-xl border bg-card p-4">
                  <div className="text-foreground font-medium">What changes</div>
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    <li>The simulator is turned off (or kept only for demos/testing).</li>
                    <li>Real machines (or a site gateway) become the telemetry source.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <section id="today" className="scroll-mt-24 space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Current state
              </p>
              <h2 className="font-heading text-xl font-semibold tracking-tight">
                How the system works today
              </h2>
              <p className="text-sm text-muted-foreground leading-6">
                The simulator produces fake machine readings and feeds them through the same
                pipeline that real machines will eventually use.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Diagram
                title="Physical view"
                description="Who talks to whom (in simple terms)."
              >
                  <svg
                    width="100%"
                    viewBox="0 0 640 110"
                    role="img"
                    className="text-foreground"
                  >
                    <title>Current system: physical view</title>
                    <desc>
                      Telemetry simulator sends to message hub, which sends to platform backend,
                      which sends to users (dashboard).
                    </desc>
                    <defs>
                      <marker
                        id="arr"
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
                        x="10"
                        y="28"
                        width="138"
                        height="54"
                        rx="12"
                        fill="var(--chart-2)"
                        opacity="0.16"
                        stroke="var(--chart-2)"
                        strokeWidth="1"
                      />
                      <text
                        fontSize="13"
                        fontWeight="600"
                        fontFamily="var(--font-sans)"
                        fill="var(--foreground)"
                        x="79"
                        y="50"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        Telemetry Simulator
                      </text>
                      <text
                        fontSize="11"
                        fontFamily="var(--font-sans)"
                        fill="var(--muted-foreground)"
                        x="79"
                        y="67"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        pretend machines
                      </text>
                    </g>
                    <line
                      x1="148"
                      y1="55"
                      x2="188"
                      y2="55"
                      stroke="var(--border)"
                      strokeWidth="2"
                      markerEnd="url(#arr)"
                    />
                    <g>
                      <rect
                        x="190"
                        y="28"
                        width="110"
                        height="54"
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
                        x="245"
                        y="50"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        Message Hub
                      </text>
                      <text
                        fontSize="11"
                        fontFamily="var(--font-sans)"
                        fill="var(--muted-foreground)"
                        x="245"
                        y="67"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        controlled env
                      </text>
                    </g>
                    <line
                      x1="300"
                      y1="55"
                      x2="342"
                      y2="55"
                      stroke="var(--border)"
                      strokeWidth="2"
                      markerEnd="url(#arr)"
                    />
                    <g>
                      <rect
                        x="344"
                        y="28"
                        width="148"
                        height="54"
                        rx="12"
                        fill="var(--chart-1)"
                        opacity="0.14"
                        stroke="var(--chart-1)"
                        strokeWidth="1"
                      />
                      <text
                        fontSize="13"
                        fontWeight="600"
                        fontFamily="var(--font-sans)"
                        fill="var(--foreground)"
                        x="418"
                        y="50"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        Platform Backend
                      </text>
                      <text
                        fontSize="11"
                        fontFamily="var(--font-sans)"
                        fill="var(--muted-foreground)"
                        x="418"
                        y="67"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        ingest · store · stream
                      </text>
                    </g>
                    <line
                      x1="492"
                      y1="55"
                      x2="534"
                      y2="55"
                      stroke="var(--border)"
                      strokeWidth="2"
                      markerEnd="url(#arr)"
                    />
                    <g>
                      <rect
                        x="536"
                        y="28"
                        width="90"
                        height="54"
                        rx="12"
                        fill="var(--chart-3)"
                        opacity="0.12"
                        stroke="var(--border)"
                        strokeWidth="1"
                      />
                      <text
                        fontSize="13"
                        fontWeight="600"
                        fontFamily="var(--font-sans)"
                        fill="var(--foreground)"
                        x="581"
                        y="50"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        Dashboard
                      </text>
                      <text
                        fontSize="11"
                        fontFamily="var(--font-sans)"
                        fill="var(--muted-foreground)"
                        x="581"
                        y="67"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        users
                      </text>
                    </g>
                  </svg>
              </Diagram>

              <Diagram
                title="Logical view"
                description="What happens to telemetry inside the platform."
              >
                  <svg width="100%" viewBox="0 0 640 360" role="img">
                    <title>Current system: logical data flow</title>
                    <desc>
                      Telemetry is generated, delivered, validated, used to update device state,
                      then optionally stored and pushed live to dashboard.
                    </desc>
                    <defs>
                      <marker
                        id="arr2"
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
                    <rect
                      x="200"
                      y="10"
                      width="240"
                      height="48"
                      rx="12"
                      fill="var(--chart-2)"
                      opacity="0.16"
                      stroke="var(--chart-2)"
                      strokeWidth="1"
                    />
                    <text
                      fontSize="13"
                      fontWeight="600"
                      fontFamily="var(--font-sans)"
                      fill="var(--foreground)"
                      x="320"
                      y="30"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      Telemetry generated
                    </text>
                    <text
                      fontSize="11"
                      fontFamily="var(--font-sans)"
                      fill="var(--muted-foreground)"
                      x="320"
                      y="46"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      simulated readings
                    </text>
                    <line
                      x1="320"
                      y1="58"
                      x2="320"
                      y2="74"
                      stroke="var(--border)"
                      strokeWidth="2"
                      markerEnd="url(#arr2)"
                    />

                    <rect
                      x="200"
                      y="76"
                      width="240"
                      height="48"
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
                      x="320"
                      y="96"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      Telemetry delivered
                    </text>
                    <text
                      fontSize="11"
                      fontFamily="var(--font-sans)"
                      fill="var(--muted-foreground)"
                      x="320"
                      y="112"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      to the platform
                    </text>
                    <line
                      x1="320"
                      y1="124"
                      x2="320"
                      y2="140"
                      stroke="var(--border)"
                      strokeWidth="2"
                      markerEnd="url(#arr2)"
                    />

                    <rect
                      x="160"
                      y="142"
                      width="320"
                      height="48"
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
                      x="320"
                      y="162"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      Backend validates &amp; normalises
                    </text>
                    <text
                      fontSize="11"
                      fontFamily="var(--font-sans)"
                      fill="var(--muted-foreground)"
                      x="320"
                      y="178"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      makes readings consistent
                    </text>
                    <line
                      x1="320"
                      y1="190"
                      x2="320"
                      y2="206"
                      stroke="var(--border)"
                      strokeWidth="2"
                      markerEnd="url(#arr2)"
                    />

                    <rect
                      x="140"
                      y="208"
                      width="360"
                      height="48"
                      rx="12"
                      fill="var(--chart-1)"
                      opacity="0.08"
                      stroke="var(--border)"
                      strokeWidth="1"
                    />
                    <text
                      fontSize="13"
                      fontWeight="600"
                      fontFamily="var(--font-sans)"
                      fill="var(--foreground)"
                      x="320"
                      y="228"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      Current device state updated
                    </text>
                    <text
                      fontSize="11"
                      fontFamily="var(--font-sans)"
                      fill="var(--muted-foreground)"
                      x="320"
                      y="244"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      latest reading per machine
                    </text>

                    <line
                      x1="220"
                      y1="256"
                      x2="130"
                      y2="256"
                      stroke="var(--border)"
                      strokeWidth="2"
                    />
                    <line
                      x1="130"
                      y1="256"
                      x2="130"
                      y2="290"
                      stroke="var(--border)"
                      strokeWidth="2"
                      markerEnd="url(#arr2)"
                    />
                    <rect
                      x="50"
                      y="292"
                      width="160"
                      height="48"
                      rx="12"
                      fill="var(--muted)"
                      stroke="var(--border)"
                      strokeWidth="1"
                      strokeDasharray="4 3"
                    />
                    <text
                      fontSize="13"
                      fontWeight="600"
                      fontFamily="var(--font-sans)"
                      fill="var(--muted-foreground)"
                      x="130"
                      y="312"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      History stored
                    </text>
                    <text
                      fontSize="11"
                      fontFamily="var(--font-sans)"
                      fill="var(--muted-foreground)"
                      x="130"
                      y="328"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      optional
                    </text>

                    <line
                      x1="420"
                      y1="256"
                      x2="510"
                      y2="256"
                      stroke="var(--border)"
                      strokeWidth="2"
                    />
                    <line
                      x1="510"
                      y1="256"
                      x2="510"
                      y2="290"
                      stroke="var(--border)"
                      strokeWidth="2"
                      markerEnd="url(#arr2)"
                    />
                    <rect
                      x="430"
                      y="292"
                      width="160"
                      height="48"
                      rx="12"
                      fill="var(--secondary)"
                      opacity="0.22"
                      stroke="var(--border)"
                      strokeWidth="1"
                    />
                    <text
                      fontSize="13"
                      fontWeight="600"
                      fontFamily="var(--font-sans)"
                      fill="var(--foreground)"
                      x="510"
                      y="312"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      Live updates pushed
                    </text>
                    <text
                      fontSize="11"
                      fontFamily="var(--font-sans)"
                      fill="var(--muted-foreground)"
                      x="510"
                      y="328"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      to dashboard
                    </text>
                  </svg>
              </Diagram>
            </div>
          </section>

          <Separator />

          <section id="future" className="scroll-mt-24 space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Target state
              </p>
              <h2 className="font-heading text-xl font-semibold tracking-tight">
                How the system works with real machines
              </h2>
              <p className="text-sm text-muted-foreground leading-6">
                Real machines rarely communicate directly with platforms. A{" "}
                <span className="font-medium text-foreground">site gateway</span>{" "}
                (or connector) collects signals and forwards them in a platform-friendly format.
              </p>
            </div>

            <div className="rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Key insight:</span>{" "}
              the backend, storage, and dashboard are unchanged. Only the first link in the chain
              — the telemetry source — is swapped.
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Diagram
                title="Physical view"
                description="New/changed parts highlighted."
              >
                  <svg width="100%" viewBox="0 0 640 130" role="img">
                    <title>Target system: physical view</title>
                    <desc>
                      Real machines connect to a site gateway which connects to a message hub which
                      connects to platform backend which connects to dashboard.
                    </desc>
                    <defs>
                      <marker
                        id="arr3"
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
                        x="6"
                        y="28"
                        width="118"
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
                        x="65"
                        y="52"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        Real Machines
                      </text>
                      <text
                        fontSize="11"
                        fontFamily="var(--font-sans)"
                        fill="var(--muted-foreground)"
                        x="65"
                        y="68"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        PLCs · sensors
                      </text>
                      <text
                        fontSize="11"
                        fontFamily="var(--font-sans)"
                        fill="var(--muted-foreground)"
                        x="65"
                        y="82"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        controllers
                      </text>
                    </g>

                    <line
                      x1="124"
                      y1="60"
                      x2="142"
                      y2="60"
                      stroke="var(--border)"
                      strokeWidth="2"
                      markerEnd="url(#arr3)"
                    />

                    <g>
                      <rect
                        x="144"
                        y="28"
                        width="120"
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
                        x="204"
                        y="48"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        Site Gateway
                      </text>
                      <text
                        fontSize="11"
                        fontFamily="var(--font-sans)"
                        fill="var(--muted-foreground)"
                        x="204"
                        y="65"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        collect + normalise
                      </text>
                      <text
                        fontSize="11"
                        fontFamily="var(--font-sans)"
                        fill="var(--muted-foreground)"
                        x="204"
                        y="80"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        + forward
                      </text>
                    </g>

                    <line
                      x1="264"
                      y1="60"
                      x2="284"
                      y2="60"
                      stroke="var(--border)"
                      strokeWidth="2"
                      markerEnd="url(#arr3)"
                    />

                    <g>
                      <rect
                        x="286"
                        y="34"
                        width="110"
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
                        x="341"
                        y="56"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        Message Hub
                      </text>
                      <text
                        fontSize="11"
                        fontFamily="var(--font-sans)"
                        fill="var(--muted-foreground)"
                        x="341"
                        y="72"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        managed
                      </text>
                    </g>

                    <line
                      x1="396"
                      y1="60"
                      x2="416"
                      y2="60"
                      stroke="var(--border)"
                      strokeWidth="2"
                      markerEnd="url(#arr3)"
                    />

                    <g>
                      <rect
                        x="418"
                        y="34"
                        width="118"
                        height="52"
                        rx="12"
                        fill="var(--chart-1)"
                        opacity="0.10"
                        stroke="var(--border)"
                        strokeWidth="1"
                      />
                      <text
                        fontSize="13"
                        fontWeight="600"
                        fontFamily="var(--font-sans)"
                        fill="var(--foreground)"
                        x="477"
                        y="56"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        Platform Backend
                      </text>
                      <text
                        fontSize="11"
                        fontFamily="var(--font-sans)"
                        fill="var(--muted-foreground)"
                        x="477"
                        y="72"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        unchanged
                      </text>
                    </g>

                    <line
                      x1="536"
                      y1="60"
                      x2="556"
                      y2="60"
                      stroke="var(--border)"
                      strokeWidth="2"
                      markerEnd="url(#arr3)"
                    />

                    <g>
                      <rect
                        x="558"
                        y="34"
                        width="76"
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
                        x="596"
                        y="56"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        Dashboard
                      </text>
                      <text
                        fontSize="11"
                        fontFamily="var(--font-sans)"
                        fill="var(--muted-foreground)"
                        x="596"
                        y="72"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        unchanged
                      </text>
                    </g>

                    <rect
                      x="8"
                      y="106"
                      width="10"
                      height="10"
                      rx="2"
                      fill="var(--chart-3)"
                      opacity="0.16"
                      stroke="var(--chart-3)"
                      strokeWidth="1"
                    />
                    <text
                      fontSize="11"
                      fontFamily="var(--font-sans)"
                      fill="var(--muted-foreground)"
                      x="22"
                      y="116"
                    >
                      New / changed
                    </text>
                  </svg>
              </Diagram>

              <Diagram
                title="Logical view"
                description="Same platform steps; new source at the start."
              >
                  <svg width="100%" viewBox="0 0 640 360" role="img">
                    <title>Target system: logical data flow</title>
                    <desc>
                      Same logical flow as today — only the first steps change from simulated to
                      real measurements forwarded via a gateway.
                    </desc>
                    <defs>
                      <marker
                        id="arr4"
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

                    <rect
                      x="160"
                      y="10"
                      width="320"
                      height="48"
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
                      x="320"
                      y="30"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      Telemetry measured
                    </text>
                    <text
                      fontSize="11"
                      fontFamily="var(--font-sans)"
                      fill="var(--muted-foreground)"
                      x="320"
                      y="46"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      real readings from machines
                    </text>
                    <line
                      x1="320"
                      y1="58"
                      x2="320"
                      y2="74"
                      stroke="var(--border)"
                      strokeWidth="2"
                      markerEnd="url(#arr4)"
                    />

                    <rect
                      x="160"
                      y="76"
                      width="320"
                      height="48"
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
                      x="320"
                      y="96"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      Telemetry forwarded
                    </text>
                    <text
                      fontSize="11"
                      fontFamily="var(--font-sans)"
                      fill="var(--muted-foreground)"
                      x="320"
                      y="112"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      via gateway / connector
                    </text>
                    <line
                      x1="320"
                      y1="124"
                      x2="320"
                      y2="140"
                      stroke="var(--border)"
                      strokeWidth="2"
                      markerEnd="url(#arr4)"
                    />

                    <rect
                      x="160"
                      y="142"
                      width="320"
                      height="48"
                      rx="12"
                      fill="var(--chart-1)"
                      opacity="0.08"
                      stroke="var(--border)"
                      strokeWidth="1"
                    />
                    <text
                      fontSize="13"
                      fontWeight="600"
                      fontFamily="var(--font-sans)"
                      fill="var(--foreground)"
                      x="320"
                      y="162"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      Backend validates &amp; normalises
                    </text>
                    <text
                      fontSize="11"
                      fontFamily="var(--font-sans)"
                      fill="var(--muted-foreground)"
                      x="320"
                      y="178"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      unchanged
                    </text>
                    <line
                      x1="320"
                      y1="190"
                      x2="320"
                      y2="206"
                      stroke="var(--border)"
                      strokeWidth="2"
                      markerEnd="url(#arr4)"
                    />

                    <rect
                      x="140"
                      y="208"
                      width="360"
                      height="48"
                      rx="12"
                      fill="var(--chart-1)"
                      opacity="0.06"
                      stroke="var(--border)"
                      strokeWidth="1"
                    />
                    <text
                      fontSize="13"
                      fontWeight="600"
                      fontFamily="var(--font-sans)"
                      fill="var(--foreground)"
                      x="320"
                      y="228"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      Current device state updated
                    </text>
                    <text
                      fontSize="11"
                      fontFamily="var(--font-sans)"
                      fill="var(--muted-foreground)"
                      x="320"
                      y="244"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      unchanged
                    </text>

                    <line
                      x1="220"
                      y1="256"
                      x2="130"
                      y2="256"
                      stroke="var(--border)"
                      strokeWidth="2"
                    />
                    <line
                      x1="130"
                      y1="256"
                      x2="130"
                      y2="290"
                      stroke="var(--border)"
                      strokeWidth="2"
                      markerEnd="url(#arr4)"
                    />
                    <rect
                      x="50"
                      y="292"
                      width="160"
                      height="48"
                      rx="12"
                      fill="var(--muted)"
                      stroke="var(--border)"
                      strokeWidth="1"
                      strokeDasharray="4 3"
                    />
                    <text
                      fontSize="13"
                      fontWeight="600"
                      fontFamily="var(--font-sans)"
                      fill="var(--muted-foreground)"
                      x="130"
                      y="312"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      History stored
                    </text>
                    <text
                      fontSize="11"
                      fontFamily="var(--font-sans)"
                      fill="var(--muted-foreground)"
                      x="130"
                      y="328"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      optional
                    </text>

                    <line
                      x1="420"
                      y1="256"
                      x2="510"
                      y2="256"
                      stroke="var(--border)"
                      strokeWidth="2"
                    />
                    <line
                      x1="510"
                      y1="256"
                      x2="510"
                      y2="290"
                      stroke="var(--border)"
                      strokeWidth="2"
                      markerEnd="url(#arr4)"
                    />
                    <rect
                      x="430"
                      y="292"
                      width="160"
                      height="48"
                      rx="12"
                      fill="var(--secondary)"
                      opacity="0.22"
                      stroke="var(--border)"
                      strokeWidth="1"
                    />
                    <text
                      fontSize="13"
                      fontWeight="600"
                      fontFamily="var(--font-sans)"
                      fill="var(--foreground)"
                      x="510"
                      y="312"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      Live updates pushed
                    </text>
                    <text
                      fontSize="11"
                      fontFamily="var(--font-sans)"
                      fill="var(--muted-foreground)"
                      x="510"
                      y="328"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      to dashboard
                    </text>
                  </svg>
              </Diagram>
            </div>
          </section>

          <Separator />

          <section id="phases" className="scroll-mt-24 space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Recommended approach
              </p>
              <h2 className="font-heading text-xl font-semibold tracking-tight">
                Migration phases
              </h2>
              <p className="text-sm text-muted-foreground leading-6">
                Keep the platform unchanged and replace only the telemetry source. Roll out at a
                pace that matches site readiness.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  phase: "Phase 0",
                  title: "Keep simulator for demos",
                  desc: "Leave iot-simulator available for rehearsals and training.",
                },
                {
                  phase: "Phase 1",
                  title: "Pilot — one machine",
                  desc: "Onboard a single machine or line. Validate end-to-end flow before expanding.",
                },
                {
                  phase: "Phase 2",
                  title: "Parallel run",
                  desc: "Real telemetry for pilot machines; simulator fills the rest.",
                },
                {
                  phase: "Phase 3",
                  title: "Scale out",
                  desc: "Onboard remaining machines in batches.",
                },
                {
                  phase: "Phase 4",
                  title: "Retire simulator",
                  desc: "Disable in production; optionally keep for test/training environments.",
                },
              ].map((p) => (
                <div key={p.phase} className="rounded-xl border bg-card p-4">
                  <div className="text-xs font-medium text-muted-foreground">
                    {p.phase}
                  </div>
                  <div className="mt-1 text-sm font-medium text-foreground">
                    {p.title}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground leading-6">
                    {p.desc.replace("iot-simulator", "iot-simulator")}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          <section id="checklist" className="scroll-mt-24 space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Step-by-step
              </p>
              <h2 className="font-heading text-xl font-semibold tracking-tight">
                Migration checklist
              </h2>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: "Choose the integration pattern",
                  desc: "Direct machine feed (rare), site gateway (common), or existing plant data platform.",
                },
                {
                  title: "Define the device inventory",
                  desc: "List machines, locations, and available measurements. Assign stable machine IDs.",
                },
                {
                  title: "Align on measurement definitions",
                  desc: "Confirm units (°C vs °F, PSI vs bar) and sampling rates.",
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
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-3 rounded-xl border bg-card p-4"
                >
                  <div className="mt-1 h-5 w-5 shrink-0 rounded-full border" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground">
                      {item.title}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground leading-6">
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          <section id="success" className="scroll-mt-24 space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Done when
              </p>
              <h2 className="font-heading text-xl font-semibold tracking-tight">
                Success criteria
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
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
              ].map((s) => (
                <div key={s.title} className="rounded-xl border bg-card p-4">
                  <div className="text-sm font-medium text-foreground">
                    {s.title}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground leading-6">
                    {s.desc}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-3 rounded-2xl border bg-card p-4">
            <div className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              On this page
            </div>
            <nav aria-label="Table of contents">
              <ul className="flex flex-col gap-1">
                <li>
                  <TocLink href="#summary">Executive summary</TocLink>
                </li>
                <li>
                  <TocLink href="#today">How it works today</TocLink>
                </li>
                <li>
                  <TocLink href="#future">With real machines</TocLink>
                </li>
                <li>
                  <TocLink href="#phases">Migration phases</TocLink>
                </li>
                <li>
                  <TocLink href="#checklist">Checklist</TocLink>
                </li>
                <li>
                  <TocLink href="#success">Success criteria</TocLink>
                </li>
              </ul>
            </nav>
            <Separator />
            <div className="text-xs text-muted-foreground leading-5">
              This guide intentionally avoids protocol-level details. If you need the integration
              contract, see{" "}
              <Link
                className="underline underline-offset-4"
                href="/docs/iot-integration-technical"
              >
                the integration details page
              </Link>
              .
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

