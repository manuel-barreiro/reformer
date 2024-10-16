import ReservasPage from "@/components/modules/roles/user/reservas/ReservasPage"
import { mockReservations } from "@/components/modules/roles/user/reservas/utils/mockReservations"

async function getInitialReservations() {
  return mockReservations
}

export default function MisReservas() {
  return <ReservasPage initialReservations={mockReservations} />
}
