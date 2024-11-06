import { NextResponse } from "next/server"
import { MercadoPagoConfig, Payment } from "mercadopago"
import { Prisma, PrismaClient, PackageStatus } from "@prisma/client"
import { sendPurchaseConfirmation } from "@/lib/mail"

const prisma = new PrismaClient()

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  throw new Error("MERCADOPAGO_ACCESS_TOKEN is not defined")
}

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
})

const payment = new Payment(client)

async function processApprovedPayment(
  pago: any,
  paymentData: Prisma.PaymentCreateInput
) {
  const [user, classPackage] = await Promise.all([
    prisma.user.findUnique({
      where: { id: pago.metadata.user_id },
    }),
    prisma.classPackage.findUnique({
      where: { id: pago.metadata.class_package_id },
    }),
  ])

  if (!user || !classPackage) {
    throw new Error(!user ? "User not found" : "ClassPackage not found")
  }

  const expirationDate = new Date()
  expirationDate.setMonth(
    expirationDate.getMonth() + classPackage.durationMonths
  )

  await sendPurchaseConfirmation(
    user.email,
    user.name,
    classPackage.name,
    classPackage.classCount,
    classPackage.durationMonths,
    pago.transaction_amount || 0
  )

  return {
    ...paymentData,
    purchasedPackage: {
      create: {
        userId: pago.metadata.user_id,
        classPackageId: classPackage.id,
        remainingClasses: classPackage.classCount,
        expirationDate,
        status: PackageStatus.active,
      },
    },
  }
}

export async function POST(request: Request) {
  try {
    const notification = await request.json()

    if (notification.type !== "payment") {
      return NextResponse.json(
        { message: "Notification received but not processed" },
        { status: 200 }
      )
    }

    const paymentId = notification.data.id
    console.log("ID del pago: ", paymentId)

    const pago = await payment.get({ id: paymentId })

    const paymentData: Prisma.PaymentCreateInput = {
      paymentType: "mercadopago",
      paymentId: pago.id?.toString() || "",
      dateCreated: pago.date_created ? new Date(pago.date_created) : new Date(),
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

    await prisma.$transaction(async (tx) => {
      const existingPayment = await tx.payment.findUnique({
        where: { paymentId: paymentData.paymentId },
      })

      if (existingPayment) {
        await tx.payment.update({
          where: { paymentId: paymentData.paymentId },
          data: {
            dateLastUpdated: paymentData.dateLastUpdated,
            moneyReleaseDate: paymentData.moneyReleaseDate,
            status: paymentData.status,
            statusDetail: paymentData.statusDetail,
          },
        })
      } else {
        const finalPaymentData =
          pago.status === "approved"
            ? await processApprovedPayment(pago, paymentData)
            : paymentData

        await tx.payment.create({
          data: finalPaymentData,
          include: {
            purchasedPackage: true,
          },
        })
      }
    })

    return NextResponse.json(
      { message: "Payment processed and saved successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
