"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { addHours, isBefore } from "date-fns"

export async function bookClass(classId: string) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      throw new Error("User not authenticated")
    }

    const userId = session.user.id
    if (!userId) {
      throw new Error("User ID is undefined")
    }

    // Check if the user has already booked this class
    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId: userId,
        classId: classId,
        status: "confirmed",
      },
    })

    if (existingBooking) {
      throw new Error("You have already booked this class")
    }

    // Check if the class is full
    const classDetails = await prisma.class.findUnique({
      where: { id: classId },
      include: { bookings: true },
    })

    if (!classDetails) {
      throw new Error("Class not found")
    }

    if (classDetails.bookings.length >= classDetails.maxCapacity) {
      throw new Error("This class is already full")
    }

    // Find an active purchased package with remaining classes
    const activePurchasedPackage = await prisma.purchasedPackage.findFirst({
      where: {
        userId: userId,
        remainingClasses: { gt: 0 },
        status: "active",
        expirationDate: { gte: new Date() },
      },
      orderBy: { expirationDate: "asc" }, // Use the package expiring soonest
    })

    if (!activePurchasedPackage) {
      throw new Error("No active package with remaining classes found")
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        userId: userId,
        classId: classId,
        purchasedPackageId: activePurchasedPackage.id,
        status: "confirmed",
      },
    })

    console.log("Booking created", booking)

    // Decrease the remaining classes in the purchased package
    await prisma.purchasedPackage.update({
      where: { id: activePurchasedPackage.id },
      data: {
        remainingClasses: {
          decrement: 1,
        },
      },
    })

    revalidatePath("/calendario")
    return { success: true, booking }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "An unknown error occurred" }
  }
}

export async function getUserBookings() {
  const session = await auth()
  if (!session || !session.user) {
    throw new Error("User not authenticated")
  }

  const userId = session.user.id

  const bookings = await prisma.booking.findMany({
    where: {
      userId: userId,
      status: "confirmed",
    },
    include: {
      class: true,
    },
    orderBy: {
      class: {
        startTime: "asc",
      },
    },
  })

  return bookings
}

export async function getUserBookingsInRange(startDate: Date, endDate: Date) {
  const session = await auth()
  if (!session || !session.user) {
    throw new Error("User not authenticated")
  }

  const userId = session.user.id

  const bookings = await prisma.booking.findMany({
    where: {
      userId: userId,
      status: "confirmed",
      class: {
        startTime: { gte: startDate },
        endTime: { lte: endDate },
      },
    },
    include: {
      class: true,
    },
    orderBy: {
      class: {
        startTime: "asc",
      },
    },
  })

  return bookings
}

export async function cancelBooking(bookingId: string) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      throw new Error("User not authenticated")
    }

    const userId = session.user.id

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { class: true },
    })

    if (!booking) {
      throw new Error("Booking not found")
    }

    if (booking.userId !== userId) {
      throw new Error("Unauthorized to cancel this booking")
    }

    const now = new Date()
    const classTime = new Date(booking.class.startTime)
    const twentyFourHoursBeforeClass = addHours(classTime, -24)

    if (isBefore(twentyFourHoursBeforeClass, now)) {
      throw new Error(
        "Cannot cancel bookings less than 24 hours before the class"
      )
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "cancelled" },
    })

    await prisma.purchasedPackage.update({
      where: { id: booking.purchasedPackageId },
      data: {
        remainingClasses: {
          increment: 1,
        },
      },
    })

    revalidatePath("/reservas")
    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "An unknown error occurred" }
  }
}
