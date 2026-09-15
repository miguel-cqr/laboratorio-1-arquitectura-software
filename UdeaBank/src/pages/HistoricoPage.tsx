import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { ArrowUpDown, Search, ReceiptText, UserRound } from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { Card } from "@/components/ui/Card"
import { Field, Input, Select } from "@/components/ui/Input"
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/States"
import { useClientes } from "@/hooks/useClientes"
import { useTransacciones } from "@/hooks/useTransacciones"
import { formatCurrency, formatDateTime } from "@/lib/utils"

type Orden = "desc" | "asc"

export function HistoricoPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { clientes, loading: loadingClientes } = useClientes()

  const [clienteId, setClienteId] = useState("")
  const [query, setQuery] = useState("")
  const [orden, setOrden] = useState<Orden>("desc")

  // Sincroniza la selección con ?cliente=
  useEffect(() => {
    const fromUrl = searchParams.get("cliente")

    if (fromUrl) {
      setClienteId(fromUrl)
    }
  }, [searchParams])

  // El ID del cliente viene como string desde la URL/select,
  // pero en el backend es Long.
  const clienteSeleccionado = clientes.find(
      (cliente) => cliente.id === Number(clienteId),
  )

  // El endpoint de transacciones NO recibe el ID del cliente.
  // Recibe el número de cuenta.
  const accountNumber = clienteSeleccionado?.accountNumber ?? ""

  const {
    transacciones,
    loading: loadingTx,
    error,
    refetch,
  } = useTransacciones(accountNumber || undefined)

  const visibles = useMemo(() => {
    const q = query.trim().toLowerCase()

    const filtradas = q
        ? transacciones.filter((t) =>
            `${t.senderAccountNumber} ${t.receiverAccountNumber} ${t.amount}`
                .toLowerCase()
                .includes(q),
        )
        : transacciones

    return [...filtradas].sort((a, b) => {
      const da = new Date(a.timestamp).getTime()
      const db = new Date(b.timestamp).getTime()

      return orden === "desc" ? db - da : da - db
    })
  }, [transacciones, query, orden])

  function onSelectCliente(id: string) {
    setClienteId(id)
    setQuery("")

    if (id) {
      setSearchParams({ cliente: id })
    } else {
      setSearchParams({})
    }
  }

  return (
      <div>
        <PageHeader
            title="Histórico de transacciones"
            subtitle="Selecciona un cliente para ver sus movimientos."
        />

        <Card className="mb-6 p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Cliente" htmlFor="cliente">
              <Select
                  id="cliente"
                  value={clienteId}
                  disabled={loadingClientes}
                  onChange={(e) => onSelectCliente(e.target.value)}
              >
                <option value="">Selecciona un cliente</option>

                {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.firstName} {cliente.lastName} ·{" "}
                      {cliente.accountNumber}
                    </option>
                ))}
              </Select>
            </Field>

            <Field label="Buscar en movimientos" htmlFor="buscar">
              <div className="relative">
                <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                />

                <Input
                    id="buscar"
                    value={query}
                    disabled={!clienteId}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Cuenta o monto"
                    className="pl-9"
                />
              </div>
            </Field>
          </div>
        </Card>

        {clienteSeleccionado && (
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserRound className="h-5 w-5" aria-hidden />
                </div>

                <div>
                  <p className="text-sm font-bold text-foreground">
                    {clienteSeleccionado.firstName}{" "}
                    {clienteSeleccionado.lastName}
                  </p>

                  <p className="font-mono text-xs text-muted-foreground">
                    {clienteSeleccionado.accountNumber} ·{" "}
                    {formatCurrency(clienteSeleccionado.balance)}
                  </p>
                </div>
              </div>

              <button
                  onClick={() =>
                      setOrden((o) => (o === "desc" ? "asc" : "desc"))
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-muted"
              >
                <ArrowUpDown className="h-4 w-4" aria-hidden />

                Fecha:{" "}
                {orden === "desc" ? "más recientes" : "más antiguas"}
              </button>
            </div>
        )}

        <Card className="overflow-hidden">
          {!clienteId ? (
              <EmptyState
                  title="Selecciona un cliente"
                  description="Elige un cliente en el selector para ver su histórico de transacciones."
                  icon={<UserRound className="h-6 w-6" aria-hidden />}
              />
          ) : loadingTx ? (
              <LoadingState label="Cargando transacciones..." />
          ) : error ? (
              <ErrorState message={error} onRetry={refetch} />
          ) : transacciones.length === 0 ? (
              <EmptyState
                  title="Sin transacciones"
                  description="Este cliente no tiene movimientos registrados."
                  icon={<ReceiptText className="h-6 w-6" aria-hidden />}
              />
          ) : visibles.length === 0 ? (
              <EmptyState
                  title="Sin resultados"
                  description={`No hay movimientos que coincidan con "${query}".`}
                  icon={<Search className="h-6 w-6" aria-hidden />}
              />
          ) : (
              <>
                {/* Tabla escritorio */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-sm">
                    <thead>
                    <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-3 font-semibold">Origen</th>
                      <th className="px-4 py-3 font-semibold">Destino</th>
                      <th className="px-4 py-3 text-right font-semibold">
                        Monto
                      </th>
                      <th className="px-4 py-3 font-semibold">Fecha</th>
                      <th className="px-4 py-3 font-semibold">Hora</th>
                    </tr>
                    </thead>

                    <tbody>
                    {visibles.map((transaccion) => {
                      const { date, time } = formatDateTime(
                          transaccion.timestamp,
                      )

                      return (
                          <tr
                              key={transaccion.id}
                              className="border-b border-border last:border-0 transition hover:bg-muted/50"
                          >
                            <td className="px-4 py-3 font-mono text-muted-foreground">
                              {transaccion.senderAccountNumber}
                            </td>

                            <td className="px-4 py-3 font-mono text-muted-foreground">
                              {transaccion.receiverAccountNumber}
                            </td>

                            <td className="px-4 py-3 text-right font-semibold text-foreground">
                              {formatCurrency(transaccion.amount)}
                            </td>

                            <td className="px-4 py-3 text-muted-foreground">
                              {date}
                            </td>

                            <td className="px-4 py-3 text-muted-foreground">
                              {time}
                            </td>
                          </tr>
                      )
                    })}
                    </tbody>
                  </table>
                </div>

                {/* Tarjetas móvil */}
                <ul className="divide-y divide-border md:hidden">
                  {visibles.map((transaccion) => {
                    const { date, time } = formatDateTime(
                        transaccion.timestamp,
                    )

                    return (
                        <li key={transaccion.id} className="p-4">
                          <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-xs text-muted-foreground">
                        {transaccion.senderAccountNumber}
                      </span>

                            <span className="text-base font-bold text-foreground">
                        {formatCurrency(transaccion.amount)}
                      </span>
                          </div>

                          <div className="mt-1 flex items-center justify-between gap-3">
                      <span className="font-mono text-xs text-muted-foreground">
                        → {transaccion.receiverAccountNumber}
                      </span>

                            <span className="text-xs text-muted-foreground">
                        {date} · {time}
                      </span>
                          </div>
                        </li>
                    )
                  })}
                </ul>
              </>
          )}
        </Card>

        {clienteId &&
            !loadingTx &&
            !error &&
            visibles.length > 0 && (
                <p className="mt-3 text-xs text-muted-foreground">
                  {visibles.length} movimiento
                  {visibles.length !== 1 ? "s" : ""} de{" "}
                  {clienteSeleccionado?.firstName}{" "}
                  {clienteSeleccionado?.lastName}.
                </p>
            )}
      </div>
  )
}