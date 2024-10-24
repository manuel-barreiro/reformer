import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { UsersTable } from "@/components/modules/roles/admin/usuarios/UsersTable"
import { prisma } from "@/lib/prisma"

export default async function PaymentsPage() {
  const users = await prisma.user.findMany()

  return (
    <Suspense fallback={<Skeleton className="h-96 w-full lg:pl-10" />}>
      <UsersTable initialUsers={users} />
    </Suspense>
  )
}
