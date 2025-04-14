import { Suspense } from "react"
import { PaymentsTable } from "@/components/modules/roles/admin/pagos/PaymentsTable"
import { getPayments } from "@/actions/payment-actions"
import { Skeleton } from "@/components/ui/skeleton"
import { PaymentsPage } from "@/components/modules/roles/admin/pagos/PaymentsPage"

export default async function PaymentsRoute() {
  const initialPayments = await getPayments()

  return (
    <Suspense
      fallback={<Skeleton className="h-96 w-full bg-pearlVariant lg:p-10" />}
    >
      <section className="h-auto w-full space-y-4 p-4 lg:p-10">
        <PaymentsPage initialPayments={initialPayments} />
      </section>
    </Suspense>
  )
}
