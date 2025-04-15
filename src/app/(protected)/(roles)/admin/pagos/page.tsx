import { Suspense } from "react"
import { getPayments } from "@/actions/payment-actions"
import { PaymentsPage } from "@/components/modules/roles/admin/pagos/PaymentsPage"
import ReformerLoader from "@/components/ui/ReformerLoader"

export default async function PaymentsRoute() {
  const initialPayments = await getPayments()

  return (
    <Suspense fallback={<ReformerLoader />}>
      <section className="h-auto w-full space-y-4 p-4 lg:p-10">
        <PaymentsPage initialPayments={initialPayments} />
      </section>
    </Suspense>
  )
}
