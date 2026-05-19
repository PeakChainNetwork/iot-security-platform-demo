"use client"

import {
  DiagramArrow,
  DiagramArrowMarker,
  DiagramNode,
  DiagramSvg,
  useDiagramMarkerId,
} from "@/components/docs/diagrams/primitives"

export function MessageContractDiagram() {
  const markerId = useDiagramMarkerId("msg")

  return (
    <DiagramSvg
      viewBox="0 0 640 200"
      title="MQTT message contract"
      desc="Topic path and JSON payload shape."
    >
      <defs>
        <DiagramArrowMarker id={markerId} />
      </defs>
      <DiagramNode
        x={20}
        y={16}
        width={600}
        height={72}
        chart={3}
        title="Topic"
        subtitle="site/<device_id>/telemetry"
      />
      <DiagramArrow x1={320} y1={88} x2={320} y2={104} markerId={markerId} />
      <DiagramNode
        x={20}
        y={104}
        width={600}
        height={80}
        chart={1}
        title="Payload (JSON)"
        subtitle="timestamp + metrics (temperature, pressure, …) · optional status"
      />
    </DiagramSvg>
  )
}
