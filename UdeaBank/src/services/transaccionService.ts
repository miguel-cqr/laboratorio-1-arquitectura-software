import type { Transaccion } from "@/types"
import { apiClient } from "./apiClient"

export const transaccionService = {
  async getTransaccionesByCliente(
      accountNumber: string,
  ): Promise<Transaccion[]> {
    const { data } = await apiClient.get<Transaccion[]>(
        `/api/transactions/${accountNumber}`,
    )

    return data
  },
}