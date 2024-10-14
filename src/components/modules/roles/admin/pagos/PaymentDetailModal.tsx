import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Payment } from "@prisma/client"

interface PaymentDetailModalProps {
  isOpen: boolean
  onClose: () => void
  payment: Payment
}

export function PaymentDetailModal({
  isOpen,
  onClose,
  payment,
}: PaymentDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalles del Pago</DialogTitle>
        </DialogHeader>
        <div className="grid w-full gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right font-medium">ID de Pago:</label>
            <div className="col-span-3">{payment.paymentId}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right font-medium">Fecha de Creación:</label>
            <div className="col-span-3">
              {new Date(payment.dateCreated).toLocaleString()}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right font-medium">
              Última Actualización:
            </label>
            <div className="col-span-3">
              {new Date(payment.dateLastUpdated).toLocaleString()}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right font-medium">
              Fecha de Liberación:
            </label>
            <div className="col-span-3">
              {payment.moneyReleaseDate
                ? new Date(payment.moneyReleaseDate).toLocaleString()
                : "N/A"}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right font-medium">Descripción:</label>
            <div className="col-span-3">{payment.description || "N/A"}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right font-medium">Estado Detallado:</label>
            <div className="col-span-3">{payment.statusDetail || "N/A"}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
