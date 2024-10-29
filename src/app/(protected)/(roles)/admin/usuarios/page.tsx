import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { UsersTable } from "@/components/modules/roles/admin/usuarios/UsersTable"
import { prisma } from "@/lib/prisma"

export default async function PaymentsPage() {
  const users = await prisma.user.findMany({
    where: {
      emailVerified: {
        not: null,
      },
    },
  })

  return (
    <Suspense
      fallback={<Skeleton className="h-96 w-full bg-pearlVariant3 lg:pl-10" />}
    >
      <UsersTable initialUsers={users} />
    </Suspense>
  )
}
