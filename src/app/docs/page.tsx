"use client"

import * as React from "react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DocsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <div className="mb-8 space-y-2">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Docs</h1>
          <p className="text-muted-foreground">
            Non‑technical overview and technical reference for the IoT simulation + live telemetry demo.
          </p>
        </div>

        <Tabs defaultValue="non-technical" className="gap-6">
          <TabsList variant="line" className="w-full justify-start gap-1">
            <TabsTrigger value="non-technical">Non‑technical</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
          </TabsList>

          <TabsContent value="non-technical" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>What this demo is (non‑technical)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <p className="text-muted-foreground">
                    This platform includes a live factory simulation so you can demo monitoring without real machines.
                    Devices continuously send readings like temperature, pressure and vibration.
                  </p>

                  <Separator />

                  <div className="space-y-2">
                    <div className="font-medium">The 3 building blocks</div>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                      <li>
                        <span className="font-medium text-foreground">Simulator</span> generates realistic device signals.
                      </li>
                      <li>
                        <span className="font-medium text-foreground">MQTT broker</span> (Mosquitto) carries device messages.
                      </li>
                      <li>
                        <span className="font-medium text-foreground">Backend</span> stores “last known state” and streams live updates to the UI.
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="font-medium">Why MQTT + WebSockets</div>
                    <p className="text-muted-foreground">
                      Machines commonly use <Badge variant="outline">MQTT</Badge>. Browsers don’t.
                      The backend bridges MQTT to <Badge variant="outline">WebSockets</Badge> so the UI updates instantly.
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="font-medium">How to read the UI (what users expect)</div>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                      <li>
                        <span className="font-medium text-foreground">Dashboard</span> answers “Is the system healthy right now?”
                      </li>
                      <li>
                        <span className="font-medium text-foreground">Devices</span> answers “Which assets exist and which ones are active?”
                      </li>
                      <li>
                        <span className="font-medium text-foreground">Device details</span> answers “What is happening on this single device?”
                      </li>
                      <li>
                        If a card is empty, it usually means <span className="font-medium text-foreground">no signal yet</span> (not an error).
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick demo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-muted-foreground">
                    Open the device inventory and drill into any online device to see live telemetry.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/devices">Open Devices</Link>
                  </Button>
                  <div className="rounded-xl border bg-card p-4 text-muted-foreground">
                    <div className="font-medium text-foreground">Tip</div>
                    <div className="mt-1">
                      If a section is empty, it usually means the simulator/pipeline hasn’t produced signals yet.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>UI map (non‑technical)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="space-y-2">
                    <div className="font-medium">Dashboard cards</div>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                      <li><span className="font-medium text-foreground">Threats detected</span>: how many security alerts are currently active.</li>
                      <li><span className="font-medium text-foreground">Devices monitored</span>: how many devices are currently sending data.</li>
                      <li><span className="font-medium text-foreground">System uptime</span>: backend service uptime for the demo.</li>
                      <li><span className="font-medium text-foreground">Response time</span>: estimated end‑to‑end responsiveness of the monitoring loop.</li>
                    </ul>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="font-medium">Pipeline + streams</div>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                      <li><span className="font-medium text-foreground">Data pipeline</span>: health of each processing stage (throughput, success, latency).</li>
                      <li><span className="font-medium text-foreground">Data streams</span>: quick view of what data categories are flowing (vision, sensors, network, quality).</li>
                    </ul>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="font-medium">Detections</div>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                      <li><span className="font-medium text-foreground">Alerts</span>: security events that need attention.</li>
                      <li><span className="font-medium text-foreground">Vulnerabilities</span>: top CVEs relevant to your asset inventory.</li>
                      <li><span className="font-medium text-foreground">Anomaly detector</span>: unusual patterns in telemetry.</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Devices + details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div>
                    <div className="font-medium text-foreground">Devices list</div>
                    Each device card shows status, risk/compliance, last seen, and whether live telemetry is available.
                  </div>
                  <Separator />
                  <div>
                    <div className="font-medium text-foreground">Device details</div>
                    The page combines live telemetry, current digital twin state, and security findings (CVEs + alerts).
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="technical" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Architecture (technical)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <p className="text-muted-foreground">
                    Telemetry flows MQTT → backend ingestion/persistence → WebSockets to the frontend.
                  </p>
                  <div className="rounded-xl border bg-card p-4 font-mono text-xs text-muted-foreground whitespace-pre-wrap">
                    iot-simulator → Mosquitto (MQTT) → iot-security-backend → PostgreSQL
                                                           ↘︎ WebSockets (/api/v1/ws/*) → www
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="font-medium">MQTT contract</div>
                    <div className="text-muted-foreground">
                      Topic pattern: <span className="font-mono text-xs">factory/&lt;device_id&gt;/telemetry</span>
                    </div>
                    <div className="rounded-xl border bg-card p-4 font-mono text-xs text-muted-foreground whitespace-pre-wrap">
                      {"{\n  \"timestamp\": \"2026-04-07T13:23:26.009702+00:00\",\n  \"temperature\": 45.8,\n  \"pressure\": 124.8,\n  \"vibration\": 2.6,\n  \"power_draw\": 4.0,\n  \"rotational_speed\": 980.4,\n  \"status\": \"ok\"\n}"}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="font-medium">Key endpoints</div>
                    <ul className="text-muted-foreground space-y-1">
                      <li>
                        <span className="font-mono text-xs">GET /api/v1/devices</span> — list devices
                      </li>
                      <li>
                        <span className="font-mono text-xs">GET /api/v1/devices/&lt;id&gt;</span> — device details
                      </li>
                      <li>
                        <span className="font-mono text-xs">WS /api/v1/ws/telemetry?device_id=&lt;id&gt;</span> — per-device live stream
                      </li>
                      <li>
                        <span className="font-mono text-xs">WS /api/v1/ws/dashboard</span> — dashboard live updates
                      </li>
                    </ul>
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
                    <div className="font-medium">How to interpret “empty” (technical)</div>
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
                  <div className="space-y-2">
                    <div className="font-medium">Backend health</div>
                    <div className="rounded-xl border bg-card p-3 font-mono text-xs text-muted-foreground whitespace-pre-wrap">
                      curl -fsS http://localhost:8000/health
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="font-medium">WebSocket telemetry</div>
                    <div className="rounded-xl border bg-card p-3 font-mono text-xs text-muted-foreground whitespace-pre-wrap">
                      {"while true; do echo ping; sleep 1; done | \\\n  websocat -v \"ws://localhost:8000/api/v1/ws/telemetry?device_id=dev-001\""}
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="font-medium">Dashboard stream</div>
                    <div className="rounded-xl border bg-card p-3 font-mono text-xs text-muted-foreground whitespace-pre-wrap">
                      {"websocat -v \"ws://localhost:8000/api/v1/ws/dashboard\""}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>UI reference (technical)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="space-y-2">
                    <div className="font-medium">Dashboard (`/`)</div>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                      <li><span className="font-medium text-foreground">Threats detected</span>: count of active alerts.</li>
                      <li><span className="font-medium text-foreground">Pipeline</span>: stage metrics (throughput/success/latency) derived from backend aggregation.</li>
                      <li><span className="font-medium text-foreground">Streams</span>: current stream rates/values derived from telemetry presence.</li>
                      <li><span className="font-medium text-foreground">Alerts</span>: recent alert list (severity/title/source/status).</li>
                      <li><span className="font-medium text-foreground">Vulnerabilities</span>: top CVEs summary by CVSS.</li>
                      <li><span className="font-medium text-foreground">Anomaly detector</span>: recent anomalies (device + score + severity).</li>
                      <li><span className="font-medium text-foreground">Devices</span>: quick links to top devices.</li>
                    </ul>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="font-medium">Devices (`/devices`)</div>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                      <li><span className="font-medium text-foreground">Status badge</span>: online/offline/warning is the operator’s first signal.</li>
                      <li><span className="font-medium text-foreground">Telemetry badge</span>: live/on, stale, or off based on status + last seen recency.</li>
                      <li><span className="font-medium text-foreground">Risk / compliance</span>: current posture scores shown as quick KPIs.</li>
                      <li><span className="font-medium text-foreground">Last seen</span>: recency of the latest telemetry stored for the device.</li>
                    </ul>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="font-medium">Device details (`/devices/&lt;id&gt;`)</div>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                      <li><span className="font-medium text-foreground">Live telemetry</span>: websocket stream + trends chart + key readings.</li>
                      <li><span className="font-medium text-foreground">Digital twin state</span>: curated current state snapshot stored in the device record.</li>
                      <li><span className="font-medium text-foreground">Security findings</span>: CVEs matched from device CPE + vulnerability database.</li>
                      <li><span className="font-medium text-foreground">Recent alerts</span>: active alerts related to this device.</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Troubleshooting</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div>
                    <div className="font-medium text-foreground">Telemetry empty</div>
                    Ensure the simulator is publishing MQTT and the backend is connected to Mosquitto.
                  </div>
                  <Separator />
                  <div>
                    <div className="font-medium text-foreground">Findings empty</div>
                    Ensure vulnerability sync and CPE matching have run.
                  </div>
                  <Separator />
                  <div>
                    <div className="font-medium text-foreground">Dashboard not updating</div>
                    Check <span className="font-mono text-xs">WS /api/v1/ws/dashboard</span> connectivity and backend logs.
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

