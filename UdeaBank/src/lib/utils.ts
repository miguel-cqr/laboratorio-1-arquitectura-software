import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formatea un número como moneda (COP). Solo presentación. */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value)
}

/** Devuelve fecha y hora legibles a partir del LocalDateTime del backend. */
export function formatDateTime(
    iso: string,
): { date: string; time: string } {
  if (!iso) {
    return {
      date: "Fecha no disponible",
      time: "Hora no disponible",
    }
  }

  const [fecha, horaCompleta] = iso.split("T")

  if (!fecha || !horaCompleta) {
    return {
      date: "Fecha no disponible",
      time: "Hora no disponible",
    }
  }

  const [year, month, day] = fecha.split("-")
  const hora = horaCompleta.split(".")[0]

  const fechaValida = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
  )

  if (Number.isNaN(fechaValida.getTime())) {
    return {
      date: "Fecha no disponible",
      time: "Hora no disponible",
    }
  }

  return {
    date: fechaValida.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: hora.slice(0, 5),
  }
}