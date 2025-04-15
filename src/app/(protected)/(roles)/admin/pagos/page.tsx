import { Suspense } from "react"
import { PaymentsTable } from "@/components/modules/roles/admin/pagos/PaymentsTable"
import { getPayments } from "@/actions/payment-actions"
import { Skeleton } from "@/components/ui/skeleton"
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
