"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { PurchasedPackage, Role, User } from "@prisma/client"
import { localToUTC } from "@/lib/timezone-utils"

const updateUserSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  surname: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  role: z.enum([Role.user, Role.admin]),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>

export async function updateUser(
  userId: string,
  userData: UpdateUserInput
): Promise<User> {
  try {
    // Validate input data
    const validatedData = updateUserSchema.parse(userData)

    // Update user
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
    })

    // Revalidate the users page to show updated data
    revalidatePath("/admin/users")

    return updatedUser
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => err.message).join(", ")
      throw new Error(`Error de validación: ${errorMessages}`)
    }

    if (error instanceof Error) {
      throw new Error(`Error actualizando usuario: ${error.message}`)
    }

    throw new Error("Error inesperado actualizando usuario")
  }
}

// This one is used to modify the remainingClasses and expirationDate of a purchased package in the user detail modal
const updatePackageSchema = z.object({
  remainingClasses: z.number().min(0),
  expirationDate: z.string(),
})

export type UpdatePackageInput = z.infer<typeof updatePackageSchema>

export async function updatePackage(
  packageId: string,
  packageData: UpdatePackageInput
): Promise<PurchasedPackage> {
  try {
    const validatedData = updatePackageSchema.parse(packageData)
    // Convert the local date string to UTC Date object
    const utcDate = localToUTC(validatedData.expirationDate, "00:00")

    const updatedPackage = await prisma.purchasedPackage.update({
      where: {
        id: packageId,
      },
      data: {
        remainingClasses: validatedData.remainingClasses,
        expirationDate: utcDate,
        updatedAt: new Date(),
      },
    })

    revalidatePath("/admin/users")
    return updatedPackage
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => err.message).join(", ")
      throw new Error(`Validation error: ${errorMessages}`)
    }

    if (error instanceof Error) {
      throw new Error(`Error updating package: ${error.message}`)
    }

    throw new Error("Unexpected error updating package")
  }
}

export async function getUserPackages(userId: string) {
  try {
    const packages = await prisma.purchasedPackage.findMany({
      where: {
        userId: userId,
      },
      include: {
        classPackage: {
          select: {
            name: true,
            classCount: true,
            durationMonths: true,
          },
        },
        payment: {
          select: {
            total: true,
            status: true,
            dateCreated: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return packages
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error obteniendo paquetes: ${error.message}`)
    }
    throw new Error("Error inesperado obteniendo paquetes")
  }
}
