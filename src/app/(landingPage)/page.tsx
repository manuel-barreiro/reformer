import LandingPage from "@/components/modules/landingPage/LandingPage"
import { getActiveClassPackages } from "@/actions/package-actions"
import { ClassPackage } from "@prisma/client"

export default async function Home() {
  const activeClassPackages: ClassPackage[] = await getActiveClassPackages()

  return <LandingPage activeClassPackages={activeClassPackages} />
}
