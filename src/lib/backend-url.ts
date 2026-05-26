import {
  LOCAL_BACKEND_BASE_URL,
} from "@/lib/platform-constants"

function safeTrimSlashes(s: string) {
  return s.trim().replace(/\/+$/, "")
}

/** Client WebSocket / optional fallback; defaults when env is unset. */
export function getBackendBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_WS_BACKEND_URL?.trim() ||
    process.env.NEXT_PUBLIC_BACKEND_URL?.trim()

  if (!raw) return LOCAL_BACKEND_BASE_URL
  return safeTrimSlashes(raw)
}

/** Server-side REST; requires NEXT_PUBLIC_BACKEND_URL. */
export function requireBackendBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.trim()
  if (!baseUrl) {
    throw new Error(`Missing env var: ${baseUrl}`)
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
