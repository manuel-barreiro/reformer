import { NextResponse } from "next/server"
import { MercadoPagoConfig, Preference } from "mercadopago"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"

// Este endpoint es llamado desde el front cuando el usuario quiere comprar un paquete. Recibe los datos del paquete y crea una preferencia de pago en MercadoPago, devolviendo la URL de pago (init_point) para que el usuario sea redirigido al CheckoutPro de MP.

const prisma = new PrismaClient()

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
  if (!session) {
    return NextResponse.json(
      { error: "Tenés que estar loggeado para poder comprar el paquete" },
      { status: 401 }
    )
  }

  try {
    const { classPackageId } = await request.json()

    // Busco el paquete en la base de datos para obtener los datos necesarios para crear la preferencia
    const classPackage = await prisma.classPackage.findUnique({
      where: { id: classPackageId },
    })

    if (!classPackage) {
      return NextResponse.json(
        { error: "ClassPackage not found" },
        { status: 404 }
      )
    }

    console.log("Creating preference for class package:", classPackage)

    const body = {
      items: [
        {
          id: classPackage.id.toString(),
          title: classPackage.name.toString(),
          description: classPackage.description?.toString(),
          picture_url: "https://www.reformer.com.ar/icons/opengraph-image.png",
          quantity: 1,
          unit_price: classPackage.price,
          currency_id: "ARS",
        },
      ],
      payment_methods: {
        excluded_payment_methods: [{ id: "pagofacil" }, { id: "rapipago" }],
      },
      back_urls: {
        success: `https://www.reformer.com.ar/checkout/success`,
        pending: `https://www.reformer.com.ar/checkout/pending`,
        failure: `https://www.reformer.com.ar/checkout/failure`,
      },
      auto_return: "approved",
      notification_url: "https://www.reformer.com.ar/api/notify",
      metadata: {
        user_id: session.user.id,
        class_package_id: classPackage.id,
      },
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
