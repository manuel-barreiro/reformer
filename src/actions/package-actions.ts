"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { ClassPackage } from "@prisma/client"

// Update type definition to use Partial
type ActionResponse<T> = { success: true; package: T } | { error: string }

type SoftDeleteResponse =
  | {
      success: boolean
      package: { id: string; isActive: boolean; deletedAt: Date | null }
      isDeleted: boolean
    }
  | { error: string }

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
      select: {
        id: true,
        name: true,
        description: true,
        classCount: true,
        price: true,
        durationMonths: true,
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

export async function createPackage(formData: FormData) {
  const validatedFields = packageSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    classCount: formData.get("classCount"),
    price: formData.get("price"),
    durationMonths: formData.get("durationMonths"),
  })

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors }
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const newPackage = await tx.classPackage.create({
        data: validatedFields.data,
        select: {
          id: true,
          name: true,
          description: true,
          classCount: true,
          price: true,
          durationMonths: true,
          isActive: true,
        },
      })

      revalidatePath("/admin/paquetes")
      return { success: true, package: newPackage }
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido"
    return { error: `Error al crear paquete: ${message}` }
  }
}

export async function updatePackage(id: string, formData: FormData) {
  const validatedFields = packageSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    classCount: formData.get("classCount"),
    price: formData.get("price"),
    durationMonths: formData.get("durationMonths"),
  })

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors }
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const updatedPackage = await tx.classPackage.update({
        where: { id },
        data: validatedFields.data,
        select: {
          id: true,
          name: true,
          description: true,
          classCount: true,
          price: true,
          durationMonths: true,
          isActive: true,
        },
      })

      revalidatePath("/admin/paquetes")
      return { success: true, package: updatedPackage }
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido"
    return { error: `Error al actualizar paquete: ${message}` }
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
    return { error: `Error al eliminar paquete: ${message}` }
  }
}

export async function togglePackageStatus(
  id: string
): Promise<ActionResponse<ClassPackage>> {
  try {
    const currentPackage = await prisma.classPackage.findUnique({
      where: { id },
      select: { isActive: true },
    })

    if (!currentPackage) {
      throw new Error("Package not found")
    }

    const updatedPackage = await prisma.classPackage.update({
      where: { id },
      data: {
        isActive: !currentPackage.isActive,
      },
      // Include all fields from ClassPackage
      include: {
        // This will return all fields without having to list them explicitly
        _count: false,
      },
    })

    revalidatePath("/admin/paquetes")
    return { success: true, package: updatedPackage }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido"
    return { error: `Error al cambiar el status: ${message}` }
  }
}
