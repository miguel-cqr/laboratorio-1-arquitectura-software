export interface Cliente {
  id: number
  firstName: string
  lastName: string
  accountNumber: string
  balance: number
}

export interface Transaccion {
  id: number
  senderAccountNumber: string
  receiverAccountNumber: string
  amount: number
  timestamp: string
}

export interface TransferenciaInput {
  cuentaOrigen: string
  cuentaDestino: string
  monto: number
}
