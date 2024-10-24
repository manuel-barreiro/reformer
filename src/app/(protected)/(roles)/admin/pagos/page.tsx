import { Suspense } from "react"
import { PaymentsTable } from "@/components/modules/roles/admin/pagos/PaymentsTable"
import { getPayments } from "@/actions/payment-actions"
import { Skeleton } from "@/components/ui/skeleton"

export default async function PaymentsPage() {
  const initialPayments = await getPayments()

  return (
    <Suspense
      fallback={<Skeleton className="h-96 w-full bg-pearlVariant lg:pl-10" />}
    >
      <PaymentsTable initialPayments={initialPayments} />
    </Suspense>
  )
}
