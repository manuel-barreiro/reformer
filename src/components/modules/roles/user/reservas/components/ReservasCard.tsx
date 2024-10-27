"use client"
import ActionDialog from "@/components/modules/roles/common/ActionDialog"
import { CalendarX } from "lucide-react"
import { cancelBooking } from "@/actions/booking-actions"
import { toast } from "@/components/ui/use-toast"
import { addHours, isBefore, format } from "date-fns"
import { BookingWithClass } from "@/components/modules/roles/user/reservas/ReservasPage"

interface ReservasCardProps {
  booking: BookingWithClass
  onCancelSuccess: () => void
}

export default function ReservasCard({
  booking,
  onCancelSuccess,
}: ReservasCardProps) {
  const handleCancelReservation = async () => {
    const result = await cancelBooking(booking.id)
    if (result.success) {
      toast({
        title: "Reserva cancelada",
        description: "La reserva ha sido cancelada exitosamente.",
        variant: "reformer",
      })
      onCancelSuccess()
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    }
  }

  const now = new Date()
  const classTime = new Date(booking.class.startTime)
  const twentyFourHoursBeforeClass = addHours(classTime, -24)
  const canCancel = isBefore(now, twentyFourHoursBeforeClass)

  return (
    <div className="flex max-h-56 w-full flex-col items-start justify-evenly rounded-md bg-rust font-dm_mono font-medium text-pearl">
      <div className="flex h-full w-full flex-col items-start justify-evenly p-5">
        <p>{format(classTime, "dd/MM/yyyy")}</p>
        <span className="my-1 w-full border border-dashed border-pearl" />
        <p className="text-md uppercase">{booking.class.category.name}</p>
        <p className="font-dm_sans text-xs font-thin uppercase">
          {booking.class.subcategory.name}
        </p>
        <p className="mt-1">{format(classTime, "HH:mm")}</p>
      </div>

      <ActionDialog
        buttons={true}
        title="¿Estás seguro?"
        description={
          canCancel
            ? "Esta acción no se puede revertir."
            : "No puedes cancelar una reserva con menos de 24 horas de anticipación."
        }
        buttonText="CANCELAR"
        action={handleCancelReservation}
        icon={<CalendarX className="h-4 w-4 text-pearl" />}
        trigger={
          <button
            className={`w-full p-2 font-dm_sans font-semibold ${canCancel ? "bg-pearlVariant2/80 text-grey_pebble" : "cursor-not-allowed bg-grey_pebble/50 text-pearlVariant2/80"}`}
            disabled={!canCancel}
          >
            CANCELAR
          </button>
        }
      />
    </div>
  )
}
