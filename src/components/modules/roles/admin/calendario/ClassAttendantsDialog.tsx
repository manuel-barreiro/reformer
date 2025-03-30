"use client"
import { Booking, User } from "@prisma/client"
import ActionDialog from "@/components/modules/roles/common/ActionDialog"
import { Users, TrashIcon } from "lucide-react"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { deleteBooking, bookClass } from "@/actions/booking-actions"
import { toast } from "@/components/ui/use-toast"
import { useState, useCallback, useEffect } from "react"
import { UserSearch } from "@/components/modules/roles/common/UserSearch"
import { ClassWithBookings } from "@/components/modules/roles/common/calendario/types"
import { ScrollArea } from "@/components/ui/scroll-area"

interface BookingWithUser extends Booking {
  user: {
    name: string
    email: string
  }
}

export default function ClassAttendantsDialog({
  classBookings,
  onBookingChange,
  class_,
}: {
  classBookings: BookingWithUser[]
  onBookingChange: (bookings: BookingWithUser[]) => void
  class_: ClassWithBookings
}) {
  const [selectedBooking, setSelectedBooking] =
    useState<BookingWithUser | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [localBookings, setLocalBookings] =
    useState<BookingWithUser[]>(classBookings)
  const [isMainDialogOpen, setIsMainDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Update local bookings when props change
  useEffect(() => {
    setLocalBookings(classBookings)
  }, [classBookings])

  const handleDeleteBooking = useCallback(async () => {
    if (!selectedBooking || isProcessing) return

    try {
      const result = await deleteBooking(selectedBooking.id)
      if (result.success) {
        const updatedBookings = localBookings.filter(
          (booking) => booking.id !== selectedBooking.id
        )
        setLocalBookings(updatedBookings)
        onBookingChange(updatedBookings)

        toast({
          title: "Usuario eliminado",
          description: "Usuario eliminado de la clase exitosamente",
          variant: "reformer",
        })

        setIsDeleteDialogOpen(false)
        setSelectedBooking(null)
      } else {
        if ("error" in result) {
          throw new Error("Unknown error occurred")
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al eliminar usuario de la clase",
        variant: "destructive",
      })
    }
  }, [selectedBooking, localBookings, onBookingChange, isProcessing])

  const handleAddUser = useCallback(async () => {
    if (!selectedUser || isProcessing) return

    setIsProcessing(true)
    try {
      const result = await bookClass(class_.id, selectedUser.id)
      if (result.success) {
        const newBooking: BookingWithUser = {
          id: Date.now().toString(),
          userId: selectedUser.id,
          classId: class_.id,
          status: "confirmed",
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            name: selectedUser.name,
            email: selectedUser.email,
          },
          purchasedPackageId: "",
        }

        const updatedBookings = [...localBookings, newBooking]
        setLocalBookings(updatedBookings)
        onBookingChange(updatedBookings)

        toast({
          title: "Usuario añadido",
          description: "Usuario añadido a la clase exitosamente",
          variant: "reformer",
        })

        setSelectedUser(null)
      } else {
        throw new Error("Error al añadir usuario a la clase")
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al añadir usuario a la clase",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }, [selectedUser, class_.id, localBookings, onBookingChange, isProcessing])

  return (
    <>
      <ActionDialog
        closeOnTop={true}
        action={() => {}}
        buttons={false}
        open={isMainDialogOpen}
        onOpenChange={setIsMainDialogOpen}
        trigger={
          <Button variant="ghost" onClick={() => setIsMainDialogOpen(true)}>
            <Users className="h-4 w-4 text-midnight" />
          </Button>
        }
        className="mx-auto w-[95vw] max-w-md sm:max-w-lg md:max-w-xl"
        title={
          <div className="w-auto font-dm_sans">
            <p className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="h-4 w-4 text-midnight" />
              <span>
                {classBookings.length}/{class_.maxCapacity}
              </span>
            </p>
            <h3 className="font-semibold text-grey_pebble">
              {class_.category.name} - {class_.subcategory.name}
            </h3>
            <div className="flex items-baseline gap-2 font-dm_sans text-sm text-gray-500">
              <span className="font-semibold capitalize">
                {class_.date?.toLocaleDateString("es-ES", {
                  weekday: "long",
                })}
              </span>
              <span className="">
                {class_.date?.toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "numeric",
                })}
              </span>
            </div>
            <div className="flex flex-col items-start gap-0 text-sm text-gray-500">
              <span>
                {new Date(class_.startTime).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                -{" "}
                {new Date(class_.endTime).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <p className="mt-0 text-sm text-gray-500">
              Instructor: {class_.instructor}
            </p>
          </div>
        }
        content={
          <div className="flex max-h-[70vh] flex-col overflow-x-hidden">
            <div className="mb-4 flex-grow overflow-hidden">
              <h4 className="mb-2 font-medium">Asistentes</h4>
              <div className="h-[250px] overflow-hidden rounded border border-gray-200">
                <ScrollArea className="h-full w-full">
                  <div className="min-w-full overflow-x-auto">
                    <Table>
                      <TableBody className="bg-pearlVariant text-sm text-tableContent">
                        {localBookings.length > 0 ? (
                          localBookings.map((booking) => (
                            <TableRow
                              key={booking.id}
                              className="border-b border-grey_pebble"
                            >
                              <TableCell className="max-w-[120px] whitespace-normal break-words font-medium sm:max-w-none">
                                {booking.user.name}
                              </TableCell>
                              <TableCell className="max-w-[120px] whitespace-normal break-words sm:max-w-none">
                                {booking.user.email}
                              </TableCell>
                              <TableCell className="w-10 text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedBooking(booking)
                                    setIsDeleteDialogOpen(true)
                                  }}
                                  disabled={isProcessing}
                                >
                                  <TrashIcon className="text-destructive h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center">
                              No hay reservas en esta clase
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium">Agregar Usuario</h3>
              <div className="mt-2 flex w-full flex-col gap-2">
                <div className="flex-grow">
                  <UserSearch
                    onSelectUser={setSelectedUser}
                    selectedUser={selectedUser}
                  />
                </div>
                <Button
                  onClick={handleAddUser}
                  disabled={!selectedUser || isProcessing}
                  className="bg-rust hover:bg-rust/90"
                >
                  {isProcessing ? "Agregando..." : "Agregar"}
                </Button>
              </div>
            </div>
          </div>
        }
        buttonText="Close"
      />

      <ActionDialog
        buttons={true}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        className="mx-auto w-[95vw] max-w-md"
        trigger={<></>}
        title="Eliminar Reserva"
        description={
          selectedBooking ? (
            <>
              <span>
                ¿Estás seguro de que deseas eliminar la reserva de{" "}
                {selectedBooking.user.name}?
              </span>

              <span className="mt-2">
                <div>• Esto eliminará al usuario de la clase</div>
                <div>• El crédito se devolverá a su paquete</div>
                <div>• Esta acción no se puede deshacer</div>
              </span>
            </>
          ) : undefined
        }
        action={handleDeleteBooking}
        buttonText={isProcessing ? "Eliminando..." : "Eliminar"}
        disabled={isProcessing}
        icon={<TrashIcon className="h-4 w-4 text-pearl" />}
      />
    </>
  )
}
