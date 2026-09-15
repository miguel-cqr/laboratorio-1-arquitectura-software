import { useCallback, useEffect, useState } from "react"
import type { Cliente } from "@/types"
import { clienteService } from "@/services/clienteService"

interface UseClientesState {
  clientes: Cliente[]
  loading: boolean
  error: string | null
  refetch: () => void
}

/** Obtiene la lista de clientes desde la capa de servicios (mock). */
export function useClientes(): UseClientesState {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await clienteService.getClientes()
      setClientes(data)
    } catch {
      setError("No fue posible cargar los clientes. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return { clientes, loading, error, refetch: load }
}
