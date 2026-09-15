import type { Cliente } from "@/types"
import { apiClient } from "./apiClient"

export interface CrearClienteInput {
  firstName: string
  lastName: string
  accountNumber: string
  balance: number
}

export const clienteService = {
  async getClientes(): Promise<Cliente[]> {
    const { data } = await apiClient.get<Cliente[]>("/api/customers")
    return data
  },

  async getClienteById(id: string | number): Promise<Cliente | undefined> {
    const { data } = await apiClient.get<Cliente>(`/api/customers/${id}`)
    return data
  },

  async crearCliente(cliente: CrearClienteInput): Promise<Cliente> {
    const { data } = await apiClient.post<Cliente>("/api/customers", cliente)
    return data
  },
}