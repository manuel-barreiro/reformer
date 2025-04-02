import { prisma } from "@/lib/prisma"
import { UserDetailView } from "@/components/modules/roles/admin/usuarios/UserDetailView"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    userId: string
  }
}

export default async function UserDetailPage({ params }: PageProps) {
  // We're just checking if the user exists for SSR
  // The full data will be fetched client-side with Tanstack Query
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    select: { id: true }, // Just fetch the ID to check existence
  })

  if (!user) {
    notFound()
  }

  return <UserDetailView userId={params.userId} />
}
