import PackagesPage from "@/components/modules/user/paquetes/PackagesPage"
import { mockPackages } from "@/components/modules/user/paquetes/utils/mockPackages"

async function getInitialPackages() {
  return mockPackages
}

export default async function MisPaquetes() {
  const initialPackages = await getInitialPackages()

  return <PackagesPage initialPackages={initialPackages} />
}
