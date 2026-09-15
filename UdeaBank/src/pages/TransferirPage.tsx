import { useMemo, useState, type FormEvent } from "react"
import { ArrowLeftRight, ArrowRight, Loader2, ShieldCheck } from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Field, Input, Select } from "@/components/ui/Input"
import { Modal } from "@/components/ui/Modal"
import { Toast } from "@/components/ui/Toast"
import { LoadingState } from "@/components/ui/States"
import { useClientes } from "@/hooks/useClientes"
import { transferenciaService } from "@/services/transferenciaService"
import { formatCurrency } from "@/lib/utils"

interface Errores {
  cuentaOrigen?: string
  cuentaDestino?: string
  monto?: string
}

export function TransferirPage() {
  const { clientes, loading } = useClientes()

  const [cuentaOrigen, setCuentaOrigen] = useState("")
  const [cuentaDestino, setCuentaDestino] = useState("")
  const [monto, setMonto] = useState("")
  const [errores, setErrores] = useState<Errores>({})

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState("")

  const cuentas = useMemo(
      () =>
          clientes.map((cliente) => ({
            value: cliente.accountNumber,
            label: `${cliente.accountNumber} · ${cliente.firstName} ${cliente.lastName}`,
          })),
      [clientes],
  )

  const montoNumber = Number(monto)

  function validar(): boolean {
    const next: Errores = {}

    if (!cuentaOrigen) {
      next.cuentaOrigen = "Selecciona la cuenta de origen."
    }

    if (!cuentaDestino) {
      next.cuentaDestino = "Selecciona la cuenta de destino."
    }

    if (!monto) {
      next.monto = "Ingresa un monto."
    } else if (Number.isNaN(montoNumber) || montoNumber <= 0) {
      next.monto = "El monto debe ser mayor que 0."
    }

    if (
        cuentaOrigen &&
        cuentaDestino &&
        cuentaOrigen === cuentaDestino
    ) {
      next.cuentaDestino =
          "La cuenta de destino no puede ser igual a la de origen."
    }

    setErrores(next)

    return Object.keys(next).length === 0
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (validar()) {
      setConfirmOpen(true)
    }
  }

  async function confirmarTransferencia() {
    setEnviando(true)

    const res = await transferenciaService.realizarTransferencia({
      cuentaOrigen,
      cuentaDestino,
      monto: montoNumber,
    })

    setEnviando(false)
    setConfirmOpen(false)

    if (res.ok) {
      setToastMsg(
          `Transferencia realizada con éxito${
              res.referencia ? ` · Ref. ${res.referencia}` : ""
          }`,
      )

      setToastOpen(true)

      setCuentaOrigen("")
      setCuentaDestino("")
      setMonto("")
      setErrores({})
    } else {
      setToastMsg(res.mensaje)
      setToastOpen(true)
    }
  }

  return (
      <div>
        <PageHeader
            title="Transferir dinero"
            subtitle="Envía dinero entre cuentas."
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2">
            {loading ? (
                <LoadingState label="Cargando cuentas..." />
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5"
                    noValidate
                >
                  <Field
                      label="Cuenta de origen"
                      htmlFor="cuentaOrigen"
                      error={errores.cuentaOrigen}
                  >
                    <Select
                        id="cuentaOrigen"
                        value={cuentaOrigen}
                        invalid={!!errores.cuentaOrigen}
                        onChange={(e) => setCuentaOrigen(e.target.value)}
                    >
                      <option value="">Selecciona una cuenta</option>

                      {cuentas.map((cuenta) => (
                          <option key={cuenta.value} value={cuenta.value}>
                            {cuenta.label}
                          </option>
                      ))}
                    </Select>
                  </Field>

                  <Field
                      label="Cuenta de destino"
                      htmlFor="cuentaDestino"
                      error={errores.cuentaDestino}
                  >
                    <Select
                        id="cuentaDestino"
                        value={cuentaDestino}
                        invalid={!!errores.cuentaDestino}
                        onChange={(e) => setCuentaDestino(e.target.value)}
                    >
                      <option value="">Selecciona una cuenta</option>

                      {cuentas.map((cuenta) => (
                          <option key={cuenta.value} value={cuenta.value}>
                            {cuenta.label}
                          </option>
                      ))}
                    </Select>
                  </Field>

                  <Field
                      label="Monto"
                      htmlFor="monto"
                      error={errores.monto}
                      hint="Ingresa un valor mayor que 0."
                  >
                    <Input
                        id="monto"
                        type="number"
                        min="0"
                        step="1000"
                        inputMode="numeric"
                        value={monto}
                        invalid={!!errores.monto}
                        onChange={(e) => setMonto(e.target.value)}
                        placeholder="0"
                    />
                  </Field>

                  <div className="pt-1">
                    <Button type="submit" className="w-full sm:w-auto">
                      <ArrowLeftRight className="h-4 w-4" aria-hidden />
                      Revisar transferencia
                    </Button>
                  </div>
                </form>
            )}
          </Card>

          <Card className="h-fit p-6">
            <div className="flex items-center gap-2 text-primary">
              <ShieldCheck className="h-5 w-5" aria-hidden />
              <p className="text-sm font-bold text-foreground">
                Antes de enviar
              </p>
            </div>

            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Verifica que las cuentas sean correctas.</li>
              <li>El monto debe ser mayor que 0.</li>
              <li>Origen y destino deben ser distintos.</li>
              <li>La transferencia se ejecutará después de confirmar.</li>
            </ul>
          </Card>
        </div>

        <Modal
            open={confirmOpen}
            onClose={() => !enviando && setConfirmOpen(false)}
            title="Confirmar transferencia"
            footer={
              <>
                <Button
                    variant="ghost"
                    onClick={() => setConfirmOpen(false)}
                    disabled={enviando}
                >
                  Cancelar
                </Button>

                <Button
                    onClick={confirmarTransferencia}
                    disabled={enviando}
                >
                  {enviando ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                        Procesando...
                      </>
                  ) : (
                      "Confirmar y transferir"
                  )}
                </Button>
              </>
            }
        >
          <p className="mb-4 text-sm text-muted-foreground">
            Revisa el resumen antes de ejecutar la operación.
          </p>

          <div className="space-y-3 rounded-[calc(var(--radius)-0.25rem)] bg-muted/60 p-4">
            <ResumenFila
                label="Cuenta de origen"
                value={cuentaOrigen}
                mono
            />

            <div className="flex justify-center">
              <ArrowRight
                  className="h-4 w-4 text-primary"
                  aria-hidden
              />
            </div>

            <ResumenFila
                label="Cuenta de destino"
                value={cuentaDestino}
                mono
            />

            <div className="border-t border-border pt-3">
              <ResumenFila
                  label="Monto"
                  value={formatCurrency(montoNumber || 0)}
                  emphasis
              />
            </div>
          </div>
        </Modal>

        <Toast
            open={toastOpen}
            message={toastMsg}
            onClose={() => setToastOpen(false)}
        />
      </div>
  )
}

function ResumenFila({
                       label,
                       value,
                       mono,
                       emphasis,
                     }: {
  label: string
  value: string
  mono?: boolean
  emphasis?: boolean
}) {
  return (
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm text-muted-foreground">{label}</span>

        <span
            className={[
              "text-right",
              mono ? "font-mono text-sm" : "",
              emphasis
                  ? "text-lg font-extrabold text-foreground"
                  : "font-semibold text-foreground",
            ].join(" ")}
        >
        {value}
      </span>
      </div>
  )
}