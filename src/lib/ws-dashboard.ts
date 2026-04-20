"use client"

import * as React from "react"

type Envelope =
  | { type: "kpis"; data: unknown }
  | { type: "pipeline"; data: unknown }
  | { type: "data_streams"; data: unknown }
  | { type: "alerts"; data: unknown }
  | { type: "anomalies"; data: unknown }
  | { type: "vulnerabilities_summary"; data: unknown }
  | { type: string; data: unknown }

export function getBackendBaseUrl() {
  return process.env.NEXT_PUBLIC_BACKEND_URL?.trim() || "http://localhost:8000"
}

export function toWsUrl(httpBaseUrl: string) {
  const trimmed = httpBaseUrl.replace(/\/+$/, "")
  if (trimmed.startsWith("https://")) return trimmed.replace(/^https:\/\//, "wss://")
  if (trimmed.startsWith("http://")) return trimmed.replace(/^http:\/\//, "ws://")
  return trimmed
}

export function useDashboardWs(onEnvelope: (env: Envelope) => void) {
  const backendBase = getBackendBaseUrl()
  const onEnvelopeRef = React.useRef(onEnvelope)

  React.useEffect(() => {
    onEnvelopeRef.current = onEnvelope
  }, [onEnvelope])

  React.useEffect(() => {
    let socket: WebSocket | null = null
    let didClose = false
    let retryTimer: number | null = null

    const connect = (attempt: number) => {
      const wsBase = toWsUrl(backendBase)
      const url = `${wsBase}/api/v1/ws/dashboard`
      try {
        socket = new WebSocket(url)
      } catch {
        scheduleReconnect(attempt + 1)
        return
      }

      socket.onmessage = (evt) => {
        try {
          const env = JSON.parse(String(evt.data)) as Envelope
          onEnvelopeRef.current(env)
        } catch {
          // ignore
        }
      }

      socket.onclose = () => {
        if (!didClose) scheduleReconnect(attempt + 1)
      }
    }

    const scheduleReconnect = (attempt: number) => {
      if (retryTimer) window.clearTimeout(retryTimer)
      const delayMs = Math.min(30_000, 500 * Math.pow(2, Math.min(attempt, 6)))
      retryTimer = window.setTimeout(() => connect(attempt), delayMs)
    }

    connect(0)

    return () => {
      didClose = true
      if (retryTimer) window.clearTimeout(retryTimer)
      try {
        socket?.close()
      } catch {
        // ignore
      }
      socket = null
    }
  }, [backendBase])
}

