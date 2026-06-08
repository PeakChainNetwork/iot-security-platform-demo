"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { LOCAL_BACKEND_BASE_URL } from "@/lib/platform-constants"
import type { Locale } from "@/lib/i18n/config"
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

type Step = { number: number; icon: typeof DownloadIcon; title: string; description: string }
type Tip = { title: string; body: string }

type Strings = {
  collectionTitle: string
  collectionBody: string
  downloadCollection: string
  environmentTitle: string
  environmentBodyPre: string
  environmentBodyPost: string
  downloadEnvironment: string
  walkthrough: string
  steps: Step[]
  whatsInside: string
  whatsInsideIntro: string
  includes: string[]
  collectionFolders: string
  colFolder: string
  colRequests: string
  colMethods: string
  envVariables: string
  colVariable: string
  colDefault: string
  colDescription: string
  baseUrlDescription: string
  scopeTitle: string
  scopeBody: string
  tipsTitle: string
  tips: Tip[]
}

const strings: Record<Locale, Strings> = {
  en: {
    collectionTitle: "Postman Collection",
    collectionBody:
      "Contains all 23 API requests organized into 9 folders with pre-filled bodies, query parameters, path variables, and saved example responses.",
    downloadCollection: "Download Collection",
    environmentTitle: "Postman Environment",
    environmentBodyPre: "Pre-configures the",
    environmentBodyPost:
      "variable so every request in the collection points to Peaksoft EU API automatically.",
    downloadEnvironment: "Download Environment",
    walkthrough: "Step-by-step walkthrough",
    steps: [
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
        description: `The default base_url is ${LOCAL_BACKEND_BASE_URL}. If Peaksoft EU runs elsewhere (for example behind ngrok or on a different port), click the environment quick-look icon (eye icon) next to the dropdown, then click "Edit" and change the value.`,
      },
      {
        number: 5,
        icon: PlayIcon,
        title: "Send your first request",
        description:
          'Expand the "Devices" folder in the collection sidebar, click "List devices", and hit Send. You should see the JSON response from Peaksoft EU.',
      },
    ],
    whatsInside: "What's inside the collection",
    whatsInsideIntro:
      "The collection mirrors the API Reference docs and is organized into folders by domain. Every request includes:",
    includes: [
      "Pre-filled request bodies (POST/PUT)",
      "Query params disabled by default — enable what you need",
      "Path variables with realistic example values",
      "Saved example responses for every documented status code",
      "Descriptions pulled from the OpenAPI spec",
      "WebSocket URLs documented in request descriptions",
    ],
    collectionFolders: "Collection folders",
    colFolder: "Folder",
    colRequests: "Requests",
    colMethods: "Methods",
    envVariables: "Environment variables",
    colVariable: "Variable",
    colDefault: "Default",
    colDescription: "Description",
    baseUrlDescription:
      "Root URL for Peaksoft EU API. All request paths are appended to this. Set this to the base URL provided for your environment (demo, pilot, or production).",
    scopeTitle: "Machine integration scope",
    scopeBody:
      "This collection covers Peaksoft EU APIs you need to verify telemetry ingestion, device state, alerts, and live streams. It does not include internal operator-only services.",
    tipsTitle: "Tips",
    tips: [
      {
        title: "Enable disabled query params",
        body: "Optional query parameters (like status on List devices) are included but disabled by default. Check the checkbox next to any param to enable it before sending.",
      },
      {
        title: "Use the Collection Runner",
        body: 'Right-click the collection name and select "Run collection" to execute all requests in sequence — useful for a quick smoke test of Peaksoft EU API.',
      },
      {
        title: "WebSocket requests",
        body: 'Postman supports native WebSocket connections. Create a "New WebSocket Request", paste the URL from the WebSocket folder descriptions (replace http:// with ws://), and click Connect.',
      },
      {
        title: "Keep it in sync",
        body: "The collection is generated from the same OpenAPI spec that powers the docs site. When the spec updates, re-download the collection to pick up new endpoints.",
      },
    ],
  },
  de: {
    collectionTitle: "Postman-Collection",
    collectionBody:
      "Enthält alle 23 API-Anfragen, organisiert in 9 Ordnern mit vorausgefüllten Bodys, Query-Parametern, Pfadvariablen und gespeicherten Beispielantworten.",
    downloadCollection: "Collection herunterladen",
    environmentTitle: "Postman-Umgebung",
    environmentBodyPre: "Konfiguriert die",
    environmentBodyPost:
      "-Variable vorab, sodass jede Anfrage in der Collection automatisch auf die Peaksoft EU API verweist.",
    downloadEnvironment: "Umgebung herunterladen",
    walkthrough: "Schritt-für-Schritt-Anleitung",
    steps: [
      {
        number: 1,
        icon: DownloadIcon,
        title: "Beide Dateien herunterladen",
        description:
          "Klicken Sie auf die beiden Download-Schaltflächen unten, um die JSON-Dateien für Collection und Umgebung auf Ihrem Rechner zu speichern.",
      },
      {
        number: 2,
        icon: ImportIcon,
        title: "Postman öffnen und importieren",
        description:
          'Öffnen Sie die Postman-App und klicken Sie oben links auf die Schaltfläche "Import" (oder drücken Sie Strg+O / Cmd+O). Ziehen Sie beide heruntergeladenen JSON-Dateien auf den Import-Dialog — oder klicken Sie auf "Upload Files" und wählen Sie sie aus.',
      },
      {
        number: 3,
        icon: SettingsIcon,
        title: "Umgebung auswählen",
        description:
          'Schauen Sie nach dem Import oben rechts in Postman, wo "No Environment" steht. Klicken Sie auf das Dropdown und wählen Sie "IoT Security Platform". Dadurch wird die base_url-Variable aktiviert.',
      },
      {
        number: 4,
        icon: VariableIcon,
        title: "base_url konfigurieren (falls nötig)",
        description: `Die Standard-base_url ist ${LOCAL_BACKEND_BASE_URL}. Wenn Peaksoft EU an anderer Stelle läuft (zum Beispiel hinter ngrok oder auf einem anderen Port), klicken Sie auf das Schnellansicht-Symbol der Umgebung (Augen-Symbol) neben dem Dropdown, klicken Sie dann auf "Edit" und ändern Sie den Wert.`,
      },
      {
        number: 5,
        icon: PlayIcon,
        title: "Erste Anfrage senden",
        description:
          'Klappen Sie den Ordner "Devices" in der Collection-Seitenleiste auf, klicken Sie auf "List devices" und drücken Sie auf Send. Sie sollten die JSON-Antwort von Peaksoft EU sehen.',
      },
    ],
    whatsInside: "Was die Collection enthält",
    whatsInsideIntro:
      "Die Collection spiegelt die API-Referenz-Dokumentation wider und ist nach Domäne in Ordner gegliedert. Jede Anfrage enthält:",
    includes: [
      "Vorausgefüllte Anfrage-Bodys (POST/PUT)",
      "Query-Parameter standardmäßig deaktiviert — aktivieren Sie, was Sie benötigen",
      "Pfadvariablen mit realistischen Beispielwerten",
      "Gespeicherte Beispielantworten für jeden dokumentierten Statuscode",
      "Aus der OpenAPI-Spezifikation übernommene Beschreibungen",
      "In den Anfragebeschreibungen dokumentierte WebSocket-URLs",
    ],
    collectionFolders: "Collection-Ordner",
    colFolder: "Ordner",
    colRequests: "Anfragen",
    colMethods: "Methoden",
    envVariables: "Umgebungsvariablen",
    colVariable: "Variable",
    colDefault: "Standard",
    colDescription: "Beschreibung",
    baseUrlDescription:
      "Root-URL für die Peaksoft EU API. Alle Anfragepfade werden daran angehängt. Setzen Sie dies auf die für Ihre Umgebung (Demo, Pilot oder Produktion) bereitgestellte Basis-URL.",
    scopeTitle: "Umfang der Maschinenanbindung",
    scopeBody:
      "Diese Collection deckt die Peaksoft EU APIs ab, die Sie benötigen, um Telemetrie-Erfassung, Gerätezustand, Alarme und Live-Streams zu überprüfen. Sie enthält keine internen, nur für Betreiber bestimmten Dienste.",
    tipsTitle: "Tipps",
    tips: [
      {
        title: "Deaktivierte Query-Parameter aktivieren",
        body: "Optionale Query-Parameter (wie status bei List devices) sind enthalten, aber standardmäßig deaktiviert. Aktivieren Sie das Kontrollkästchen neben einem Parameter, um ihn vor dem Senden zu aktivieren.",
      },
      {
        title: "Den Collection Runner verwenden",
        body: 'Klicken Sie mit der rechten Maustaste auf den Collection-Namen und wählen Sie "Run collection", um alle Anfragen nacheinander auszuführen — nützlich für einen schnellen Smoke-Test der Peaksoft EU API.',
      },
      {
        title: "WebSocket-Anfragen",
        body: 'Postman unterstützt native WebSocket-Verbindungen. Erstellen Sie eine "New WebSocket Request", fügen Sie die URL aus den Beschreibungen des WebSocket-Ordners ein (ersetzen Sie http:// durch ws://) und klicken Sie auf Connect.',
      },
      {
        title: "Aktuell halten",
        body: "Die Collection wird aus derselben OpenAPI-Spezifikation generiert, die auch die Dokumentationsseite speist. Wenn die Spezifikation aktualisiert wird, laden Sie die Collection erneut herunter, um neue Endpunkte zu übernehmen.",
      },
    ],
  },
}

export function PostmanGuide({ lang }: { lang: Locale }) {
  const s = strings[lang]

  return (
    <div className="space-y-10">
      {/* Download cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileJsonIcon className="size-4 text-primary" />
              {s.collectionTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {s.collectionBody}
            </p>
            <Button asChild className="w-full gap-2">
              <a href={COLLECTION_HREF} download={COLLECTION_FILENAME}>
                <DownloadIcon className="size-4" />
                {s.downloadCollection}
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <SettingsIcon className="size-4 text-primary" />
              {s.environmentTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {s.environmentBodyPre}{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">base_url</code> {s.environmentBodyPost}
            </p>
            <Button asChild variant="outline" className="w-full gap-2">
              <a href={ENVIRONMENT_HREF} download={ENVIRONMENT_FILENAME}>
                <DownloadIcon className="size-4" />
                {s.downloadEnvironment}
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Step-by-step walkthrough */}
      <section className="space-y-6">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
          {s.walkthrough}
        </h2>

        <ol className="relative space-y-8 border-l border-border pl-8">
          {s.steps.map((step) => (
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
          {s.whatsInside}
        </h2>

        <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
          {s.whatsInsideIntro}
        </p>

        <ul className="grid gap-3 sm:grid-cols-2">
          {s.includes.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-1 block size-1.5 shrink-0 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>

        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <FolderOpenIcon className="size-3.5 text-muted-foreground" />
            {s.collectionFolders}
          </h3>
          <div className="rounded-lg border">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-3 py-2 text-xs font-medium text-muted-foreground">{s.colFolder}</th>
                  <th className="px-3 py-2 text-xs font-medium text-muted-foreground">{s.colRequests}</th>
                  <th className="px-3 py-2 text-xs font-medium text-muted-foreground">{s.colMethods}</th>
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
          {s.envVariables}
        </h2>

        <div className="rounded-lg border">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-2 text-xs font-medium text-muted-foreground">{s.colVariable}</th>
                <th className="px-3 py-2 text-xs font-medium text-muted-foreground">{s.colDefault}</th>
                <th className="px-3 py-2 text-xs font-medium text-muted-foreground">{s.colDescription}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2">
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">base_url</code>
                </td>
                <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{LOCAL_BACKEND_BASE_URL}</td>
                <td className="px-3 py-2 text-xs text-muted-foreground">
                  {s.baseUrlDescription}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <Card className="border-amber-500/20 bg-amber-500/[0.03]">
          <CardContent className="flex gap-3 pt-4">
            <LayersIcon className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">{s.scopeTitle}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {s.scopeBody}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Tips */}
      <section className="space-y-6">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">{s.tipsTitle}</h2>
        <ul className="space-y-4">
          {s.tips.map((tip) => (
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
