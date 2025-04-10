"use client"

import React, { useState, useMemo, useEffect } from "react"
import HeaderToggle from "@/components/modules/roles/common/HeaderToggle"
import ReservasList from "@/components/modules/roles/user/reservas/components/ReservasList"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getUserBookings } from "@/actions/booking-actions"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Booking, Class, Category } from "@prisma/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CalendarSearch } from "lucide-react"

interface ExtendedClass extends Class {
  category: {
    id: string
    name: string
  }
  subcategory: {
    id: string
    name: string
  }
}

export interface BookingWithClass extends Booking {
  class: ExtendedClass
}

export default function ReservasPage({
  initialReservations,
}: {
  initialReservations: BookingWithClass[]
}) {
  const [filter, setFilter] = useState<string>("TODOS")
  const [bookings, setBookings] =
    useState<BookingWithClass[]>(initialReservations)
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
    return bookings.filter(
      (booking) =>
        booking.class.category.name.toLowerCase() === filter.toLowerCase()
    )
  }, [bookings, filter])

  const handleCancelSuccess = () => {
    fetchBookings()
  }

  const buyButton = (
    <Button
      asChild
      className="flex w-full shrink-0 items-center gap-1 bg-rust font-dm_mono text-pearl hover:bg-rust/90"
    >
      <Link href="/calendario" className="flex w-full items-center gap-3">
        <CalendarSearch size={18} />
        <span className="">NUEVA RESERVA</span>
      </Link>
    </Button>
  )

  return (
    <section className="flex h-full w-full flex-col">
      <HeaderToggle
        filterOptions={["TODOS", "YOGA", "PILATES"]}
        currentFilter={filter}
        onFilterChange={setFilter}
        actionButton={buyButton}
      />
      <ScrollArea className="w-full flex-grow overflow-y-auto">
        {isLoading ? (
          <div className="grid h-full w-full grid-cols-1 gap-3 py-5 md:grid-cols-3 md:p-10 lg:grid-cols-4">
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
