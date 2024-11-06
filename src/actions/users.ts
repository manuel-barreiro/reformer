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
    const validatedData = updateUserSchema.parse(userData)

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
    })

    revalidatePath("/admin/users")
    return updatedUser
  } catch (error) {
    const message =
      error instanceof z.ZodError
        ? error.errors.map((err) => err.message).join(", ")
        : error instanceof Error
          ? error.message
          : "Error inesperado"

    throw new Error(`Error actualizando usuario: ${message}`)
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
    const utcDate = localToUTC(validatedData.expirationDate, "00:00")

    return await prisma.$transaction(async (tx) => {
      const updatedPackage = await tx.purchasedPackage.update({
        where: { id: packageId },
        data: {
          remainingClasses: validatedData.remainingClasses,
          expirationDate: utcDate,
          updatedAt: new Date(),
        },
      })

      revalidatePath("/admin/users")
      return updatedPackage
    })
  } catch (error) {
    const message =
      error instanceof z.ZodError
        ? error.errors.map((err) => err.message).join(", ")
        : error instanceof Error
          ? error.message
          : "Error inesperado"

    throw new Error(`Error actualizando paquete: ${message}`)
  }
}

export async function getUserPackages(userId: string) {
  try {
    return await prisma.purchasedPackage.findMany({
      where: { userId },
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
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error inesperado"
    throw new Error(`Error obteniendo paquetes: ${message}`)
  }
}
