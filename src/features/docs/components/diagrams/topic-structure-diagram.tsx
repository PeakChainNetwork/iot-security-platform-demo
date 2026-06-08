"use client"

import { DiagramSvg } from "@/features/docs/components/diagrams/primitives"
import { useLocale } from "@/lib/i18n/use-locale"
import type { Locale } from "@/lib/i18n/config"

type Strings = {
  title: string
  desc: string
  siteHint: string
  deviceHint: string
  telemetryHint: string
  platformListens: string
  wildcardMatches: string
}

const strings: Record<Locale, Strings> = {
  en: {
    title: "MQTT topic structure breakdown",
    desc: "Segments site, device_id, telemetry with wildcard subscription and examples.",
    siteHint: "Namespace (fixed)",
    deviceHint: "Stable machine identifier",
    telemetryHint: "Message type (fixed)",
    platformListens: "Platform listens:",
    wildcardMatches: "+ matches any device",
  },
  de: {
    title: "Aufschlüsselung der MQTT-Topic-Struktur",
    desc: "Segmente site, device_id, telemetry mit Wildcard-Abonnement und Beispielen.",
    siteHint: "Namespace (fest)",
    deviceHint: "Stabile Maschinenkennung",
    telemetryHint: "Nachrichtentyp (fest)",
    platformListens: "Plattform hört zu:",
    wildcardMatches: "+ passt auf jedes Gerät",
  },
}

const segmentFill: Record<number, string> = {
  3: "var(--chart-3)",
  4: "var(--chart-4)",
  1: "var(--chart-1)",
  5: "var(--chart-5)",
}

function Segment({
  x,
  w,
  label,
  hint,
  chart,
}: {
  x: number
  w: number
  label: string
  hint: string
  chart: 1 | 3 | 4
}) {
  const stroke = segmentFill[chart]
  const cx = x + w / 2
  return (
    <g>
      <rect
        x={x}
        y={16}
        width={w}
        height={48}
        rx={10}
        fill={stroke}
        fillOpacity={0.14}
        stroke={stroke}
        strokeWidth={1}
      />
      <text
        x={cx}
        y={36}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={15}
        fontWeight={700}
        fontFamily="var(--font-mono)"
        fill="var(--foreground)"
      >
        {label}
      </text>
      <text
        x={cx}
        y={52}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={10}
        fill="var(--muted-foreground)"
      >
        {hint}
      </text>
    </g>
  )
}

export function TopicStructureDiagram() {
  const lang = useLocale()
  const s = strings[lang]
  return (
    <DiagramSvg
      viewBox="0 0 700 170"
      title={s.title}
      desc={s.desc}
      className="max-w-2xl"
    >
      <Segment x={60} w={150} label="site" hint={s.siteHint} chart={3} />
      <text x={225} y={40} textAnchor="middle" dominantBaseline="middle" fontSize={18} fontFamily="var(--font-mono)" fill="var(--muted-foreground)">
        /
      </text>
      <Segment x={245} w={200} label="<device_id>" hint={s.deviceHint} chart={4} />
      <text x={460} y={40} textAnchor="middle" dominantBaseline="middle" fontSize={18} fontFamily="var(--font-mono)" fill="var(--muted-foreground)">
        /
      </text>
      <Segment x={480} w={160} label="telemetry" hint={s.telemetryHint} chart={1} />

      <rect
        x={60}
        y={90}
        width={580}
        height={42}
        rx={10}
        fill="var(--chart-5)"
        fillOpacity={0.1}
        stroke="var(--chart-5)"
        strokeWidth={1}
        strokeDasharray="5 3"
      />
      <text x={100} y={112} dominantBaseline="middle" fontSize={12} fontWeight={600} fill="var(--foreground)">
        {s.platformListens}
      </text>
      <text x={260} y={112} dominantBaseline="middle" fontSize={14} fontWeight={700} fontFamily="var(--font-mono)" fill="var(--foreground)">
        site / + / telemetry
      </text>
      <text x={480} y={112} dominantBaseline="middle" fontSize={11} fill="var(--muted-foreground)">
        {s.wildcardMatches}
      </text>

      <line x1={345} y1={64} x2={345} y2={88} stroke="var(--border)" strokeWidth={1.5} strokeDasharray="3 2" />

      <text x={60} y={155} fontSize={11} fontFamily="var(--font-mono)" fill="var(--muted-foreground)">
        site/dev-001/telemetry
      </text>
      <text x={300} y={155} fontSize={11} fontFamily="var(--font-mono)" fill="var(--muted-foreground)">
        site/press-7/telemetry
      </text>
      <text x={530} y={155} fontSize={11} fontFamily="var(--font-mono)" fill="var(--muted-foreground)">
        site/lineA_motor_02/telemetry
      </text>
    </DiagramSvg>
  )
}
