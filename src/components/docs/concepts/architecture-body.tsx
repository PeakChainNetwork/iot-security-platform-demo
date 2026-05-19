import Link from "next/link"

import { Diagram } from "@/components/docs/diagram"
import { IntegrationOverviewDiagram } from "@/components/docs/diagrams/integration-overview-diagram"
import { DocsPageHeader } from "@/components/docs/docs-page-header"
import { DocsSection } from "@/components/docs/docs-section"
import { LayersIcon } from "lucide-react"

export function ArchitectureBody() {
  return (
    <div className="space-y-10">
      <DocsPageHeader
        eyebrow="Concepts"
        title="How it works"
        description="Your gateway publishes JSON telemetry over MQTT. The platform updates device state and exposes it through REST and WebSocket endpoints."
        icon={LayersIcon}
      />

      <Diagram title="Integration map" description="End-to-end path from your site to API consumers.">
        <IntegrationOverviewDiagram variant="compact" />
      </Diagram>

      <DocsSection title="Next">
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            <Link href="/concepts/data-flow" className="text-primary underline underline-offset-4">
              Data flow
            </Link>{" "}
            — MQTT topic, REST paths, and example responses
          </li>
          <li>
            <Link href="/guides/iot-integration-technical" className="text-primary underline underline-offset-4">
              MQTT integration
            </Link>{" "}
            — payload fields and pitfalls
          </li>
          <li>
            <Link href="/api" className="text-primary underline underline-offset-4">
              API reference
            </Link>{" "}
            — interactive schemas
          </li>
        </ul>
      </DocsSection>
    </div>
  )
}
