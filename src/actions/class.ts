"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Class } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { addDays, isBefore, parse, addWeeks, isAfter, set } from "date-fns"
import { toZonedTime } from "date-fns-tz"

const classSchema = z.object({
  category: z.enum(["YOGA", "PILATES"]),
  type: z.enum([
    "VINYASA",
    "HATHA",
    "BALANCE",
    "STRENGTH_CORE",
    "LOWER_BODY",
    "FULL_BODY",
  ]),
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
  const timeZone = "America/Argentina/Buenos_Aires"

  try {
    const validatedData = classSchema.parse(data)
    const classInstances: Array<any> = []

    // Parse base date and create a Date object in the correct timezone
    const baseDate = parse(validatedData.date, "yyyy-MM-dd", new Date())
    const baseDateInZone = toZonedTime(baseDate, timeZone)

    // Function to create a datetime in the correct timezone
    const createZonedDateTime = (date: Date, timeString: string) => {
      const [hours, minutes] = timeString.split(":").map(Number)
      const dateTime = set(date, {
        hours,
        minutes,
        seconds: 0,
        milliseconds: 0,
      })
      return toZonedTime(dateTime, timeZone)
    }

    // Calculate dates for horizontal repetition (within week)
    const horizontalDates: Date[] = []
    if (validatedData.repeatDaily && validatedData.repeatUntil) {
      const endDate = parse(validatedData.repeatUntil, "yyyy-MM-dd", new Date())
      const endDateInZone = toZonedTime(endDate, timeZone)
      let currentDate = baseDateInZone

      while (
        isBefore(currentDate, endDateInZone) ||
        currentDate.getTime() === endDateInZone.getTime()
      ) {
        horizontalDates.push(currentDate)
        currentDate = toZonedTime(addDays(currentDate, 1), timeZone)
      }
    } else {
      horizontalDates.push(baseDateInZone)
    }

    // Calculate vertical repetition (weeks)
    const numberOfWeeks = validatedData.repeatWeekly
      ? validatedData.repeatWeeks || 1
      : 1

    // Generate all class instances
    for (let week = 0; week < numberOfWeeks; week++) {
      for (const date of horizontalDates) {
        const weeklyDate = toZonedTime(addWeeks(date, week), timeZone)

        // Don't schedule classes more than 3 months in advance
        if (isAfter(weeklyDate, addWeeks(new Date(), 12))) continue

        // Create start and end times in the correct timezone
        const startTime = createZonedDateTime(
          weeklyDate,
          validatedData.startTime
        )
        const endTime = createZonedDateTime(weeklyDate, validatedData.endTime)

        const classData = {
          category: validatedData.category,
          type: validatedData.type,
          date: weeklyDate,
          startTime,
          endTime,
          instructor: validatedData.instructor,
          maxCapacity: validatedData.maxCapacity,
        }

        const newClass = await prisma.class.create({
          data: classData,
        })

        classInstances.push(newClass)
      }
    }

    revalidatePath("/admin/calendario")
    return {
      success: true,
      data: classInstances,
      count: classInstances.length,
    }
  } catch (error) {
    console.error("Error creating classes:", error)
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid data provided",
        details: error.errors,
      }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "Failed to create classes" }
  }
}

export async function getClasses(startDate: Date, endDate: Date) {
  try {
    const classes = await prisma.class.findMany({
      where: {
        AND: [{ startTime: { gte: startDate } }, { endTime: { lte: endDate } }],
      },
      include: {
        bookings: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        }, // Include bookings to show capacity
      },
      orderBy: {
        startTime: "asc",
      },
    })

    return classes
  } catch (error) {
    console.error("Error fetching classes:", error)
    return []
  }
}

export async function deleteClass(classId: string) {
  try {
    // Start a transaction to handle both the class deletion and package refunds
    await prisma.$transaction(async (tx) => {
      // Get all confirmed bookings for this class to handle package refunds
      const confirmedBookings = await tx.booking.findMany({
        where: {
          classId: classId,
          status: "confirmed",
        },
        include: {
          purchasedPackage: true,
        },
      })

      // Refund classes back to active packages
      for (const booking of confirmedBookings) {
        if (booking.purchasedPackageId) {
          await tx.purchasedPackage.update({
            where: {
              id: booking.purchasedPackageId,
            },
            data: {
              remainingClasses: {
                increment: 1,
              },
            },
          })
        }
      }

      // Delete all bookings associated with this class
      await tx.booking.deleteMany({
        where: { classId: classId },
      })

      // Delete the class
      await tx.class.delete({
        where: { id: classId },
      })
    })

    revalidatePath("/admin/calendario")
    return { success: true }
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
    })

    if (!currentClass) {
      throw new Error("Class not found")
    }

    const updatedClass = await prisma.class.update({
      where: { id: classId },
      data: { isActive: !currentClass.isActive },
    })

    revalidatePath("/admin/calendario")
    return { success: true, data: updatedClass }
  } catch (error) {
    console.error("Error toggling class lock:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    }
  }
}

export async function updateClass(classId: string, data: Partial<Class>) {
  const timeZone = "America/Argentina/Buenos_Aires"

  try {
    // Convertir las fechas a la zona horaria correcta si están presentes en los datos
    const updatedData = { ...data }
    if (data.date) {
      updatedData.date = toZonedTime(new Date(data.date), timeZone)
    }
    if (data.startTime) {
      updatedData.startTime = toZonedTime(new Date(data.startTime), timeZone)
    }
    if (data.endTime) {
      updatedData.endTime = toZonedTime(new Date(data.endTime), timeZone)
    }

    const updatedClass = await prisma.class.update({
      where: { id: classId },
      data: updatedData,
      include: {
        bookings: true,
      },
    })

    return { success: true, data: updatedClass }
  } catch (error) {
    console.error("Error updating class:", error)
    return { success: false, error: "Failed to update class" }
  }
}
