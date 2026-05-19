import { AlertTriangleIcon, CircleAlertIcon, InfoIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const variants = {
  default: {
    box: "border-border bg-muted/30",
    icon: CircleAlertIcon,
    iconClass: "text-muted-foreground",
  },
  info: {
    box: "border-chart-1/25 bg-chart-1/8",
    icon: InfoIcon,
    iconClass: "text-chart-1",
  },
  warning: {
    box: "border-chart-4/30 bg-chart-4/10",
    icon: AlertTriangleIcon,
    iconClass: "text-chart-4",
  },
  danger: {
    box: "border-destructive/40 bg-destructive/10",
    icon: AlertTriangleIcon,
    iconClass: "text-destructive",
  },
} as const

export function Callout({
  title,
  variant = "default",
  children,
}: {
  title?: string
  variant?: keyof typeof variants
  children: React.ReactNode
}) {
  const v = variants[variant]
  const Icon = v.icon
  return (
    <div className={cn("flex gap-3 rounded-xl border p-4 text-sm", v.box)}>
      <Icon className={cn("mt-0.5 size-5 shrink-0", v.iconClass)} aria-hidden />
      <div className="min-w-0 space-y-2">
        {title ? <div className="font-medium text-foreground">{title}</div> : null}
        <div className="leading-relaxed text-muted-foreground [&_code]:rounded [&_code]:bg-muted/80 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_strong]:font-medium [&_strong]:text-foreground">
          {children}
        </div>
      </div>
    </div>
  )
}
