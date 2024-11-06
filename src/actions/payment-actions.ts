"use server"

import { prisma } from "@/lib/prisma"
import { Payment, User } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { deletePackage } from "./purchased-packages"

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
    await prisma.$transaction(async (tx) => {
      // First, find the purchasedPackage associated with this payment
      const purchasedPackage = await tx.purchasedPackage.findFirst({
        where: { paymentId },
      })

      if (purchasedPackage) {
        console.log(`Found purchasedPackage: ${purchasedPackage.id}`)

        // Use the deletePackage function to delete the package and its associated bookings
        await deletePackage(purchasedPackage.id)
      } else {
        console.log(`No purchasedPackage found for paymentId: ${paymentId}`)
      }

      // Finally delete the payment
      await tx.payment.delete({
        where: { paymentId },
      })
    })

    revalidatePath("/admin/pagos")
  } catch (error) {
    console.error("Error borrando pago:", error)
    throw new Error("Error al borrar pago y registros asociados")
  }
}
