import { CodeBlock } from "@/features/docs/components/code-block"

export function DocsResponseExample({
  title,
  status,
  children,
  language = "json",
}: {
  title: string
  status?: number
  children: string
  language?: "text" | "json" | "python" | "javascript" | "typescript" | "csharp" | "bash"
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Example response
        </span>
        <span className="text-sm font-medium text-foreground">{title}</span>
        {status != null ? (
          <span className="rounded-md border border-chart-3/30 bg-chart-3/10 px-2 py-0.5 font-mono text-xs text-foreground">
            {status}
          </span>
        ) : null}
      </div>
      <CodeBlock language={language}>{children.trim()}</CodeBlock>
    </div>
  )
}
