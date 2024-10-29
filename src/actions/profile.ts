"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  surname: z.string().optional(),
  phone: z.string().optional(),
})

export async function updateProfile(
  userId: string,
  data: z.infer<typeof updateProfileSchema>
) {
  try {
    const validatedData = updateProfileSchema.parse(data)

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: validatedData.name,
        surname: validatedData.surname,
        phone: validatedData.phone,
      },
    })

    revalidatePath("/mi-perfil")
    return { success: true, data: updatedUser }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Datos inválidos" }
    }
    return { success: false, error: "Error al actualizar perfil" }
  }
}

export async function getProfile(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      surname: true,
      phone: true,
      email: true,
    },
  })
}
