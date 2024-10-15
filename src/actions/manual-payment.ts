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
        throw new Error(`Prisma error: ${error.message}`)
      } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        // Handle unknown Prisma errors
        throw new Error(`Unknown Prisma error: ${error.message}`)
      } else if (error instanceof Prisma.PrismaClientRustPanicError) {
        // Handle Prisma Rust panic errors
        throw new Error(`Prisma Rust panic error: ${error.message}`)
      } else if (error instanceof Prisma.PrismaClientInitializationError) {
        // Handle Prisma initialization errors
        throw new Error(`Prisma initialization error: ${error.message}`)
      } else if (error instanceof Prisma.PrismaClientValidationError) {
        // Handle Prisma validation errors
        throw new Error(`Prisma validation error: ${error.message}`)
      } else {
        // Handle any other errors
        throw new Error(`Unexpected error: ${(error as any).message}`)
      }
    }
  })
}
