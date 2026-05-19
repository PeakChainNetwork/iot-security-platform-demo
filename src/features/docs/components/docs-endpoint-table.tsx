import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type DocsEndpointRow = {
  method: string
  path: string
  desc: string
}

export function DocsEndpointTable({
  rows,
  className,
}: {
  rows: DocsEndpointRow[]
  className?: string
}) {
  return (
    <div className={cn("overflow-x-auto rounded-xl border shadow-sm", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/40">
            <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Method
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Path
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Purpose
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.method}-${row.path}`} className="border-b last:border-0 transition-colors hover:bg-muted/20">
              <td className="px-4 py-2.5">
                <Badge variant="outline" className="font-mono text-xs">
                  {row.method}
                </Badge>
              </td>
              <td className="px-4 py-2.5 font-mono text-xs text-foreground">{row.path}</td>
              <td className="px-4 py-2.5 text-muted-foreground">{row.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
