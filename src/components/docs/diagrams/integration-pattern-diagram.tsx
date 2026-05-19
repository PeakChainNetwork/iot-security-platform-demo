"use client"

import {
  DiagramArrow,
  DiagramArrowMarker,
  DiagramNode,
  DiagramSvg,
  useDiagramMarkerId,
} from "@/components/docs/diagrams/primitives"

export function IntegrationPatternDiagram() {
  const markerId = useDiagramMarkerId("pat")

  return (
    <DiagramSvg
      viewBox="0 0 720 280"
      title="Integration pattern decision tree"
      desc="Choose direct feed, site gateway, or platform connector based on how machines expose data."
    >
      <defs>
        <DiagramArrowMarker id={markerId} />
      </defs>

      <DiagramNode
        x={200}
        y={12}
        width={320}
        height={52}
        chart={1}
        title="How do machines expose data?"
        subtitle="Pick the path that matches your site"
      />

      <DiagramArrow x1={280} y1={64} x2={120} y2={100} markerId={markerId} />
      <DiagramArrow x1={360} y1={64} x2={360} y2={100} markerId={markerId} />
      <DiagramArrow x1={440} y1={64} x2={600} y2={100} markerId={markerId} />

      <g>
        <text x={180} y={84} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          Native MQTT / HTTP
        </text>
        <DiagramNode x={20} y={102} width={200} height={52} chart={3} title="Direct feed" subtitle="rare — simplest path" />
        <DiagramArrow x1={120} y1={154} x2={120} y2={180} markerId={markerId} />
        <DiagramNode
          x={10}
          y={182}
          width={220}
          height={80}
          chart={3}
          title="Machine publishes directly"
          subtitle="to site/<id>/telemetry."
          dashed
        />
        <text x={120} y={238} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          No gateway needed.
        </text>
      </g>

      <g>
        <text x={360} y={90} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          OPC-UA / Modbus / custom
        </text>
        <DiagramNode x={260} y={102} width={200} height={52} chart={3} title="Site gateway" subtitle="most common" />
        <DiagramArrow x1={360} y1={154} x2={360} y2={180} markerId={markerId} />
        <DiagramNode
          x={250}
          y={182}
          width={220}
          height={80}
          chart={5}
          title="Gateway translates protocols"
          subtitle="and normalises units before"
          dashed
        />
        <text x={360} y={238} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          publishing to the hub.
        </text>
      </g>

      <g>
        <text x={540} y={84} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          Historian / SCADA
        </text>
        <DiagramNode x={500} y={102} width={200} height={52} chart={3} title="Platform connector" subtitle="enterprise sites" />
        <DiagramArrow x1={600} y1={154} x2={600} y2={180} markerId={markerId} />
        <DiagramNode
          x={490}
          y={182}
          width={220}
          height={80}
          chart={4}
          title="Existing platform exports"
          subtitle="data via API or file drop."
          dashed
        />
        <text x={600} y={238} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          Adapter bridges to MQTT.
        </text>
      </g>
    </DiagramSvg>
  )
}
