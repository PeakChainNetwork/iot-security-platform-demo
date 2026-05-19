export function CodeBlock({ children }: { children: string }) {
  return (
    <div className="rounded-xl border bg-card p-4 font-mono text-xs text-muted-foreground whitespace-pre-wrap">
      {children}
    </div>
  )
}
