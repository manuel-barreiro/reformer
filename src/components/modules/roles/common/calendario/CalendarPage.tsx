import { Suspense } from "react"
import ClientCalendarPage from "./ClientCalendarPage"
import { getClasses } from "@/actions/class"
import { startOfMonth, endOfMonth } from "date-fns"
import ErrorBoundary from "@/components/modules/roles/common/calendario/ErrorBoundary"
import { Skeleton } from "@/components/ui/skeleton"
import { getUserBookingsInRange } from "@/actions/booking-actions"

async function CalendarPage({ userRole }: { userRole: string }) {
  const initialDate = new Date()
  const monthStart = startOfMonth(initialDate)
  const monthEnd = endOfMonth(initialDate)
  const initialClasses = await getClasses(monthStart, monthEnd)
  const initialBookings = await getUserBookingsInRange(monthStart, monthEnd)

  return (
    <ErrorBoundary>
      <Suspense
        fallback={<Skeleton className="h-full rounded-lg bg-pearlVariant" />}
      >
        <ClientCalendarPage
          initialDate={initialDate}
          initialClasses={initialClasses}
          userRole={userRole}
          userBookings={initialBookings}
        />
      </Suspense>
    </ErrorBoundary>
  )
}

export default CalendarPage
