"use server"

import { prisma } from "@/lib/prisma"
import { PurchasedPackage, ClassPackage } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { localToUTC } from "@/lib/timezone-utils"

interface AssignPackageInput {
  userId: string
  classPackageId: string
  expirationDate: string
}

interface UpdatePackageInput {
  remainingClasses: number
  expirationDate: string
}

export type PurchasedPackageWithClassPackage = PurchasedPackage & {
  classPackage: ClassPackage
}

export async function getUserPackages(
  id: string
): Promise<PurchasedPackageWithClassPackage[]> {
  const userPurchasedPackages = await prisma.purchasedPackage.findMany({
    where: {
      userId: id,
    },
    include: {
      classPackage: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return userPurchasedPackages
}

export async function assignPackage(
  userId: string,
  data: { classPackageId: string; expirationDate: string }
) {
  try {
    const classPackage = await prisma.classPackage.findUnique({
      where: { id: data.classPackageId },
    })

    if (!classPackage) {
      throw new Error("Package not found")
    }

    // Convert local date to UTC for storage
    // Since we don't have a time component, we'll use end of day
    const utcExpirationDate = localToUTC(data.expirationDate, "23:59")

    const purchasedPackage = await prisma.purchasedPackage.create({
      data: {
        userId: userId,
        classPackageId: data.classPackageId,
        remainingClasses: classPackage.classCount,
        expirationDate: utcExpirationDate,
        status: "active",
      },
      include: {
        classPackage: true,
      },
    })

    revalidatePath(`/admin/usuarios/${userId}`)
    return { success: true, data: purchasedPackage }
  } catch (error) {
    console.error("Error assigning package:", error)
    return { success: false, error: "Failed to assign package" }
  }
}

export async function updatePackage(
  packageId: string,
  data: UpdatePackageInput
) {
  try {
    // Convert local date to UTC for storage
    // Since we don't have a time component, we'll use end of day
    const utcExpirationDate = localToUTC(data.expirationDate, "23:59")

    const updatedPackage = await prisma.purchasedPackage.update({
      where: { id: packageId },
      data: {
        remainingClasses: data.remainingClasses,
        expirationDate: utcExpirationDate,
      },
      include: {
        classPackage: true,
      },
    })

    revalidatePath(`/admin/usuarios/${updatedPackage.userId}`)
    return { success: true, data: updatedPackage }
  } catch (error) {
    console.error("Error updating package:", error)
    return { success: false, error: "Failed to update package" }
  }
}

export async function deletePackage(packageId: string) {
  try {
    // First, get the package to get the userId for revalidation
    const packageToDelete = await prisma.purchasedPackage.findUnique({
      where: { id: packageId },
      select: { userId: true },
    })

    if (!packageToDelete) {
      throw new Error("Package not found")
    }

    // Delete the package and all associated bookings in a transaction
    await prisma.$transaction([
      // Delete all associated bookings first
      prisma.booking.deleteMany({
        where: { purchasedPackageId: packageId },
      }),
      // Then delete the package itself
      prisma.purchasedPackage.delete({
        where: { id: packageId },
      }),
    ])

    revalidatePath(`/admin/usuarios/${packageToDelete.userId}`)
    return { success: true, data: packageToDelete }
  } catch (error) {
    console.error("Error al borrar paquete:", error)
    return { success: false, error: "Error al borrar paquete" }
  }
}
