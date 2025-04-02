"use client"

import { Payment } from "@prisma/client"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { utcToLocal } from "@/lib/timezone-utils"
import { useUserPayments } from "../hooks/useUserQueries"
import { useEffect } from "react"
import { ReusableTable } from "@/components/ui/ReusableTable"
import { userPaymentsColumns } from "@/components/modules/roles/admin/usuarios/columns/user-payments-columns"

interface UserPaymentsTabProps {
  userId: string
}

export function UserPaymentsTab({ userId }: UserPaymentsTabProps) {
  // Early check for undefined userId
  if (!userId) {
    console.error("UserPaymentsTab: userId is undefined")
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Pagos</h3>
        <div className="rounded-md border p-8 text-center">
          <p className="text-rust">Error: ID de usuario no proporcionado</p>
        </div>
      </div>
    )
  }

  const { data, isLoading, error } = useUserPayments(userId)

  const payments = data?.success ? (data.data as Payment[]) : []

  useEffect(() => {
    console.log("Component debug:", {
      userId,
      data,
      error,
      isLoading,
    })
  }, [userId, data, error, isLoading])

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

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Pagos</h3>
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  // Error handling
  if (error || !data) {
    console.error("Data loading error:", error, data)
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Pagos</h3>
        <div className="rounded-md border p-8 text-center">
          <p className="text-rust">
            Error al cargar los pagos:{" "}
            {error?.message ||
              (data && !data.success ? data.error : "Error desconocido")}
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Por favor revisa la consola del navegador para más detalles.
          </p>
        </div>
      </div>
    )
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
        <ReusableTable
          columns={userPaymentsColumns(
            formatDate,
            formatPaymentStatus,
            getStatusBadgeColor
          )}
          data={payments}
        />
      )}
    </div>
  )
}
