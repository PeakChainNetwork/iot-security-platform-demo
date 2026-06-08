"use client"

import {
  DiagramArrow,
  DiagramArrowMarker,
  DiagramNode,
  DiagramSvg,
  useDiagramMarkerId,
} from "@/features/docs/components/diagrams/primitives"
import { useLocale } from "@/lib/i18n/use-locale"
import type { Locale } from "@/lib/i18n/config"

type Strings = {
  title: string
  desc: string
  topicTitle: string
  payloadTitle: string
  payloadSubtitle: string
}

const strings: Record<Locale, Strings> = {
  en: {
    title: "MQTT message contract",
    desc: "Topic path and JSON payload shape.",
    topicTitle: "Topic",
    payloadTitle: "Payload (JSON)",
    payloadSubtitle: "timestamp + metrics (temperature, pressure, …) · optional status",
  },
  de: {
    title: "MQTT-Nachrichten-Schema",
    desc: "Topic-Pfad und Form des JSON-Payloads.",
    topicTitle: "Topic",
    payloadTitle: "Payload (JSON)",
    payloadSubtitle: "timestamp + Messwerte (temperature, pressure, …) · optionaler status",
  },
}

export function MessageContractDiagram() {
  const lang = useLocale()
  const s = strings[lang]
  const markerId = useDiagramMarkerId("msg")

  return (
    <DiagramSvg
      viewBox="0 0 640 200"
      title={s.title}
      desc={s.desc}
    >
      <defs>
        <DiagramArrowMarker id={markerId} />
      </defs>
      <DiagramNode
        x={20}
        y={16}
        width={600}
        height={72}
        chart={3}
        title={s.topicTitle}
        subtitle="site/<device_id>/telemetry"
      />
      <DiagramArrow x1={320} y1={88} x2={320} y2={104} markerId={markerId} />
      <DiagramNode
        x={20}
        y={104}
        width={600}
        height={80}
        chart={1}
        title={s.payloadTitle}
        subtitle={s.payloadSubtitle}
      />
    </DiagramSvg>
  )
}
