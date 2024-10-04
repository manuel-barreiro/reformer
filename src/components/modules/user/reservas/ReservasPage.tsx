"use client"

import React, { useState, useMemo } from "react"
import HeaderToggle from "@/components/modules/user/common/HeaderToggle"
import ReservasList from "@/components/modules/user/reservas/components/ReservasList"
import { Reservation } from "@/components/modules/user/reservas/utils/mockReservations"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ReservationsPageProps {
  initialReservations: Reservation[]
}

export default function ReservasPage({
  initialReservations,
}: ReservationsPageProps) {
  const [filter, setFilter] = useState<string>("YOGA")

  const filteredReservations = useMemo(() => {
    return initialReservations.filter((reserva: Reservation) => {
      return reserva.activity === filter
    })
  }, [initialReservations, filter])

  return (
    <>
      <HeaderToggle
        title="Mis Reservas"
        filterOptions={["YOGA", "PILATES"]}
        currentFilter={filter}
        onFilterChange={setFilter}
      />
      <ScrollArea className="max-h-[550px] w-full overflow-y-auto pb-10 md:h-72 md:pb-0">
        <ReservasList reservas={filteredReservations} />
      </ScrollArea>
    </>
  )
}
