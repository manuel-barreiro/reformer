import { NextResponse } from "next/server"
import { MercadoPagoConfig, Payment } from "mercadopago"
import {
  Prisma,
  PrismaClient,
  PackageStatus,
  PaymentType,
} from "@prisma/client"

const prisma = new PrismaClient()

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  throw new Error("MERCADOPAGO_ACCESS_TOKEN is not defined")
}

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
})

const payment = new Payment(client)

export async function POST(request: Request) {
  try {
    const notification = await request.json()

    if (notification.type === "payment") {
      const paymentId = notification.data.id
      console.log("ID del pago: ", paymentId)

      try {
        const pago = await payment.get({
          id: paymentId,
        })

        const paymentData: Prisma.PaymentCreateInput = {
          paymentType: PaymentType.mercadopago,
          paymentId: pago.id?.toString() || "",
          dateCreated: pago.date_created
            ? new Date(pago.date_created)
            : new Date(),
          dateLastUpdated: pago.date_last_updated
            ? new Date(pago.date_last_updated)
            : new Date(),
          moneyReleaseDate: pago.money_release_date
            ? new Date(pago.money_release_date)
            : null,
          description: pago.description || null,
          total: pago.transaction_amount || 0,
          status: pago.status || "",
          statusDetail: pago.status_detail || null,
          paymentTypeId: pago.payment_type_id || "",
          user: {
            connect: { id: pago.metadata.user_id },
          },
        }

        console.log("PAGO RECIBIDO", JSON.stringify(paymentData))

        // Check if payment already exists in the database
        const existingPayment = await prisma.payment.findUnique({
          where: { paymentId: paymentData.paymentId },
        })

        let savedPayment

        if (existingPayment) {
          // Payment exists, update it
          savedPayment = await prisma.payment.update({
            where: { paymentId: paymentData.paymentId },
            data: {
              dateLastUpdated: paymentData.dateLastUpdated,
              moneyReleaseDate: paymentData.moneyReleaseDate,
              status: paymentData.status,
              statusDetail: paymentData.statusDetail,
            },
          })
          console.log("Payment updated in database:", savedPayment)
        } else {
          // Only create PurchasedPackage if payment status is "approved"
          const paymentCreateData: any = { ...paymentData }

          if (pago.status === "approved") {
            const classPackage = await prisma.classPackage.findUnique({
              where: { id: pago.metadata.class_package_id },
            })

            if (!classPackage) {
              throw new Error("ClassPackage not found")
            }

            // Calculate expiration date based on class package duration and current date
            const expirationDate = new Date()
            expirationDate.setMonth(
              expirationDate.getMonth() + classPackage.durationMonths
            )

            // Add purchasedPackage creation to payment data
            paymentCreateData.purchasedPackage = {
              create: {
                userId: pago.metadata.user_id,
                classPackageId: classPackage.id,
                remainingClasses: classPackage.classCount,
                expirationDate: expirationDate,
                status: PackageStatus.active,
              },
            }
          }

          // Create the payment (and purchasedPackage if status is approved)
          savedPayment = await prisma.payment.create({
            data: paymentCreateData,
            include: {
              purchasedPackage: true,
            },
          })
          console.log(
            "New payment" +
              (pago.status === "approved" ? " and PurchasedPackage" : "") +
              " saved to database:",
            savedPayment
          )
        }

        return NextResponse.json(
          { message: "Payment processed and saved successfully" },
          { status: 200 }
        )
      } catch (error) {
        console.error("Error processing payment:", error)
        return NextResponse.json(
          { error: (error as Error).message },
          { status: 400 }
        )
      }
    } else {
      // Handle non-payment notifications
      return NextResponse.json(
        { message: "Notification received but not processed" },
        { status: 200 }
      )
    }
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
