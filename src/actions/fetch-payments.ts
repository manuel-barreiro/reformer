import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function getPayments() {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        dateCreated: "desc",
      },
    })
    console.log(payments)
    return payments
  } catch (error) {
    console.error("Error fetching payments:", error)
    throw new Error("Failed to fetch payments")
  } finally {
    await prisma.$disconnect()
  }
}
