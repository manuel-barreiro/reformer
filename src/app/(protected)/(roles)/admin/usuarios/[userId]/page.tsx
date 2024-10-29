import { prisma } from "@/lib/prisma"
import { UserPackagesView } from "@/components/modules/roles/admin/usuarios/UserPackagesView"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    userId: string
  }
}

export default async function UserPackagesPage({ params }: PageProps) {
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    include: {
      purchasedPackages: {
        include: {
          classPackage: true,
          payment: {
            select: {
              total: true,
              status: true,
              dateCreated: true,
            },
          },
        },
      },
    },
  })

  if (!user) {
    notFound()
  }

  const availablePackages = await prisma.classPackage.findMany({
    where: { isActive: true },
  })

  return <UserPackagesView user={user} availablePackages={availablePackages} />
}
