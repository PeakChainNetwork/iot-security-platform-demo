"use client"

import * as React from "react"
import { useId } from "react"

import { cn } from "@/lib/utils"

export type DiagramChart = 1 | 2 | 3 | 4 | 5

const chartFill: Record<DiagramChart, string> = {
  1: "var(--chart-1)",
  2: "var(--chart-2)",
  3: "var(--chart-3)",
  4: "var(--chart-4)",
  5: "var(--chart-5)",
}

export function useDiagramMarkerId(prefix = "arr") {
  const uid = useId().replace(/:/g, "")
  return `${prefix}-${uid}`
}

export function DiagramSvg({
  viewBox,
  title,
  desc,
  children,
  className,
}: {
  viewBox: string
  title: string
  desc?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={title}
      className={cn(
        "mx-auto block h-auto w-full max-w-3xl text-foreground",
        className
      )}
    >
      <title>{title}</title>
      {desc ? <desc>{desc}</desc> : null}
      {children}
    </svg>
  )
}

export function DiagramArrowMarker({ id }: { id: string }) {
  return (
    <marker
      id={id}
      viewBox="0 0 10 10"
      refX="9"
      refY="5"
      markerWidth="6"
      markerHeight="6"
      orient="auto"
    >
      <path
        d="M1 1.5 L8.5 5 L1 8.5"
        fill="none"
        stroke="var(--foreground)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </marker>
  )
}

export function DiagramNode({
  x,
  y,
  width,
  height,
  chart,
  title,
  subtitle,
  dashed,
  variant = "chart",
}: {
  x: number
  y: number
  width: number
  height: number
  chart?: DiagramChart
  title: string
  subtitle?: string
  dashed?: boolean
  variant?: "chart" | "alert"
}) {
  const stroke =
    variant === "alert" ? "var(--destructive)" : chartFill[chart ?? 1]
  const cx = x + width / 2
  const titleY = subtitle ? y + height * 0.42 : y + height / 2
  const subY = y + height * 0.68

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={12}
        fill={stroke}
        fillOpacity={variant === "alert" ? 0.08 : 0.14}
        stroke={stroke}
        strokeWidth={1.25}
        strokeDasharray={dashed ? "5 4" : undefined}
      />
      <text
        x={cx}
        y={titleY}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={13}
        fontWeight={600}
        fill="var(--foreground)"
      >
        {title}
      </text>
      {subtitle ? (
        <text
          x={cx}
          y={subY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={11}
          fill="var(--muted-foreground)"
        >
          {subtitle}
        </text>
      ) : null}
    </g>
  )
}

export function DiagramArrow({
  x1,
  y1,
  x2,
  y2,
  markerId,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
  markerId: string
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="var(--border)"
      strokeWidth={2}
      markerEnd={`url(#${markerId})`}
    />
  )
}
