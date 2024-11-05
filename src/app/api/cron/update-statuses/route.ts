// app/api/cron/update-statuses/route.ts

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  // Check authorization
  if (
    request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

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
      message: "Status updates completed",
      updatedBookings: updatedBookings.count,
      updatedPackages: updatedPackages.count,
      updatedClasses: updatedClasses.count,
    })
  } catch (error) {
    console.error("Cron job failed:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
