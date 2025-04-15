import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { UsersPage } from "@/components/modules/roles/admin/usuarios/UsersPage"
import { prisma } from "@/lib/prisma"
import ReformerLoader from "@/components/ui/ReformerLoader"

export default async function PaymentsPage() {
  const users = await prisma.user.findMany({
    where: {
      emailVerified: {
        not: null,
      },
    },
  })

  return (
    <Suspense fallback={<ReformerLoader />}>
      <UsersPage initialUsers={users} />
    </Suspense>
  )
}
