"use client"

import * as React from "react"

export type DashboardEnvelope =
  | { type: "kpis"; data: unknown }
  | { type: "pipeline"; data: unknown }
  | { type: "data_streams"; data: unknown }
  | { type: "alerts"; data: unknown }
  | { type: "anomalies"; data: unknown }
  | { type: "vulnerabilities_summary"; data: unknown }
  | { type: string; data: unknown }

const BackendBaseUrl = process.env.NEXT_PUBLIC_WS_BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL

export type WsStatus = "connecting" | "open" | "closed" | "error"

export type WsCloseInfo = {
  code: number
  reason: string
  wasClean: boolean
}

function isKeepalivePayload(text: string) {
  const t = text.trim().toLowerCase()
  return t === "ping" || t === "pong"
}

function safeTrimSlashes(s: string) {
  return s.trim().replace(/\/+$/, "")
}

export function getBackendBaseUrl() {
  const raw = BackendBaseUrl?.trim()
  if (!raw) return "http://localhost:8000"
  return safeTrimSlashes(raw)
}

export function toWsUrl(httpBaseUrl: string) {
  const trimmed = safeTrimSlashes(httpBaseUrl)
  if (trimmed.startsWith("https://")) return trimmed.replace(/^https:\/\//, "wss://")
  if (trimmed.startsWith("http://")) return trimmed.replace(/^http:\/\//, "ws://")
  if (trimmed.startsWith("wss://") || trimmed.startsWith("ws://")) return trimmed
  // If someone passed a bare host, assume secure for production-like envs.
  return `wss://${trimmed.replace(/^\/+/, "")}`
}

export function dashboardWsUrl(backendBaseUrl = getBackendBaseUrl()) {
  const wsBase = toWsUrl(backendBaseUrl)
  return `${wsBase}/api/v1/ws/dashboard`
}

export function telemetryWsUrl(deviceId: string, backendBaseUrl = getBackendBaseUrl()) {
  const wsBase = toWsUrl(backendBaseUrl)
  return `${wsBase}/api/v1/ws/telemetry?device_id=${encodeURIComponent(deviceId)}`
}

function retryDelayMs(attempt: number) {
  // 0 => 500ms, 1 => 1s, 2 => 2s, ... capped at 30s (plus jitter)
  const base = Math.min(30_000, 500 * Math.pow(2, Math.min(attempt, 6)))
  const jitter = Math.floor(Math.random() * Math.min(750, Math.max(50, base * 0.15)))
  return base + jitter
}

type ManagedWsParams = {
  name: "dashboard" | "telemetry" | string
  url: string
  enabled?: boolean
  keepaliveMs?: number
  // Called on any status change (connecting/open/closed/error)
  onStatus?: (s: WsStatus) => void
  // Called after `onStatus("error")` with a friendly message
  onErrorMessage?: (msg: string) => void
  // Raw text message handler
  onTextMessage?: (text: string) => void
  // Called on close (also triggers reconnect when enabled)
  onCloseInfo?: (info: WsCloseInfo) => void
}

export function startManagedWebSocket({
  name,
  url,
  enabled = true,
  keepaliveMs = 25_000,
  onStatus,
  onErrorMessage,
  onTextMessage,
  onCloseInfo,
}: ManagedWsParams) {
  let socket: WebSocket | null = null
  let didClose = false
  let attempt = 0
  let retryTimer: number | null = null
  let keepaliveTimer: number | null = null

  const clearTimers = () => {
    if (retryTimer) window.clearTimeout(retryTimer)
    if (keepaliveTimer) window.clearInterval(keepaliveTimer)
    retryTimer = null
    keepaliveTimer = null
  }

  const scheduleReconnect = () => {
    if (!enabled) return
    const delay = retryDelayMs(attempt)
    attempt += 1
    if (retryTimer) window.clearTimeout(retryTimer)
    retryTimer = window.setTimeout(() => connect(), delay)
  }

  const connect = () => {
    if (didClose || !enabled) return
    clearTimers()
    onStatus?.("connecting")

    try {
      socket = new WebSocket(url)
    } catch (e) {
      onStatus?.("error")
      onErrorMessage?.(e instanceof Error ? e.message : "Failed to open WebSocket")
      scheduleReconnect()
      return
    }

    socket.onopen = () => {
      attempt = 0
      onStatus?.("open")
      if (keepaliveTimer) window.clearInterval(keepaliveTimer)
      keepaliveTimer = window.setInterval(() => {
        if (socket?.readyState !== WebSocket.OPEN) return
        try {
          socket.send("ping")
        } catch (e) {
          onStatus?.("error")
          onErrorMessage?.(e instanceof Error ? e.message : "WebSocket keepalive send failed")
        }
      }, keepaliveMs)
    }

    socket.onmessage = (evt) => {
      try {
        onTextMessage?.(String(evt.data))
      } catch (e) {
        onStatus?.("error")
        onErrorMessage?.(e instanceof Error ? e.message : "WebSocket message handler failed")
      }
    }

    socket.onerror = () => {
      // Browsers don't expose a useful error payload here; `onclose` is what we can inspect.
      onStatus?.("error")
      onErrorMessage?.("WebSocket error")
    }

    socket.onclose = (evt) => {
      clearTimers()
      const info: WsCloseInfo = { code: evt.code, reason: evt.reason, wasClean: evt.wasClean }
      onCloseInfo?.(info)

      // eslint-disable-next-line no-console
      console.debug(`[${name}-ws] closed`, { url, ...info })

      onStatus?.("closed")
      if (!didClose) scheduleReconnect()
    }
  }

  connect()

  return () => {
    didClose = true
    clearTimers()
    const current = socket
    socket = null
    try {
      if (!current) {
        // no-op
      } else if (current.readyState === WebSocket.CONNECTING) {
        // Avoid noisy browser warning:
        // "WebSocket is closed before the connection is established."
        // We defer closing until it opens, and ignore all events because caller is disposing.
        current.onopen = () => {
          try {
            current.close()
          } catch {
            // ignore disposal close errors
          }
        }
        current.onmessage = null
        current.onerror = null
        current.onclose = null
      } else {
        current.close()
      }
    } catch (e) {
      onStatus?.("error")
      onErrorMessage?.(e instanceof Error ? e.message : "WebSocket close failed")
    }
    onStatus?.("closed")
  }
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

