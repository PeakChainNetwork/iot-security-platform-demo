"use client"

import { getBackendBaseUrl, toWsUrl } from "@/lib/backend-url"
import { startManagedWebSocket, type WsStatus } from "@/lib/ws-client"

export type { WsStatus }

export function telemetryWsUrl(deviceId: string, backendBaseUrl = getBackendBaseUrl()) {
  const wsBase = toWsUrl(backendBaseUrl)
  return `${wsBase}/api/v1/ws/telemetry?device_id=${encodeURIComponent(deviceId)}`
}

export function startTelemetryWs(params: {
  deviceId: string
  onMessage: (msg: unknown) => void
  onStatus?: (s: WsStatus) => void
  onErrorMessage?: (msg: string) => void
  backendBaseUrl?: string
}) {
  const url = telemetryWsUrl(params.deviceId, params.backendBaseUrl)
  return startManagedWebSocket({
    name: "telemetry",
    url,
    onStatus: params.onStatus,
    onErrorMessage: params.onErrorMessage,
    onTextMessage: (text) => {
      try {
        params.onMessage(JSON.parse(text))
      } catch (e) {
        params.onErrorMessage?.(
          e instanceof Error ? `Bad message JSON: ${e.message}` : "Bad message JSON"
        )
      }
    },
  })
}
