"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Role, User } from "@prisma/client"

const updateUserSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  surname: z.string().optional().nullable(),
  email: z.string().email("Email inválido"),
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

    // Check if email is being changed and if it's already in use
    if (userData.email) {
      const existingUserWithEmail = await prisma.user.findFirst({
        where: {
          email: userData.email,
          id: {
            not: userId,
          },
        },
      })

      if (existingUserWithEmail) {
        throw new Error("El email ya está en uso por otro usuario")
      }
    }

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
