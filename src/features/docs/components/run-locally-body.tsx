import Link from "next/link"

import { Callout } from "@/features/docs/components/callout"
import { DocsDetails } from "@/features/docs/components/docs-details"
import { DocsPageHeader } from "@/features/docs/components/docs-page-header"
import { DocsShellCommand } from "@/features/docs/components/docs-shell-command"
import { DocsStep, DocsSteps } from "@/features/docs/components/docs-steps"
import { Snippet } from "@/features/docs/components/snippet"
import { SimulatedTerminal, type TerminalLine } from "@/features/docs/components/simulated-terminal"
import {
  BACKEND_BASE_URL_ENV_VAR,
  SIMULATOR_GITHUB_REPO_URL,
  SIMULATOR_RUN_COMMAND,
  WEB_UI_GITHUB_REPO_URL,
} from "@/lib/platform-constants"
import { KeyRoundIcon, MonitorIcon, RadioTowerIcon, RocketIcon } from "lucide-react"

const dashboardClone = `git clone ${WEB_UI_GITHUB_REPO_URL}.git && cd iot-security-platform-demo`
const dashboardEnv = `${BACKEND_BASE_URL_ENV_VAR}=https://<peaksoft-backend-url>`
const simulatorClone = `git clone ${SIMULATOR_GITHUB_REPO_URL}.git && cd iot-simulator`
const simulatorEnv = `MQTT_HOST=<broker-host>\nMQTT_PORT=443\nMQTT_TRANSPORT=websockets\nMQTT_TLS=true\nMQTT_USERNAME=iot_client\nMQTT_PASSWORD=<password-from-peaksoft>`

const dashboardRunOutput: TerminalLine[] = [
  { text: "> next dev", tone: "muted" },
  { text: "▲ Next.js 16.2.2 (Turbopack)", tone: "default" },
  { text: "- Local:   http://localhost:3000", tone: "default" },
  { text: "✓ Ready in 1.1s", tone: "success" },
]

const simulatorRunOutput: TerminalLine[] = [
  { text: "Connecting to broker over WSS...", tone: "muted" },
  { text: "Connected to MQTT broker ✓", tone: "success" },
  { text: "Publishing factory/dev-001/telemetry @ 1 Hz", tone: "default" },
  { text: "Publishing factory/dev-002/telemetry @ 1 Hz", tone: "default" },
  { text: "Publishing factory/dev-003/telemetry @ 1 Hz", tone: "default" },
  { text: "(open the dashboard to watch it arrive)", tone: "muted" },
]

const requirements = [
  { icon: MonitorIcon, title: "Node.js 20+ and pnpm", desc: "To run the dashboard." },
  { icon: RadioTowerIcon, title: "Python 3.10+", desc: "To run the simulator (no Docker)." },
  { icon: KeyRoundIcon, title: "Access from PeakSoft", desc: "The backend URL for the dashboard, and broker credentials for the simulator." },
]

const services = [
  { label: "Dashboard", href: "http://localhost:3000", note: "the operator UI (live data)" },
  { label: "Simulator control", href: "http://localhost:8001/health", note: "status + scenario API" },
]

export function RunLocallyBody() {
  return (
    <div className="space-y-10">
      <DocsPageHeader
        eyebrow="Documentation"
        title="Run it locally"
        icon={RocketIcon}
        description="Test the live platform with your own data. Run the dashboard and the simulator locally; PeakSoft hosts the platform itself — you don't run it."
      />

      <Callout variant="tip" title="What you run vs. what we host">
        You run two things — the <strong>dashboard</strong> and the <strong>simulator</strong>. The platform
        (backend + security engine) stays <strong>hosted by PeakSoft</strong>. The simulator publishes
        telemetry to PeakSoft&apos;s broker; the platform processes it live, and you watch it appear in the
        dashboard. Ask your PeakSoft contact for the <strong>backend URL</strong> and <strong>broker credentials</strong>.
      </Callout>

      <section className="space-y-3">
        <h2 className="font-heading text-xl font-semibold tracking-tight">Before you start</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {requirements.map((r) => {
            const Icon = r.icon
            return (
              <div key={r.title} className="flex gap-3 rounded-xl border bg-card p-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background text-primary">
                  <Icon className="size-4" aria-hidden />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground">{r.title}</div>
                  <div className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{r.desc}</div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Track 1 — Dashboard */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-chart-2/15 text-chart-2">
            <MonitorIcon className="size-4" aria-hidden />
          </div>
          <h2 className="font-heading text-xl font-semibold tracking-tight">1 · The dashboard</h2>
        </div>
        <DocsSteps>
          <DocsStep step={1} title="Clone the dashboard repo">
            <div className="mt-2">
              <DocsShellCommand value={dashboardClone} label="In a terminal" />
            </div>
          </DocsStep>
          <DocsStep step={2} title="Install dependencies">
            <div className="mt-2">
              <DocsShellCommand value="pnpm install" label="Install" />
            </div>
          </DocsStep>
          <DocsStep step={3} title="Point it at the hosted platform">
            <p>
              Copy <code>.env.example</code> to <code>.env.local</code> and set the backend URL PeakSoft gave you:
            </p>
            <div className="mt-2">
              <Snippet title=".env.local" value={dashboardEnv} type="env">
                {dashboardEnv}
              </Snippet>
            </div>
          </DocsStep>
          <DocsStep step={4} title="Start it">
            <div className="mt-2">
              <SimulatedTerminal command="pnpm dev" lines={dashboardRunOutput} label="dashboard" />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Open <a href="http://localhost:3000" target="_blank" rel="noreferrer">http://localhost:3000</a>.
            </p>
          </DocsStep>
        </DocsSteps>
      </section>

      {/* Track 2 — Simulator */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <RadioTowerIcon className="size-4" aria-hidden />
          </div>
          <h2 className="font-heading text-xl font-semibold tracking-tight">2 · The simulator</h2>
        </div>
        <DocsSteps>
          <DocsStep step={1} title="Clone the simulator repo">
            <div className="mt-2">
              <DocsShellCommand value={simulatorClone} label="In a terminal" />
            </div>
          </DocsStep>
          <DocsStep step={2} title="Install dependencies">
            <div className="mt-2 space-y-3">
              <DocsShellCommand value="python -m venv .venv" label="Create a virtual environment" />
              <p className="text-sm text-muted-foreground">
                Activate it — <strong>Windows (PowerShell):</strong>{" "}
                <code>.\.venv\Scripts\Activate.ps1</code> · <strong>macOS/Linux:</strong>{" "}
                <code>source .venv/bin/activate</code>
              </p>
              <DocsShellCommand value="pip install -r requirements.txt" label="Install dependencies" />
            </div>
          </DocsStep>
          <DocsStep step={3} title="Point it at PeakSoft's broker">
            <p>Copy <code>.env.example</code> to <code>.env</code> and add the broker host + credentials:</p>
            <div className="mt-2">
              <Snippet title=".env" value={simulatorEnv} type="env">
                {simulatorEnv}
              </Snippet>
            </div>
          </DocsStep>
          <DocsStep step={4} title="Start publishing">
            <div className="mt-2">
              <SimulatedTerminal command={SIMULATOR_RUN_COMMAND} lines={simulatorRunOutput} label="simulator" />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              It connects to the broker and streams telemetry — which flows through the live platform and shows
              up in your dashboard.
            </p>
          </DocsStep>
        </DocsSteps>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-xl font-semibold tracking-tight">What&apos;s now running</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {services.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="group no-underline">
              <div className="h-full rounded-xl border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-muted/40">
                <div className="text-sm font-medium text-foreground">{s.label}</div>
                <div className="mt-1 font-mono text-xs text-primary">{s.href}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.note}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <DocsDetails summary="Trigger an anomaly" description="Drive a fault to see the platform detect it.">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Tell the simulator to misbehave, then watch an alert appear in the dashboard:
        </p>
        <DocsShellCommand
          value={`curl -X POST http://localhost:8001/scenario -H "Content-Type: application/json" -d '{"global_":{"scenario":"spike","enabled":true}}'`}
          label="Inject a spike"
        />
        <p className="text-xs text-muted-foreground">
          Scenarios: <code>spike</code>, <code>drift</code>, <code>flood</code>, <code>bad_payload</code>, <code>impersonation</code>.
        </p>
      </DocsDetails>

      <DocsDetails summary="Troubleshooting" description="The most common first-run snags.">
        <div className="space-y-2">
          {[
            {
              problem: "Dashboard loads but shows no data",
              solution: `Check ${BACKEND_BASE_URL_ENV_VAR} points at PeakSoft's backend URL, and that the simulator is connected and publishing.`,
            },
            {
              problem: "Simulator can't connect to the broker",
              solution: "Confirm MQTT_HOST and credentials, and that MQTT_TRANSPORT=websockets with MQTT_TLS=true for a WSS broker on port 443.",
            },
            {
              problem: "Port 3000 or 8001 already in use",
              solution: "Another app is using that port. Stop it, or change the port (pnpm dev -p / uvicorn --port).",
            },
          ].map((t) => (
            <div key={t.problem} className="rounded-lg border bg-card p-4">
              <div className="text-sm font-medium text-foreground">{t.problem}</div>
              <div className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.solution}</div>
            </div>
          ))}
        </div>
      </DocsDetails>

      <p className="text-sm text-muted-foreground">
        New here? See{" "}
        <Link href="/docs/how-it-works" className="text-primary underline underline-offset-4">
          how it works
        </Link>{" "}
        or{" "}
        <Link href="/docs/connect" className="text-primary underline underline-offset-4">
          connect your own machines
        </Link>
        .
      </p>
    </div>
  )
}
