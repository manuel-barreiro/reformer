"use client"
import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Payment, User } from "@prisma/client"
import { ManualPaymentForm } from "./ManualPaymentForm"

interface AddPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onAddPayment: (payment: Payment & { user: User }) => void
}

export function AddPaymentModal({
  isOpen,
  onClose,
  onAddPayment,
}: AddPaymentModalProps) {
  const handleAddPayment = async (payment: Payment & { user: User }) => {
    onAddPayment(payment)
    onClose()
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cargar Pago y Asignar Paquete - Manual</DialogTitle>
        </DialogHeader>
        <ManualPaymentForm onAddPayment={handleAddPayment} onClose={onClose} />
      </DialogContent>
    </Dialog>
  )
}
