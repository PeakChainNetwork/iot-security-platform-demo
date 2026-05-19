"use client"

import {
  DiagramArrow,
  DiagramArrowMarker,
  DiagramNode,
  DiagramSvg,
  useDiagramMarkerId,
} from "@/components/docs/diagrams/primitives"

/** Gateway → platform → (REST | WS) → clients */
export function IntegrationOverviewDiagram({
  variant = "full",
}: {
  variant?: "full" | "compact"
}) {
  const markerId = useDiagramMarkerId("flow")

  if (variant === "compact") {
    return (
      <DiagramSvg
        viewBox="0 0 640 120"
        title="Integration map"
        desc="Site gateway publishes MQTT; clients read REST and WebSocket."
      >
        <defs>
          <DiagramArrowMarker id={markerId} />
        </defs>
        <DiagramNode x={24} y={32} width={130} height={56} chart={3} title="Site gateway" subtitle="site/…/telemetry" />
        <DiagramArrow x1={154} y1={60} x2={188} y2={60} markerId={markerId} />
        <DiagramNode x={190} y={28} width={150} height={64} chart={1} title="Platform" subtitle="ingest · stream" />
        <DiagramArrow x1={340} y1={60} x2={374} y2={60} markerId={markerId} />
        <DiagramNode x={376} y={32} width={140} height={56} chart={2} title="REST / WS" subtitle="your apps" />
      </DiagramSvg>
    )
  }

  return (
    <DiagramSvg
      viewBox="0 0 720 140"
      title="Integration overview"
      desc="MQTT publish in; REST and WebSocket read paths out to your applications."
    >
      <defs>
        <DiagramArrowMarker id={markerId} />
      </defs>

      <DiagramNode x={20} y={40} width={128} height={60} chart={3} title="Your gateway" subtitle="MQTT publish" />
      <DiagramArrow x1={148} y1={70} x2={178} y2={70} markerId={markerId} />

      <DiagramNode x={180} y={32} width={152} height={76} chart={1} title="Platform API" subtitle="ingest · store · stream" />

      <DiagramArrow x1={332} y1={52} x2={368} y2={44} markerId={markerId} />
      <DiagramArrow x1={332} y1={88} x2={368} y2={96} markerId={markerId} />

      <DiagramNode x={370} y={24} width={116} height={48} chart={2} title="REST" />
      <DiagramNode x={370} y={80} width={116} height={48} chart={5} title="WebSocket" />

      <DiagramArrow x1={486} y1={48} x2={522} y2={62} markerId={markerId} />
      <DiagramArrow x1={486} y1={104} x2={522} y2={78} markerId={markerId} />

      <DiagramNode
        x={524}
        y={40}
        width={176}
        height={60}
        chart={4}
        title="Your applications"
        subtitle="dashboard · integrations"
      />
    </DiagramSvg>
  )
}
