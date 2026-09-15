import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Users, ReceiptText, Plus, X } from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/States"
import { useClientes } from "@/hooks/useClientes"
import { formatCurrency } from "@/lib/utils"
import { clienteService } from "@/services/clienteService"

export function ClientesPage() {
  const navigate = useNavigate()
  const { clientes, loading, error, refetch } = useClientes()

  const [query, setQuery] = useState("")
  const [showForm, setShowForm] = useState(false)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [balance, setBalance] = useState("")

  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    if (!q) return clientes

    return clientes.filter((c) =>
        `${c.firstName} ${c.lastName} ${c.accountNumber}`
            .toLowerCase()
            .includes(q),
    )
  }, [clientes, query])

  const verHistorico = (id: number) => {
    navigate(`/historico?cliente=${id}`)
  }

  const limpiarFormulario = () => {
    setFirstName("")
    setLastName("")
    setAccountNumber("")
    setBalance("")
    setFormError(null)
  }

  const cerrarFormulario = () => {
    if (saving) return

    limpiarFormulario()
    setShowForm(false)
  }

  const crearCliente = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setFormError(null)

    const nombre = firstName.trim()
    const apellido = lastName.trim()
    const cuenta = accountNumber.trim()
    const saldo = Number(balance)

    if (!nombre || !apellido || !cuenta || balance.trim() === "") {
      setFormError("Todos los campos son obligatorios.")
      return
    }

    if (Number.isNaN(saldo) || saldo < 0) {
      setFormError("El saldo debe ser un número mayor o igual a 0.")
      return
    }

    try {
      setSaving(true)

      await clienteService.crearCliente({
        firstName: nombre,
        lastName: apellido,
        accountNumber: cuenta,
        balance: saldo,
      })

      limpiarFormulario()
      setShowForm(false)

      await refetch()
    } catch (err) {
      console.error(err)
      setFormError(
          "No fue posible crear el cliente. Verifica los datos e inténtalo nuevamente.",
      )
    } finally {
      setSaving(false)
    }
  }

  return (
      <div>
        <PageHeader
            title="Clientes"
            subtitle="Consulta la información de los clientes y accede a su histórico."
        />

        {/* Encabezado de acciones */}
        <div className="mb-4 flex justify-end">
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" aria-hidden />
            Nuevo cliente
          </Button>
        </div>

        {/* Formulario de creación */}
        {showForm && (
            <Card className="mb-4">
              <div className="flex items-center justify-between border-b border-border p-4">
                <div>
                  <h2 className="font-semibold text-foreground">
                    Nuevo cliente
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Registra un nuevo cliente en el sistema.
                  </p>
                </div>

                <Button
                    variant="secondary"
                    size="sm"
                    onClick={cerrarFormulario}
                    disabled={saving}
                    aria-label="Cerrar formulario"
                >
                  <X className="h-4 w-4" aria-hidden />
                </Button>
              </div>

              <form onSubmit={crearCliente} className="p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label
                        htmlFor="firstName"
                        className="mb-1 block text-sm font-medium text-foreground"
                    >
                      Nombre
                    </label>
                    <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Ej. Juan"
                        disabled={saving}
                    />
                  </div>

                  <div>
                    <label
                        htmlFor="lastName"
                        className="mb-1 block text-sm font-medium text-foreground"
                    >
                      Apellido
                    </label>
                    <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Ej. Pérez"
                        disabled={saving}
                    />
                  </div>

                  <div>
                    <label
                        htmlFor="accountNumber"
                        className="mb-1 block text-sm font-medium text-foreground"
                    >
                      Número de cuenta
                    </label>
                    <Input
                        id="accountNumber"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="Ej. 10001"
                        disabled={saving}
                    />
                  </div>

                  <div>
                    <label
                        htmlFor="balance"
                        className="mb-1 block text-sm font-medium text-foreground"
                    >
                      Saldo inicial
                    </label>
                    <Input
                        id="balance"
                        type="number"
                        min="0"
                        step="0.01"
                        value={balance}
                        onChange={(e) => setBalance(e.target.value)}
                        placeholder="Ej. 500000"
                        disabled={saving}
                    />
                  </div>
                </div>

                {formError && (
                    <p className="mt-4 text-sm text-destructive">
                      {formError}
                    </p>
                )}

                <div className="mt-4 flex justify-end gap-2">
                  <Button
                      type="button"
                      variant="secondary"
                      onClick={cerrarFormulario}
                      disabled={saving}
                  >
                    Cancelar
                  </Button>

                  <Button type="submit" disabled={saving}>
                    {saving ? "Guardando..." : "Crear cliente"}
                  </Button>
                </div>
              </form>
            </Card>
        )}

        {/* Lista de clientes */}
        <Card className="overflow-hidden">
          <div className="border-b border-border p-4">
            <div className="relative max-w-sm">
              <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
              />

              <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar por nombre o número de cuenta"
                  className="pl-9"
                  aria-label="Buscar clientes"
              />
            </div>
          </div>

          {loading ? (
              <LoadingState label="Cargando clientes..." />
          ) : error ? (
              <ErrorState message={error} onRetry={refetch} />
          ) : clientes.length === 0 ? (
              <EmptyState
                  title="No hay clientes registrados"
                  description="Aún no existen clientes. Crea el primero para comenzar."
                  icon={<Users className="h-6 w-6" aria-hidden />}
              />
          ) : filtered.length === 0 ? (
              <EmptyState
                  title="Sin resultados"
                  description={`No se encontraron clientes para "${query}".`}
                  icon={<Search className="h-6 w-6" aria-hidden />}
              />
          ) : (
              <>
                {/* Tabla en escritorio */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-sm">
                    <thead>
                    <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-3 font-semibold">Cliente</th>
                      <th className="px-4 py-3 font-semibold">
                        N.º de cuenta
                      </th>
                      <th className="px-4 py-3 text-right font-semibold">
                        Saldo
                      </th>
                      <th className="px-4 py-3 text-right font-semibold">
                        Acción
                      </th>
                    </tr>
                    </thead>

                    <tbody>
                    {filtered.map((c) => (
                        <tr
                            key={c.id}
                            className="border-b border-border last:border-0 transition hover:bg-muted/50"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar
                                  nombre={c.firstName}
                                  apellido={c.lastName}
                              />

                              <span className="font-semibold text-foreground">
                            {c.firstName} {c.lastName}
                          </span>
                            </div>
                          </td>

                          <td className="px-4 py-3 font-mono text-muted-foreground">
                            {c.accountNumber}
                          </td>

                          <td className="px-4 py-3 text-right font-semibold text-foreground">
                            {formatCurrency(c.balance)}
                          </td>

                          <td className="px-4 py-3 text-right">
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => verHistorico(c.id)}
                            >
                              <ReceiptText
                                  className="h-4 w-4"
                                  aria-hidden
                              />
                              Histórico
                            </Button>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>

                {/* Tarjetas en móvil */}
                <ul className="divide-y divide-border md:hidden">
                  {filtered.map((c) => (
                      <li key={c.id} className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                              nombre={c.firstName}
                              apellido={c.lastName}
                          />

                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold text-foreground">
                              {c.firstName} {c.lastName}
                            </p>

                            <p className="truncate font-mono text-xs text-muted-foreground">
                              {c.accountNumber}
                            </p>
                          </div>

                          <span className="shrink-0 text-sm font-bold text-foreground">
                      {formatCurrency(c.balance)}
                    </span>
                        </div>

                        <Button
                            size="sm"
                            variant="secondary"
                            className="mt-3 w-full"
                            onClick={() => verHistorico(c.id)}
                        >
                          <ReceiptText
                              className="h-4 w-4"
                              aria-hidden
                          />
                          Ver histórico
                        </Button>
                      </li>
                  ))}
                </ul>
              </>
          )}
        </Card>

        {!loading && !error && filtered.length > 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              Mostrando {filtered.length} de {clientes.length} clientes.
            </p>
        )}
      </div>
  )
}

function Avatar({
                  nombre,
                  apellido,
                }: {
  nombre: string
  apellido: string
}) {
  const initials =
      `${nombre[0] ?? ""}${apellido[0] ?? ""}`.toUpperCase()

  return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
        {initials}
      </div>
  )
}