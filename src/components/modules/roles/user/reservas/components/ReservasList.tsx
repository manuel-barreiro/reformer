import React from "react"
import ReservasCard from "@/components/modules/roles/user/reservas/components/ReservasCard"
import { BookingWithClass } from "@/components/modules/roles/user/reservas/ReservasPage"
import { cn } from "@/lib/utils"

export default function ReservasList({
  bookings,
  onCancelSuccess,
}: {
  bookings: BookingWithClass[]
  onCancelSuccess: () => void
}) {
  return (
    <div
      className={cn(
        "h-full py-5 xl:max-w-[1000px]",
        bookings.length === 0 && "flex items-center justify-center",
        bookings.length > 0 &&
          "grid grid-cols-2 gap-3 md:grid-cols-3 md:p-10 lg:grid-cols-4"
      )}
    >
      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <ReservasCard
            key={booking.id}
            booking={booking}
            onCancelSuccess={onCancelSuccess}
          />
        ))
      ) : (
        <div className="my-auto text-center text-gray-500">
          No se encontraron reservas.
        </div>
      )}
    </div>
  )
}
