"use client"

import { Booking, Class, Category, Subcategory } from "@prisma/client"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { utcToLocal } from "@/lib/timezone-utils"
import { useUserBookings } from "../hooks/useUserQueries"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect } from "react"
// Import ReformerTable and remove ReusableTable
import { ReformerTable } from "@/components/ui/table/ReformerTable"
// import { ReusableTable } from "@/components/ui/ReusableTable"
import { userBookingsColumns } from "@/components/modules/roles/admin/usuarios/columns/user-bookings-columns"

interface ClassWithDetails extends Class {
  category: Category
  subcategory: Subcategory
}

export interface ExtendedBooking extends Booking {
  class: ClassWithDetails
}

interface UserBookingsTabProps {
  userId: string
}

export function UserBookingsTab({ userId }: UserBookingsTabProps) {
  // Early check for undefined userId
  if (!userId) {
    console.error("UserBookingsTab: userId is undefined")
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Reservas</h3>
        <div className="rounded-md border p-8 text-center">
          <p className="text-rust">Error: ID de usuario no proporcionado</p>
        </div>
      </div>
    )
  }

  const { data, isLoading, error } = useUserBookings(userId)

  const bookings = data?.success ? (data.data as ExtendedBooking[]) : []

  useEffect(() => {
    console.log("Component debug:", {
      userId,
      data,
      error,
      isLoading,
    })
  }, [userId, data, error, isLoading])

  // Format booking status
  const formatBookingStatus = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmada"
      case "cancelled":
        return "Cancelada"
      case "attended":
        return "Asistida"
      default:
        return status
    }
  }

  // Format date
  const formatDate = (date: Date) => {
    const localDate = utcToLocal(new Date(date))
    return format(localDate, "dd MMM yyyy", { locale: es })
  }

  // Format time
  const formatTime = (date: Date) => {
    const localDate = utcToLocal(new Date(date))
    return format(localDate, "HH:mm", { locale: es })
  }

  // Get badge color based on booking status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-amber-500"
      case "cancelled":
        return "bg-grey_pebble"
      case "attended":
        return "bg-emerald-500"
      default:
        return "bg-midnight"
    }
  }

  // Define columns
  const columns = userBookingsColumns(
    formatDate,
    formatTime,
    formatBookingStatus,
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
        <h3 className="text-xl font-bold">Reservas</h3>
        <div className="rounded-md border p-8 text-center">
          <p className="text-rust">
            Error al cargar las reservas:{" "}
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

      {bookings.length === 0 && !isLoading ? (
        // Show message if no bookings
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Reservas</h3>{" "}
          {/* Keep title here when no data */}
          <div className="rounded-md border p-8 text-center">
            <p className="text-grey_pebble">
              No hay reservas registradas para este usuario
            </p>
          </div>
        </div>
      ) : (
        // Render table if bookings exist
        <ReformerTable
          columns={columns}
          data={bookings}
          filterKeys={filterKeys} // Pass empty array to hide search
          noResultsMessage="No se encontraron reservas."
          isLoading={isLoading} // Pass loading state
          initialPageSize={10} // Adjust as needed for tabs
        >
          {/* Children: Title */}
          <div className="flex w-full flex-col items-start justify-between gap-3 lg:flex-row">
            <h3 className="text-xl font-bold">Reservas</h3>
            {/* No button needed here */}
          </div>
        </ReformerTable>
      )}
    </div>
  )
}
