import { NextResponse } from "next/server"
import { MercadoPagoConfig, Payment } from "mercadopago"
import { Prisma, PrismaClient, PackageType } from "@prisma/client"

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
          paymentId: pago.id?.toString() || "",
          packageType: pago.external_reference as PackageType,
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
              // Add any other fields that might change
            },
          })
          console.log("Payment updated in database:", savedPayment)
        } else {
          // Payment doesn't exist, create a new entry
          savedPayment = await prisma.payment.create({
            data: paymentData,
          })
          console.log("New payment saved to database:", savedPayment)
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
