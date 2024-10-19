"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Class } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"

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
  date: z.date(),
  startTime: z.date(),
  endTime: z.date(),
  instructor: z.string().min(1),
  maxCapacity: z.number().int().positive(),
})

export type ClassFormData = z.infer<typeof classSchema>

// Function to validate admin role
async function validateAdmin() {
  const session = await auth()
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized")
  }
  console.log("User is admin")
}

export async function createClass(data: ClassFormData) {
  console.log("Received data:", data)
  await validateAdmin()

  try {
    const validatedData = classSchema.parse(data)
    console.log("Validated data:", validatedData)

    const newClass = await prisma.class.create({
      data: validatedData,
    })

    console.log("Created class:", newClass)

    revalidatePath("/admin/calendario")
    return { success: true, data: newClass }
  } catch (error) {
    console.error("Error creating class:", error)
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
    return { success: false, error: "Failed to create class" }
  }
}

export async function getClasses(startDate: Date, endDate: Date) {
  try {
    const classes = await prisma.class.findMany({
      where: {
        AND: [
          { startTime: { gte: startDate } },
          { endTime: { lte: endDate } },
          { isActive: true },
        ],
      },
      include: {
        bookings: true, // Include bookings to show capacity
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
    await prisma.class.update({
      where: { id: classId },
      data: { isActive: false },
    })

    return { success: true }
  } catch (error) {
    console.error("Error deleting class:", error)
    return { success: false, error: "Failed to delete class" }
  }
}

export async function updateClass(classId: string, data: Partial<Class>) {
  try {
    const updatedClass = await prisma.class.update({
      where: { id: classId },
      data,
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
