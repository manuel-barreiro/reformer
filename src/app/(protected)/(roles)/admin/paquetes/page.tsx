import AdminPackagesPage from "@/components/modules/roles/admin/paquetes/AdminPackagesPage"
import { getAllClassPackages } from "@/actions/package-actions"

export default async function page() {
  const initialPackages = await getAllClassPackages()

  return (
    <main className="flex min-h-[86dvh] flex-col items-center justify-center gap-5">
      <AdminPackagesPage initialPackages={initialPackages} />
    </main>
  )
}
