import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")

  if (!token) {
    return new Response("Token not provided", { status: 400 })
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const verifyToken = await tx.verificationToken.findFirst({
        where: { token },
        select: {
          identifier: true,
          expires: true,
        },
      })

      if (!verifyToken) {
        throw new Error("Token not found")
      }

      if (verifyToken.expires < new Date()) {
        throw new Error("Token expired")
      }

      const user = await tx.user.findUnique({
        where: { email: verifyToken.identifier },
        select: { emailVerified: true },
      })

      if (user?.emailVerified) {
        throw new Error("Email already verified")
      }

      // Update user and delete token atomically
      await tx.user.update({
        where: { email: verifyToken.identifier },
        data: { emailVerified: new Date() },
      })

      await tx.verificationToken.delete({
        where: { identifier: verifyToken.identifier },
      })
    })

    redirect("/sign-in?verified=true")
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Verification failed"
    return new Response(message, { status: 400 })
  }
}
