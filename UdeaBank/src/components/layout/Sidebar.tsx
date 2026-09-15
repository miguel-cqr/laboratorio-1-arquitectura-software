import { NavLink } from "react-router-dom"
import { Landmark } from "lucide-react"
import { navItems } from "./navItems"
import { cn } from "@/lib/utils"

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Landmark className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <p className="text-base font-extrabold leading-tight text-white">
            UdeaBank
          </p>
          <p className="text-xs text-sidebar-foreground/70">Panel académico</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                isActive
                  ? "bg-sidebar-active text-white"
                  : "text-sidebar-foreground/80 hover:bg-white/5 hover:text-white",
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden />
            <span className="text-pretty">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
