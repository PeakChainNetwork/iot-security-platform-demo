import type { MDXComponents } from "mdx/types"

import { Callout } from "@/features/docs/components/callout"
import { CodeBlock } from "@/features/docs/components/code-block"
import { Diagram } from "@/features/docs/components/diagram"
import { DocsChecklist, DocsChecklistItem } from "@/features/docs/components/docs-checklist"
import {
  DocsDeliverableCard,
  DocsDeliverableGrid,
} from "@/features/docs/components/docs-deliverable-card"
import { DocsEndpointTable } from "@/features/docs/components/docs-endpoint-table"
import { DocsNavCard } from "@/features/docs/components/docs-nav-card"
import { DocsPageHeader } from "@/features/docs/components/docs-page-header"
import {
  DocsOptionalItem,
  DocsRequirementCard,
  DocsRequirementGrid,
} from "@/features/docs/components/docs-requirement-card"
import { DocsSection } from "@/features/docs/components/docs-section"
import { DocsResponseExample } from "@/features/docs/components/docs-response-example"
import { DocsStep, DocsSteps } from "@/features/docs/components/docs-steps"
import { DocsShellCommand } from "@/features/docs/components/docs-shell-command"
import { DocsVerificationCommand } from "@/features/docs/components/docs-verification-command"
import {
  DocsVerificationCriteria,
  DocsVerificationCriterion,
  DocsVerificationFlow,
  DocsVerificationStep,
} from "@/features/docs/components/docs-verification-step"
import { Snippet } from "@/features/docs/components/snippet"

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
