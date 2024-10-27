import { Booking, Category, Class, Subcategory } from "@prisma/client"

export interface ClassWithBookings extends Class {
  category: Category
  subcategory: Subcategory
  bookings: (Booking & {
    user: {
      name: string
      email: string
    }
  })[]
}
