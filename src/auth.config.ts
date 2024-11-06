import { prisma } from "@/lib/prisma"
import { loginSchema } from "@/lib/zod-schemas"
import bcrypt from "bcryptjs"
import { nanoid } from "nanoid"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { sendEmailVerification } from "@/lib/mail"

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Google,
    Credentials({
      authorize: async (credentials) => {
        const { data, success } = loginSchema.safeParse(credentials)

        if (!success) {
          throw new Error("Invalid credentials")
        }

        // Get user with a single query
        const user = await prisma.user.findUnique({
          where: {
            email: data.email,
          },
        })

        if (!user) {
          throw new Error("Usuario no encontrado")
        } else if (!user.password) {
          throw new Error("Inicia sesión con Google")
        }

        const isValid = await bcrypt.compare(data.password, user.password)

        if (!isValid) {
          throw new Error("Contraseña incorrecta")
        }

        if (!user.emailVerified) {
          // Use transaction for token operations
          const token = nanoid()

          await prisma.$transaction(async (tx) => {
            // Delete existing token and create new one in a transaction
            await tx.verificationToken.deleteMany({
              where: {
                identifier: user.email,
              },
            })

            await tx.verificationToken.create({
              data: {
                identifier: user.email,
                token,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
              },
            })
          })

          await sendEmailVerification(user.email, user.name, token)
          throw new Error(
            "Por favor, revisa tu correo para verificar tu cuenta"
          )
        }

        return user
      },
    }),
  ],
} satisfies NextAuthConfig
