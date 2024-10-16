"use server"

import { prisma } from "@/lib/prisma"
import { ClassPackage } from "@prisma/client"

export async function fetchClassPackages(): Promise<ClassPackage[]> {
  return prisma.classPackage.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" },
  })
}
