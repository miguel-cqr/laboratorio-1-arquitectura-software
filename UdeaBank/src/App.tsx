import { Routes, Route, Navigate } from "react-router-dom"
import { MainLayout } from "@/layouts/MainLayout"
import { DashboardPage } from "@/pages/DashboardPage"
import { ClientesPage } from "@/pages/ClientesPage"
import { TransferirPage } from "@/pages/TransferirPage"
import { HistoricoPage } from "@/pages/HistoricoPage"

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/transferir" element={<TransferirPage />} />
        <Route path="/historico" element={<HistoricoPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
