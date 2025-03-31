"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { ClassFormDialog } from "@/components/modules/roles/admin/calendario/ClassFormDialog"
import {
  EditIcon,
  TrashIcon,
  CalendarPlus,
  Users,
  LockIcon,
  UnlockIcon,
  CalendarMinus,
  Loader2,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { ClassWithBookings } from "@/components/modules/roles/common/calendario/types"
import ActionDialog from "@/components/modules/roles/common/ActionDialog"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import ClassAttendantsDialog from "@/components/modules/roles/admin/calendario/ClassAttendantsDialog"
import { useCallback } from "react"
import { Progress } from "@/components/ui/progress"
import { useClassMutations } from "@/components/modules/roles/common/calendario/hooks/useClassMutations"

interface ClassCardProps {
  date: Date
  class_: ClassWithBookings
  onClassChange: () => void
  updateClassBookings: (classId: string, updatedBookings: any[]) => void
  userRole: string
  currentUserId?: string
}

export default function ClassCard({
  date,
  class_,
  onClassChange,
  updateClassBookings,
  userRole,
  currentUserId,
}: ClassCardProps) {
  // Access all mutations from the custom hook
  const {
    useBookClassMutation,
    useCancelBookingMutation,
    useToggleLockMutation,
    useDeleteClassMutation,
  } = useClassMutations(date, onClassChange)

  // Initialize mutations for this specific class
  const bookClassMutation = useBookClassMutation(class_.id)
  const toggleLockMutation = useToggleLockMutation(class_)
  const deleteClassMutation = useDeleteClassMutation(class_.id)

  const classDetails = [
    { label: "Categoría", value: class_.category.name },
    { label: "Subcategoría", value: class_.subcategory.name },
    {
      label: "Fecha",
      value: class_.date.toLocaleDateString("es-ES", {
        weekday: "long",
        month: "numeric",
        day: "numeric",
      }),
    },
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

  const userBooking = class_.bookings.find(
    (booking) =>
      booking.userId === currentUserId && booking.status === "confirmed"
  )

  // Initialize cancel booking mutation only if there's a booking to cancel
  const cancelBookingMutation = useCancelBookingMutation(userBooking?.id)

  const handleBookingChange = useCallback(
    (updatedBookings: any[]) => {
      updateClassBookings(class_.id, updatedBookings)
    },
    [class_.id, updateClassBookings]
  )

  const confirmedBookings = class_.bookings.filter(
    (booking) => booking.status === "confirmed" || booking.status === "attended"
  )

  const isFull = confirmedBookings.length >= class_.maxCapacity

  return (
    <Card
      key={class_.id}
      className={`relative w-full animate-fade-down border bg-pearlVariant px-4 py-2 ${
        userBooking && "bg-rust text-pearl"
      } ${userRole === "user" && isFull && "!opacity-50"} ${!class_.isActive && userRole === "admin" && "!opacity-70"}`}
    >
      <div className="relative flex w-full flex-col items-start justify-between gap-3 2xl:flex-row 2xl:items-center 2xl:gap-6">
        <div className="w-auto">
          <p className="flex items-center gap-2 text-sm">
            <Users
              className={`h-4 w-4 ${userRole === "user" && userBooking ? "text-pearl" : "text-midnight"}`}
            />
            <span>
              {confirmedBookings.length}/{class_.maxCapacity}
            </span>
          </p>

          <h3
            className={`flex items-center gap-2 font-dm_sans font-semibold uppercase ${userBooking ? "text-pearl" : "text-grey_pebble"}`}
          >
            {!class_.isActive && userRole === "admin" && (
              <LockIcon className="h-4 w-4 text-midnight" />
            )}{" "}
            {class_.category.name} - {class_.subcategory.name}
          </h3>
          <div
            className={`flex flex-col items-start gap-1 text-sm ${userBooking ? "text-pearl/80" : "text-gray-500"}`}
          >
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
          <p
            className={`mt-1 text-sm ${userBooking ? "text-pearl/80" : "text-gray-500"}`}
          >
            Instructor: {class_.instructor}
          </p>
        </div>
        {userRole === "admin" && (
          <div className="flex w-full items-center justify-between gap-1 2xl:grid 2xl:w-auto 2xl:grid-cols-2">
            <ActionDialog
              buttons={true}
              trigger={
                <Button
                  variant="ghost"
                  disabled={deleteClassMutation.isPending}
                >
                  {deleteClassMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin text-midnight" />
                  ) : (
                    <TrashIcon className="h-4 w-4 text-midnight" />
                  )}
                </Button>
              }
              title="Eliminar Clase"
              description={
                <div className="flex max-w-md flex-col gap-1">
                  <span className="font-bold text-red-600">¡Advertencia!</span>
                  <span>Esta acción eliminará permanentemente:</span>
                  <span>• La clase y toda su información</span>
                  <span>• Todas las reservas asociadas</span>
                  <span>
                    • Se re-asignarán las clases a los paquetes activos
                  </span>
                  <span className="mt-2 font-semibold">
                    Esta acción no se puede deshacer.
                  </span>
                </div>
              }
              action={() => deleteClassMutation.mutate()}
              buttonText="Eliminar"
              icon={<TrashIcon className="h-4 w-4 text-pearl" />}
            />
            <ActionDialog
              buttons={true}
              trigger={
                <Button
                  variant="ghost"
                  title={
                    class_.isActive ? "Bloquear clase" : "Desbloquear clase"
                  }
                  disabled={toggleLockMutation.isPending}
                >
                  {toggleLockMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin text-midnight" />
                  ) : class_.isActive ? (
                    <LockIcon className="h-4 w-4 text-midnight" />
                  ) : (
                    <UnlockIcon className="h-4 w-4 text-midnight" />
                  )}
                </Button>
              }
              title={class_.isActive ? "Bloquear Clase" : "Desbloquear Clase"}
              description={
                <div className="flex max-w-md flex-col gap-1">
                  {class_.isActive ? (
                    <>
                      <span>Al bloquear esta clase:</span>
                      <span>• No será visible para los usuarios</span>
                      <span>• Las reservas existentes se mantendrán</span>
                      <span>• No se podrán realizar nuevas reservas</span>
                    </>
                  ) : (
                    <>
                      <span>Al desbloquear esta clase:</span>
                      <span>• Será visible para todos los usuarios</span>
                      <span>• Se podrán realizar nuevas reservas</span>
                    </>
                  )}
                </div>
              }
              action={() => toggleLockMutation.mutate()}
              buttonText={class_.isActive ? "Bloquear" : "Desbloquear"}
              icon={
                class_.isActive ? (
                  <LockIcon className="h-4 w-4 text-pearl" />
                ) : (
                  <UnlockIcon className="h-4 w-4 text-pearl" />
                )
              }
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
                        <TableCell className="capitalize">
                          {detail.value}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              }
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
              onBookingChange={handleBookingChange}
              class_={class_}
            />
          </div>
        )}
        {userRole === "user" && (
          <div className="absolute -right-2 top-4 flex w-auto flex-col">
            {userBooking ? (
              <ActionDialog
                buttons={true}
                trigger={
                  <Button
                    variant="ghost"
                    className="group text-pearl hover:bg-pearlVariant hover:text-midnight"
                    disabled={cancelBookingMutation.isPending}
                  >
                    {cancelBookingMutation.isPending ? (
                      <Loader2 className="h-7 w-7 animate-spin text-pearlVariant" />
                    ) : (
                      <CalendarMinus className="h-4 w-4" />
                    )}
                  </Button>
                }
                title="Cancelar Reserva"
                description="¿Estás seguro que deseas cancelar esta reserva?"
                action={() => cancelBookingMutation.mutate()}
                buttonText="Cancelar Reserva"
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
                          <TableCell className="capitalize">
                            {detail.value}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                }
                icon={<CalendarMinus className="h-4 w-4 text-pearl" />}
              />
            ) : (
              !isFull && (
                <ActionDialog
                  buttons={true}
                  trigger={
                    <Button
                      variant="ghost"
                      disabled={bookClassMutation.isPending}
                    >
                      {bookClassMutation.isPending ? (
                        <Loader2 className="h-7 w-7 animate-spin text-midnight" />
                      ) : (
                        <CalendarPlus className="h-4 w-4 text-midnight" />
                      )}
                    </Button>
                  }
                  title="Reservar Clase"
                  description="¿Deseas reservar esta clase?"
                  action={() => bookClassMutation.mutate()}
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
                            <TableCell className="capitalize">
                              {detail.value}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  }
                  icon={<CalendarPlus className="h-4 w-4 text-pearl" />}
                />
              )
            )}
          </div>
        )}
      </div>
      {userRole === "admin" && (
        <Progress
          value={(confirmedBookings.length / class_.maxCapacity) * 100}
          className="absolute left-0 right-0 top-0 h-1 w-full rounded-b-none rounded-t-md"
        />
      )}
    </Card>
  )
}
