import Link from "next/link"

import { Callout } from "@/features/docs/components/callout"
import { DocsDetails } from "@/features/docs/components/docs-details"
import { DocsPageHeader } from "@/features/docs/components/docs-page-header"
import { DocsShellCommand } from "@/features/docs/components/docs-shell-command"
import { DocsStep, DocsSteps } from "@/features/docs/components/docs-steps"
import { SimulatedTerminal, type TerminalLine } from "@/features/docs/components/simulated-terminal"
import { PLATFORM_GITHUB_REPO_URL } from "@/lib/platform-constants"
import { BoxIcon, GitBranchIcon, RocketIcon } from "lucide-react"

const cloneCommand = `git clone --recurse-submodules ${PLATFORM_GITHUB_REPO_URL}.git && cd peaksoft-security-platform`;

const setupOutput: TerminalLine[] = [
  { text: "🚀 Starting Peaksoft IoT Security setup....", tone: "header" },
  { text: "🔍 Checking requirements...", tone: "muted" },
  { text: "ℹ️  Using Docker Compose V2", tone: "muted" },
  { text: "🔐 Generating SSL certificates...", tone: "muted" },
  { text: "✅ Certificates generated.", tone: "success" },
  { text: "📦 Building IoT Security backend...", tone: "muted" },
  { text: "✅ Backend built.", tone: "success" },
  { text: "🎨 Building dashboard (this can take a while)...", tone: "muted" },
  { text: "✅ Dashboard built.", tone: "success" },
  { text: "🚢 Launching the stack...", tone: "muted" },
  { text: "⏳ Waiting for the database...", tone: "muted" },
  { text: "✅ Database ready.", tone: "success" },
  { text: "🔄 Running migrations...", tone: "muted" },
  { text: "✅ Migrations applied.", tone: "success" },
  { text: "🌱 Seeding demo devices...", tone: "muted" },
  { text: "📡 Starting telemetry simulator...", tone: "muted" },
  { text: "🧠 Training the anomaly model...", tone: "muted" },
  { text: "", tone: "default" },
  { text: "🎉 SETUP COMPLETE", tone: "header" },
  { text: "🌐 Dashboard:  https://localhost", tone: "default" },
  { text: "👤 admin / SecretPassword", tone: "muted" },
  { text: "✨ All systems go!", tone: "success" },
]

const dockerPsOutput: TerminalLine[] = [
  { text: "NAMES                   STATUS", tone: "muted" },
  { text: "iot-security-backend    Up (healthy)", tone: "success" },
  { text: "iot-postgres            Up (healthy)", tone: "success" },
  { text: "mosquitto               Up", tone: "default" },
  { text: "kafka                   Up (healthy)", tone: "success" },
  { text: "wazuh.manager           Up (healthy)", tone: "success" },
  { text: "wazuh.dashboard         Up", tone: "default" },
]

const requirements = [
  { icon: BoxIcon, title: "Docker Desktop", desc: "Installed and running. The whole platform ships as containers." },
  { icon: GitBranchIcon, title: "Git", desc: "To download the project. About 8 GB of free memory is recommended." },
]

const services = [
  { label: "Dashboard", href: "https://localhost", note: "admin / SecretPassword" },
  { label: "Backend API", href: "http://localhost:8000", note: "REST + WebSockets" },
  { label: "API docs", href: "http://localhost:8000/docs", note: "Interactive Swagger" },
]

export function RunLocallyBody() {
  return (
    <div className="space-y-10">
      <DocsPageHeader
        eyebrow="Documentation"
        title="Run it locally"
        icon={RocketIcon}
        description="Bring the whole platform up on your own machine with a single command — database, dashboard, backend, and a built-in telemetry demo."
      />

      <section className="space-y-3">
        <h2 className="font-heading text-xl font-semibold tracking-tight">Before you start</h2>
        <div className="grid gap-3 sm:grid-cols-2">
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

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold tracking-tight">Three steps</h2>
        <DocsSteps>
          <DocsStep step={1} title="Get the code">
            <p>Clone the project and move into the folder.</p>
            <div className="mt-3">
              <DocsShellCommand value={cloneCommand} label="In a terminal" />
            </div>
          </DocsStep>

          <DocsStep step={2} title="Start everything">
            <p>
              One command builds the images, starts the stack, sets up the database, and turns on a demo
              telemetry feed. The first run can take a few minutes while images download. Press{" "}
              <strong>Run</strong> below to preview what you&apos;ll see.
            </p>
            <div className="mt-3">
              <SimulatedTerminal command="bash scripts/setup.sh" lines={setupOutput} label="setup" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              On Windows, run this inside WSL or Git Bash (it&apos;s a Bash script).
            </p>
          </DocsStep>

          <DocsStep step={3} title="Open the dashboard">
            <p>
              When it finishes, open{" "}
              <a href="https://localhost" target="_blank" rel="noreferrer">
                https://localhost
              </a>{" "}
              and sign in with <strong>admin</strong> / <strong>SecretPassword</strong>. You&apos;ll see live demo
              machines straight away.
            </p>
          </DocsStep>
        </DocsSteps>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-xl font-semibold tracking-tight">What&apos;s now running</h2>
        <div className="grid gap-3 sm:grid-cols-3">
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

      <Callout variant="tip" title="A couple of heads-ups">
        Make sure Docker is running before you start. The dashboard uses a self-signed certificate, so your
        browser will ask you to accept the security warning on first visit — that&apos;s expected for a local run.
      </Callout>

      <DocsDetails summary="Stop or reset the stack" description="When you're done, or want a clean restart.">
        <DocsShellCommand value="cd wazuh-docker/multi-node && docker compose down" label="Stop all services" />
      </DocsDetails>

      <DocsDetails summary="Troubleshooting" description="The most common first-run snags and how to clear them.">
        <div className="space-y-2">
          {[
            {
              problem: "“Cannot connect to the Docker daemon”",
              solution: "Docker isn't running. Start Docker Desktop, wait until it reports running, then run the setup again.",
            },
            {
              problem: "Port already in use (443 or 8000)",
              solution: "Another app is using that port. Stop it (or the conflicting container) and re-run the setup.",
            },
            {
              problem: "The browser says the dashboard isn't secure",
              solution: "Expected on a local run — the dashboard uses a self-signed certificate. Choose “Advanced” and proceed to https://localhost.",
            },
            {
              problem: "Pages don't load yet / services look down",
              solution: "First boot downloads images and can take 2–3 minutes. Check progress with the commands below.",
            },
          ].map((t) => (
            <div key={t.problem} className="rounded-lg border bg-card p-4">
              <div className="text-sm font-medium text-foreground">{t.problem}</div>
              <div className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.solution}</div>
            </div>
          ))}
        </div>
        <SimulatedTerminal command="docker ps" lines={dockerPsOutput} label="services" />
        <DocsShellCommand value="docker logs iot-security-backend" label="Check the backend logs" />
      </DocsDetails>

      <p className="text-sm text-muted-foreground">
        Up and running? Try the{" "}
        <Link href="/docs/how-it-works#see-it-in-action" className="text-primary underline underline-offset-4">
          interactive demo
        </Link>
        , then{" "}
        <Link href="/docs/connect" className="text-primary underline underline-offset-4">
          connect your own machines
        </Link>
        .
      </p>
    </div>
  )
}
