import {
  BACKEND_BASE_URL_ENV_VAR,
  LOCAL_BACKEND_BASE_URL,
  WS_BACKEND_URL_ENV_VAR,
} from "@/lib/platform-constants"

function safeTrimSlashes(s: string) {
  return s.trim().replace(/\/+$/, "")
}

/** Client WebSocket / optional fallback; defaults when env is unset. */
export function getBackendBaseUrl(): string {
  const raw =
    process.env[WS_BACKEND_URL_ENV_VAR]?.trim() ||
    process.env[BACKEND_BASE_URL_ENV_VAR]?.trim()

  if (!raw) return LOCAL_BACKEND_BASE_URL
  return safeTrimSlashes(raw)
}

/** Server-side REST; requires NEXT_PUBLIC_BACKEND_URL. */
export function requireBackendBaseUrl(): string {
  const baseUrl = process.env[BACKEND_BASE_URL_ENV_VAR]?.trim()
  if (!baseUrl) {
    throw new Error(`Missing env var: ${BACKEND_BASE_URL_ENV_VAR}`)
  }
  return safeTrimSlashes(baseUrl)
}

export function toWsUrl(httpBaseUrl: string) {
  const trimmed = safeTrimSlashes(httpBaseUrl)
  if (trimmed.startsWith("https://")) return trimmed.replace(/^https:\/\//, "wss://")
  if (trimmed.startsWith("http://")) return trimmed.replace(/^http:\/\//, "ws://")
  if (trimmed.startsWith("wss://") || trimmed.startsWith("ws://")) return trimmed
  return `wss://${trimmed.replace(/^\/+/, "")}`
}
