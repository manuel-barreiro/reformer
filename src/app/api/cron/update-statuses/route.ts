import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Receiver } from "@upstash/qstash"
import { headers } from "next/headers"

async function POST(request: Request) {
  try {
    const signature = headers().get("upstash-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 })
    }

    const receiver = new Receiver({
      currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
      nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
    })

    const body = await request.text()
    const isValid = await receiver.verify({ signature, body })

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const now = new Date()
    const updates = await prisma.$transaction(async (tx) => {
      const [updatedBookings, updatedPackages, updatedClasses] =
        await Promise.all([
          tx.booking.updateMany({
            where: {
              status: "confirmed",
              class: { startTime: { lt: now } },
            },
            data: { status: "attended" },
          }),
          tx.purchasedPackage.updateMany({
            where: {
              status: { not: "expired" },
              expirationDate: { lt: now },
            },
            data: { status: "expired" },
          }),
          tx.class.updateMany({
            where: {
              isActive: true,
              startTime: { lt: now },
            },
            data: { isActive: false },
          }),
        ])

      return { updatedBookings, updatedPackages, updatedClasses }
    })

    console.log("Status updates completed successfully:", updates)
    return NextResponse.json({
      success: true,
      message: "Status updates completed",
      ...updates,
    })
  } catch (error) {
    console.error("Status update failed:", error)
    return NextResponse.json(
      {
        error: "Update failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

export { POST }
