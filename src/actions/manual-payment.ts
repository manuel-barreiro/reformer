import { PrismaClient, User, Payment, PackageType } from "@prisma/client"

const prisma = new PrismaClient()

export async function searchUsers(term: string): Promise<User[]> {
  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: term, mode: "insensitive" } },
          { surname: { contains: term, mode: "insensitive" } },
          { email: { contains: term, mode: "insensitive" } },
        ],
      },
      take: 10,
    })
    console.log(users)
    return users
  } catch (error) {
    console.error("Error searching users:", error)
    throw new Error("Failed to search users")
  } finally {
    await prisma.$disconnect()
  }
}

export async function createManualPayment(
  userId: string,
  packageType: PackageType,
  amount: number,
  paymentMethod: string
): Promise<Payment> {
  try {
    const payment = await prisma.payment.create({
      data: {
        userId,
        packageType,
        total: amount,
        status: "approved",
        paymentTypeId: paymentMethod,
        dateCreated: new Date(),
        dateLastUpdated: new Date(),
        paymentId: `MANUAL-${Date.now()}`,
      },
    })

    // Here you would also call the generatePackage function

    return payment
  } catch (error) {
    console.error("Error creating manual payment:", error)
    throw new Error("Failed to create manual payment")
  } finally {
    await prisma.$disconnect()
  }
}
