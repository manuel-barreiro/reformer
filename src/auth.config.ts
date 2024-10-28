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

        // verificar si existe el usuario en la base de datos
        const user = await prisma.user.findUnique({
          where: {
            email: data.email,
          },
        })

        if (!user) {
          throw new Error("No user found")
        } else if (!user.password) {
          throw new Error("Log in wih Google")
        }

        // verificar si la contraseña es correcta
        const isValid = await bcrypt.compare(data.password, user.password)

        if (!isValid) {
          throw new Error("Incorrect password")
        }

        // verificación de email
        if (!user.emailVerified) {
          const verifyTokenExits = await prisma.verificationToken.findFirst({
            where: {
              identifier: user.email,
            },
          })

          // si existe un token, lo eliminamos
          if (verifyTokenExits?.identifier) {
            await prisma.verificationToken.delete({
              where: {
                identifier: user.email,
              },
            })
          }

          const token = nanoid()

          await prisma.verificationToken.create({
            data: {
              identifier: user.email,
              token,
              expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
            },
          })

          // enviar email de verificación
          await sendEmailVerification(user.email, user.name, token)

          throw new Error("Please check your email to verify your account")
        }

        return user
      },
    }),
  ],
} satisfies NextAuthConfig
