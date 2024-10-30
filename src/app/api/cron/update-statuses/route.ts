// app/api/cron/update-statuses/route.ts

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  console.log("Cron job started at:", new Date().toISOString())
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
    console.log(`Updated ${updatedBookings.count} bookings to attended`)

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
    console.log(`Updated ${updatedPackages.count} packages to expired`)

    console.log("Cron job completed at:", new Date().toISOString())
    return NextResponse.json({
      message: "Status updates completed",
      updatedBookings: updatedBookings.count,
      updatedPackages: updatedPackages.count,
    })
  } catch (error) {
    console.error(
      "Cron job failed at:",
      new Date().toISOString(),
      "Error:",
      error
    )
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
