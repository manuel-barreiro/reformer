"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { addHours, isBefore } from "date-fns"

type SuccessResponse<T = void> = {
  success: true
  data?: T
  booking?: any
}

type ErrorResponse = {
  success: false
  error: string
}

type ActionResponse<T = void> = SuccessResponse<T> | ErrorResponse

export async function bookClass(
  classId: string,
  adminSelectedUserId?: string
): Promise<ActionResponse> {
  try {
    const session = await auth()
    if (!session || !session.user) {
      throw new Error("Usuario no autenticado")
    }

    const userId = adminSelectedUserId || session.user.id
    if (!userId) {
      throw new Error("ID de usuario no encontrado")
    }

    return await prisma.$transaction(async (tx) => {
      const [existingBooking, classDetails, activePurchasedPackage] =
        await Promise.all([
          tx.booking.findFirst({
            where: {
              userId: userId,
              classId: classId,
              status: "confirmed",
            },
          }),
          tx.class.findUnique({
            where: { id: classId },
            include: { bookings: true },
          }),
          tx.purchasedPackage.findFirst({
            where: {
              userId: userId,
              remainingClasses: { gt: 0 },
              status: "active",
              expirationDate: { gte: new Date() },
            },
            orderBy: { expirationDate: "asc" },
          }),
        ])

      if (existingBooking) {
        throw new Error("Ya tienes una reserva confirmada para esta clase")
      }

      if (!classDetails) {
        throw new Error("Clase no encontrada")
      }

      const confirmedBookings = classDetails.bookings.filter(
        (booking) => booking.status === "confirmed"
      )

      if (confirmedBookings.length >= classDetails.maxCapacity) {
        throw new Error("La clase no tiene lugares disponibles")
      }

      if (!activePurchasedPackage) {
        throw new Error("No tienes un paquete activo con clases disponibles")
      }

      const booking = await tx.booking.create({
        data: {
          userId: userId,
          classId: classId,
          purchasedPackageId: activePurchasedPackage.id,
          status: "confirmed",
        },
        include: {
          user: true,
        },
      })

      await tx.purchasedPackage.update({
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
    })
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

  // No need for transaction here since it's a single read operation
  return await prisma.booking.findMany({
    where: {
      userId: session.user.id,
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
}

export async function getUserBookingsInRange(startDate: Date, endDate: Date) {
  const session = await auth()
  if (!session || !session.user) {
    throw new Error("Usuario no autenticado")
  }

  // No need for transaction here since it's a single read operation
  return await prisma.booking.findMany({
    where: {
      userId: session.user.id,
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
}

export async function cancelBooking(
  bookingId: string
): Promise<ActionResponse> {
  try {
    const session = await auth()
    if (!session || !session.user) {
      throw new Error("Usuario no autenticado")
    }

    return await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: { class: true },
      })

      if (!booking) {
        throw new Error("Reserva no encontrada")
      }

      if (booking.userId !== session.user.id) {
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

      // Execute both operations in parallel within the transaction
      await Promise.all([
        tx.booking.update({
          where: { id: bookingId },
          data: { status: "cancelled" },
        }),
        tx.purchasedPackage.update({
          where: { id: booking.purchasedPackageId },
          data: {
            remainingClasses: {
              increment: 1,
            },
          },
        }),
      ])

      revalidatePath("/reservas")
      return { success: true }
    })
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "Ocurrió un error desconocido" }
  }
}

export async function deleteBooking(bookingId: string) {
  try {
    return await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: {
          purchasedPackage: true,
        },
      })

      if (!booking) {
        throw new Error("No se encontró la reserva")
      }

      // Execute both operations in parallel within the transaction
      await Promise.all([
        tx.booking.delete({
          where: { id: bookingId },
        }),
        tx.purchasedPackage.update({
          where: { id: booking.purchasedPackageId },
          data: {
            remainingClasses: {
              increment: 1,
            },
          },
        }),
      ])

      return { success: true }
    })
  } catch (error) {
    console.error("Error borrando reserva:", error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error desconocido al borrar",
    }
  }
}
