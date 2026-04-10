export type DeviceRead = {
  id: string
  name: string
  device_type: string
  status: string
  ip_address: string | null
  mac_address: string | null
  manufacturer: string | null
  firmware_version: string | null
  location: string | null
  cpe: string | null
  last_seen: string
  registered_at: string
  risk_score: number
  compliance_score: number
  compliance_status: string
  digital_twin_state: Record<string, unknown>
}

export type AlertRead = {
  id: string
  severity: "critical" | "high" | "medium" | "low"
  title: string
  description: string
  timestamp_ms: number
  source: string
  status: "active" | "dismissed"
  device_id?: string | null
}

export type PipelineStageRead = {
  name: string
  throughput: number
  success_rate: number
  avg_latency_ms: number
  status: "healthy" | "warning" | "critical"
}

export type DataStreamRead = {
  key: string
  name: string
  status: "healthy" | "warning" | "critical"
  current_value: number
  unit: string
}

export type SystemHealthRead = {
  threats_detected: number
  devices_monitored: number
  system_uptime_pct: number
  avg_response_time_ms: number
  generated_at_ms: number
}

export type VulnerabilitySummaryResponse = {
  top_10: Array<{
    cve_id: string
    severity?: string | null
    cvss_score?: number | null
    last_modified: string
  }>
  by_severity: Record<string, number>
}

export type AnomalyRead = {
  id: string
  device_id: string
  score: number
  severity: "critical" | "high" | "medium" | "low"
  timestamp_ms: number
  factors: Record<string, unknown>
}

export type DeviceDetailRead = DeviceRead & {
  sections: {
    vulnerabilities: Array<Record<string, unknown>>
    alerts: Array<Record<string, unknown>>
    anomalies: Array<Record<string, unknown>>
    pipeline_health: Record<string, unknown>
    stream_health: Record<string, unknown>
  }
}

