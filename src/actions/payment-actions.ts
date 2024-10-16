"use server"

import { prisma } from "@/lib/prisma"
import { Payment, User } from "@prisma/client"

export async function getPayments(): Promise<(Payment & { user: User })[]> {
  return await prisma.payment.findMany({
    include: {
      user: true,
      purchasedPackage: {
        include: {
          classPackage: true,
        },
      },
    },
    orderBy: {
      dateCreated: "desc",
    },
  })
}

export async function updatePayment(
  paymentId: string,
  newStatus: string,
  newPaymentMethod: string
): Promise<Payment> {
  try {
    const updatedPayment = await prisma.payment.update({
      where: { paymentId: paymentId },
      data: {
        status: newStatus,
        paymentTypeId: newPaymentMethod,
        dateLastUpdated: new Date(), // Update the last modified date
      },
    })

    return updatedPayment
  } catch (error) {
    console.error("Error updating payment:", error)
    throw new Error("Failed to update payment")
  }
}
