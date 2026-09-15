import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Menu, Landmark, X } from "lucide-react"
import { SidebarContent } from "@/components/layout/Sidebar"

export function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background lg:flex">
      {/* Sidebar fijo en escritorio */}
      <aside className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </aside>

      {/* Barra superior móvil */}
      <header className="flex items-center justify-between border-b border-border bg-sidebar px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2 text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Landmark className="h-4 w-4" aria-hidden />
          </div>
          <span className="text-sm font-extrabold">UdeaBank</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-md p-2 text-white transition hover:bg-white/10"
          aria-label="Abrir menú"
        >
          <Menu className="h-6 w-6" aria-hidden />
        </button>
      </header>

      {/* Drawer móvil */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[80%] shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 z-10 rounded-md p-1 text-white/80 transition hover:bg-white/10"
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Contenido */}
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
