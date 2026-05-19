import type { MDXComponents } from "mdx/types"

import { Callout } from "@/components/docs/callout"
import { CodeBlock } from "@/components/docs/code-block"
import { Diagram } from "@/components/docs/diagram"
import { DocsChecklist, DocsChecklistItem } from "@/components/docs/docs-checklist"
import {
  DocsDeliverableCard,
  DocsDeliverableGrid,
} from "@/components/docs/docs-deliverable-card"
import { DocsEndpointTable } from "@/components/docs/docs-endpoint-table"
import { DocsNavCard } from "@/components/docs/docs-nav-card"
import { DocsPageHeader } from "@/components/docs/docs-page-header"
import {
  DocsOptionalItem,
  DocsRequirementCard,
  DocsRequirementGrid,
} from "@/components/docs/docs-requirement-card"
import { DocsSection } from "@/components/docs/docs-section"
import { DocsResponseExample } from "@/components/docs/docs-response-example"
import { DocsStep, DocsSteps } from "@/components/docs/docs-steps"
import { DocsShellCommand } from "@/components/docs/docs-shell-command"
import { DocsVerificationCommand } from "@/components/docs/docs-verification-command"
import {
  DocsVerificationCriteria,
  DocsVerificationCriterion,
  DocsVerificationFlow,
  DocsVerificationStep,
} from "@/components/docs/docs-verification-step"
import { Snippet } from "@/components/docs/snippet"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    wrapper: ({ children }) => <div className="docs-prose space-y-8">{children}</div>,
    Diagram,
    Snippet,
    Callout,
    CodeBlock,
    DocsPageHeader,
    DocsSection,
    DocsNavCard,
    DocsSteps,
    DocsStep,
    DocsChecklist,
    DocsChecklistItem,
    DocsDeliverableGrid,
    DocsDeliverableCard,
    DocsShellCommand,
    DocsVerificationFlow,
    DocsVerificationStep,
    DocsVerificationCommand,
    DocsVerificationCriteria,
    DocsVerificationCriterion,
    DocsRequirementGrid,
    DocsRequirementCard,
    DocsOptionalItem,
    DocsEndpointTable,
    DocsResponseExample,
  } as MDXComponents
}
