"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { ClassPackage } from "@prisma/client"

// Export the type definition
export type PackageResponse =
  | {
      success: true
      package: ClassPackage
    }
  | {
      success: false
      error: string | Record<string, string[]>
    }

export type SoftDeleteResponse =
  | {
      success: true
      package: { id: string; isActive: boolean; deletedAt: Date | null }
      isDeleted: true
    }
  | {
      success: false
      error: string
    }

const packageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  classCount: z.coerce.number().min(1, "Class count must be at least 1"),
  price: z.coerce.number().min(0, "Price must be non-negative"),
  durationMonths: z.coerce.number().min(1, "Duration must be at least 1 day"),
})

export async function getActiveClassPackages() {
  try {
    return await prisma.classPackage.findMany({
      where: {
        deletedAt: null,
        isActive: true,
      },
      orderBy: {
        classCount: "asc",
      },
    })
  } catch (error) {
    console.error("Error fetching active packages:", error)
    return []
  }
}

export async function getAllClassPackages() {
  try {
    return await prisma.classPackage.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        classCount: true,
        price: true,
        durationMonths: true,
        isActive: true,
        deletedAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        classCount: "asc",
      },
    })
  } catch (error) {
    console.error("Error fetching packages:", error)
    return []
  }
}

export async function createPackage(
  formData: FormData
): Promise<PackageResponse> {
  const validatedFields = packageSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    classCount: formData.get("classCount"),
    price: formData.get("price"),
    durationMonths: formData.get("durationMonths"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    const newPackage = await prisma.classPackage.create({
      data: validatedFields.data,
    })

    revalidatePath("/admin/paquetes")
    return { success: true, package: newPackage }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido"
    return { success: false, error: `Error al crear paquete: ${message}` }
  }
}

export async function updatePackage(
  id: string,
  formData: FormData
): Promise<PackageResponse> {
  const validatedFields = packageSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    classCount: formData.get("classCount"),
    price: formData.get("price"),
    durationMonths: formData.get("durationMonths"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    const updatedPackage = await prisma.classPackage.update({
      where: { id },
      data: validatedFields.data,
    })

    revalidatePath("/admin/paquetes")
    return { success: true, package: updatedPackage }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido"
    return { success: false, error: `Error al actualizar paquete: ${message}` }
  }
}

export async function softDeletePackage(
  id: string
): Promise<SoftDeleteResponse> {
  try {
    return await prisma.$transaction(async (tx) => {
      const deletedPackage = await tx.classPackage.update({
        where: { id },
        data: {
          isActive: false,
          deletedAt: new Date(),
        },
        select: {
          id: true,
          isActive: true,
          deletedAt: true,
        },
      })

      revalidatePath("/admin/paquetes")
      return { success: true, package: deletedPackage, isDeleted: true }
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido"
    return { success: false, error: `Error al eliminar paquete: ${message}` }
  }
}

export async function togglePackageStatus(
  id: string
): Promise<PackageResponse> {
  // Changed from ActionResponse to PackageResponse
  try {
    const currentPackage = await prisma.classPackage.findUnique({
      where: { id },
      select: { isActive: true },
    })

    if (!currentPackage) {
      return { success: false, error: "Package not found" }
    }

    const updatedPackage = await prisma.classPackage.update({
      where: { id },
      data: {
        isActive: !currentPackage.isActive,
      },
    })

    revalidatePath("/admin/paquetes")
    return { success: true, package: updatedPackage }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido"
    return { success: false, error: `Error al cambiar el status: ${message}` }
  }
}
