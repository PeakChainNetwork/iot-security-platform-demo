"use client"

import {
  DiagramArrow,
  DiagramArrowMarker,
  DiagramNode,
  DiagramSvg,
  useDiagramMarkerId,
} from "@/components/docs/diagrams/primitives"

/** Simulator → hub → platform → dashboard */
export function SimulatorPipelineDiagram() {
  const markerId = useDiagramMarkerId("sim")

  return (
    <DiagramSvg viewBox="0 0 640 110" title="Simulator path" desc="Demo telemetry through hub to platform.">
      <defs>
        <DiagramArrowMarker id={markerId} />
      </defs>
      <DiagramNode x={8} y={26} width={130} height={58} chart={2} title="Simulator" subtitle="demo telemetry" />
      <DiagramArrow x1={138} y1={55} x2={162} y2={55} markerId={markerId} />
      <DiagramNode x={164} y={26} width={108} height={58} chart={5} title="Message hub" subtitle="MQTT" />
      <DiagramArrow x1={272} y1={55} x2={296} y2={55} markerId={markerId} />
      <DiagramNode x={298} y={26} width={142} height={58} chart={1} title="Platform" subtitle="API" />
      <DiagramArrow x1={440} y1={55} x2={464} y2={55} markerId={markerId} />
      <DiagramNode x={466} y={26} width={100} height={58} chart={3} title="Dashboard" subtitle="UI" />
    </DiagramSvg>
  )
}
