import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const range = searchParams.get("range") || "90d"

  const daysToSubtract = range === "7d" ? 7 : range === "30d" ? 30 : 90
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - daysToSubtract)

  const payments = await prisma.payment.groupBy({
    by: ["dateCreated"],
    where: {
      status: "approved",
      dateCreated: {
        gte: startDate,
      },
    },
    _sum: {
      total: true,
    },
  })

  // Transform for chart format
  const chartData = payments.map((day) => ({
    date: day.dateCreated.toISOString().split("T")[0],
    total: day._sum.total || 0,
  }))

  return NextResponse.json(chartData)
}
