import type { Metadata } from "next"

import { PlatformApiBody } from "@/features/docs/components/guides/platform-api-body"

export const metadata: Metadata = {
  title: "Platform API capabilities",
  description: "REST and WebSocket endpoints for devices, alerts, vulnerabilities, and dashboard KPIs.",
}

export default function PlatformApiPage() {
  return <PlatformApiBody />
}
