import React from "react"
import { InteractiveAreaChart } from "./components/InteractiveAreaChart"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { getPaymentsData } from "./actions/getPaymentsData"
import { PaymentsData } from "./types/getPaymentsData.types"

export default async function Dashboard({
  searchParams,
}: {
  searchParams: { range?: string }
}) {
  const paymentsData: PaymentsData = await getPaymentsData("90d")
  console.log(paymentsData)
  return (
    <section className="h-full w-full">
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <InteractiveAreaChart paymentsData={paymentsData} />
      </Suspense>
      {/* other charts & metrics */}
    </section>
  )
}
