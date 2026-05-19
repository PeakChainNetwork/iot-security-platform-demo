import type { Metadata } from "next"

import { ApiExplorer } from "@/features/docs/components/api-explorer"

export const metadata: Metadata = {
  title: "API reference",
  description: "REST and WebSocket contracts for the IoT Security Platform backend.",
}

export default function DocsApiPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            API Reference
          </h1>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
          Interactive reference for the IoT Security Platform backend. REST endpoints are loaded from the committed{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">openapi.json</code> snapshot and WebSocket
          streams from{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ws-contracts.json</code>.
          Select an endpoint to view parameters, schemas, and a ready-to-use cURL example.
        </p>
      </div>
      <ApiExplorer />
    </div>
  )
}
