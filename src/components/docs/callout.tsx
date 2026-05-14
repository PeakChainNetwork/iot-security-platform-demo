import { cn } from "@/lib/utils"

const variants = {
  default: "border-border bg-muted/30",
  info: "border-sky-500/30 bg-sky-500/5",
  warning: "border-amber-500/30 bg-amber-500/5",
  danger: "border-destructive/40 bg-destructive/5",
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
  return (
    <div className={cn("rounded-xl border p-4 text-sm", variants[variant])}>
      {title ? <div className="mb-2 font-medium text-foreground">{title}</div> : null}
      <div className="text-muted-foreground leading-relaxed [&_code]:rounded [&_code]:bg-muted/80 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs">
        {children}
      </div>
    </div>
  )
}
