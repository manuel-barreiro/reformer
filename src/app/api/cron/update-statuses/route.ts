import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifySignature } from "@upstash/qstash/nextjs"

// Remove unused request parameter and fix typing
export const POST = verifySignature(
  async () => {
    return handleStatusUpdates()
  },
  {
    currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
    nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
  }
)

async function handleStatusUpdates() {
  try {
    // Update bookings to "attended"
    const updatedBookings = await prisma.booking.updateMany({
      where: {
        status: "confirmed",
        class: {
          startTime: {
            lt: new Date(),
          },
        },
      },
      data: {
        status: "attended",
      },
    })

    // Update expired packages
    const updatedPackages = await prisma.purchasedPackage.updateMany({
      where: {
        status: {
          not: "expired",
        },
        expirationDate: {
          lt: new Date(),
        },
      },
      data: {
        status: "expired",
      },
    })

    // Update past classes to inactive
    const updatedClasses = await prisma.class.updateMany({
      where: {
        isActive: true,
        startTime: {
          lt: new Date(),
        },
      },
      data: {
        isActive: false,
      },
    })

    console.log(`Updated ${updatedBookings.count} bookings to attended`)
    console.log(`Updated ${updatedPackages.count} packages to expired`)
    console.log(`Updated ${updatedClasses.count} classes to inactive`)

    return NextResponse.json({
      success: true,
      message: "Status updates completed",
      updatedBookings: updatedBookings.count,
      updatedPackages: updatedPackages.count,
      updatedClasses: updatedClasses.count,
    })
  } catch (error) {
    console.error("Status update failed:", error)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}
