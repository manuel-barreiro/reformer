"use client"

import { Payment } from "@prisma/client"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { utcToLocal } from "@/lib/timezone-utils"
import { useUserPayments } from "../hooks/useUserQueries"
import { useEffect } from "react"
import { ReformerTable } from "@/components/ui/table/ReformerTable"
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

  // Define columns
  const columns = userPaymentsColumns(
    formatDate,
    formatPaymentStatus,
    getStatusBadgeColor
  )

  // Define filter keys - Empty array to hide search bar
  const filterKeys: string[] = []

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-24" /> {/* Skeleton for title */}
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
      {/* Title is now passed as children to ReformerTable */}
      {/* Removed the outer h3 */}

      {payments.length === 0 && !isLoading ? (
        // Show message if no payments
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Pagos</h3>{" "}
          {/* Keep title here when no data */}
          <div className="rounded-md border p-8 text-center">
            <p className="text-grey_pebble">
              No hay pagos registrados para este usuario
            </p>
          </div>
        </div>
      ) : (
        // Render table if payments exist
        <ReformerTable
          columns={columns}
          data={payments}
          filterKeys={filterKeys} // Pass empty array to hide search
          noResultsMessage="No se encontraron pagos."
          isLoading={isLoading} // Pass loading state
          initialPageSize={10} // Adjust as needed for tabs
        >
          {/* Children: Title */}
          <div className="flex w-full flex-col items-start justify-between gap-3 lg:flex-row">
            <h3 className="text-xl font-bold">Pagos</h3>
            {/* No button needed here */}
          </div>
        </ReformerTable>
      )}
    </div>
  )
}
