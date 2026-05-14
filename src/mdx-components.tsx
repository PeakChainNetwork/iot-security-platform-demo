import type { MDXComponents } from "mdx/types"

import { Callout } from "@/components/docs/callout"
import { CodeBlock } from "@/components/docs/code-block"
import { Diagram } from "@/components/docs/diagram"
import { Snippet } from "@/components/docs/snippet"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    wrapper: ({ children }) => <div className="docs-prose">{children}</div>,
    Diagram,
    Snippet,
    Callout,
    CodeBlock,
  } as MDXComponents
}
