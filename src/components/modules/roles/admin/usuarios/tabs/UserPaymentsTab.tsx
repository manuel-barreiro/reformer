"use client"

import { Payment } from "@prisma/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { utcToLocal } from "@/lib/timezone-utils"

interface UserPaymentsTabProps {
  payments: Payment[]
}

export function UserPaymentsTab({ payments }: UserPaymentsTabProps) {
  // Format payment status from BE to human readable
  const formatPaymentStatus = (status: string) => {
    switch (status) {
      case "approved":
        return "Aprobado"
      case "pending":
        return "Pendiente"
      case "rejected":
        return "Rechazado"
      case "refunded":
        return "Reembolsado"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  // Format payment date
  const formatDate = (date: Date) => {
    const localDate = utcToLocal(new Date(date))
    return format(localDate, "dd MMM yyyy, HH:mm", { locale: es })
  }

  // Get badge color based on payment status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500"
      case "pending":
        return "bg-amber-500"
      case "rejected":
        return "bg-rust"
      case "refunded":
        return "bg-blue-500"
      case "cancelled":
        return "bg-grey_pebble"
      default:
        return "bg-midnight"
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Pagos</h3>

      {payments.length === 0 ? (
        <div className="rounded-md border p-8 text-center">
          <p className="text-grey_pebble">
            No hay pagos registrados para este usuario
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-grey_pebble">
                <TableHead className="text-grey_pebble">ID de Pago</TableHead>
                <TableHead className="text-grey_pebble">Fecha</TableHead>
                <TableHead className="text-grey_pebble">Descripción</TableHead>
                <TableHead className="text-grey_pebble">Monto</TableHead>
                <TableHead className="text-grey_pebble">Estado</TableHead>
                <TableHead className="text-grey_pebble">Tipo de Pago</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow
                  key={payment.id}
                  className="border-b border-grey_pebble"
                >
                  <TableCell className="font-mono text-xs">
                    {payment.paymentId}
                  </TableCell>
                  <TableCell>{formatDate(payment.dateCreated)}</TableCell>
                  <TableCell>
                    {payment.description || "Sin descripción"}
                  </TableCell>
                  <TableCell>${payment.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${getStatusBadgeColor(payment.status)} text-pearl`}
                    >
                      {formatPaymentStatus(payment.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">
                    {payment.paymentType === "mercadopago"
                      ? "MercadoPago"
                      : payment.paymentType}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
