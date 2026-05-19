"use client"

import * as React from "react"

import { getBackendBaseUrl, toWsUrl } from "@/lib/backend-url"
import { startManagedWebSocket, type WsStatus } from "@/lib/ws-client"

export type DashboardEnvelope =
  | { type: "kpis"; data: unknown }
  | { type: "pipeline"; data: unknown }
  | { type: "data_streams"; data: unknown }
  | { type: "alerts"; data: unknown }
  | { type: "anomalies"; data: unknown }
  | { type: "vulnerabilities_summary"; data: unknown }
  | { type: string; data: unknown }

export type { WsStatus }

function isKeepalivePayload(text: string) {
  const t = text.trim().toLowerCase()
  return t === "ping" || t === "pong"
}

export function dashboardWsUrl(backendBaseUrl = getBackendBaseUrl()) {
  const wsBase = toWsUrl(backendBaseUrl)
  return `${wsBase}/api/v1/ws/dashboard`
}

export function startDashboardWs(params: {
  onEnvelope: (env: DashboardEnvelope) => void
  onStatus?: (s: WsStatus) => void
  onErrorMessage?: (msg: string) => void
  backendBaseUrl?: string
}) {
  const url = dashboardWsUrl(params.backendBaseUrl)
  return startManagedWebSocket({
    name: "dashboard",
    url,
    onStatus: params.onStatus,
    onErrorMessage: params.onErrorMessage,
    onTextMessage: (text) => {
      if (isKeepalivePayload(text)) return
      try {
        const env = JSON.parse(text) as DashboardEnvelope
        params.onEnvelope(env)
      } catch (e) {
        params.onErrorMessage?.(
          e instanceof Error
            ? `Bad dashboard WS message JSON: ${e.message}`
            : "Bad dashboard WS message JSON"
        )
      }
    },
  })
}

export function useDashboardWs(onEnvelope: (env: DashboardEnvelope) => void) {
  const backendBase = getBackendBaseUrl()
  const onEnvelopeRef = React.useRef(onEnvelope)

  React.useEffect(() => {
    onEnvelopeRef.current = onEnvelope
  }, [onEnvelope])

  React.useEffect(() => {
    return startDashboardWs({
      backendBaseUrl: backendBase,
      onEnvelope: (env) => onEnvelopeRef.current(env),
    })
  }, [backendBase])
}
