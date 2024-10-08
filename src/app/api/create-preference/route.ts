import { NextResponse } from "next/server"
import { MercadoPagoConfig, Preference } from "mercadopago"

// Initialize MercadoPago client
if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  throw new Error("MERCADOPAGO_ACCESS_TOKEN is not defined")
}

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
})

export async function POST(request: Request) {
  try {
    const { id, title, description, price } = await request.json()
    console.log({ id, title, description, price })
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
      payer: {
        name: "John",
        surname: "Doe",
        email: "john.doe@gmail.com",
        date_created: new Date().toISOString(),
      },
      back_urls: {
        success: `http://${process.env.NEXTAUTH_URL}/success`,
        pending: `http://${process.env.NEXTAUTH_URL}/pending`,
        failure: `http://${process.env.NEXTAUTH_URL}/failure`,
      },
      // notification_url: "http://notificationurl.com",
    }

    const preference = await new Preference(client).create({ body })

    return NextResponse.json({ redirectUrl: preference.init_point })
    // console.log("Preference created:", body)
    // return NextResponse.json({
    //   redirectUrl:
    //     "https://www.reddit.com/r/devsarg/comments/1dyo0sz/comment/lf1cgdj/",
    // })
  } catch (error) {
    console.error("Error creating preference:", error)
    return NextResponse.json(
      { error: "An error occurred while creating the preference" },
      { status: 500 }
    )
  }
}
