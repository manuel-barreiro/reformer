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
      // Get only needed fields from classPackage
      const classPackage = await tx.classPackage.findFirst({
        where: { id: classPackageId },
        select: {
          id: true,
          name: true,
          classCount: true,
          durationMonths: true,
        },
      })

      if (!classPackage) {
        throw new Error("Class package not found")
      }

      const expirationDate = new Date()
      expirationDate.setMonth(
        expirationDate.getMonth() + classPackage.durationMonths
      )

      // Create payment and purchasedPackage in a single operation
      return await tx.payment.create({
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
          user: { connect: { id: userId } },
          purchasedPackage: {
            create: {
              userId,
              classPackageId: classPackage.id,
              remainingClasses: classPackage.classCount,
              expirationDate,
              status: PackageStatus.active,
            },
          },
        },
        include: {
          purchasedPackage: true,
        },
      })
    } catch (error) {
      // Simplified error handling
      const message =
        error instanceof Error ? error.message : "Unknown error occurred"
      throw new Error(`Payment creation failed: ${message}`)
    }
  })
}
