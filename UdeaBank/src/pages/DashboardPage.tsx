import { Link } from "react-router-dom"
import {
  Users,
  ArrowLeftRight,
  ReceiptText,
  Wallet,
  ArrowUpRight,
} from "lucide-react"
import { useEffect, useState } from "react"

import { PageHeader } from "@/components/layout/PageHeader"
import { Card } from "@/components/ui/Card"
import { useClientes } from "@/hooks/useClientes"
import { transaccionService } from "@/services/transaccionService"
import { formatCurrency } from "@/lib/utils"

const accesos = [
  {
    to: "/clientes",
    title: "Consultar clientes",
    description: "Explora la base de clientes y sus cuentas.",
    icon: Users,
  },
  {
    to: "/transferir",
    title: "Realizar transferencia",
    description: "Envía dinero entre cuentas de forma segura.",
    icon: ArrowLeftRight,
  },
  {
    to: "/historico",
    title: "Ver histórico",
    description: "Consulta las transacciones por cliente.",
    icon: ReceiptText,
  },
]

export function DashboardPage() {
  const { clientes, loading } = useClientes()

  const [totalTransacciones, setTotalTransacciones] = useState(0)
  const [loadingTransacciones, setLoadingTransacciones] = useState(true)

  useEffect(() => {
    async function cargarTransacciones() {
      if (clientes.length === 0) {
        setTotalTransacciones(0)
        setLoadingTransacciones(false)
        return
      }

      setLoadingTransacciones(true)

      try {
        // Consultamos las transacciones de cada cuenta.
        const resultados = await Promise.all(
          clientes.map((cliente) =>
            transaccionService.getTransaccionesByCliente(
              cliente.accountNumber,
            ),
          ),
        )

        // Un mismo movimiento puede aparecer en la cuenta
        // del remitente y en la cuenta del receptor.
        const todasLasTransacciones = resultados.flat()

        // Contamos cada transacción una sola vez utilizando su ID.
        const idsUnicos = new Set(
          todasLasTransacciones.map(
            (transaccion) => transaccion.id,
          ),
        )

        setTotalTransacciones(idsUnicos.size)
      } catch {
        setTotalTransacciones(0)
      } finally {
        setLoadingTransacciones(false)
      }
    }

    void cargarTransacciones()
  }, [clientes])

  const totalClientes = clientes.length

  // El backend utiliza "balance", no "saldo".
  const saldoTotal = clientes.reduce(
    (acc, cliente) => acc + Number(cliente.balance || 0),
    0,
  )

  const stats = [
    {
      label: "Clientes registrados",
      value: loading ? "—" : String(totalClientes),
      icon: Users,
    },
    {
      label: "Transacciones",
      value: loadingTransacciones ? "—" : String(totalTransacciones),
      icon: ArrowLeftRight,
    },
    {
      label: "Saldo total administrado",
      value: loading ? "—" : formatCurrency(saldoTotal),
      icon: Wallet,
    },
  ]

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Resumen"
        title="Panel principal"
        description="Consulta el estado general de NovaBank y accede rápidamente a las operaciones principales."
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <Card key={stat.label} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-2xl font-semibold tracking-tight">
                    {stat.value}
                  </p>
                </div>

                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          )
        })}
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold tracking-tight">
            Accesos rápidos
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Gestiona clientes, transferencias e históricos.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {accesos.map((acceso) => {
            const Icon = acceso.icon

            return (
              <Link
                key={acceso.to}
                to={acceso.to}
                className="group"
              >
                <Card className="h-full p-5 transition-colors hover:border-primary/40">
                  <div className="flex items-start justify-between gap-4">
                    <div className="rounded-xl bg-primary/10 p-3 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>

                    <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>

                  <h3 className="mt-5 font-semibold">
                    {acceso.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {acceso.description}
                  </p>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}

