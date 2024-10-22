"use client"

import { Button } from "@/components/ui/button"
import { ClassFormDialog } from "@/components/modules/roles/admin/calendario/ClassFormDialog"
import { EditIcon, TrashIcon, CalendarPlus, Users } from "lucide-react"
import { Card } from "@/components/ui/card"
import { ClassWithBookings } from "@/components/modules/roles/common/calendario/types"
import ActionDialog from "@/components/modules/roles/common/ActionDialog"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { bookClass } from "@/actions/booking-actions"
import { toast } from "@/components/ui/use-toast"
import ClassAttendantsDialog from "./ClassAttendantsDialog"

interface ClassCardProps {
  date: Date
  class_: ClassWithBookings
  onClassChange: () => void
  handleDeleteClass: (classId: string) => Promise<void>
  userRole: string
}

export default function ClassCard({
  date,
  class_,
  onClassChange,
  handleDeleteClass,
  userRole,
}: ClassCardProps) {
  const classDetails = [
    { label: "Categoría", value: class_.category },
    { label: "Subcategoría", value: class_.type.replace("_", " ") },
    { label: "Fecha", value: class_.date.toLocaleDateString() },
    {
      label: "Horario",
      value: `${new Date(class_.startTime).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })} - ${new Date(class_.endTime).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
    },
    { label: "Instructor", value: class_.instructor },
  ]

  const handleBookClass = async () => {
    const result = await bookClass(class_.id)
    if (result.success) {
      toast({
        title: "Clase reservada",
        description: "La clase ha sido reservada exitosamente.",
        variant: "reformer",
      })
      onClassChange() // Refresh the classes
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    }
  }

  const confirmedBookings = class_.bookings.filter(
    (booking) => booking.status === "confirmed"
  )

  return (
    <Card key={class_.id} className="border bg-pearlVariant p-4">
      <div className="flex items-center justify-between gap-6">
        <div className="w-auto">
          <h3 className="font-dm_sans font-semibold text-grey_pebble">
            {class_.category} - {class_.type.replace("_", " ")}
          </h3>
          <div className="flex flex-col items-start gap-1 text-sm text-gray-500">
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
            {userRole === "admin" && (
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-midnight" />
                <span>
                  {confirmedBookings.length}/{class_.maxCapacity}
                </span>
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Instructor: {class_.instructor}
          </p>
        </div>
        {userRole === "admin" && (
          <div className="flex w-auto flex-col">
            <ActionDialog
              buttons={true}
              trigger={
                <Button variant="ghost">
                  <TrashIcon className="h-4 w-4 text-midnight" />
                </Button>
              }
              title="Eliminar Clase"
              description="¿Deseas eliminar esta clase? Esta acción no se puede revertir."
              action={() => handleDeleteClass(class_.id)}
              buttonText="Eliminar"
              icon={<TrashIcon className="h-4 w-4 text-pearl" />}
            />
            <ClassFormDialog
              selectedDate={date}
              classToEdit={class_}
              onSuccess={onClassChange}
              trigger={
                <Button variant="ghost">
                  <EditIcon className="h-4 w-4 text-midnight" />
                </Button>
              }
            />
            <ClassAttendantsDialog
              classBookings={confirmedBookings}
              onBookingChange={onClassChange}
            />
          </div>
        )}
        {userRole === "user" && (
          <div className="flex w-auto flex-col">
            <ActionDialog
              buttons={true}
              trigger={
                <Button variant="ghost">
                  <CalendarPlus className="h-4 w-4 text-midnight" />
                </Button>
              }
              title="Reservar Clase"
              description="¿Deseas reservar esta clase?"
              action={handleBookClass}
              buttonText="Reservar"
              content={
                <Table>
                  <TableBody className="bg-pearlVariant text-sm text-tableContent">
                    {classDetails.map((detail, index) => (
                      <TableRow
                        key={index}
                        className="border-b border-grey_pebble"
                      >
                        <TableCell className="font-medium">
                          {detail.label}
                        </TableCell>
                        <TableCell>{detail.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              }
              icon={<CalendarPlus className="h-4 w-4 text-pearl" />}
            />
          </div>
        )}
      </div>
    </Card>
  )
}
