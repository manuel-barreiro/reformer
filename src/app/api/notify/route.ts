import { NextResponse } from "next/server"
import { MercadoPagoConfig, Payment } from "mercadopago"

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

        const paymentData = {
          paymentId: pago.id,
          packageId: pago.external_reference,
          date_created: pago.date_created,
          date_last_updated: pago.date_last_updated,
          money_release_date: pago.money_release_date,
          items: pago.additional_info?.items,
          description: pago.description,
          total: pago.transaction_amount,
          status: pago.status,
          status_detail: pago.status_detail,
          payment_type_id: pago.payment_type_id,
          user_id: pago.metadata.user_id,
        }

        console.log("PAGO RECIBIDO", JSON.stringify(paymentData))

        // Here you can add your logic to save paymentData to the database

        return NextResponse.json(
          { message: "Payment processed successfully" },
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
  }
}
