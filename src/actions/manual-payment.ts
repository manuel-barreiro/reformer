"use server"

import { prisma } from "@/lib/prisma"
import { PackageStatus, Payment, PaymentType, Prisma } from "@prisma/client"

export async function createManualPayment(
  userId: string,
  classPackageId: string,
  total: number,
  paymentTypeId: string
): Promise<Payment> {
  return await prisma.$transaction(async (tx) => {
    try {
      // Find classPackage by ID
      const classPackage = await tx.classPackage.findUnique({
        where: { id: classPackageId },
      })

      if (!classPackage) {
        throw new Error("Class package not found")
      }

      // Calculate expiration date based on class package duration and current date
      const expirationDate = new Date()
      expirationDate.setMonth(
        expirationDate.getMonth() + classPackage.durationMonths
      )

      // Create the payment and purchasedPackage entries
      const paymentData = await tx.payment.create({
        data: {
          paymentType: PaymentType.manual,
          paymentId: `MANUAL_${Date.now()}`,
          dateCreated: new Date(),
          dateLastUpdated: new Date(),
          description: classPackage.name,
          total,
          status: "approved",
          statusDetail: "Pago Manual",
          paymentTypeId,
          user: {
            connect: { id: userId },
          },
          purchasedPackage: {
            create: {
              userId: userId,
              classPackageId: classPackage.id,
              remainingClasses: classPackage.classCount,
              expirationDate: expirationDate,
              status: PackageStatus.active,
            },
          },
        },
        include: {
          purchasedPackage: true,
        },
      })

      return paymentData
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle known Prisma errors
        throw new Error(`Error de Prisma: ${error.message}`)
      } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        // Handle unknown Prisma errors
        throw new Error(`Error desconocido de Prisma: ${error.message}`)
      } else if (error instanceof Prisma.PrismaClientRustPanicError) {
        // Handle Prisma Rust panic errors
        throw new Error(`Error de pánico de Prisma Rust: ${error.message}`)
      } else if (error instanceof Prisma.PrismaClientInitializationError) {
        // Handle Prisma initialization errors
        throw new Error(`Error de inicialización de Prisma: ${error.message}`)
      } else if (error instanceof Prisma.PrismaClientValidationError) {
        // Handle Prisma validation errors
        throw new Error(`Error de validación de Prisma: ${error.message}`)
      } else {
        // Handle any other errors
        throw new Error(`Error inesperado: ${(error as any).message}`)
      }
    }
  })
}
