"use client"

import {
  DiagramArrow,
  DiagramArrowMarker,
  DiagramNode,
  DiagramSvg,
  type DiagramChart,
  useDiagramMarkerId,
} from "@/components/docs/diagrams/primitives"

export function VerticalFlowDiagram({
  steps,
  branches,
}: {
  steps: { title: string; subtitle?: string; chart: DiagramChart; width?: number }[]
  branches?: {
    fromIndex: number
    items: { title: string; subtitle?: string; chart: DiagramChart; side: "left" | "right" }[]
  }[]
}) {
  const markerId = useDiagramMarkerId("vflow")
  const boxW = 320
  const boxH = 48
  const gap = 16
  const startY = 12
  const cx = 360

  const totalHeight =
    startY + steps.length * (boxH + gap) + (branches?.length ? boxH + gap : 0) + 24

  return (
    <DiagramSvg
      viewBox={`0 0 720 ${totalHeight}`}
      title="Processing flow"
      desc="Sequential steps with optional branches."
    >
      <defs>
        <DiagramArrowMarker id={markerId} />
      </defs>
      {steps.map((step, i) => {
        const y = startY + i * (boxH + gap)
        const x = cx - (step.width ?? boxW) / 2
        return (
          <g key={step.title}>
            <DiagramNode
              x={x}
              y={y}
              width={step.width ?? boxW}
              height={boxH}
              chart={step.chart}
              title={step.title}
              subtitle={step.subtitle}
            />
            {i < steps.length - 1 ? (
              <DiagramArrow
                x1={cx}
                y1={y + boxH}
                x2={cx}
                y2={y + boxH + gap}
                markerId={markerId}
              />
            ) : null}
          </g>
        )
      })}
      {branches?.map((branch) => {
        const fromY = startY + branch.fromIndex * (boxH + gap) + boxH
        const branchY = fromY + gap + 8
        return branch.items.map((item) => {
          const bx = item.side === "left" ? 48 : 472
          const midX = item.side === "left" ? cx - boxW / 2 - 8 : cx + boxW / 2 + 8
          return (
            <g key={`${branch.fromIndex}-${item.title}`}>
              <line x1={cx} y1={fromY} x2={midX} y2={fromY} stroke="var(--border)" strokeWidth={2} />
              <DiagramArrow
                x1={midX}
                y1={fromY}
                x2={bx + 80}
                y2={branchY + boxH / 2}
                markerId={markerId}
              />
              <DiagramNode
                x={bx}
                y={branchY}
                width={160}
                height={boxH}
                chart={item.chart}
                title={item.title}
                subtitle={item.subtitle}
                dashed={item.subtitle === "optional"}
              />
            </g>
          )
        })
      })}
    </DiagramSvg>
  )
}
