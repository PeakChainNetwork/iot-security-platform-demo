"use client"

import { DiagramSvg } from "@/features/docs/components/diagrams/primitives"

export function MigrationPhaseTimelineDiagram() {
  return (
    <DiagramSvg
      viewBox="0 0 720 200"
      title="Migration phases timeline"
      desc="Simulator and real-machine phases overlapping from start to done."
    >
      <text x={10} y={48} dominantBaseline="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">
        Simulator
      </text>
      <text x={10} y={96} dominantBaseline="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">
        Real machines
      </text>

      <line x1={120} y1={150} x2={700} y2={150} stroke="var(--border)" strokeWidth={1} />
      <text x={120} y={168} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        Start
      </text>
      <text x={700} y={168} textAnchor="end" fontSize={10} fill="var(--muted-foreground)">
        Done
      </text>
      <line x1={120} y1={146} x2={120} y2={154} stroke="var(--border)" strokeWidth={1} />
      <line x1={700} y1={146} x2={700} y2={154} stroke="var(--border)" strokeWidth={1} />

      <rect x={120} y={32} width={480} height={32} rx={8} fill="var(--chart-2)" fillOpacity={0.18} stroke="var(--chart-2)" strokeWidth={1} />
      <rect
        x={600}
        y={32}
        width={100}
        height={32}
        rx={8}
        fill="var(--chart-2)"
        fillOpacity={0.08}
        stroke="var(--chart-2)"
        strokeWidth={1}
        strokeDasharray="4 3"
      />
      <text x={360} y={48} textAnchor="middle" dominantBaseline="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
        Phase 0 — simulator active
      </text>
      <text x={650} y={48} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill="var(--muted-foreground)">
        retiring
      </text>

      <rect x={260} y={80} width={120} height={32} rx={8} fill="var(--chart-3)" fillOpacity={0.18} stroke="var(--chart-3)" strokeWidth={1} />
      <text x={320} y={96} textAnchor="middle" dominantBaseline="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
        Phase 1 — pilot
      </text>

      <rect x={380} y={80} width={120} height={32} rx={8} fill="var(--chart-3)" fillOpacity={0.24} stroke="var(--chart-3)" strokeWidth={1} />
      <text x={440} y={96} textAnchor="middle" dominantBaseline="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
        Phase 2 — parallel
      </text>

      <rect x={500} y={80} width={120} height={32} rx={8} fill="var(--chart-3)" fillOpacity={0.3} stroke="var(--chart-3)" strokeWidth={1} />
      <text x={560} y={96} textAnchor="middle" dominantBaseline="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
        Phase 3 — scale
      </text>

      <rect x={620} y={80} width={80} height={32} rx={8} fill="var(--chart-3)" fillOpacity={0.36} stroke="var(--chart-3)" strokeWidth={1} />
      <text x={660} y={96} textAnchor="middle" dominantBaseline="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
        Phase 4
      </text>

      <rect x={120} y={182} width={12} height={12} rx={3} fill="var(--chart-2)" fillOpacity={0.18} stroke="var(--chart-2)" strokeWidth={1} />
      <text x={138} y={192} fontSize={10} fill="var(--muted-foreground)">
        Simulator
      </text>
      <rect x={210} y={182} width={12} height={12} rx={3} fill="var(--chart-3)" fillOpacity={0.24} stroke="var(--chart-3)" strokeWidth={1} />
      <text x={228} y={192} fontSize={10} fill="var(--muted-foreground)">
        Real machines
      </text>
    </DiagramSvg>
  )
}
