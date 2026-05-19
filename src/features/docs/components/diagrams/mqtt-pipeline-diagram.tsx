"use client"

import {
  DiagramArrow,
  DiagramArrowMarker,
  DiagramNode,
  DiagramSvg,
  useDiagramMarkerId,
} from "@/features/docs/components/diagrams/primitives"

/** Machines → gateway → hub → platform → UI */
export function MqttPipelineDiagram({ compact = false }: { compact?: boolean }) {
  const markerId = useDiagramMarkerId("mqtt-pipe")

  if (compact) {
    return (
      <DiagramSvg viewBox="0 0 640 120" title="MQTT pipeline" desc="Telemetry path from machines to API.">
        <defs>
          <DiagramArrowMarker id={markerId} />
        </defs>
        <DiagramNode x={8} y={30} width={110} height={60} chart={3} title="Machines" subtitle="sensors · PLCs" />
        <DiagramArrow x1={118} y1={60} x2={138} y2={60} markerId={markerId} />
        <DiagramNode x={140} y={30} width={120} height={60} chart={4} title="Site gateway" subtitle="publish JSON" />
        <DiagramArrow x1={260} y1={60} x2={280} y2={60} markerId={markerId} />
        <DiagramNode x={282} y={34} width={110} height={52} chart={5} title="Message hub" subtitle="MQTT" />
        <DiagramArrow x1={392} y1={60} x2={412} y2={60} markerId={markerId} />
        <DiagramNode x={414} y={34} width={110} height={52} chart={1} title="Platform" subtitle="API" />
        <DiagramArrow x1={524} y1={60} x2={544} y2={60} markerId={markerId} />
        <DiagramNode x={546} y={34} width={88} height={52} chart={2} title="Clients" subtitle="REST · WS" />
      </DiagramSvg>
    )
  }

  return (
    <DiagramSvg
      viewBox="0 0 700 130"
      title="MQTT integration path"
      desc="Real machines through gateway and message hub to the platform and clients."
    >
      <defs>
        <DiagramArrowMarker id={markerId} />
      </defs>
      <DiagramNode x={12} y={28} width={118} height={64} chart={3} title="Real machines" subtitle="sensors · PLCs" />
      <DiagramArrow x1={130} y1={60} x2={152} y2={60} markerId={markerId} />
      <DiagramNode x={154} y={28} width={128} height={64} chart={4} title="Site gateway" subtitle="collect · forward" />
      <DiagramArrow x1={282} y1={60} x2={304} y2={60} markerId={markerId} />
      <DiagramNode x={306} y={34} width={118} height={52} chart={5} title="Message hub" subtitle="MQTT broker" />
      <DiagramArrow x1={424} y1={60} x2={446} y2={60} markerId={markerId} />
      <DiagramNode x={448} y={34} width={118} height={52} chart={1} title="Platform" subtitle="ingest · API" />
      <DiagramArrow x1={566} y1={60} x2={588} y2={60} markerId={markerId} />
      <DiagramNode x={590} y={34} width={98} height={52} chart={2} title="Clients" subtitle="REST · WS · UI" />
    </DiagramSvg>
  )
}
