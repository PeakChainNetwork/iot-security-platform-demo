import { AppShell } from "@/components/common/app-shell"

export default function AppGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AppShell>{children}</AppShell>
}