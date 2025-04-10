"use client"
import ActionDialog from "@/components/modules/roles/common/ActionDialog"
import { CalendarDays, CalendarX, Clock } from "lucide-react"
import { cancelBooking } from "@/actions/booking-actions"
import { toast } from "@/components/ui/use-toast"
import { addHours, isBefore, format } from "date-fns"
import { BookingWithClass } from "@/components/modules/roles/user/reservas/ReservasPage"
import { utcToLocal } from "@/lib/timezone-utils"
import { cn } from "@/lib/utils"
import { es } from "date-fns/locale"

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
  const classTime = utcToLocal(booking.class.startTime)
  const twelveHoursBeforeClass = addHours(classTime, -12)
  const canCancel = isBefore(now, twelveHoursBeforeClass)

  return (
    // Restore min-height, background, and adjust border/text colors
    <div className="flex h-52 w-full flex-col justify-between rounded-lg border border-pearl/30 bg-rust font-dm_sans text-pearl shadow-sm">
      {/* Main content area */}
      <div className="flex flex-grow flex-col p-4">
        {/* Date and Time - Adjust icon/separator color */}
        <div className="mb-2 flex items-center gap-2 text-sm font-medium">
          <CalendarDays size={16} className="text-pearl/80" />
          <span>
            {format(classTime, "EEEE d/M", { locale: es }).replace(/^\w/, (c) =>
              c.toUpperCase()
            )}
          </span>
          <span className="mx-1 text-pearl/50">|</span>
          <Clock size={16} className="text-pearl/80" />
          <span>{format(classTime, "HH:mm")}</span>
        </div>

        {/* Separator - Adjust color */}
        <span className="my-1 w-full border-t border-dashed border-pearl/50" />

        {/* Class Details - Adjust text colors */}
        <p className="mt-1 text-lg font-semibold uppercase text-pearl">
          {booking.class.category.name}
        </p>
        <p className="text-sm font-normal uppercase text-pearl/70">
          {" "}
          {/* Lighter secondary text */}
          {booking.class.subcategory.name}
        </p>
      </div>

      {/* Action Area */}
      <ActionDialog
        buttons={true}
        title="¿Confirmar cancelación?"
        description={
          canCancel
            ? "Tu clase se liberará y se acreditará de nuevo en tu paquete si corresponde. Esta acción no se puede revertir."
            : "No puedes cancelar una reserva con menos de 12 horas de anticipación."
        }
        buttonText="Cancelar reserva"
        cancelText="Volver"
        action={handleCancelReservation}
        // Icon color needs to contrast with the button background
        icon={<CalendarX className="h-4 w-4 text-pearl" />} // Icon for the dialog button (dark on light bg)
        trigger={
          <button
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-b-lg p-3 text-sm font-semibold transition-colors",
              canCancel
                ? // Active button: Light background, dark text
                  "bg-pearl text-rust hover:bg-pearl/90"
                : // Disabled button: Keep the improved subtle disabled style
                  "cursor-not-allowed bg-pearl/30 text-pearl/70"
            )}
            disabled={!canCancel}
          >
            <CalendarX
              className={cn("h-4 w-4", canCancel ? "text-rust" : "text-pearl")}
            />
            CANCELAR RESERVA
          </button>
        }
      />
    </div>
  )
}
