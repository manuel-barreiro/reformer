import { Booking } from "@prisma/client"
import ActionDialog from "@/components/modules/roles/common/ActionDialog"
import { Users, TrashIcon } from "lucide-react"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { deleteBooking } from "@/actions/booking-actions"
import { toast } from "@/components/ui/use-toast"
import { useState } from "react"

interface BookingWithUser extends Booking {
  user: {
    name: string
    email: string
  }
}

export default function ClassAttendantsDialog({
  classBookings,
  onBookingChange,
}: {
  classBookings: BookingWithUser[]
  onBookingChange: () => void
}) {
  const [selectedBooking, setSelectedBooking] =
    useState<BookingWithUser | null>(null)

  const handleDeleteBooking = async () => {
    if (!selectedBooking) return

    try {
      const result = await deleteBooking(selectedBooking.id)
      if (result.success) {
        toast({
          title: "Success",
          description: "User removed from class successfully",
          variant: "reformer",
        })
        onBookingChange() // Refresh the bookings list
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove user from class",
        variant: "destructive",
      })
    }
    setSelectedBooking(null)
  }

  return (
    <>
      <ActionDialog
        closeOnTop={true}
        className=""
        action={() => {}}
        buttons={false}
        trigger={
          <Button variant="ghost">
            <Users className="h-4 w-4 text-midnight" />
          </Button>
        }
        title="Asistentes"
        content={
          <div className="overflow-x-auto">
            <Table>
              <TableBody className="bg-pearlVariant text-sm text-tableContent">
                {classBookings.length > 0 ? (
                  classBookings.map((booking, index) => (
                    <TableRow
                      key={index}
                      className="border-b border-grey_pebble"
                    >
                      <TableCell className="font-medium">
                        {booking.user.name}
                      </TableCell>
                      <TableCell>{booking.user.email}</TableCell>
                      <TableCell className="text-right">
                        <ActionDialog
                          buttons={true}
                          trigger={
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedBooking(booking)}
                            >
                              <TrashIcon className="text-destructive h-4 w-4" />
                            </Button>
                          }
                          title="Eliminar Reserva"
                          description={
                            <>
                              <p>
                                ¿Estás seguro que deseas eliminar la reserva de{" "}
                                {booking.user.name}?
                              </p>
                              <ul>
                                <li>• Eliminará al usuario de la clase</li>
                                <li>• Devolverá el crédito a su paquete</li>
                                <li>• No se puede deshacer</li>
                              </ul>
                            </>
                          }
                          action={handleDeleteBooking}
                          buttonText="Eliminar"
                          icon={<TrashIcon className="h-4 w-4 text-pearl" />}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No hay asistentes
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        }
        buttonText="Cerrar"
      />
    </>
  )
}
