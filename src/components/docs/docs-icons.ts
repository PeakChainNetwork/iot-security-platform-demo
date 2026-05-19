import {
  ActivityIcon,
  BracesIcon,
  CableIcon,
  GlobeIcon,
  LayoutDashboardIcon,
  ListTreeIcon,
  RadioIcon,
  RadioTowerIcon,
  TerminalIcon,
  type LucideIcon,
} from "lucide-react"

export const docsIcons = {
  globe: GlobeIcon,
  mqtt: RadioTowerIcon,
  registry: ListTreeIcon,
  dashboard: LayoutDashboardIcon,
  terminal: TerminalIcon,
  websocket: RadioIcon,
  postman: BracesIcon,
  integration: CableIcon,
  api: BracesIcon,
  health: ActivityIcon,
} as const

export type DocsIconName = keyof typeof docsIcons

export function resolveDocsIcon(icon: DocsIconName | LucideIcon): LucideIcon {
  return typeof icon === "string" ? docsIcons[icon] : icon
}
