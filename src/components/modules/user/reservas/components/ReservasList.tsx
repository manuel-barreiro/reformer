import React from "react"
import ReservasCard from "@/components/modules/user/reservas/components/ReservasCard"
import { Reservation } from "@/components/modules/user/reservas/utils/mockReservations"

export default function ReservasList({
  reservas,
}: {
  reservas: Reservation[]
}) {
  return (
    <div className="grid h-full grid-cols-2 gap-3 py-5 md:max-w-[600px] md:grid-cols-3 md:p-10 lg:max-w-[800px]">
      {reservas.map((reserva) => (
        <ReservasCard key={reserva.id} reserva={reserva} />
      ))}
    </div>
  )
}
