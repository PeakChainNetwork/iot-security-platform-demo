export const PLATFORM_GITHUB_REPO_URL =
  "https://github.com/PeakChainNetwork/peaksoft-security-platform"

export const WEB_UI_GITHUB_REPO_URL =
  "https://github.com/PeakChainNetwork/iot-security-platform-demo"

export const BACKEND_BASE_URL_ENV_VAR = "NEXT_PUBLIC_BACKEND_URL"
export const WS_BACKEND_URL_ENV_VAR = "NEXT_PUBLIC_WS_BACKEND_URL"

export const LOCAL_BACKEND_BASE_URL = "http://localhost:8000"

export const API_HOST_PLACEHOLDER = "<api-host>"
export const DEVICE_ID_PLACEHOLDER = "<device_id>"
export const MQTT_HOST_PLACEHOLDER = "<mqtt-host>"
export const MQTT_USERNAME_PLACEHOLDER = "<mqtt-username>"
export const MQTT_PASSWORD_PLACEHOLDER = "<mqtt-password>"

export const API_BASE_URL_EXAMPLE = `https://${API_HOST_PLACEHOLDER}`
export const API_WS_BASE_URL_EXAMPLE = `wss://${API_HOST_PLACEHOLDER}`
export const API_HEALTH_URL_EXAMPLE = `${API_BASE_URL_EXAMPLE}/health`
export const API_INGESTION_STATUS_URL_EXAMPLE = `${API_BASE_URL_EXAMPLE}/api/v1/ingestion/status`
export const API_DEVICES_URL_EXAMPLE = `${API_BASE_URL_EXAMPLE}/api/v1/devices`
export const API_TELEMETRY_WS_URL_EXAMPLE = `${API_WS_BASE_URL_EXAMPLE}/api/v1/ws/telemetry?device_id=${DEVICE_ID_PLACEHOLDER}`

export const MQTT_BROKER_WSS_URL_EXAMPLE = `wss://${MQTT_HOST_PLACEHOLDER}:443/mqtt`
export const MQTT_TOPIC_EXAMPLE = `site/${DEVICE_ID_PLACEHOLDER}/telemetry`
export const MQTT_TCP_PUBLISH_EXAMPLE = `mosquitto_pub -h ${MQTT_HOST_PLACEHOLDER} -p 1883 \\
  -t '${MQTT_TOPIC_EXAMPLE}' \\
  -m '{"timestamp":"2026-05-18T14:30:00+00:00","temperature":25.0,"pressure":100.0,"status":"ok"}'`
