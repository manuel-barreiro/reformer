"use server"
import { prisma } from "@/lib/prisma"

export async function getPaymentsData(range: string) {
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

  return payments
    .reduce(
      (acc, payment) => {
        const date = payment.dateCreated.toISOString().split("T")[0]
        const existingDay = acc.find((day) => day.date === date)

        if (existingDay) {
          existingDay.total += payment._sum.total || 0
        } else {
          acc.push({
            date,
            total: payment._sum.total || 0,
          })
        }

        return acc
      },
      [] as Array<{ date: string; total: number }>
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}
