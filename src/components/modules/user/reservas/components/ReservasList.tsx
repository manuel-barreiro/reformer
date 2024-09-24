import React from "react"
import ReservasCard from "@/components/modules/user/reservas/components/ReservasCard"
import { Reservation } from "@/components/modules/user/reservas/utils/mockReservations"

export default function ReservasList({
  reservas,
}: {
  reservas: Reservation[]
}) {
  return (
    <div className="grid grid-cols-4 gap-3 p-10">
      {reservas.map((reserva) => (
        <ReservasCard key={reserva.id} reserva={reserva} />
      ))}
    </div>
  )
}
