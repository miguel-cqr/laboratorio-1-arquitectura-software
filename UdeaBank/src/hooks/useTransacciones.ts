import { useCallback, useEffect, useState } from "react"
import type { Transaccion } from "@/types"
import { transaccionService } from "@/services/transaccionService"

interface UseTransaccionesState {
  transacciones: Transaccion[]
  loading: boolean
  error: string | null
  refetch: () => void
}

/**
 * Obtiene las transacciones asociadas a una cuenta.
 * Si no se pasa accountNumber, no realiza ninguna carga.
 */
export function useTransacciones(
    accountNumber?: string,
): UseTransaccionesState {
  const [transacciones, setTransacciones] = useState<Transaccion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!accountNumber) {
      setTransacciones([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data =
          await transaccionService.getTransaccionesByCliente(accountNumber)

      setTransacciones(data)
    } catch {
      setError(
          "No fue posible cargar las transacciones. Intenta nuevamente.",
      )
    } finally {
      setLoading(false)
    }
  }, [accountNumber])

  useEffect(() => {
    void load()
  }, [load])

  return {
    transacciones,
    loading,
    error,
    refetch: load,
  }
}