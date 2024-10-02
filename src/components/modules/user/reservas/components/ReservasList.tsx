import React from "react"
import ReservasCard from "@/components/modules/user/reservas/components/ReservasCard"
import { Reservation } from "@/components/modules/user/reservas/utils/mockReservations"

export default function ReservasList({
  reservas,
}: {
  reservas: Reservation[]
}) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:p-10 lg:grid-cols-4">
      {reservas.map((reserva) => (
        <ReservasCard key={reserva.id} reserva={reserva} />
      ))}
    </div>
  )
}
