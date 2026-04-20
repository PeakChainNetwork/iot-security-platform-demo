import {
  AlertRead,
  AnomalyRead,
  DataStreamRead,
  DeviceDetailRead,
  DeviceRead,
  PipelineStageRead,
  SystemHealthRead,
  VulnerabilitySummaryResponse,
} from "@/lib/backend-types"


export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

function backendBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  if (!baseUrl) {
    throw new Error("Missing env var: NEXT_PUBLIC_BACKEND_URL")
  }

  return baseUrl.replace(
    /\/+$/,
    ""
  )
}

function urlFor(pathname: string) {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`
  return `${backendBaseUrl()}${path}`
}

async function fetchJson<T>(pathname: string): Promise<T> {
  const res = await fetch(urlFor(pathname), {
    cache: "no-store",
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  })

  if (!res.ok) {
    let detail = ""
    try {
      detail = await res.text()
    } catch {
      // ignore
    }
    throw new ApiError(
      res.status,
      `Request failed: ${res.status} ${res.statusText}${detail ? ` — ${detail}` : ""}`
    )
  }

  return (await res.json()) as T
}

export async function getDevices(): Promise<DeviceRead[]> {
  return await fetchJson<DeviceRead[]>("/api/v1/devices")
}

export async function getDevice(deviceId: string): Promise<DeviceDetailRead> {
  return await fetchJson<DeviceDetailRead>(`/api/v1/devices/${encodeURIComponent(deviceId)}`)
}

export async function getSystemHealth(): Promise<SystemHealthRead> {
  return await fetchJson<SystemHealthRead>("/api/v1/system/health")
}

export async function getPipelineMetrics(): Promise<PipelineStageRead[]> {
  return await fetchJson<PipelineStageRead[]>("/api/v1/metrics/pipeline")
}

export async function getDataStreams(): Promise<DataStreamRead[]> {
  return await fetchJson<DataStreamRead[]>("/api/v1/metrics/data-streams")
}

export async function getAlerts(): Promise<AlertRead[]> {
  return await fetchJson<AlertRead[]>("/api/v1/alerts")
}

export async function getAnomalies(): Promise<AnomalyRead[]> {
  return await fetchJson<AnomalyRead[]>("/api/v1/anomalies")
}

export async function getVulnerabilitiesSummary(): Promise<VulnerabilitySummaryResponse> {
  return await fetchJson<VulnerabilitySummaryResponse>("/api/v1/vulnerabilities/summary")
}

