import AdminPackagesPage from "@/components/modules/roles/admin/paquetes/AdminPackagesPage"
import { prisma } from "@/lib/prisma"

async function getClassPackages() {
  return await prisma.classPackage.findMany({
    orderBy: {
      classCount: "asc",
    },
  })
}

export default async function page() {
  const initialPackages = await getClassPackages()

  return (
    <main className="flex min-h-[86dvh] flex-col items-center justify-center gap-5">
      <AdminPackagesPage initialPackages={initialPackages} />
    </main>
  )
}
