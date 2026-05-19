import { fetchJson } from "@/lib/api-client"
import type { DeviceDetailRead, DeviceRead } from "@/types/backend-types"

export async function getDevices(): Promise<DeviceRead[]> {
  return await fetchJson<DeviceRead[]>("/api/v1/devices")
}

export async function getDevice(deviceId: string): Promise<DeviceDetailRead> {
  return await fetchJson<DeviceDetailRead>(`/api/v1/devices/${encodeURIComponent(deviceId)}`)
}
