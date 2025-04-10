import React from "react"
import ReservasCard from "@/components/modules/roles/user/reservas/components/ReservasCard"
import { BookingWithClass } from "@/components/modules/roles/user/reservas/ReservasPage"
import { cn } from "@/lib/utils"
import { Info } from "lucide-react" // Import an icon
import { Button } from "@/components/ui/button" // Import Button
import Link from "next/link" // Import Link

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
        "h-full w-full px-6 py-5 md:p-10",
        // Center content vertically and horizontally when empty
        bookings.length === 0 &&
          "flex min-h-[200px] items-center justify-center",
        bookings.length > 0 &&
          "grid grid-cols-1 gap-4 md:grid-cols-2 md:p-10 lg:grid-cols-3 xl:grid-cols-4" // Adjusted grid and padding
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
        // Enhanced empty state
        <div className="my-auto flex flex-col items-center gap-4 text-center text-grey_pebble">
          <Info size={48} />
          <p className="text-lg font-medium">
            No tienes reservas{" "}
            {bookings.length > 0 ? "activas en esta categoría" : "activas"}.
          </p>
          <Button
            asChild
            variant="outline"
            className="border-rust text-rust hover:bg-rust/10 hover:text-rust"
          >
            <Link href="/calendario">Reservar una clase</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
