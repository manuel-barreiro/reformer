import { getUserBookings } from "@/actions/booking-actions"
import ReservasPage from "@/components/modules/roles/user/reservas/ReservasPage"

export default async function MisReservas() {
  const initialReservations = await getUserBookings()
  return <ReservasPage initialReservations={initialReservations} />
}
