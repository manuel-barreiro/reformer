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
    // Validate the data server-side
    const { data, success } = await registerSchema.safeParse(values)
    if (!success) {
      throw new Error("Invalid credentials")
    }

    // Check if the user already exists
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    })

    if (user) {
      throw new Error("Email already in use")
    }

    // logic to salt and hash password
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // Create the user in the database
    await prisma.user.create({
      data: {
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
      },
    })

    // Log in the user
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

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new Error("No existe una cuenta con este email")
    }

    // Check if user has a password (if not, they registered with Google)
    if (!user.password) {
      throw new Error(
        "Esta cuenta fue creada con Google. Por favor, inicia sesión con Google."
      )
    }

    // Check if there's an existing valid token
    const existingToken = await prisma.passwordResetToken.findUnique({
      where: { identifier: email },
    })

    if (existingToken) {
      if (existingToken.expires > new Date()) {
        throw new Error(
          "Ya te enviamos un correo para restablecer tu contraseña. Por favor, revisa tu bandeja de entrada y carpeta de spam."
        )
      }
      // If token exists but is expired, delete it
      await prisma.passwordResetToken.delete({
        where: { identifier: email },
      })
    }

    // Generate reset token
    const token = nanoid()
    const expires = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

    // Save token in database
    await prisma.passwordResetToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    })

    // Send reset email
    await sendPasswordResetEmail(email, user.name, token)

    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}
export async function resetPasswordAction(
  token: string,
  values: z.infer<typeof resetPasswordSchema>
) {
  try {
    // Validate token
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: { token },
    })

    if (!resetToken) {
      throw new Error("Token inválido")
    }

    if (resetToken.expires < new Date()) {
      throw new Error("Token expirado")
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(values.password, 10)

    // Update user password
    await prisma.user.update({
      where: { email: resetToken.identifier },
      data: { password: hashedPassword },
    })

    // Delete used token
    await prisma.passwordResetToken.delete({
      where: { identifier: resetToken.identifier },
    })

    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}
