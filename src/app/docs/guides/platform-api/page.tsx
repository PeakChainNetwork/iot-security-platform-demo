import type { Metadata } from "next"

import { PlatformApiBody } from "@/features/docs/components/guides/platform-api-body"

export const metadata: Metadata = {
  title: "Platform API capabilities",
  description: "What you can read back from the IoT Security Platform once telemetry is flowing.",
}

export default function PlatformApiGuidePage() {
  return <PlatformApiBody />
}
