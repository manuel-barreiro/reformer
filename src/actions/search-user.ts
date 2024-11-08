"use server"

import { prisma } from "@/lib/prisma"
import { User } from "@prisma/client"

export async function searchUsers(searchTerm: string): Promise<User[]> {
  try {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: searchTerm, mode: "insensitive" } },
              { surname: { contains: searchTerm, mode: "insensitive" } },
              { email: { contains: searchTerm, mode: "insensitive" } },
            ],
          },
          { role: "user" },
          { emailVerified: { not: null } },
        ],
      },
      take: 5,
    })
    return users
  } catch (error) {
    console.error("Error en searchUsers:", error)
    return []
  }
}
