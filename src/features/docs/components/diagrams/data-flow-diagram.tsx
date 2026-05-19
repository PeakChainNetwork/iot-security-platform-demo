"use client"

import {
  DiagramArrow,
  DiagramArrowMarker,
  DiagramNode,
  DiagramSvg,
  useDiagramMarkerId,
} from "@/features/docs/components/diagrams/primitives"

export function DataFlowDiagram() {
  const markerId = useDiagramMarkerId("data")

  return (
    <DiagramSvg
      viewBox="0 0 680 150"
      title="Data flow"
      desc="MQTT telemetry in; REST and WebSocket read paths out."
    >
      <defs>
        <DiagramArrowMarker id={markerId} />
      </defs>

      <DiagramNode
        x={24}
        y={42}
        width={156}
        height={66}
        chart={3}
        title="MQTT publish"
        subtitle="site/{device_id}/telemetry"
      />
      <DiagramArrow x1={180} y1={75} x2={214} y2={75} markerId={markerId} />

      <DiagramNode x={216} y={38} width={148} height={74} chart={1} title="Platform" subtitle="state · alerts · streams" />

      <DiagramArrow x1={364} y1={58} x2={400} y2={48} markerId={markerId} />
      <DiagramArrow x1={364} y1={92} x2={400} y2={102} markerId={markerId} />

      <DiagramNode x={402} y={26} width={124} height={50} chart={2} title="REST" subtitle="GET endpoints" />
      <DiagramNode x={402} y={84} width={124} height={50} chart={5} title="WebSocket" subtitle="live JSON" />

      <DiagramArrow x1={526} y1={51} x2={552} y2={75} markerId={markerId} />
      <DiagramArrow x1={526} y1={109} x2={552} y2={75} markerId={markerId} />

      <DiagramNode x={554} y={42} width={102} height={66} chart={4} title="Clients" subtitle="apps · UI" />
    </DiagramSvg>
  )
}
