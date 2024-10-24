import { Booking, Class } from "@prisma/client"

export interface ClassWithBookings extends Class {
  bookings: (Booking & {
    user: {
      name: string
      email: string
    }
  })[]
}
