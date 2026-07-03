import { WazuhLayout } from "@/components/common/wazuh-layout"

export default function AppGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <WazuhLayout>{children}</WazuhLayout>
}