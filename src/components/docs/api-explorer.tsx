"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { CopyButton } from "@/components/copy-button"
import { DocsShellCommand } from "@/components/docs/docs-shell-command"
import {
  ChevronDownIcon,
  ChevronRightIcon,
  GlobeIcon,
  HashIcon,
  RefreshCwIcon,
  SearchIcon,
  TerminalIcon,
  WifiIcon,
  ZapIcon,
  XIcon,
  AlertTriangleIcon,
} from "lucide-react"

type JsonSchema = Record<string, unknown>

type OpenApiParameter = {
  name: string
  in: string
  required?: boolean
  description?: string
  example?: unknown
  schema?: JsonSchema
}

type MediaTypeObject = {
  schema?: JsonSchema
  example?: unknown
}

type ResponseObject = {
  description?: string
  content?: Record<string, MediaTypeObject>
}

type Operation = {
  operationId?: string
  summary?: string
  description?: string
  tags?: string[]
  parameters?: OpenApiParameter[]
  requestBody?: {
    required?: boolean
    content?: Record<string, MediaTypeObject>
  }
  responses?: Record<string, ResponseObject>
}

type PathItem = Record<string, Operation | undefined> & {
  parameters?: OpenApiParameter[]
}

type OpenApiDoc = {
  openapi?: string
  info?: { title?: string; version?: string; description?: string }
  paths?: Record<string, PathItem>
  components?: { schemas?: Record<string, JsonSchema> }
}

type WsMessageDirection = {
  description: string
  messageSchema?: JsonSchema
  example?: unknown
  examples?: Array<{ label: string; description: string; payload: unknown }>
}

type WsError = {
  code: number
  reason: string
  description: string
  example?: unknown
}

type WsConnectionLifecycle = {
  handshake?: string
  heartbeat?: string
  reconnection?: string
  idleTimeout?: string
}

type WsContract = {
  id: string
  method: string
  path: string
  summary: string
  description: string
  queryParameters: OpenApiParameter[]
  protocol: string
  exampleUrl: string
  clientToServer: string | WsMessageDirection
  serverToClient: string | WsMessageDirection
  errors?: WsError[]
  connectionLifecycle?: WsConnectionLifecycle
  jsExample?: string
}

const HTTP_METHODS = new Set(["get", "post", "put", "patch", "delete", "options", "head"])

function methodVariant(m: string): "default" | "secondary" | "destructive" | "outline" {
  const u = m.toUpperCase()
  if (u === "GET") return "secondary"
  if (u === "POST") return "default"
  if (u === "DELETE") return "destructive"
  return "outline"
}

function statusVariant(code: string): "default" | "secondary" | "destructive" | "outline" {
  if (code.startsWith("2")) return "secondary"
  if (code.startsWith("4") || code.startsWith("5")) return "destructive"
  return "outline"
}

function isErrorCode(code: string): boolean {
  return code.startsWith("4") || code.startsWith("5")
}

function resolveRef(root: OpenApiDoc, ref: string): JsonSchema | null {
  if (!ref.startsWith("#/components/schemas/")) return null
  const name = ref.slice("#/components/schemas/".length)
  return root.components?.schemas?.[name] ?? null
}

function resolveSchemaFull(root: OpenApiDoc, schema: JsonSchema | undefined, depth: number): JsonSchema | undefined {
  if (!schema || depth > 12) return schema
  if (typeof schema !== "object") return schema
  const r = schema.$ref
  if (typeof r === "string") {
    const resolved = resolveRef(root, r)
    if (!resolved) return schema
    return { ...resolved, ...("description" in schema ? { description: schema.description } : {}) }
  }
  return schema
}

function getRefName(schema: JsonSchema | undefined): string | null {
  if (!schema || typeof schema !== "object") return null
  const r = schema.$ref
  if (typeof r === "string" && r.startsWith("#/components/schemas/")) {
    return r.slice("#/components/schemas/".length)
  }
  return null
}

function generateExample(root: OpenApiDoc, schema: JsonSchema | undefined, depth: number = 0): unknown {
  if (!schema || depth > 8) return null
  const s = resolveSchemaFull(root, schema, depth)
  if (!s || typeof s !== "object") return null

  if (s.example !== undefined) return s.example

  const type = typeof s.type === "string" ? s.type : s.properties ? "object" : "any"

  if (type === "object" && s.properties && typeof s.properties === "object") {
    const obj: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(s.properties as Record<string, JsonSchema>)) {
      obj[key] = generateExample(root, val, depth + 1)
    }
    return obj
  }

  if (type === "array" && s.items) {
    const item = generateExample(root, s.items as JsonSchema, depth + 1)
    return item !== null ? [item] : []
  }

  if (s.allOf && Array.isArray(s.allOf)) {
    let merged: Record<string, unknown> = {}
    for (const part of s.allOf as JsonSchema[]) {
      const ex = generateExample(root, part, depth + 1)
      if (ex && typeof ex === "object" && !Array.isArray(ex)) {
        merged = { ...merged, ...(ex as Record<string, unknown>) }
      }
    }
    return Object.keys(merged).length ? merged : null
  }

  if (Array.isArray(s.enum)) return s.enum[0]
  if (type === "string") return s.format === "date-time" ? "2026-05-14T10:30:00Z" : "string"
  if (type === "integer") return 0
  if (type === "number") return 0.0
  if (type === "boolean") return false
  return null
}

type FlatField = {
  name: string
  type: string
  required: boolean
  description: string
  example: string
  nullable: boolean
  enumValues: string[] | null
}

function flattenSchema(root: OpenApiDoc, schema: JsonSchema | undefined, depth: number = 0): FlatField[] {
  const s = resolveSchemaFull(root, schema, depth)
  if (!s || typeof s !== "object") return []

  if (s.allOf && Array.isArray(s.allOf)) {
    const fields: FlatField[] = []
    for (const part of s.allOf as JsonSchema[]) {
      fields.push(...flattenSchema(root, part, depth + 1))
    }
    return fields
  }

  const type = typeof s.type === "string" ? s.type : s.properties ? "object" : "any"
  if (type !== "object" || !s.properties) return []

  const props = s.properties as Record<string, JsonSchema>
  const required = new Set(Array.isArray(s.required) ? (s.required as string[]) : [])
  const fields: FlatField[] = []

  for (const [key, val] of Object.entries(props)) {
    const resolved = resolveSchemaFull(root, val, depth + 1)
    const refName = getRefName(val)
    let fieldType = "any"
    if (resolved && typeof resolved === "object") {
      if (typeof resolved.type === "string") {
        fieldType = resolved.type
        if (fieldType === "string" && resolved.format) fieldType = `string (${String(resolved.format)})`
        if (fieldType === "array" && resolved.items) {
          const itemRef = getRefName(resolved.items as JsonSchema)
          const itemResolved = resolveSchemaFull(root, resolved.items as JsonSchema, depth + 2)
          const itemType = itemRef ?? (itemResolved && typeof itemResolved.type === "string" ? itemResolved.type : "any")
          fieldType = `${itemType}[]`
        }
      } else if (refName) {
        fieldType = refName
      }
    }

    const ex = resolved?.example
    let exStr = "—"
    if (ex !== undefined && ex !== null) {
      exStr = typeof ex === "object" ? JSON.stringify(ex) : String(ex)
    }

    const enumVals = resolved && Array.isArray(resolved.enum) ? (resolved.enum as unknown[]).map(String) : null

    fields.push({
      name: key,
      type: fieldType,
      required: required.has(key),
      description: (resolved?.description as string) ?? "",
      example: exStr,
      nullable: !!(resolved?.nullable),
      enumValues: enumVals,
    })
  }

  return fields
}

function JsonBlock({ data, label }: { data: unknown; label: string }) {
  const json = JSON.stringify(data, null, 2)
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        <CopyButton value={json} label={`Copy ${label}`} />
      </div>
      <pre className="overflow-x-auto rounded-lg border bg-muted/30 p-4 font-mono text-xs leading-relaxed text-foreground">
        {json}
      </pre>
    </div>
  )
}

function SchemaFieldTable({ fields }: { fields: FlatField[] }) {
  if (!fields.length) return null
  return (
    <div className="rounded-lg border">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-3 py-2 text-xs font-medium text-muted-foreground">Field</th>
            <th className="px-3 py-2 text-xs font-medium text-muted-foreground">Type</th>
            <th className="px-3 py-2 text-xs font-medium text-muted-foreground">Description</th>
            <th className="px-3 py-2 text-xs font-medium text-muted-foreground">Example</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((f, i) => (
            <tr key={f.name} className={cn("align-top", i < fields.length - 1 && "border-b border-border/60")}>
              <td className="px-3 py-2 font-mono text-xs">
                <span className="text-foreground">{f.name}</span>
                {f.required && <span className="ml-1 text-destructive">*</span>}
                {f.nullable && <span className="ml-1 text-muted-foreground">?</span>}
              </td>
              <td className="px-3 py-2">
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground">{f.type}</code>
                {f.enumValues && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {f.enumValues.map((v) => (
                      <Badge key={v} variant="outline" className="h-4 px-1 text-[9px] font-normal">{v}</Badge>
                    ))}
                  </div>
                )}
              </td>
              <td className="px-3 py-2 text-xs text-muted-foreground">{f.description || "—"}</td>
              <td className="px-3 py-2 font-mono text-[11px] text-muted-foreground">{f.example}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

type OpRef = { path: string; method: string; operation: Operation }

function collectOperations(spec: OpenApiDoc): OpRef[] {
  const out: OpRef[] = []
  const paths = spec.paths ?? {}
  for (const [p, item] of Object.entries(paths)) {
    if (!item) continue
    const commonParams = item.parameters ?? []
    for (const [method, op] of Object.entries(item)) {
      if (!HTTP_METHODS.has(method) || !op || typeof op !== "object") continue
      const operation = op as Operation
      const merged = {
        ...operation,
        parameters: [...commonParams, ...(operation.parameters ?? [])],
      }
      out.push({ path: p, method, operation: merged })
    }
  }
  return out
}

function buildCurlExample(op: OpRef, hasBody: boolean): string {
  const m = op.method.toUpperCase()
  const pathParams = op.operation.parameters?.filter((p) => p.in === "path") ?? []
  const queryParams = op.operation.parameters?.filter((p) => p.in === "query") ?? []

  let url = op.path
  for (const p of pathParams) {
    const ex = p.example ?? p.schema?.example
    url = url.replace(`{${p.name}}`, ex ? String(ex) : `<${p.name}>`)
  }

  const qs = queryParams.length
    ? "?" + queryParams.map((p) => {
        const ex = p.example ?? p.schema?.example
        return `${p.name}=${ex ? String(ex) : "<value>"}`
      }).join("&")
    : ""

  const parts = [`curl -X ${m}`]
  parts.push(`  "$\{BASE_URL\}${url}${qs}"`)

  if (hasBody) {
    parts.push(`  -H "Content-Type: application/json"`)
    const bodyContent = op.operation.requestBody?.content?.["application/json"]
    if (bodyContent?.example) {
      parts.push(`  -d '${JSON.stringify(bodyContent.example)}'`)
    } else {
      parts.push(`  -d '{ ... }'`)
    }
  }

  return parts.join(" \\\n")
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-24" />
      </div>
      <Skeleton className="h-9 w-full max-w-sm" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-5 w-24" />
          {Array.from({ length: 2 }).map((_, j) => (
            <Skeleton key={j} className="h-16 w-full" />
          ))}
        </div>
      ))}
    </div>
  )
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card className="border-destructive/30">
      <CardContent className="flex flex-col items-center gap-4 py-12">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
          <ZapIcon className="size-6 text-destructive" />
        </div>
        <div className="text-center">
          <p className="font-medium text-foreground">Failed to load API specification</p>
          <p className="mt-1 text-sm text-muted-foreground">{message}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
          <RefreshCwIcon className="size-3.5" />
          Retry
        </Button>
      </CardContent>
    </Card>
  )
}

function EmptyFilterState({ filter, onClear }: { filter: string; onClear: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <SearchIcon className="size-8 text-muted-foreground/40" />
      <div>
        <p className="text-sm font-medium text-foreground">No endpoints match &ldquo;{filter}&rdquo;</p>
        <p className="mt-1 text-xs text-muted-foreground">Try a different search term or clear the filter.</p>
      </div>
      <Button variant="ghost" size="sm" onClick={onClear} className="gap-1.5 text-xs">
        <XIcon className="size-3" />
        Clear filter
      </Button>
    </div>
  )
}

function EndpointDetail({ op, spec }: { op: OpRef; spec: OpenApiDoc }) {
  const hasBody = !!op.operation.requestBody?.content?.["application/json"]
  const curl = buildCurlExample(op, hasBody)

  const bodyContent = op.operation.requestBody?.content?.["application/json"]
  const bodySchema = bodyContent?.schema
  const bodyExample = bodyContent?.example ?? (bodySchema ? generateExample(spec, bodySchema) : null)
  const bodyFields = bodySchema ? flattenSchema(spec, bodySchema) : []

  const successResponses = Object.entries(op.operation.responses ?? {})
    .filter(([code]) => code.startsWith("2"))
    .sort(([a], [b]) => a.localeCompare(b))
  const errorResponses = Object.entries(op.operation.responses ?? {})
    .filter(([code]) => isErrorCode(code))
    .sort(([a], [b]) => a.localeCompare(b))

  return (
    <div className="space-y-6 pt-4">
      {op.operation.description && (
        <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {op.operation.description}
        </p>
      )}

      {/* Parameters */}
      {op.operation.parameters?.length ? (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Parameters</h4>
          <div className="rounded-lg border">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-3 py-2 text-xs font-medium text-muted-foreground">Name</th>
                  <th className="px-3 py-2 text-xs font-medium text-muted-foreground">In</th>
                  <th className="px-3 py-2 text-xs font-medium text-muted-foreground">Type</th>
                  <th className="px-3 py-2 text-xs font-medium text-muted-foreground">Description</th>
                  <th className="px-3 py-2 text-xs font-medium text-muted-foreground">Example</th>
                </tr>
              </thead>
              <tbody>
                {op.operation.parameters.map((p, i) => {
                  const sch = p.schema as JsonSchema | undefined
                  const t = sch && typeof sch === "object" && typeof sch.type === "string" ? sch.type : "any"
                  const isLast = i === (op.operation.parameters?.length ?? 0) - 1
                  const ex = p.example ?? sch?.example ?? sch?.default
                  const enumVals = sch && Array.isArray(sch.enum) ? (sch.enum as unknown[]).map(String) : null
                  return (
                    <tr key={`${p.in}:${p.name}`} className={cn("align-top", !isLast && "border-b border-border/60")}>
                      <td className="px-3 py-2 font-mono text-xs">
                        <span className="text-foreground">{p.name}</span>
                        {p.required ? <span className="ml-1 text-destructive">*</span> : null}
                      </td>
                      <td className="px-3 py-2">
                        <Badge variant="outline" className="h-5 text-[10px] font-normal">{p.in}</Badge>
                      </td>
                      <td className="px-3 py-2">
                        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground">{t}</code>
                        {enumVals && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {enumVals.map((v) => (
                              <Badge key={v} variant="outline" className="h-4 px-1 text-[9px] font-normal">{v}</Badge>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">
                        {p.description ?? "—"}
                        {sch?.default !== undefined && (
                          <span className="mt-0.5 block text-[10px]">
                            Default: <code className="font-mono">{String(sch.default)}</code>
                          </span>
                        )}
                        {sch?.minimum !== undefined && (
                          <span className="mt-0.5 block text-[10px]">
                            Min: <code className="font-mono">{String(sch.minimum)}</code>
                            {sch.maximum !== undefined && <>, Max: <code className="font-mono">{String(sch.maximum)}</code></>}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 font-mono text-[11px] text-muted-foreground">
                        {ex !== undefined && ex !== null ? String(ex) : "—"}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {/* Request Body */}
      {hasBody ? (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Request Body</h4>
          {bodyFields.length > 0 && <SchemaFieldTable fields={bodyFields} />}
          {bodyExample != null && <JsonBlock data={bodyExample} label="Example request" />}
        </div>
      ) : null}

      {/* Success Responses */}
      {successResponses.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Responses</h4>
          {successResponses.map(([code, res]) => {
            const content = res.content?.["application/json"]
            const example = content?.example ?? (content?.schema ? generateExample(spec, content.schema) : null)
            const fields = content?.schema ? flattenSchema(spec, content.schema) : []
            return (
              <div key={code} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariant(code)} className="font-mono text-[10px]">{code}</Badge>
                  <span className="text-sm text-muted-foreground">{res.description}</span>
                </div>
                {fields.length > 0 && <SchemaFieldTable fields={fields} />}
                {example != null && <JsonBlock data={example} label={`${code} response`} />}
                {!content && (
                  <p className="text-xs text-muted-foreground">No response body.</p>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Error Responses */}
      {errorResponses.length > 0 && (
        <div className="space-y-3">
          <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <AlertTriangleIcon className="size-3" />
            Error Responses
          </h4>
          <div className="space-y-2">
            {errorResponses.map(([code, res]) => {
              const content = res.content?.["application/json"]
              const example = content?.example
              return (
                <Collapsible key={code} className="group/err">
                  <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/[0.03] px-3 py-2 text-left transition-colors hover:bg-destructive/[0.06]">
                    <Badge variant="destructive" className="font-mono text-[10px]">{code}</Badge>
                    <span className="flex-1 text-xs text-muted-foreground">{res.description}</span>
                    <ChevronRightIcon className="size-3.5 shrink-0 text-muted-foreground transition-transform group-data-[state=open]/err:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {example != null ? (
                      <div className="mt-2 ml-1">
                        <JsonBlock data={example} label={`${code} example`} />
                      </div>
                    ) : (
                      <p className="mt-2 ml-1 text-xs text-muted-foreground">No example body.</p>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              )
            })}
          </div>
        </div>
      )}

      <DocsShellCommand label="cURL" value={curl} />
    </div>
  )
}

function EndpointRow({ item, spec }: { item: OpRef; spec: OpenApiDoc }) {
  const errorCount = Object.keys(item.operation.responses ?? {}).filter((c) => isErrorCode(c)).length

  return (
    <Collapsible className="group/endpoint">
      <CollapsibleTrigger className="flex w-full items-center gap-3 rounded-lg border bg-card px-4 py-3 text-left transition-colors hover:bg-accent/50 group-data-[state=open]/endpoint:rounded-b-none group-data-[state=open]/endpoint:border-b-0">
        <Badge variant={methodVariant(item.method)} className="h-6 min-w-[3.75rem] justify-center font-mono text-[10px] font-semibold uppercase">
          {item.method.toUpperCase()}
        </Badge>
        <code className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">{item.path}</code>
        {item.operation.summary && (
          <span className="hidden text-xs text-foreground sm:block">{item.operation.summary}</span>
        )}
        {errorCount > 0 && (
          <Badge variant="outline" className="hidden h-5 gap-1 text-[10px] font-normal text-muted-foreground sm:flex">
            {errorCount} error{errorCount > 1 ? "s" : ""}
          </Badge>
        )}
        <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]/endpoint:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="rounded-b-lg border border-t-0 bg-card px-4 pb-5">
          {item.operation.summary && (
            <p className="pt-3 text-sm font-medium text-foreground sm:hidden">{item.operation.summary}</p>
          )}
          <EndpointDetail op={item} spec={spec} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function WsSchemaFieldTable({ schema }: { schema: JsonSchema }) {
  const props = schema.properties as Record<string, JsonSchema> | undefined
  if (!props) return null
  const entries = Object.entries(props)
  if (!entries.length) return null

  return (
    <div className="rounded-lg border">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-3 py-2 text-xs font-medium text-muted-foreground">Field</th>
            <th className="px-3 py-2 text-xs font-medium text-muted-foreground">Type</th>
            <th className="px-3 py-2 text-xs font-medium text-muted-foreground">Description</th>
            <th className="px-3 py-2 text-xs font-medium text-muted-foreground">Example</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([key, val], i) => {
            const t = typeof val.type === "string" ? val.type : "any"
            const enumVals = Array.isArray(val.enum) ? (val.enum as unknown[]).map(String) : null
            const ex = val.example
            return (
              <tr key={key} className={cn("align-top", i < entries.length - 1 && "border-b border-border/60")}>
                <td className="px-3 py-2 font-mono text-xs text-foreground">{key}</td>
                <td className="px-3 py-2">
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground">{t}</code>
                  {enumVals && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {enumVals.map((v) => (
                        <Badge key={v} variant="outline" className="h-4 px-1 text-[9px] font-normal">{v}</Badge>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-3 py-2 text-xs text-muted-foreground">{(val.description as string) ?? "—"}</td>
                <td className="px-3 py-2 font-mono text-[11px] text-muted-foreground">
                  {ex !== undefined && ex !== null ? (typeof ex === "object" ? JSON.stringify(ex) : String(ex)) : "—"}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function WsMessageSection({ direction, label }: { direction: string | WsMessageDirection; label: string }) {
  if (typeof direction === "string") {
    return (
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{direction}</p>
      </div>
    )
  }

  const dir = direction
  const hasMultipleExamples = dir.examples && dir.examples.length > 0
  const json = dir.example != null ? JSON.stringify(dir.example, null, 2) : null

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">{dir.description}</p>

      {dir.messageSchema && (
        <div className="space-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Message schema</span>
          <WsSchemaFieldTable schema={dir.messageSchema} />
        </div>
      )}

      {hasMultipleExamples ? (
        <div className="space-y-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Examples</span>
          {dir.examples!.map((ex) => {
            const exJson = JSON.stringify(ex.payload, null, 2)
            return (
              <Collapsible key={ex.label} className="group/wsex">
                <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors hover:bg-accent/50">
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground">{ex.label}</code>
                  <span className="flex-1 text-xs text-muted-foreground">{ex.description}</span>
                  <ChevronRightIcon className="size-3.5 shrink-0 text-muted-foreground transition-transform group-data-[state=open]/wsex:rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center justify-end">
                      <CopyButton value={exJson} label={`Copy ${ex.label} example`} />
                    </div>
                    <pre className="overflow-x-auto rounded-lg border bg-muted/30 p-4 font-mono text-xs leading-relaxed text-foreground">
                      {exJson}
                    </pre>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )
          })}
        </div>
      ) : json != null ? (
        <JsonBlock data={dir.example} label={`${label} example`} />
      ) : null}
    </div>
  )
}

function WsContractCard({ contract }: { contract: WsContract }) {
  const lifecycle = contract.connectionLifecycle
  const lifecycleEntries = lifecycle ? Object.entries(lifecycle).filter(([, v]) => v) as [string, string][] : []

  return (
    <Collapsible className="group/ws">
      <CollapsibleTrigger className="flex w-full items-center gap-3 rounded-lg border bg-card px-4 py-3 text-left transition-colors hover:bg-accent/50 group-data-[state=open]/ws:rounded-b-none group-data-[state=open]/ws:border-b-0">
        <Badge variant="outline" className="h-6 gap-1 font-mono text-[10px] font-semibold">
          <WifiIcon className="size-3" />
          WS
        </Badge>
        <code className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">{contract.path}</code>
        <span className="hidden text-xs text-foreground sm:block">{contract.summary}</span>
        {contract.errors && contract.errors.length > 0 && (
          <Badge variant="outline" className="hidden h-5 gap-1 text-[10px] font-normal text-muted-foreground sm:flex">
            {contract.errors.length} error{contract.errors.length > 1 ? "s" : ""}
          </Badge>
        )}
        <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]/ws:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-6 rounded-b-lg border border-t-0 bg-card px-4 pb-5 pt-4">
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">{contract.description}</p>

          {/* Connection URL */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Connection URL</h4>
            <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2 font-mono text-xs">
              <span className="min-w-0 flex-1 break-all text-foreground">{contract.exampleUrl}</span>
              <CopyButton value={contract.exampleUrl} label="Copy WebSocket URL" />
            </div>
          </div>

          {/* Query Parameters */}
          {contract.queryParameters.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Query Parameters</h4>
              <div className="rounded-lg border">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-3 py-2 text-xs font-medium text-muted-foreground">Name</th>
                      <th className="px-3 py-2 text-xs font-medium text-muted-foreground">Type</th>
                      <th className="px-3 py-2 text-xs font-medium text-muted-foreground">Required</th>
                      <th className="px-3 py-2 text-xs font-medium text-muted-foreground">Description</th>
                      <th className="px-3 py-2 text-xs font-medium text-muted-foreground">Example</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contract.queryParameters.map((p, i) => {
                      const t = p.schema && typeof p.schema.type === "string" ? p.schema.type : "any"
                      return (
                        <tr key={p.name} className={cn("align-top", i < contract.queryParameters.length - 1 && "border-b border-border/60")}>
                          <td className="px-3 py-2 font-mono text-xs text-foreground">{p.name}</td>
                          <td className="px-3 py-2">
                            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground">{t}</code>
                          </td>
                          <td className="px-3 py-2 text-xs text-muted-foreground">{p.required ? "Yes" : "No"}</td>
                          <td className="px-3 py-2 text-xs text-muted-foreground">{p.description ?? "—"}</td>
                          <td className="px-3 py-2 font-mono text-[11px] text-muted-foreground">
                            {p.example !== undefined ? String(p.example) : "—"}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Message directions */}
          <WsMessageSection direction={contract.clientToServer} label="Client → Server" />
          <WsMessageSection direction={contract.serverToClient} label="Server → Client" />

          {/* Connection Lifecycle */}
          {lifecycleEntries.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Connection Lifecycle</h4>
              <div className="rounded-lg border">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-3 py-2 text-xs font-medium text-muted-foreground">Phase</th>
                      <th className="px-3 py-2 text-xs font-medium text-muted-foreground">Behavior</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lifecycleEntries.map(([phase, desc], i) => (
                      <tr key={phase} className={cn("align-top", i < lifecycleEntries.length - 1 && "border-b border-border/60")}>
                        <td className="px-3 py-2 text-xs font-medium capitalize text-foreground">{phase}</td>
                        <td className="px-3 py-2 text-xs text-muted-foreground leading-relaxed">{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Errors */}
          {contract.errors && contract.errors.length > 0 && (
            <div className="space-y-3">
              <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <AlertTriangleIcon className="size-3" />
                Close Codes / Errors
              </h4>
              <div className="space-y-2">
                {contract.errors.map((err) => (
                  <Collapsible key={err.code} className="group/wserr">
                    <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/[0.03] px-3 py-2 text-left transition-colors hover:bg-destructive/[0.06]">
                      <Badge variant="destructive" className="font-mono text-[10px]">{err.code}</Badge>
                      <span className="font-mono text-xs text-foreground">{err.reason}</span>
                      <span className="flex-1 text-xs text-muted-foreground">{err.description}</span>
                      <ChevronRightIcon className="size-3.5 shrink-0 text-muted-foreground transition-transform group-data-[state=open]/wserr:rotate-90" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      {err.example != null ? (
                        <div className="mt-2 ml-1">
                          <JsonBlock data={err.example} label={`${err.code} example`} />
                        </div>
                      ) : (
                        <p className="mt-2 ml-1 text-xs text-muted-foreground">No example payload.</p>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </div>
          )}

          {/* JS Example */}
          {contract.jsExample && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <TerminalIcon className="size-3" />
                  JavaScript Example
                </h4>
                <CopyButton value={contract.jsExample} label="Copy JS example" />
              </div>
              <pre className="overflow-x-auto rounded-lg border bg-muted/30 p-4 font-mono text-xs leading-relaxed text-foreground">
                {contract.jsExample}
              </pre>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function ApiExplorer() {
  const [spec, setSpec] = React.useState<OpenApiDoc | null>(null)
  const [wsList, setWsList] = React.useState<WsContract[]>([])
  const [filter, setFilter] = React.useState("")
  const [err, setErr] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [activeTab, setActiveTab] = React.useState("rest")

  const loadSpec = React.useCallback(async () => {
    setErr(null)
    setLoading(true)
    try {
      const [a, b] = await Promise.all([
        fetch("/openapi.json", { cache: "no-store" }).then((r) => {
          if (!r.ok) throw new Error(`${r.status} openapi`)
          return r.json() as Promise<OpenApiDoc>
        }),
        fetch("/ws-contracts.json", { cache: "no-store" }).then((r) => {
          if (!r.ok) return [] as WsContract[]
          return r.json() as Promise<WsContract[]>
        }),
      ])
      setSpec(a)
      setWsList(Array.isArray(b) ? b : [])
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load API spec")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => { loadSpec() }, [loadSpec])

  const ops = React.useMemo(() => (spec ? collectOperations(spec) : []), [spec])

  const grouped = React.useMemo(() => {
    const g = new Map<string, OpRef[]>()
    const q = filter.trim().toLowerCase()
    for (const o of ops) {
      const hay = `${o.method} ${o.path} ${o.operation.summary ?? ""}`.toLowerCase()
      if (q && !hay.includes(q)) continue
      const tag = o.operation.tags?.[0] ?? "Other"
      if (!g.has(tag)) g.set(tag, [])
      g.get(tag)!.push(o)
    }
    for (const [, list] of g) {
      list.sort((a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method))
    }
    return Array.from(g.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [ops, filter])

  const totalFiltered = React.useMemo(() => grouped.reduce((sum, [, list]) => sum + list.length, 0), [grouped])
  const tagCount = React.useMemo(() => {
    const tags = new Set<string>()
    for (const o of ops) {
      const tag = o.operation.tags?.[0] ?? "Other"
      tags.add(tag)
    }
    return tags.size
  }, [ops])

  if (loading) return <LoadingSkeleton />
  if (err) return <ErrorState message={err} onRetry={loadSpec} />
  if (!spec) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="gap-1.5 font-normal">
              <GlobeIcon className="size-3" />
              {ops.length} endpoints
            </Badge>
          </TooltipTrigger>
          <TooltipContent>Total REST endpoints in spec</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="gap-1.5 font-normal">
              <HashIcon className="size-3" />
              {tagCount} tags
            </Badge>
          </TooltipTrigger>
          <TooltipContent>API tag groups</TooltipContent>
        </Tooltip>
        {wsList.length > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="gap-1.5 font-normal">
                <WifiIcon className="size-3" />
                {wsList.length} WebSocket{wsList.length !== 1 ? "s" : ""}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>WebSocket streams</TooltipContent>
          </Tooltip>
        )}
        {spec.info?.version && (
          <Badge variant="secondary" className="font-mono text-[10px]">
            v{spec.info.version}
          </Badge>
        )}
        {spec.openapi && (
          <Badge variant="secondary" className="font-mono text-[10px]">
            OpenAPI {spec.openapi}
          </Badge>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="rest" className="gap-1.5">
            <TerminalIcon className="size-3.5" />
            REST API
            <Badge variant="secondary" className="ml-1 h-4 px-1.5 text-[10px]">{ops.length}</Badge>
          </TabsTrigger>
          {wsList.length > 0 && (
            <TabsTrigger value="websocket" className="gap-1.5">
              <WifiIcon className="size-3.5" />
              WebSockets
              <Badge variant="secondary" className="ml-1 h-4 px-1.5 text-[10px]">{wsList.length}</Badge>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="rest" className="mt-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="relative max-w-sm flex-1">
              <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter by path or summary…"
                className="h-9 pl-8"
              />
              {filter && (
                <button
                  type="button"
                  onClick={() => setFilter("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <XIcon className="size-3.5" />
                </button>
              )}
            </div>
            {filter && (
              <span className="text-xs text-muted-foreground">
                {totalFiltered} of {ops.length} endpoints
              </span>
            )}
          </div>

          {totalFiltered === 0 && filter ? (
            <EmptyFilterState filter={filter} onClear={() => setFilter("")} />
          ) : (
            <div className="space-y-8">
              {grouped.map(([tag, list]) => (
                <section key={tag} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{tag}</h3>
                    <Separator className="flex-1" />
                    <span className="text-xs text-muted-foreground">{list.length}</span>
                  </div>
                  <div className="space-y-2">
                    {list.map((item) => (
                      <EndpointRow key={`${item.method}:${item.path}`} item={item} spec={spec} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </TabsContent>

        {wsList.length > 0 && (
          <TabsContent value="websocket" className="mt-6 space-y-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Real-time data channels via persistent WebSocket connections. Each stream has its own message schema, error codes, and connection lifecycle details.
            </p>
            <div className="space-y-2">
              {wsList.map((w) => (
                <WsContractCard key={w.id} contract={w} />
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
