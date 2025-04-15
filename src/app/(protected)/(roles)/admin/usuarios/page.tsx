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
      <section className="h-auto w-full space-y-4 p-4 lg:p-10">
        <UsersPage initialUsers={users} />
      </section>
    </Suspense>
  )
}
