"use client"

import { Booking, Class, Category, Subcategory } from "@prisma/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { utcToLocal } from "@/lib/timezone-utils"

interface ClassWithDetails extends Class {
  category: Category
  subcategory: Subcategory
}

interface ExtendedBooking extends Booking {
  class: ClassWithDetails
}

interface UserBookingsTabProps {
  bookings: ExtendedBooking[]
}

export function UserBookingsTab({ bookings }: UserBookingsTabProps) {
  // Format booking status
  const formatBookingStatus = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmada"
      case "cancelled":
        return "Cancelada"
      case "attended":
        return "Asistida"
      default:
        return status
    }
  }

  // Format date
  const formatDate = (date: Date) => {
    const localDate = utcToLocal(new Date(date))
    return format(localDate, "dd MMM yyyy", { locale: es })
  }

  // Format time
  const formatTime = (date: Date) => {
    const localDate = utcToLocal(new Date(date))
    return format(localDate, "HH:mm", { locale: es })
  }

  // Get badge color based on booking status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-amber-500"
      case "cancelled":
        return "bg-grey_pebble"
      case "attended":
        return "bg-emerald-500"
      default:
        return "bg-midnight"
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Reservas</h3>

      {bookings.length === 0 ? (
        <div className="rounded-md border p-8 text-center">
          <p className="text-grey_pebble">
            No hay reservas registradas para este usuario
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-grey_pebble">
                <TableHead className="text-grey_pebble">Clase</TableHead>
                <TableHead className="text-grey_pebble">Fecha</TableHead>
                <TableHead className="text-grey_pebble">Horario</TableHead>
                <TableHead className="text-grey_pebble">Instructor</TableHead>
                <TableHead className="text-grey_pebble">Estado</TableHead>
                <TableHead className="text-grey_pebble">
                  Fecha de Reserva
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow
                  key={booking.id}
                  className="border-b border-grey_pebble"
                >
                  <TableCell className="font-medium">
                    {booking.class.category.name} -{" "}
                    {booking.class.subcategory.name}
                  </TableCell>
                  <TableCell>{formatDate(booking.class.date)}</TableCell>
                  <TableCell>
                    {formatTime(booking.class.startTime)} -{" "}
                    {formatTime(booking.class.endTime)}
                  </TableCell>
                  <TableCell>{booking.class.instructor}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${getStatusBadgeColor(booking.status)} text-pearl`}
                    >
                      {formatBookingStatus(booking.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(booking.createdAt, "dd MMM yyyy", { locale: es })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
