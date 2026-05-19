"use client"

import {
  DiagramArrow,
  DiagramArrowMarker,
  DiagramNode,
  DiagramSvg,
  useDiagramMarkerId,
} from "@/components/docs/diagrams/primitives"

export function HighLevelFlowDiagram() {
  const markerId = useDiagramMarkerId("hl")

  return (
    <DiagramSvg
      viewBox="0 0 760 190"
      title="High-level flow diagram"
      desc="Real machines through gateway and hub to platform, then dashboard and optional history."
    >
      <defs>
        <DiagramArrowMarker id={markerId} />
      </defs>

      <DiagramNode x={18} y={24} width={150} height={56} chart={3} title="Real machines" subtitle="measurements" />
      <DiagramArrow x1={168} y1={52} x2={210} y2={52} markerId={markerId} />

      <DiagramNode x={212} y={24} width={160} height={56} chart={4} title="Site gateway" subtitle="map · forward" />
      <DiagramArrow x1={372} y1={52} x2={414} y2={52} markerId={markerId} />

      <DiagramNode x={416} y={28} width={150} height={48} chart={5} title="Message hub" />
      <DiagramArrow x1={566} y1={52} x2={608} y2={52} markerId={markerId} />

      <DiagramNode x={610} y={28} width={132} height={48} chart={1} title="Platform" />

      <DiagramArrow x1={676} y1={76} x2={676} y2={110} markerId={markerId} />
      <DiagramNode x={596} y={112} width={160} height={54} chart={2} title="Dashboard (UI)" subtitle="live updates" />

      <DiagramArrow x1={676} y1={76} x2={494} y2={134} markerId={markerId} />
      <DiagramNode
        x={340}
        y={112}
        width={180}
        height={54}
        chart={4}
        title="History storage"
        subtitle="optional"
        dashed
      />
    </DiagramSvg>
  )
}
