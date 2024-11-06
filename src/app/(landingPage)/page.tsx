import LandingPage from "@/components/modules/landingPage/LandingPage"
import { getActiveClassPackages } from "@/actions/package-actions"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

export default async function Home() {
  return (
    <ErrorBoundary fallback={<div>Error loading packages</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <PackagesLoader />
      </Suspense>
    </ErrorBoundary>
  )
}

async function PackagesLoader() {
  const classPackages = await getActiveClassPackages().then((packages) =>
    packages.map((pkg) => ({
      ...pkg,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  )
  return <LandingPage activeClassPackages={classPackages} />
}
