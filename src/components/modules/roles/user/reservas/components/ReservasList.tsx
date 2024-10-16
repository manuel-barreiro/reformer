import React from "react"
import ReservasCard from "@/components/modules/roles/user/reservas/components/ReservasCard"
import { Reservation } from "@/components/modules/roles/user/reservas/utils/mockReservations"

export default function ReservasList({
  reservas,
}: {
  reservas: Reservation[]
}) {
  return (
    <div className="grid h-full grid-cols-2 gap-3 py-5 md:grid-cols-3 md:p-10 lg:grid-cols-4 xl:max-w-[1000px]">
      {reservas.map((reserva) => (
        <ReservasCard key={reserva.id} reserva={reserva} />
      ))}
    </div>
  )
}
