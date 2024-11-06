import CheckoutPage from "@/components/modules/checkout/CheckoutPage"
import { getActiveClassPackages } from "@/actions/package-actions"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

export default async function Checkout() {
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
  return <CheckoutPage classPackages={classPackages} />
}
