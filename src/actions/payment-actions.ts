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
  console.log("paymentId:", paymentId)
  try {
    await prisma.$transaction(async (tx) => {
      // Find the purchasedPackage using the payment's id, not paymentId
      const payment = await tx.payment.findUnique({
        where: { paymentId: paymentId },
      })

      if (!payment) {
        throw new Error("Payment not found")
      }

      const purchasedPackage = await tx.purchasedPackage.findUnique({
        where: { paymentId: payment.id },
      })

      console.log("purchasedPackage:", purchasedPackage)

      if (purchasedPackage) {
        // Delete all associated bookings first
        await tx.booking.deleteMany({
          where: { purchasedPackageId: purchasedPackage.id },
        })

        // Then delete the purchasedPackage
        await tx.purchasedPackage.delete({
          where: { id: purchasedPackage.id },
        })
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
