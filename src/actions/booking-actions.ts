"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { addHours, isBefore } from "date-fns"

export async function bookClass(classId: string, adminSelectedUserId?: string) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      throw new Error("Usuario no autenticado")
    }

    // For admin bookings, use the provided userId, otherwise use the authenticated user's ID
    const userId = adminSelectedUserId || session.user.id
    if (!userId) {
      throw new Error("ID de usuario no encontrado")
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
      throw new Error("Ya tienes una reserva confirmada para esta clase")
    }

    // Check if the class is full
    const classDetails = await prisma.class.findUnique({
      where: { id: classId },
      include: { bookings: true },
    })

    if (!classDetails) {
      throw new Error("Clase no encontrada")
    }

    const confirmedBookings = classDetails.bookings.filter(
      (booking) => booking.status === "confirmed"
    )

    if (confirmedBookings.length >= classDetails.maxCapacity) {
      throw new Error("La clase no tiene lugares disponibles")
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

    console.log("activePurchasedPackage", activePurchasedPackage)

    if (!activePurchasedPackage) {
      throw new Error("No tienes un paquete activo con clases disponibles")
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        userId: userId,
        classId: classId,
        purchasedPackageId: activePurchasedPackage.id,
        status: "confirmed",
      },
      include: {
        user: true, // Include user details in the response
      },
    })

    // Decrease the remaining classes in the purchased package
    await prisma.purchasedPackage.update({
      where: { id: activePurchasedPackage.id },
      data: {
        remainingClasses: {
          decrement: 1,
        },
      },
    })

    adminSelectedUserId
      ? revalidatePath("/admin/calendario")
      : revalidatePath("/calendario")
    return { success: true, booking }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "Ocurrió un error desconocido" }
  }
}

export async function getUserBookings() {
  const session = await auth()
  if (!session || !session.user) {
    throw new Error("Usuario no autenticado")
  }

  const userId = session.user.id

  const bookings = await prisma.booking.findMany({
    where: {
      userId: userId,
      status: "confirmed",
    },
    include: {
      class: {
        include: {
          category: true,
          subcategory: true,
        },
      },
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
    throw new Error("Usuario no autenticado")
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
      class: {
        include: {
          category: true,
          subcategory: true,
        },
      },
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
      throw new Error("Usuario no autenticado")
    }

    const userId = session.user.id

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { class: true },
    })

    if (!booking) {
      throw new Error("Reserva no encontrada")
    }

    if (booking.userId !== userId) {
      throw new Error("No tienes permiso para cancelar esta reserva")
    }

    const now = new Date()
    const classTime = new Date(booking.class.startTime)
    const twentyFourHoursBeforeClass = addHours(classTime, -24)

    if (isBefore(twentyFourHoursBeforeClass, now)) {
      throw new Error(
        "No puedes cancelar la reserva con menos de 24 horas de anticipación"
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
    return { success: false, error: "Ocurrió un error desconocido" }
  }
}

export async function deleteBooking(bookingId: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        purchasedPackage: true,
      },
    })

    if (!booking) {
      return { success: false, error: "No se encontró la reserva" }
    }

    // Start a transaction to handle both the booking deletion and package update
    const result = await prisma.$transaction(async (tx) => {
      // Delete the booking
      await tx.booking.delete({
        where: { id: bookingId },
      })

      // Update the remaining classes in the purchased package
      await tx.purchasedPackage.update({
        where: { id: booking.purchasedPackageId },
        data: {
          remainingClasses: {
            increment: 1,
          },
        },
      })
    })

    return { success: true }
  } catch (error) {
    console.error("Error borrando reserva:", error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error desconocido al borrar",
    }
  }
}
