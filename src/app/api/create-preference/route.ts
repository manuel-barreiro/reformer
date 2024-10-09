import { NextResponse } from "next/server"
import { MercadoPagoConfig, Preference } from "mercadopago"
import { auth } from "@/auth"

// Este endpoint es llamado desde el front cuando el usuario quiere comprar un paquete. Recibe los datos del paquete y crea una preferencia de pago en MercadoPago, devolviendo la URL de pago (init_point) para que el usuario sea redirigido al CheckoutPro de MP.

// Inicializo cliente MercadoPago con el access token
if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  throw new Error("MERCADOPAGO_ACCESS_TOKEN is not defined")
}

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
})

export async function POST(request: Request) {
  //Chequeo si el usuario está loggeado cuando intenta comprar el paquete, si no lo está, le muestro un mensaje de error
  const session = await auth()
  console.log("session", session)
  if (!session) {
    return NextResponse.json(
      { error: "Tenés que estar loggeado para poder comprar el paquete" },
      { status: 401 }
    )
  }
  try {
    const { id, title, description, price } = await request.json()
    console.log("PACK id", id)
    const body = {
      items: [
        {
          id: id,
          title: title,
          description: description,
          picture_url: "http://www.reformer.com.ar/icons/opengraph-image.png",
          quantity: 1,
          unit_price: price,
          currency_id: "ARS",
        },
      ],
      payment_methods: {
        excluded_payment_methods: [{ id: "pagofacil" }, { id: "rapipago" }],
      },
      back_urls: {
        success: `http://${process.env.NEXTAUTH_URL}/paquetes`,
        pending: `http://${process.env.NEXTAUTH_URL}/pending`,
        failure: `http://${process.env.NEXTAUTH_URL}/failure`,
      },
      auto_return: "approved",
      notification_url:
        "https://movement-position-earning-referral.trycloudflare.com/api/notify",
      metadata: {
        user_id: session.user.id,
      },
      external_reference: id,
    }

    const preference = await new Preference(client).create({ body })

    return NextResponse.json({ redirectUrl: preference.init_point })
  } catch (error) {
    console.error("Error creating preference:", error)
    return NextResponse.json(
      { error: "An error occurred while creating the preference" },
      { status: 500 }
    )
  }
}
