"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  DownloadIcon,
  FileJsonIcon,
  FolderOpenIcon,
  ImportIcon,
  LayersIcon,
  PlayIcon,
  SettingsIcon,
  VariableIcon,
} from "lucide-react"

const COLLECTION_HREF = "/postman-collection.json"
const COLLECTION_FILENAME = "IoT-Security-Platform.postman_collection.json"
const ENVIRONMENT_HREF = "/postman-environment.json"
const ENVIRONMENT_FILENAME = "IoT-Security-Platform.postman_environment.json"

const FOLDERS = [
  { name: "Devices", count: 7, methods: "GET, POST, PUT, DELETE" },
  { name: "System", count: 1, methods: "GET" },
  { name: "Metrics", count: 2, methods: "GET" },
  { name: "Alerts", count: 2, methods: "GET, POST" },
  { name: "Anomalies", count: 2, methods: "GET" },
  { name: "Vulnerabilities", count: 2, methods: "GET" },
  { name: "Pipeline", count: 4, methods: "GET, POST" },
  { name: "Compliance", count: 1, methods: "GET" },
  { name: "WebSocket", count: 2, methods: "WS" },
] as const

const STEPS = [
  {
    number: 1,
    icon: DownloadIcon,
    title: "Download both files",
    description:
      "Click the two download buttons below to save the collection and environment JSON files to your machine.",
  },
  {
    number: 2,
    icon: ImportIcon,
    title: "Open Postman and import",
    description:
      'Open the Postman app, click the "Import" button in the top-left corner (or press Ctrl+O / Cmd+O). Drag both downloaded JSON files onto the import dialog — or click "Upload Files" and select them.',
  },
  {
    number: 3,
    icon: SettingsIcon,
    title: "Select the environment",
    description:
      'After import, look at the top-right corner of Postman where it says "No Environment". Click the dropdown and select "IoT Security Platform". This activates the base_url variable.',
  },
  {
    number: 4,
    icon: VariableIcon,
    title: "Configure base_url (if needed)",
    description:
      'The default base_url is http://localhost:8000. If your backend runs elsewhere (e.g. behind ngrok or on a different port), click the environment quick-look icon (eye icon) next to the dropdown, then click "Edit" and change the value.',
  },
  {
    number: 5,
    icon: PlayIcon,
    title: "Send your first request",
    description:
      'Expand the "Devices" folder in the collection sidebar, click "List devices", and hit Send. You should see the JSON response from your running backend.',
  },
] as const

export function PostmanGuide() {
  return (
    <div className="space-y-10">
      {/* Download cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileJsonIcon className="size-4 text-primary" />
              Postman Collection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Contains all 23 API requests organized into 9 folders with pre-filled bodies, query parameters, path
              variables, and saved example responses.
            </p>
            <Button asChild className="w-full gap-2">
              <a href={COLLECTION_HREF} download={COLLECTION_FILENAME}>
                <DownloadIcon className="size-4" />
                Download Collection
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <SettingsIcon className="size-4 text-primary" />
              Postman Environment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Pre-configures the{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">base_url</code> variable so every
              request in the collection points to your backend automatically.
            </p>
            <Button asChild variant="outline" className="w-full gap-2">
              <a href={ENVIRONMENT_HREF} download={ENVIRONMENT_FILENAME}>
                <DownloadIcon className="size-4" />
                Download Environment
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Step-by-step walkthrough */}
      <section className="space-y-6">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
          Step-by-step walkthrough
        </h2>

        <ol className="relative space-y-8 border-l border-border pl-8">
          {STEPS.map((step) => (
            <li key={step.number} className="relative">
              <span className="absolute -left-[2.55rem] flex size-6 items-center justify-center rounded-full border bg-background text-xs font-semibold text-foreground">
                {step.number}
              </span>
              <div className="space-y-1.5">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <step.icon className="size-3.5 text-muted-foreground" />
                  {step.title}
                </h3>
                <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <Separator />

      {/* What's inside */}
      <section className="space-y-6">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
          What&apos;s inside the collection
        </h2>

        <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
          The collection mirrors the API Reference docs and is organized into folders by domain. Every request includes:
        </p>

        <ul className="grid gap-3 sm:grid-cols-2">
          {[
            "Pre-filled request bodies (POST/PUT)",
            "Query params disabled by default — enable what you need",
            "Path variables with realistic example values",
            "Saved example responses for every documented status code",
            "Descriptions pulled from the OpenAPI spec",
            "WebSocket URLs documented in request descriptions",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-1 block size-1.5 shrink-0 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>

        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <FolderOpenIcon className="size-3.5 text-muted-foreground" />
            Collection folders
          </h3>
          <div className="rounded-lg border">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-3 py-2 text-xs font-medium text-muted-foreground">Folder</th>
                  <th className="px-3 py-2 text-xs font-medium text-muted-foreground">Requests</th>
                  <th className="px-3 py-2 text-xs font-medium text-muted-foreground">Methods</th>
                </tr>
              </thead>
              <tbody>
                {FOLDERS.map((f, i) => (
                  <tr key={f.name} className={i < FOLDERS.length - 1 ? "border-b border-border/60" : ""}>
                    <td className="px-3 py-2 font-medium text-foreground">{f.name}</td>
                    <td className="px-3 py-2">
                      <Badge variant="secondary" className="font-mono text-[10px]">
                        {f.count}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{f.methods}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Separator />

      {/* Environment variables */}
      <section className="space-y-6">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
          Environment variables
        </h2>

        <div className="rounded-lg border">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-2 text-xs font-medium text-muted-foreground">Variable</th>
                <th className="px-3 py-2 text-xs font-medium text-muted-foreground">Default</th>
                <th className="px-3 py-2 text-xs font-medium text-muted-foreground">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2">
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">base_url</code>
                </td>
                <td className="px-3 py-2 font-mono text-xs text-muted-foreground">http://localhost:8000</td>
                <td className="px-3 py-2 text-xs text-muted-foreground">
                  Root URL for the main backend service. All request paths are appended to this. Change it if you&apos;re
                  using ngrok, Docker, or a remote server.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <Card className="border-amber-500/20 bg-amber-500/[0.03]">
          <CardContent className="flex gap-3 pt-4">
            <LayersIcon className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Scanner &amp; CVE services</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This collection covers the main backend API (port 8000). The scanner service (port 8083) and CVE
                intelligence service (port 8082) have their own OpenAPI specs at{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">/docs</code> on their respective
                ports. You can import those auto-generated specs into Postman directly from{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                  http://localhost:8083/openapi.json
                </code>{" "}
                and{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                  http://localhost:8082/openapi.json
                </code>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Tips */}
      <section className="space-y-6">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">Tips</h2>
        <ul className="space-y-4">
          {[
            {
              title: "Enable disabled query params",
              body: "Optional query parameters (like status on List devices) are included but disabled by default. Check the checkbox next to any param to enable it before sending.",
            },
            {
              title: "Use the Collection Runner",
              body: 'Right-click the collection name and select "Run collection" to execute all requests in sequence — useful for a quick smoke test of your backend.',
            },
            {
              title: "WebSocket requests",
              body: 'Postman supports native WebSocket connections. Create a "New WebSocket Request", paste the URL from the WebSocket folder descriptions (replace http:// with ws://), and click Connect.',
            },
            {
              title: "Keep it in sync",
              body: "The collection is generated from the same OpenAPI spec that powers the docs site. When the spec updates, re-download the collection to pick up new endpoints.",
            },
          ].map((tip) => (
            <li key={tip.title} className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground">{tip.title}</h3>
              <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">{tip.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
