"use client"

import React, { useState, useMemo, useEffect } from "react"
import HeaderToggle from "@/components/modules/roles/common/HeaderToggle"
import ReservasList from "@/components/modules/roles/user/reservas/components/ReservasList"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getUserBookings } from "@/actions/booking-actions"
import { Booking, Class } from "@prisma/client"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export interface BookingWithClass extends Booking {
  class: Class
}

export default function ReservasPage({
  initialReservations,
}: {
  initialReservations: BookingWithClass[]
}) {
  const [filter, setFilter] = useState<string>("TODOS")
  const [bookings, setBookings] = useState<BookingWithClass[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchBookings = async () => {
    setIsLoading(true)
    try {
      const userBookings = await getUserBookings()
      setBookings(userBookings)
    } catch (error) {
      toast({
        title: "Error",
        description:
          "No se pudieron cargar las reservas. Por favor, intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const filteredBookings = useMemo(() => {
    if (filter === "TODOS") return bookings
    return bookings.filter((booking) => booking.class.category === filter)
  }, [bookings, filter])

  const handleCancelSuccess = () => {
    fetchBookings()
  }

  return (
    <section className="h-full">
      <HeaderToggle
        title="Mis Reservas"
        filterOptions={["TODOS", "YOGA", "PILATES"]}
        currentFilter={filter}
        onFilterChange={setFilter}
      />
      <ScrollArea className="w-full overflow-y-auto md:h-96">
        {isLoading ? (
          <div className="grid h-full grid-cols-2 gap-3 py-5 md:grid-cols-3 md:p-10 lg:grid-cols-4 xl:max-w-[1000px]">
            {Array(4)
              .fill(null)
              .map((item) => (
                <Skeleton key={item} className="h-52 w-full bg-rust/50" />
              ))}
          </div>
        ) : (
          <ReservasList
            bookings={filteredBookings}
            onCancelSuccess={handleCancelSuccess}
          />
        )}
      </ScrollArea>
    </section>
  )
}
