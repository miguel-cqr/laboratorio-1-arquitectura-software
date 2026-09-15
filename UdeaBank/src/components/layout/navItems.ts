import {
  LayoutDashboard,
  Users,
  ArrowLeftRight,
  ReceiptText,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/transferir", label: "Transferir dinero", icon: ArrowLeftRight },
  { to: "/historico", label: "Histórico de transacciones", icon: ReceiptText },
]
