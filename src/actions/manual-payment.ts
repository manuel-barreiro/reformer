"use server"

import { prisma } from "@/lib/prisma"
import { Payment, PurchasedPackage, User } from "@prisma/client"

export async function createManualPayment(
  userId: string,
  classPackageId: string,
  total: number,
  paymentTypeId: string
): Promise<Payment> {
  return prisma.$transaction(async (tx) => {
    const classPackage = await tx.classPackage.findUnique({
      where: { id: classPackageId },
    })

    if (!classPackage) {
      throw new Error("Class package not found")
    }

    const payment = await tx.payment.create({
      data: {
        paymentId: `MANUAL_${Date.now()}`,
        dateCreated: new Date(),
        dateLastUpdated: new Date(),
        description: `Manual payment for ${classPackage.name}`,
        total,
        status: "approved",
        statusDetail: "Manual payment",
        paymentTypeId,
        userId,
      },
    })

    const purchasedPackage = await tx.purchasedPackage.create({
      data: {
        userId,
        classPackageId,
        remainingClasses: classPackage.classCount,
        expirationDate: new Date(
          Date.now() + classPackage.durationMonths * 30 * 24 * 60 * 60 * 1000
        ),
        paymentId: payment.id,
        status: "active",
      },
    })

    return payment
  })
}

export async function searchUsers(searchTerm: string): Promise<User[]> {
  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { surname: { contains: searchTerm, mode: "insensitive" } },
          { email: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      take: 5,
    })
    console.log(searchTerm, users)
    return users
  } catch (error) {
    console.error("Error in searchUsers:", error)
    return [] // Return an empty array instead of undefinedA
  }
}
