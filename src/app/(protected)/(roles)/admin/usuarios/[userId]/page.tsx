import { prisma } from "@/lib/prisma"
import { UserDetailView } from "@/components/modules/roles/admin/usuarios/UserDetailView"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    userId: string
  }
}

export default async function UserDetailPage({ params }: PageProps) {
  // Fetch user with all related data
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
      payments: {
        orderBy: {
          dateCreated: "desc",
        },
      },
      bookings: {
        include: {
          class: {
            include: {
              category: true,
              subcategory: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
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

  return <UserDetailView user={user} availablePackages={availablePackages} />
}
