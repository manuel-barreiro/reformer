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
import { useCallback } from "react"
import { Progress } from "@/components/ui/progress"
import { Span } from "next/dist/trace"

interface ClassCardProps {
  date: Date
  class_: ClassWithBookings
  onClassChange: () => void
  updateClassBookings: (classId: string, updatedBookings: any[]) => void
  handleDeleteClass: (classId: string) => Promise<void>
  userRole: string
}

export default function ClassCard({
  date,
  class_,
  onClassChange,
  updateClassBookings, // Add this new prop
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

  const handleBookingChange = useCallback(
    (updatedBookings: any[]) => {
      updateClassBookings(class_.id, updatedBookings)
    },
    [class_.id, updateClassBookings]
  )

  const confirmedBookings = class_.bookings.filter(
    (booking) => booking.status === "confirmed"
  )

  return (
    <Card
      key={class_.id}
      className="relative animate-fade-down border bg-pearlVariant px-4 py-2"
    >
      <div className="flex items-center justify-between gap-6">
        <div className="w-auto">
          {userRole === "admin" && (
            <p className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-midnight" />
              <span>
                {confirmedBookings.length}/{class_.maxCapacity}
              </span>
            </p>
          )}
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
              description={
                <div className="flex max-w-md flex-col gap-1">
                  <span>¿Estás seguro de que deseas eliminar esta clase?</span>
                  <span>• Esta acción no se puede deshacer.</span>
                  <span>
                    • Se re-asignará la clase a los paquetes activos de los
                    usuarios que reservaron esta clase.{" "}
                  </span>
                </div>
              }
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
              onBookingChange={handleBookingChange} // Use the new handler
              class_={class_}
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
      <Progress
        value={(confirmedBookings.length / class_.maxCapacity) * 100}
        className="absolute left-0 right-0 top-0 h-1 w-full rounded-b-none rounded-t-md"
      />
    </Card>
  )
}
