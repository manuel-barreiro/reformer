"use server"

import { prisma } from "@/lib/prisma"
import { PurchasedPackage, ClassPackage } from "@prisma/client"

export type PurchasedPackageWithClassPackage = PurchasedPackage & {
  classPackage: ClassPackage
}

export async function getUserPackages(
  id: string
): Promise<PurchasedPackageWithClassPackage[]> {
  const userPurchasedPackages = await prisma.purchasedPackage.findMany({
    where: {
      userId: id,
    },
    include: {
      classPackage: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return userPurchasedPackages
}
