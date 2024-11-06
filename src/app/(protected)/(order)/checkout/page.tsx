import CheckoutPage from "@/components/modules/checkout/CheckoutPage"
import { getActiveClassPackages } from "@/actions/package-actions"

export default async function Checkout() {
  const classPackages = await getActiveClassPackages()
  return <CheckoutPage classPackages={classPackages} />
}
