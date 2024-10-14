import { Suspense } from "react"
import { PaymentsTable } from "@/components/modules/roles/admin/pagos/PaymentsTable"
import { getPayments } from "@/actions/fetch-payments"

export default async function PaymentsPage() {
  const initialPayments = await getPayments()

  return (
    <section className="flex min-h-[86dvh] items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <PaymentsTable initialPayments={initialPayments} />
      </Suspense>
    </section>
  )
}
