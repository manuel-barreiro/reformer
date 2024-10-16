"use client"
import React, { useState, useTransition } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Payment, User } from "@prisma/client"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { getFullName } from "@/components/modules/roles/admin/pagos/lib/getFullName"
import { numberFormatter } from "@/lib/numberFormatter"
import { toast } from "@/components/ui/use-toast"
import { UpdateExistingPaymentForm } from "./UpdateExistingPaymentForm"

interface PaymentDetailModalProps {
  isOpen: boolean
  onClose: () => void
  payment: Payment & { user: User }
  onUpdatePayment: (
    paymentId: string,
    newStatus: string,
    newPaymentMethod: string
  ) => Promise<void>
  onDeletePayment: (paymentId: string) => Promise<void>
}

export function PaymentDetailModal({
  isOpen,
  onClose,
  payment,
  onUpdatePayment,
  onDeletePayment,
}: PaymentDetailModalProps) {
  const [isUpdating, startUpdateTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()
  const isManualPayment = payment.paymentType === "manual"

  const paymentDetails = [
    {
      label: "Usuario",
      value:
        getFullName(payment.user).length > 20
          ? `${getFullName(payment.user).slice(0, 20)}...`
          : getFullName(payment.user),
    },
    { label: "Email", value: payment.user.email },
    { label: "Total", value: numberFormatter.format(payment.total) },
    { label: "ID de Pago", value: payment.paymentId },
    {
      label: "Fecha de Creación",
      value: new Date(payment.dateCreated).toLocaleString(),
    },
    {
      label: "Última Actualización",
      value: new Date(payment.dateLastUpdated).toLocaleString(),
    },
    ...(payment.paymentType === "mercadopago"
      ? [
          {
            label: "Fecha de Liberación",
            value: payment.moneyReleaseDate
              ? new Date(payment.moneyReleaseDate).toLocaleString()
              : "N/A",
          },
        ]
      : []),
    { label: "Descripción", value: payment.description || "N/A" },
    { label: "Estado Detallado", value: payment.statusDetail || "N/A" },
  ]

  const handleSubmit = async (values: {
    status: string
    paymentMethod: string
  }) => {
    startUpdateTransition(async () => {
      try {
        await onUpdatePayment(
          payment.paymentId,
          values.status,
          values.paymentMethod
        )
        toast({
          title: "Pago actualizado",
          description: "El pago se ha actualizado exitosamente.",
          variant: "reformer",
        })
        onClose()
      } catch (error) {
        console.error("Error al actualizar el pago:", error)
        toast({
          title: "Error",
          description:
            "Error al actualizar el pago. Por favor, intente nuevamente.",
          variant: "destructive",
        })
      }
    })
  }

  const handleDelete = async () => {
    startDeleteTransition(async () => {
      try {
        await onDeletePayment(payment.paymentId)
        toast({
          title: "Pago eliminado",
          description: "El pago se ha eliminado exitosamente.",
          variant: "reformer",
        })
        onClose()
      } catch (error) {
        console.error("Error al eliminar el pago:", error)
        toast({
          title: "Error",
          description:
            "Error al eliminar el pago. Por favor, intente nuevamente.",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Detalles del Pago
          </DialogTitle>
        </DialogHeader>
        <Table>
          <TableBody className="bg-pearlVariant text-sm text-tableContent">
            {paymentDetails.map((detail, index) => (
              <TableRow key={index} className="border-b border-grey_pebble">
                <TableCell className="font-medium">{detail.label}</TableCell>
                <TableCell>{detail.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {isManualPayment && (
          <>
            <UpdateExistingPaymentForm
              payment={payment}
              onSubmit={handleSubmit}
              isPending={isUpdating}
            />
          </>
        )}
        <DialogFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full bg-midnight py-6 font-dm_mono text-pearl duration-300 ease-in-out"
                disabled={isDeleting}
              >
                {isDeleting ? "Eliminando..." : "Eliminar Pago"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción eliminará permanentemente el pago y el paquete de
                  clases asociado. Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-rust"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Eliminando..." : "Eliminar"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
