import { BookOpenIcon, CableIcon, LayersIcon, RadioIcon } from "lucide-react"

import { Diagram } from "@/components/docs/diagram"
import { IntegrationOverviewDiagram } from "@/components/docs/diagrams/integration-overview-diagram"
import { DocsNavCard } from "@/components/docs/docs-nav-card"
import { DocsPageHeader } from "@/components/docs/docs-page-header"
import { DocsSection } from "@/components/docs/docs-section"

export function DocsHomeBody() {
  return (
    <div className="docs-prose space-y-10">
      <DocsPageHeader
        eyebrow="Documentation"
        title="IoT Security Platform"
        description="Integrate by publishing machine telemetry over MQTT and reading fleet state, alerts, and live metrics over REST and WebSocket."
        badges={["MQTT in", "REST out", "WebSocket streams"]}
        icon={BookOpenIcon}
      />

      <Diagram title="Integration at a glance" description="What you send and what the API returns.">
        <IntegrationOverviewDiagram />
      </Diagram>

      <DocsSection title="Start here">
        <div className="grid gap-3 sm:grid-cols-2">
          <DocsNavCard href="/getting-started/installation" eyebrow="1 · Setup" title="Credentials & access" description="API base URL, MQTT broker, and registered device IDs." icon="globe" />
          <DocsNavCard href="/concepts/architecture" eyebrow="2 · Concepts" title="How it works" description="Integration diagram and data paths." icon="integration" />
          <DocsNavCard href="/guides/iot-integration-technical" eyebrow="3 · MQTT" title="Telemetry contract" description="Topic, JSON payload, and ingestion checks." icon="mqtt" />
          <DocsNavCard href="/api" eyebrow="4 · Reference" title="REST & WebSockets" description="Full OpenAPI explorer and example responses." icon="api" />
        </div>
      </DocsSection>
    </div>
  )
}
