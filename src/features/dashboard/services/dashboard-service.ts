import { fetchJson } from "@/lib/api-client"
import type {
  AlertRead,
  AnomalyRead,
  DataStreamRead,
  PipelineStageRead,
  SystemHealthRead,
  VulnerabilitySummaryResponse,
} from "@/types/backend-types"

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
