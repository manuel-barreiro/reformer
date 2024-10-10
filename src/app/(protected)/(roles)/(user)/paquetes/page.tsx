import PackagesPage from "@/components/modules/roles/user/paquetes/PackagesPage"
import { mockPackages } from "@/components/modules/roles/user/paquetes/utils/mockPackages"

async function getInitialPackages() {
  return mockPackages
}

export default async function MisPaquetes() {
  const initialPackages = await getInitialPackages()

  return <PackagesPage initialPackages={initialPackages} />
}
