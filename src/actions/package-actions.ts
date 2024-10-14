"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const packageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  classCount: z.coerce.number().min(1, "Class count must be at least 1"),
  price: z.coerce.number().min(0, "Price must be non-negative"),
  durationMonths: z.coerce.number().min(1, "Duration must be at least 1 day"),
})

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
    const newPackage = await prisma.classPackage.create({
      data: validatedFields.data,
    })
    revalidatePath("/admin/packages")
    return { success: true, package: newPackage }
  } catch (error) {
    return { error: "Failed to create package" }
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
    const updatedPackage = await prisma.classPackage.update({
      where: { id },
      data: validatedFields.data,
    })
    revalidatePath("/admin/packages")
    return { success: true, package: updatedPackage }
  } catch (error) {
    return { error: "Failed to update package" }
  }
}

export async function deletePackage(id: string) {
  try {
    await prisma.classPackage.delete({
      where: { id },
    })
    revalidatePath("/admin/packages")
    return { success: true }
  } catch (error) {
    return { error: "Failed to delete package" }
  }
}

export async function togglePackageStatus(id: string) {
  try {
    const classPackage = await prisma.classPackage.findUnique({ where: { id } })
    if (!classPackage) {
      return { error: "Package not found" }
    }
    const updatedPackage = await prisma.classPackage.update({
      where: { id },
      data: { isActive: !classPackage.isActive },
    })
    revalidatePath("/admin/packages")
    return { success: true, package: updatedPackage }
  } catch (error) {
    return { error: "Failed to toggle package status" }
  }
}
