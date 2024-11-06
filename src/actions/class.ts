"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Class } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { addDays, addWeeks, isAfter } from "date-fns"
import { formatLocalDate, localToUTC } from "@/lib/timezone-utils"

const classSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  subcategoryId: z.string().min(1, "Subcategory is required"),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  instructor: z.string().min(1),
  maxCapacity: z.number().int().positive(),
  repeatDaily: z.boolean().default(false),
  repeatUntil: z.string().optional(),
  repeatWeekly: z.boolean().default(false),
  repeatWeeks: z.number().min(1).max(12).optional(),
})

export type ClassFormData = z.infer<typeof classSchema>

// Function to validate admin role
async function validateAdmin() {
  const session = await auth()
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized")
  }
}

export async function createClass(data: ClassFormData) {
  await validateAdmin()

  try {
    const validatedData = classSchema.parse(data)
    const classPromises: Promise<any>[] = []

    const baseDate = localToUTC(validatedData.date, "00:00")
    const horizontalDates: Date[] = []

    if (validatedData.repeatDaily && validatedData.repeatUntil) {
      const endDate = localToUTC(validatedData.repeatUntil, "00:00")
      let currentDate = baseDate
      while (currentDate <= endDate) {
        horizontalDates.push(currentDate)
        currentDate = addDays(currentDate, 1)
      }
    } else {
      horizontalDates.push(baseDate)
    }

    const weeks = validatedData.repeatWeekly
      ? validatedData.repeatWeeks || 1
      : 1

    // Use transaction for bulk insert
    const classInstances = await prisma.$transaction(async (tx) => {
      const instances = []

      for (let week = 0; week < weeks; week++) {
        for (const date of horizontalDates) {
          const weeklyDate = addWeeks(date, week)
          const startTime = localToUTC(
            formatLocalDate(weeklyDate),
            validatedData.startTime
          )
          const endTime = localToUTC(
            formatLocalDate(weeklyDate),
            validatedData.endTime
          )

          const classData = {
            categoryId: validatedData.categoryId,
            subcategoryId: validatedData.subcategoryId,
            date: weeklyDate,
            startTime,
            endTime,
            instructor: validatedData.instructor,
            maxCapacity: validatedData.maxCapacity,
          }

          instances.push(tx.class.create({ data: classData }))
        }
      }

      return await Promise.all(instances)
    })

    revalidatePath("/admin/calendario")
    return { success: true, data: classInstances, count: classInstances.length }
  } catch (error) {
    console.error("Error creando las clases:", error)
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Datos inválidos",
        details: error.errors,
      }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "Falló la creación de clases" }
  }
}

export async function getClasses(startDate: Date, endDate: Date) {
  try {
    // Single query with all includes
    return await prisma.class.findMany({
      where: {
        AND: [{ startTime: { gte: startDate } }, { endTime: { lte: endDate } }],
      },
      include: {
        category: true,
        subcategory: true,
        bookings: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    })
  } catch (error) {
    console.error("Error al buscar clases:", error)
    return []
  }
}

export async function deleteClass(classId: string) {
  try {
    return await prisma.$transaction(async (tx) => {
      const [confirmedBookings, deleteBookings, deleteClass] =
        await Promise.all([
          tx.booking.findMany({
            where: {
              classId: classId,
              status: "confirmed",
            },
            include: {
              purchasedPackage: true,
            },
          }),
          tx.booking.deleteMany({
            where: { classId: classId },
          }),
          tx.class.delete({
            where: { id: classId },
          }),
        ])

      // Process refunds if needed
      if (confirmedBookings.length > 0) {
        await Promise.all(
          confirmedBookings
            .map((booking) =>
              booking.purchasedPackageId
                ? tx.purchasedPackage.update({
                    where: { id: booking.purchasedPackageId },
                    data: { remainingClasses: { increment: 1 } },
                  })
                : null
            )
            .filter(Boolean)
        )
      }

      revalidatePath("/admin/calendario")
      return { success: true }
    })
  } catch (error) {
    console.error("Error al eliminar clase", error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error desconocido al borrar",
    }
  }
}

// New function to toggle class visibility
export async function toggleClassLock(classId: string) {
  try {
    const currentClass = await prisma.class.findUnique({
      where: { id: classId },
      select: { isActive: true },
    })

    if (!currentClass) {
      throw new Error("Class not found")
    }

    const updatedClass = await prisma.class.update({
      where: { id: classId },
      data: {
        isActive: !currentClass.isActive,
      },
    })

    revalidatePath("/admin/calendario")
    return { success: true, data: updatedClass }
  } catch (error) {
    console.error("Error al cambiar el status de la clase:", error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al cambiar el status de la clase",
    }
  }
}

export async function updateClass(classId: string, data: Partial<Class>) {
  try {
    const updatedClass = await prisma.class.update({
      where: { id: classId },
      data: {
        ...data,
      },
      include: {
        bookings: true,
      },
    })

    revalidatePath("/admin/calendario")
    return { success: true, data: updatedClass }
  } catch (error) {
    console.error("Error actualizando clase:", error)
    return { success: false, error: "Error al actualizar clase" }
  }
}
