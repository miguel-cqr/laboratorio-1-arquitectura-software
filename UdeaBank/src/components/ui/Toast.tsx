import { useEffect } from "react"
import { CheckCircle2, X } from "lucide-react"

interface ToastProps {
  open: boolean
  message: string
  onClose: () => void
}

export function Toast({ open, message, onClose }: ToastProps) {
  useEffect(() => {
    if (!open) return
    const t = setTimeout(onClose, 5000)
    return () => clearTimeout(t)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="status"
      className="fixed bottom-4 right-4 z-[60] flex max-w-sm items-start gap-3 rounded-[var(--radius)] border border-success/30 bg-card px-4 py-3 shadow-lg"
    >
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden />
      <p className="text-sm font-medium text-foreground text-pretty">{message}</p>
      <button
        onClick={onClose}
        className="rounded p-0.5 text-muted-foreground transition hover:bg-muted"
        aria-label="Cerrar notificación"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  )
}
