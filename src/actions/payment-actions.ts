"use server"

import { prisma } from "@/lib/prisma"
import { Payment, User } from "@prisma/client"
import { revalidatePath } from "next/cache"

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
        dateLastUpdated: new Date(),
      },
    })

    revalidatePath("/admin/pagos")
    return updatedPayment
  } catch (error) {
    console.error("Error actualizando pago:", error)
    throw new Error("Error al actualizar pago")
  }
}

export async function deletePayment(paymentId: string): Promise<void> {
  try {
    // Start a transaction to ensure both operations succeed or fail together
    await prisma.$transaction(async (tx) => {
      // First, find and delete the associated PurchasedPackage if it exists
      const payment = await tx.payment.findUnique({
        where: { paymentId },
        include: { purchasedPackage: true },
      })

      if (payment?.purchasedPackage) {
        await tx.purchasedPackage.delete({
          where: { id: payment.purchasedPackage.id },
        })
      }

      // Then delete the payment
      await tx.payment.delete({
        where: { paymentId },
      })
    })

    revalidatePath("/admin/pagos")
  } catch (error) {
    console.error("Error borrando pago:", error)
    throw new Error("Error al borrar pago")
  }
}
