"use client"

import {
  DiagramArrow,
  DiagramArrowMarker,
  DiagramNode,
  DiagramSvg,
  useDiagramMarkerId,
} from "@/features/docs/components/diagrams/primitives"

export function PlatformApiDiagram() {
  const markerId = useDiagramMarkerId("api")

  return (
    <DiagramSvg
      viewBox="0 0 680 110"
      title="Read paths after ingest"
      desc="After MQTT ingest, use REST and WebSocket endpoints to read fleet state."
    >
      <defs>
        <DiagramArrowMarker id={markerId} />
      </defs>

      <DiagramNode x={32} y={30} width={120} height={50} chart={3} title="MQTT in" subtitle="telemetry" />
      <DiagramArrow x1={152} y1={55} x2={186} y2={55} markerId={markerId} />

      <DiagramNode
        x={188}
        y={22}
        width={304}
        height={66}
        chart={1}
        title="Platform API"
        subtitle="devices · alerts · vulnerabilities · system/health · WS streams"
      />

      <DiagramArrow x1={492} y1={42} x2={526} y2={38} markerId={markerId} />
      <DiagramArrow x1={492} y1={68} x2={526} y2={72} markerId={markerId} />

      <DiagramNode x={528} y={24} width={120} height={40} chart={2} title="REST" />
      <DiagramNode x={528} y={68} width={120} height={40} chart={5} title="WebSocket" />
    </DiagramSvg>
  )
}
