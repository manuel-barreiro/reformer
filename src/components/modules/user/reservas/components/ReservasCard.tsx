import { Reservation } from "@/components/modules/user/reservas/utils/mockReservations"
import ActionDialog from "@/components/modules/user/common/ActionDialog"

export default function ReservasCard({ reserva }: { reserva: Reservation }) {
  return (
    <div className="flex h-full w-full flex-col items-start justify-evenly rounded-lg bg-rust font-dm_mono font-medium text-pearl">
      <div className="flex h-full w-full flex-col items-start justify-evenly p-5">
        <p>{reserva.date}</p>
        <span className="my-1 w-full border border-dashed border-pearl" />
        <p className="text-md">{reserva.activity}</p>
        <p className="font-dm_sans text-xs font-thin">{reserva.description}</p>
        <p className="mt-1">{reserva.time}</p>
      </div>

      <ActionDialog
        trigger={
          <button className="bg-pearlVariant2/80 w-full p-2 font-dm_sans font-semibold text-grey_pebble">
            CANCELAR
          </button>
        }
      />
    </div>
  )
}
