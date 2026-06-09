import Link from "next/link"

import { Callout } from "@/features/docs/components/callout"
import { DocsDetails } from "@/features/docs/components/docs-details"
import { DocsPageHeader } from "@/features/docs/components/docs-page-header"
import { DocsShellCommand } from "@/features/docs/components/docs-shell-command"
import { DocsStep, DocsSteps } from "@/features/docs/components/docs-steps"
import { Snippet } from "@/features/docs/components/snippet"
import { SimulatedTerminal, type TerminalLine } from "@/features/docs/components/simulated-terminal"
import { FlowDiagram, type FlowNode } from "@/features/docs/components/diagrams/flow-diagram"
import { localizedHref } from "@/lib/i18n/routing"
import type { Locale } from "@/lib/i18n/config"
import {
  API_BASE_URL_EXAMPLE,
  API_WS_BASE_URL_EXAMPLE,
  BACKEND_BASE_URL_ENV_VAR,
  MQTT_HOST_PLACEHOLDER,
  MQTT_PASSWORD_PLACEHOLDER,
  MQTT_USERNAME_PLACEHOLDER,
  SIMULATOR_GITHUB_REPO_URL,
  WEB_UI_GITHUB_REPO_URL,
  WS_BACKEND_URL_ENV_VAR,
} from "@/lib/platform-constants"
import {
  ExternalLinkIcon,
  MonitorIcon,
  RadioTowerIcon,
  RocketIcon,
  ShieldCheckIcon,
} from "lucide-react"

const dashboardClone = `git clone ${WEB_UI_GITHUB_REPO_URL}.git && cd iot-security-platform-demo`
const dashboardEnv = `${BACKEND_BASE_URL_ENV_VAR}=${API_BASE_URL_EXAMPLE}\n${WS_BACKEND_URL_ENV_VAR}=${API_WS_BASE_URL_EXAMPLE}`
const simulatorClone = `git clone ${SIMULATOR_GITHUB_REPO_URL}.git && cd iot-simulator`
const simulatorEnv = `MQTT_HOST=${MQTT_HOST_PLACEHOLDER}\nMQTT_PORT=443\nMQTT_TRANSPORT=websockets\nMQTT_TLS=true\nMQTT_USERNAME=${MQTT_USERNAME_PLACEHOLDER}\nMQTT_PASSWORD=${MQTT_PASSWORD_PLACEHOLDER}`

type Requirement = {
  icon: typeof MonitorIcon
  title: string
  desc: string
  links: { label: string; href: string }[]
}

type Service = { label: string; href: string; note: string }

type Content = {
  header: { eyebrow: string; title: string; description: string }
  whatRunsWhere: { label: string; body: React.ReactNode }
  runFlow: {
    simulator: { title: string; subtitle: string }
    platform: { title: string; subtitle: string }
    dashboard: { title: string; subtitle: string }
  }
  beforeYouStart: { title: string; requirements: Requirement[] }
  dashboardRunOutput: TerminalLine[]
  simulatorRunOutput: TerminalLine[]
  part1: {
    step: string
    title: string
    cloneLabel: string
    step1Title: string
    step2Title: string
    installLabel: string
    step3Title: string
    step3Body: React.ReactNode
    step4Title: string
    step4Body: React.ReactNode
  }
  part2: {
    step: string
    title: string
    cloneLabel: string
    step1Title: string
    step2Title: string
    step2Body: React.ReactNode
    step2WindowsLabel: string
    step2UnixLabel: string
    step2Outro: React.ReactNode
    details: {
      summary: string
      description: string
      venvLabel: string
      activate: React.ReactNode
      installLabel: string
      brokerBody: React.ReactNode
      startLabel: string
    }
  }
  live: { title: string; services: Service[] }
  anomaly: {
    title: string
    body: string
    unixLabel: string
    windowsLabel: string
    scenarios: React.ReactNode
  }
  troubleshooting: {
    summary: string
    description: string
    items: { problem: string; solution: string }[]
  }
  footer: React.ReactNode
}

const content: Record<Locale, Content> = {
  en: {
    header: {
      eyebrow: "Documentation",
      title: "Run it locally",
      description:
        "Test the live platform with your own data. You run two small pieces, the dashboard and the simulator, and PeakSoft hosts the platform itself.",
    },
    whatRunsWhere: {
      label: "What runs where",
      body: (
        <>
          The simulator publishes telemetry to PeakSoft EU&apos;s broker; the hosted platform ingests and scores it;
          the dashboard shows the result. The <strong>backend URL</strong> and <strong>broker </strong> are
          already preset in each repo&apos;s <code>.env.example</code>, just clone and run.
        </>
      ),
    },
    runFlow: {
      simulator: { title: "Simulator", subtitle: "you run it" },
      platform: { title: "PeakSoft EU", subtitle: "hosted · ingest · score · alert" },
      dashboard: { title: "Dashboard", subtitle: "you run it" },
    },
    beforeYouStart: {
      title: "Before you start",
      requirements: [
        {
          icon: MonitorIcon,
          title: "Node.js 20+ and pnpm",
          desc: "To run the dashboard.",
          links: [
            { label: "Node.js", href: "https://nodejs.org/en/download" },
            { label: "pnpm", href: "https://pnpm.io/installation" },
          ],
        },
        {
          icon: RadioTowerIcon,
          title: "Python 3.10+",
          desc: "To run the simulator (no Docker).",
          links: [{ label: "Python", href: "https://www.python.org/downloads/" }],
        },
      ],
    },
    dashboardRunOutput: [
      { text: "> next dev", tone: "muted" },
      { text: "▲ Next.js 16.2.2 (Turbopack)", tone: "default" },
      { text: "- Local:   http://localhost:3000", tone: "default" },
      { text: "✓ Ready in 1.1s", tone: "success" },
    ],
    simulatorRunOutput: [
      { text: "Creating virtual environment...", tone: "muted" },
      { text: "Installing dependencies...", tone: "muted" },
      { text: "Starting simulator on http://localhost:8001 ...", tone: "muted" },
      { text: "Connected to MQTT broker shrubs-…:443", tone: "success" },
      { text: "Published 1 msg(s) to factory/dev-001/telemetry", tone: "default" },
      { text: "Published 10 msg(s) to factory/dev-002/telemetry", tone: "default" },
      { text: "(open the dashboard to watch it arrive)", tone: "muted" },
    ],
    part1: {
      step: "Part 1",
      title: "The dashboard",
      cloneLabel: "In a terminal",
      step1Title: "Clone the dashboard repo",
      step2Title: "Install dependencies",
      installLabel: "Install",
      step3Title: "Point it at the hosted platform",
      step3Body: (
        <>
          Copy <code>.env.example</code> to <code>.env.local</code>, it already points at the hosted backend:
        </>
      ),
      step4Title: "Start it",
      step4Body: (
        <>
          Open <a href="http://localhost:3000" target="_blank" rel="noreferrer">http://localhost:3000</a>.
        </>
      ),
    },
    part2: {
      step: "Part 2",
      title: "The simulator",
      cloneLabel: "In a terminal",
      step1Title: "Clone the simulator repo",
      step2Title: "Run it, one command",
      step2Body: (
        <>
          The script sets up Python, installs everything, configures the broker (the demo broker is the
          default), and starts publishing, no other setup needed.
        </>
      ),
      step2WindowsLabel: "Windows",
      step2UnixLabel: "macOS / Linux",
      step2Outro: (
        <>
          Telemetry now flows through the live platform and into your dashboard. A control API runs on{" "}
          <code>http://localhost:8001</code>.
        </>
      ),
      details: {
        summary: "Run it manually / change the broker",
        description: "The steps the script runs, and the broker settings.",
        venvLabel: "1 · Create a virtual environment",
        activate: (
          <>
            Activate, <strong>Windows (PowerShell):</strong> <code>.\.venv\Scripts\Activate.ps1</code> ·{" "}
            <strong>macOS/Linux:</strong> <code>source .venv/bin/activate</code>
          </>
        ),
        installLabel: "2 · Install dependencies",
        brokerBody: (
          <>
            3 · The broker is preset in <code>.env.example</code> (copied to <code>.env</code> on first run). To
            change it, edit <code>.env</code>:
          </>
        ),
        startLabel: "4 · Start publishing",
      },
    },
    live: {
      title: "You're live",
      services: [
        { label: "Dashboard", href: "http://localhost:3000", note: "the operator UI (live data)" },
        { label: "Simulator control", href: "http://localhost:8001/health", note: "status + scenario API" },
      ],
    },
    anomaly: {
      title: "Now drive an anomaly",
      body: "With both running, tell the simulator to misbehave and watch the platform flag it in the dashboard:",
      unixLabel: "macOS / Linux / Git Bash",
      windowsLabel: "Windows (PowerShell)",
      scenarios: (
        <>
          Scenarios: <code>spike</code>, <code>drift</code>, <code>flood</code>, <code>bad_payload</code>, <code>impersonation</code>.
        </>
      ),
    },
    troubleshooting: {
      summary: "Troubleshooting",
      description: "The most common first-run snags.",
      items: [
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
      ],
    },
    footer: (
      <>
        New here? See{" "}
        <Link href={localizedHref("en", "/docs/how-it-works")} className="text-primary underline underline-offset-4">
          how it works
        </Link>{" "}
        or{" "}
        <Link href={localizedHref("en", "/docs/connect")} className="text-primary underline underline-offset-4">
          connect your own machines
        </Link>
        .
      </>
    ),
  },
  de: {
    header: {
      eyebrow: "Dokumentation",
      title: "Lokal ausführen",
      description:
        "Testen Sie die Live-Plattform mit Ihren eigenen Daten. Sie führen zwei kleine Teile aus, das Dashboard und den Simulator, und PeakSoft hostet die Plattform selbst.",
    },
    whatRunsWhere: {
      label: "Was läuft wo",
      body: (
        <>
          Der Simulator veröffentlicht Telemetrie an den Broker von PeakSoft EU; die gehostete Plattform erfasst und
          bewertet sie; das Dashboard zeigt das Ergebnis. Die <strong>Backend-URL</strong> und der{" "}
          <strong>Broker </strong> sind in der <code>.env.example</code> jedes Repositorys bereits voreingestellt —
          einfach klonen und ausführen.
        </>
      ),
    },
    runFlow: {
      simulator: { title: "Simulator", subtitle: "Sie führen ihn aus" },
      platform: { title: "PeakSoft EU", subtitle: "gehostet · erfassen · bewerten · warnen" },
      dashboard: { title: "Dashboard", subtitle: "Sie führen es aus" },
    },
    beforeYouStart: {
      title: "Bevor Sie beginnen",
      requirements: [
        {
          icon: MonitorIcon,
          title: "Node.js 20+ und pnpm",
          desc: "Zum Ausführen des Dashboards.",
          links: [
            { label: "Node.js", href: "https://nodejs.org/en/download" },
            { label: "pnpm", href: "https://pnpm.io/installation" },
          ],
        },
        {
          icon: RadioTowerIcon,
          title: "Python 3.10+",
          desc: "Zum Ausführen des Simulators (kein Docker).",
          links: [{ label: "Python", href: "https://www.python.org/downloads/" }],
        },
      ],
    },
    dashboardRunOutput: [
      { text: "> next dev", tone: "muted" },
      { text: "▲ Next.js 16.2.2 (Turbopack)", tone: "default" },
      { text: "- Local:   http://localhost:3000", tone: "default" },
      { text: "✓ Ready in 1.1s", tone: "success" },
    ],
    simulatorRunOutput: [
      { text: "Creating virtual environment...", tone: "muted" },
      { text: "Installing dependencies...", tone: "muted" },
      { text: "Starting simulator on http://localhost:8001 ...", tone: "muted" },
      { text: "Connected to MQTT broker shrubs-…:443", tone: "success" },
      { text: "Published 1 msg(s) to factory/dev-001/telemetry", tone: "default" },
      { text: "Published 10 msg(s) to factory/dev-002/telemetry", tone: "default" },
      { text: "(open the dashboard to watch it arrive)", tone: "muted" },
    ],
    part1: {
      step: "Teil 1",
      title: "Das Dashboard",
      cloneLabel: "In einem Terminal",
      step1Title: "Dashboard-Repository klonen",
      step2Title: "Abhängigkeiten installieren",
      installLabel: "Installieren",
      step3Title: "Auf die gehostete Plattform ausrichten",
      step3Body: (
        <>
          Kopieren Sie <code>.env.example</code> nach <code>.env.local</code>, sie verweist bereits auf das
          gehostete Backend:
        </>
      ),
      step4Title: "Starten",
      step4Body: (
        <>
          Öffnen Sie <a href="http://localhost:3000" target="_blank" rel="noreferrer">http://localhost:3000</a>.
        </>
      ),
    },
    part2: {
      step: "Teil 2",
      title: "Der Simulator",
      cloneLabel: "In einem Terminal",
      step1Title: "Simulator-Repository klonen",
      step2Title: "Ausführen, ein Befehl",
      step2Body: (
        <>
          Das Skript richtet Python ein, installiert alles, konfiguriert den Broker (der Demo-Broker ist die
          Standardeinstellung) und beginnt mit dem Veröffentlichen, keine weitere Einrichtung nötig.
        </>
      ),
      step2WindowsLabel: "Windows",
      step2UnixLabel: "macOS / Linux",
      step2Outro: (
        <>
          Telemetrie fließt nun durch die Live-Plattform und in Ihr Dashboard. Eine Steuerungs-API läuft auf{" "}
          <code>http://localhost:8001</code>.
        </>
      ),
      details: {
        summary: "Manuell ausführen / Broker ändern",
        description: "Die Schritte, die das Skript ausführt, und die Broker-Einstellungen.",
        venvLabel: "1 · Virtuelle Umgebung erstellen",
        activate: (
          <>
            Aktivieren, <strong>Windows (PowerShell):</strong> <code>.\.venv\Scripts\Activate.ps1</code> ·{" "}
            <strong>macOS/Linux:</strong> <code>source .venv/bin/activate</code>
          </>
        ),
        installLabel: "2 · Abhängigkeiten installieren",
        brokerBody: (
          <>
            3 · Der Broker ist in der <code>.env.example</code> voreingestellt (beim ersten Start nach{" "}
            <code>.env</code> kopiert). Um ihn zu ändern, bearbeiten Sie <code>.env</code>:
          </>
        ),
        startLabel: "4 · Veröffentlichen starten",
      },
    },
    live: {
      title: "Sie sind live",
      services: [
        { label: "Dashboard", href: "http://localhost:3000", note: "die Bediener-Oberfläche (Live-Daten)" },
        { label: "Simulator-Steuerung", href: "http://localhost:8001/health", note: "Status + Szenario-API" },
      ],
    },
    anomaly: {
      title: "Jetzt eine Anomalie auslösen",
      body: "Während beide laufen, weisen Sie den Simulator an, sich fehlerhaft zu verhalten, und beobachten Sie, wie die Plattform dies im Dashboard kennzeichnet:",
      unixLabel: "macOS / Linux / Git Bash",
      windowsLabel: "Windows (PowerShell)",
      scenarios: (
        <>
          Szenarien: <code>spike</code>, <code>drift</code>, <code>flood</code>, <code>bad_payload</code>, <code>impersonation</code>.
        </>
      ),
    },
    troubleshooting: {
      summary: "Fehlerbehebung",
      description: "Die häufigsten Stolpersteine beim ersten Start.",
      items: [
        {
          problem: "Dashboard lädt, zeigt aber keine Daten",
          solution: `Prüfen Sie, ob ${BACKEND_BASE_URL_ENV_VAR} auf die Backend-URL von PeakSoft verweist und ob der Simulator verbunden ist und veröffentlicht.`,
        },
        {
          problem: "Simulator kann sich nicht mit dem Broker verbinden",
          solution: "Bestätigen Sie MQTT_HOST und die Zugangsdaten sowie MQTT_TRANSPORT=websockets mit MQTT_TLS=true für einen WSS-Broker auf Port 443.",
        },
        {
          problem: "Port 3000 oder 8001 bereits belegt",
          solution: "Eine andere Anwendung verwendet diesen Port. Beenden Sie sie oder ändern Sie den Port (pnpm dev -p / uvicorn --port).",
        },
      ],
    },
    footer: (
      <>
        Neu hier? Siehe{" "}
        <Link href={localizedHref("de", "/docs/how-it-works")} className="text-primary underline underline-offset-4">
          So funktioniert es
        </Link>{" "}
        oder{" "}
        <Link href={localizedHref("de", "/docs/connect")} className="text-primary underline underline-offset-4">
          eigene Maschinen anbinden
        </Link>
        .
      </>
    ),
  },
}

function TrackHeader({
  step,
  title,
  port,
  icon: Icon,
  tile,
}: {
  step: string
  title: string
  port: string
  icon: typeof MonitorIcon
  tile: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${tile}`}>
        <Icon className="size-5" aria-hidden />
      </div>
      <div className="min-w-0">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{step}</div>
        <div role="heading" aria-level={2} className="font-heading text-xl font-semibold tracking-tight text-foreground">
          {title}
        </div>
      </div>
      <span className="ml-auto rounded-full border bg-background px-2.5 py-0.5 font-mono text-xs text-muted-foreground">
        {port}
      </span>
    </div>
  )
}

export function RunLocallyBody({ lang }: { lang: Locale }) {
  const t = content[lang]
  const runFlow: FlowNode[] = [
    { icon: RadioTowerIcon, title: t.runFlow.simulator.title, subtitle: t.runFlow.simulator.subtitle, tile: "bg-primary/15 text-primary" },
    { icon: ShieldCheckIcon, title: t.runFlow.platform.title, subtitle: t.runFlow.platform.subtitle, tile: "bg-chart-4/15 text-chart-4", emphasized: true },
    { icon: MonitorIcon, title: t.runFlow.dashboard.title, subtitle: t.runFlow.dashboard.subtitle, tile: "bg-chart-2/15 text-chart-2" },
  ]

  return (
    <div className="space-y-10">
      <DocsPageHeader
        eyebrow={t.header.eyebrow}
        title={t.header.title}
        icon={RocketIcon}
        description={t.header.description}
      />

      {/* What runs where */}
      <div className="rounded-2xl border bg-muted/20 p-5 sm:p-6">
        <div className="mb-5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t.whatRunsWhere.label}
        </div>
        <FlowDiagram nodes={runFlow} connectorLabels={["MQTT", "HTTP / WS"]} />
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          {t.whatRunsWhere.body}
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="font-heading text-xl font-semibold tracking-tight">{t.beforeYouStart.title}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {t.beforeYouStart.requirements.map((r) => {
            const Icon = r.icon
            return (
              <div key={r.title} className="flex gap-3 rounded-xl border bg-card p-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background text-primary">
                  <Icon className="size-4" aria-hidden />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground">{r.title}</div>
                  <div className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{r.desc}</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {r.links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-0.5 text-xs font-medium text-primary transition-colors hover:bg-muted/40"
                      >
                        {l.label}
                        <ExternalLinkIcon className="size-3" aria-hidden />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Track 1 — Dashboard */}
      <section className="space-y-4 rounded-2xl border bg-card/30 p-5 sm:p-6">
        <TrackHeader step={t.part1.step} title={t.part1.title} port=":3000" icon={MonitorIcon} tile="bg-chart-2/15 text-chart-2" />
        <DocsSteps>
          <DocsStep step={1} title={t.part1.step1Title}>
            <div className="mt-2">
              <DocsShellCommand value={dashboardClone} label={t.part1.cloneLabel} />
            </div>
          </DocsStep>
          <DocsStep step={2} title={t.part1.step2Title}>
            <div className="mt-2">
              <DocsShellCommand value="pnpm install" label={t.part1.installLabel} />
            </div>
          </DocsStep>
          <DocsStep step={3} title={t.part1.step3Title}>
            <p>{t.part1.step3Body}</p>
            <div className="mt-2">
              <Snippet title=".env.local" value={dashboardEnv} type="env">
                {dashboardEnv}
              </Snippet>
            </div>
          </DocsStep>
          <DocsStep step={4} title={t.part1.step4Title}>
            <div className="mt-2">
              <SimulatedTerminal command="pnpm dev" lines={t.dashboardRunOutput} label="dashboard" />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{t.part1.step4Body}</p>
          </DocsStep>
        </DocsSteps>
      </section>

      {/* Track 2 — Simulator */}
      <section className="space-y-4 rounded-2xl border bg-card/30 p-5 sm:p-6">
        <TrackHeader step={t.part2.step} title={t.part2.title} port=":8001" icon={RadioTowerIcon} tile="bg-primary/15 text-primary" />
        <DocsSteps>
          <DocsStep step={1} title={t.part2.step1Title}>
            <div className="mt-2">
              <DocsShellCommand value={simulatorClone} label={t.part2.cloneLabel} />
            </div>
          </DocsStep>
          <DocsStep step={2} title={t.part2.step2Title}>
            <p>{t.part2.step2Body}</p>
            <div className="mt-2 space-y-2">
              <DocsShellCommand value=".\run.bat" label={t.part2.step2WindowsLabel} />
              <DocsShellCommand value="./run.sh" label={t.part2.step2UnixLabel} />
            </div>
            <div className="mt-3">
              <SimulatedTerminal command=".\run.bat" lines={t.simulatorRunOutput} label="simulator" />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{t.part2.step2Outro}</p>
          </DocsStep>
        </DocsSteps>

        <DocsDetails summary={t.part2.details.summary} description={t.part2.details.description}>
          <DocsShellCommand value="python -m venv .venv" label={t.part2.details.venvLabel} />
          <p className="text-sm text-muted-foreground">{t.part2.details.activate}</p>
          <DocsShellCommand value="pip install -r requirements.txt" label={t.part2.details.installLabel} />
          <p className="text-sm text-muted-foreground">{t.part2.details.brokerBody}</p>
          <Snippet title=".env" value={simulatorEnv} type="env">
            {simulatorEnv}
          </Snippet>
          <DocsShellCommand value="uvicorn app.main:app --port 8001" label={t.part2.details.startLabel} />
        </DocsDetails>
      </section>

      {/* Now you're live */}
      <section className="space-y-3">
        <h2 className="font-heading text-xl font-semibold tracking-tight">{t.live.title}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {t.live.services.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="group no-underline">
              <div className="h-full rounded-xl border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-muted/40">
                <div className="text-sm font-medium text-foreground">{s.label}</div>
                <div className="mt-1 font-mono text-xs text-primary">{s.href}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.note}</div>
              </div>
            </a>
          ))}
        </div>

        <Callout variant="tip" title={t.anomaly.title}>
          {t.anomaly.body}
          <div className="mt-3 space-y-2">
            <DocsShellCommand
              value={`curl -X POST http://localhost:8001/scenario -H "Content-Type: application/json" -d '{"global":{"scenario":"spike","enabled":true}}'`}
              label={t.anomaly.unixLabel}
            />
            <DocsShellCommand
              value={`Invoke-RestMethod -Method Post -Uri http://localhost:8001/scenario -ContentType "application/json" -Body '{"global":{"scenario":"spike","enabled":true}}'`}
              label={t.anomaly.windowsLabel}
            />
          </div>
          <span className="mt-2 block text-xs text-muted-foreground">
            {t.anomaly.scenarios}
          </span>
        </Callout>
      </section>

      <DocsDetails summary={t.troubleshooting.summary} description={t.troubleshooting.description}>
        <div className="space-y-2">
          {t.troubleshooting.items.map((item) => (
            <div key={item.problem} className="rounded-lg border bg-card p-4">
              <div className="text-sm font-medium text-foreground">{item.problem}</div>
              <div className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.solution}</div>
            </div>
          ))}
        </div>
      </DocsDetails>

      <p className="text-sm text-muted-foreground">{t.footer}</p>
    </div>
  )
}
