import AdminPackagesPage from "@/components/modules/roles/admin/paquetes/AdminPackagesPage"
import { getAllClassPackages } from "@/actions/package-actions"

export default async function page() {
  const initialPackages = await getAllClassPackages()

  return <AdminPackagesPage initialPackages={initialPackages} />
}
