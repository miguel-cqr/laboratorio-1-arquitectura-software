import type { TransferenciaInput } from "@/types"
import { apiClient } from "./apiClient"

export interface TransferenciaResultado {
    ok: boolean
    id?: number
    referencia?: string
    mensaje: string
}

export const transferenciaService = {
    async realizarTransferencia(
        input: TransferenciaInput,
    ): Promise<TransferenciaResultado> {
        try {
            const { data } = await apiClient.post(
                "/api/transactions",
                {
                    senderAccountNumber: input.cuentaOrigen,
                    receiverAccountNumber: input.cuentaDestino,
                    amount: input.monto,
                },
            )

            return {
                ok: true,
                id: data.id,
                referencia: data.id?.toString(),
                mensaje: "Transferencia realizada correctamente.",
            }
        } catch (error: any) {
            const mensaje =
                error?.response?.data ||
                "No fue posible realizar la transferencia."

            return {
                ok: false,
                mensaje: String(mensaje),
            }
        }
    },
}