"use client"

import React, { useTransition } from "react"
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
import { bookClass, cancelBooking } from "@/actions/booking-actions"
import { toast } from "@/components/ui/use-toast"
import ClassAttendantsDialog from "./ClassAttendantsDialog"
import { useCallback } from "react"
import { Progress } from "@/components/ui/progress"
import { toggleClassLock } from "@/actions/class"
import { SolMidnight, SolPearl } from "@/assets/icons"

interface ClassCardProps {
  date: Date
  class_: ClassWithBookings
  onClassChange: () => void
  updateClassBookings: (classId: string, updatedBookings: any[]) => void
  handleDeleteClass: (classId: string) => Promise<void>
  userRole: string
  currentUserId?: string
}

export default function ClassCard({
  date,
  class_,
  onClassChange,
  updateClassBookings,
  handleDeleteClass,
  userRole,
  currentUserId,
}: ClassCardProps) {
  const [isPending, startTransition] = useTransition()

  const classDetails = [
    { label: "Categoría", value: class_.category },
    { label: "Subcategoría", value: class_.type.replace("_", " ") },
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

  const handleBookClass = async () => {
    startTransition(async () => {
      try {
        const result = await bookClass(class_.id)
        if (result.success) {
          toast({
            title: "Clase reservada",
            description: "La clase ha sido reservada exitosamente.",
            variant: "reformer",
          })
          onClassChange()
        } else {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description:
            "No se pudo realizar la reserva. Por favor intente nuevamente.",
          variant: "destructive",
        })
      }
    })
  }

  const handleCancelBooking = async () => {
    if (!userBooking) return

    startTransition(async () => {
      try {
        const result = await cancelBooking(userBooking.id)
        if (result.success) {
          toast({
            title: "Reserva cancelada",
            description: "La reserva ha sido cancelada exitosamente.",
            variant: "reformer",
          })
          onClassChange()
        } else {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description:
            "No se pudo cancelar la reserva. Por favor intente nuevamente.",
          variant: "destructive",
        })
      }
    })
  }

  const handleToggleLock = async () => {
    startTransition(async () => {
      const result = await toggleClassLock(class_.id)
      if (result.success) {
        toast({
          title: class_.isActive ? "Clase bloqueada" : "Clase desbloqueada",
          description: class_.isActive
            ? "La clase ha sido bloqueada y no será visible para los usuarios."
            : "La clase ha sido desbloqueada y ahora es visible para los usuarios.",
          variant: "reformer",
        })
        onClassChange()
      } else {
        toast({
          title: "Error",
          description: "No se pudo cambiar el estado de la clase.",
          variant: "destructive",
        })
      }
    })
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
      className={`relative animate-fade-down border bg-pearlVariant px-4 py-2 ${
        !class_.isActive && userRole === "admin"
          ? "line-through"
          : userBooking && "bg-rust text-pearl"
      }`}
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
          <h3
            className={`font-dm_sans font-semibold ${userBooking ? "text-pearl" : "text-grey_pebble"}`}
          >
            {class_.category} - {class_.type.replace("_", " ")}
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
          <div className="grid w-auto grid-cols-2 gap-1">
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
              action={() => handleDeleteClass(class_.id)}
              buttonText="Eliminar"
              icon={<TrashIcon className="h-4 w-4 text-pearl" />}
            />
            <Button
              variant="ghost"
              onClick={handleToggleLock}
              title={class_.isActive ? "Bloquear clase" : "Desbloquear clase"}
            >
              {class_.isActive ? (
                <UnlockIcon className="h-4 w-4 text-midnight" />
              ) : (
                <LockIcon className="h-4 w-4 text-midnight" />
              )}
            </Button>
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
          <div className="flex w-auto flex-col">
            {userBooking ? (
              <ActionDialog
                buttons={true}
                trigger={
                  <Button
                    variant="ghost"
                    className="group text-pearl hover:bg-pearlVariant hover:text-midnight"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <SolPearl className="h-7 w-7 animate-spin text-pearl" />
                    ) : (
                      <CalendarMinus className="h-4 w-4" />
                    )}
                  </Button>
                }
                title="Cancelar Reserva"
                description="¿Estás seguro que deseas cancelar esta reserva?"
                action={handleCancelBooking}
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
              <ActionDialog
                buttons={true}
                trigger={
                  <Button variant="ghost" disabled={isPending}>
                    {isPending ? (
                      <SolMidnight className="h-7 w-7 animate-spin text-midnight" />
                    ) : (
                      <CalendarPlus className="h-4 w-4 text-midnight" />
                    )}
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
