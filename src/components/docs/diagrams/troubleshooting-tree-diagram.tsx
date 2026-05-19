"use client"

import {
  DiagramArrow,
  DiagramArrowMarker,
  DiagramNode,
  DiagramSvg,
  useDiagramMarkerId,
} from "@/components/docs/diagrams/primitives"

function BranchLabel({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text x={x} y={y} fontSize={10} fill="var(--muted-foreground)">
      {text}
    </text>
  )
}

export function TroubleshootingTreeDiagram() {
  const markerId = useDiagramMarkerId("ts")

  return (
    <DiagramSvg
      viewBox="0 0 720 310"
      title="Troubleshooting decision tree"
      desc="Isolate missing dashboard data via hub, platform, and device ID checks."
    >
      <defs>
        <DiagramArrowMarker id={markerId} />
      </defs>

      <DiagramNode x={230} y={10} width={260} height={42} variant="alert" title="No data on the dashboard?" />
      <DiagramArrow x1={360} y1={52} x2={360} y2={72} markerId={markerId} />

      <DiagramNode x={230} y={74} width={260} height={42} chart={1} title="Run mosquitto_sub — messages?" />

      <DiagramArrow x1={490} y1={95} x2={560} y2={95} markerId={markerId} />
      <BranchLabel x={525} y={86} text="No" />
      <DiagramNode x={562} y={78} width={148} height={36} chart={2} title="Check gateway /" subtitle="publisher config" />

      <DiagramArrow x1={360} y1={116} x2={360} y2={138} markerId={markerId} />
      <BranchLabel x={375} y={130} text="Yes" />

      <DiagramNode x={230} y={140} width={260} height={42} chart={1} title="Backend logs show forwarding?" />

      <DiagramArrow x1={490} y1={161} x2={560} y2={161} markerId={markerId} />
      <BranchLabel x={525} y={152} text="No" />
      <DiagramNode x={562} y={144} width={148} height={36} chart={5} title="Check platform API →" subtitle="hub connection" />

      <DiagramArrow x1={360} y1={182} x2={360} y2={204} markerId={markerId} />
      <BranchLabel x={375} y={196} text="Yes" />

      <DiagramNode x={230} y={206} width={260} height={42} chart={1} title="Device ID in UI matches topic?" />

      <DiagramArrow x1={490} y1={227} x2={560} y2={227} markerId={markerId} />
      <BranchLabel x={525} y={218} text="No" />
      <DiagramNode x={562} y={210} width={148} height={36} chart={3} title="Fix device_id" subtitle="mismatch" />

      <DiagramArrow x1={360} y1={248} x2={360} y2={270} markerId={markerId} />
      <BranchLabel x={375} y={262} text="Yes" />

      <DiagramNode
        x={230}
        y={272}
        width={260}
        height={36}
        chart={3}
        title="Check network / WebSocket connectivity"
      />
    </DiagramSvg>
  )
}
