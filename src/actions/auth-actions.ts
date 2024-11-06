"use server"

import { signIn } from "@/auth"
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/zod-schemas"
import { prisma } from "@/lib/prisma"
import { AuthError } from "next-auth"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { nanoid } from "nanoid"
import { sendPasswordResetEmail } from "@/lib/mail"

export const loginAction = async (values: z.infer<typeof loginSchema>) => {
  try {
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    })
    return { success: true }
  } catch (error: any) {
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message }
    }
    return { error: error.message }
  }
}

export const registerAction = async (
  values: z.infer<typeof registerSchema>
) => {
  try {
    const { data, success } = await registerSchema.safeParse(values)
    if (!success) {
      throw new Error("Credenciales inválidas")
    }

    // Use transaction for user creation
    const result = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { email: data.email },
      })

      if (existingUser) {
        throw new Error("Este email ya está registrado")
      }

      const hashedPassword = await bcrypt.hash(data.password, 10)

      return await tx.user.create({
        data: {
          name: data.name,
          surname: data.surname,
          email: data.email,
          phone: data.phone,
          password: hashedPassword,
        },
      })
    })

    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    return { success: true }
  } catch (error: any) {
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message }
    }
    return { error: error.message }
  }
}

export async function forgotPasswordAction(
  values: z.infer<typeof forgotPasswordSchema>
) {
  try {
    const { email } = values

    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { email },
      })

      if (!user) {
        throw new Error("No existe una cuenta con este email")
      }

      if (!user.password) {
        throw new Error(
          "Esta cuenta fue creada con Google. Por favor, inicia sesión con Google."
        )
      }

      const existingToken = await tx.passwordResetToken.findUnique({
        where: { identifier: email },
      })

      if (existingToken) {
        if (existingToken.expires > new Date()) {
          throw new Error(
            "Ya te enviamos un correo para restablecer tu contraseña. Por favor, revisa tu bandeja de entrada y carpeta de spam."
          )
        }
        await tx.passwordResetToken.delete({
          where: { identifier: email },
        })
      }

      const token = nanoid()
      const expires = new Date(Date.now() + 1000 * 60 * 60)

      await tx.passwordResetToken.create({
        data: {
          identifier: email,
          token,
          expires,
        },
      })

      const emailResult = await sendPasswordResetEmail(email, user.name, token)
      if (emailResult.error) {
        throw new Error(
          "Error al enviar el email. Por favor, intenta nuevamente."
        )
      }

      return { success: true }
    })
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function resetPasswordAction(
  token: string,
  values: z.infer<typeof resetPasswordSchema>
) {
  try {
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: { token },
    })

    if (!resetToken) {
      throw new Error("Token inválido")
    }

    if (resetToken.expires < new Date()) {
      throw new Error("Token expirado")
    }

    const hashedPassword = await bcrypt.hash(values.password, 10)

    // Use transaction for atomic operations
    await prisma.$transaction(async (tx) => {
      // Update user and delete token in parallel
      await Promise.all([
        tx.user.update({
          where: { email: resetToken.identifier },
          data: { password: hashedPassword },
        }),
        tx.passwordResetToken.delete({
          where: { identifier: resetToken.identifier },
        }),
      ])
    })

    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}
