import Link from "next/link"

import { FlowDiagram, type FlowNode } from "@/features/docs/components/diagrams/flow-diagram"
import { CapabilityExplorer } from "@/features/docs/components/capability-explorer"
import { DocsPageHeader } from "@/features/docs/components/docs-page-header"
import { BracesIcon, LayoutDashboardIcon, ShieldCheckIcon } from "lucide-react"

const flowNodes: FlowNode[] = [
  { icon: ShieldCheckIcon, title: "The platform", subtitle: "processed state", tile: "bg-primary/15 text-primary", emphasized: true },
  { icon: BracesIcon, title: "REST / WebSocket", subtitle: "endpoints & streams", tile: "bg-chart-1/15 text-chart-1" },
  { icon: LayoutDashboardIcon, title: "Your apps", subtitle: "dashboard · integrations", tile: "bg-chart-2/15 text-chart-2" },
]

export function PlatformApiBody() {
  return (
    <div className="space-y-10">
      <DocsPageHeader
        eyebrow="Guides"
        title="What you can read back"
        icon={BracesIcon}
        description="Once telemetry is flowing, the platform exposes it through simple REST and live WebSocket endpoints. Tap a capability to see what you get back."
      />

      <div className="rounded-2xl border bg-muted/20 p-5 sm:p-6">
        <div className="mb-5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Read paths after ingest
        </div>
        <FlowDiagram nodes={flowNodes} connectorLabels={["read", "deliver"]} />
      </div>

      <CapabilityExplorer />

      <p className="text-sm text-muted-foreground">
        Full schemas, parameters, and try-it requests are in the{" "}
        <Link href="/docs/api" className="text-primary underline underline-offset-4">
          API reference
        </Link>
        , or import the{" "}
        <Link href="/docs/api/postman" className="text-primary underline underline-offset-4">
          Postman collection
        </Link>
        .
      </p>
    </div>
  )
}
