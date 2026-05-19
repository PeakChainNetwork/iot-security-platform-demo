import { DocsShellCommand } from "@/components/docs/docs-shell-command"

export function DocsVerificationCommand({ value }: { value: string }) {
  return <DocsShellCommand value={value} label="Run this command" />
}
