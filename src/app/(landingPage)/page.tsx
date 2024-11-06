import LandingPage from "@/components/modules/landingPage/LandingPage"
import { getActiveClassPackages } from "@/actions/package-actions"
import { ClassPackageProps } from "@/types"

export default async function Home() {
  const activeClassPackages = await getActiveClassPackages()

  return (
    <LandingPage
      activeClassPackages={activeClassPackages as ClassPackageProps[]}
    />
  )
}
