import { Suspense } from "react"
import ClientCalendarPage from "./ClientCalendarPage"
import { getClasses } from "@/actions/class"
import { startOfMonth, endOfMonth } from "date-fns"
import ErrorBoundary from "@/components/modules/roles/common/calendario/ErrorBoundary"
import { getUserBookingsInRange } from "@/actions/booking-actions"
import { auth } from "@/auth"
import ReformerLoader from "@/components/ui/ReformerLoader"

async function CalendarPage({
  userRole,
}: {
  userRole: "admin" | "user" | "guest"
}) {
  const initialDate = new Date()
  const monthStart = startOfMonth(initialDate)
  const monthEnd = endOfMonth(initialDate)
  const initialClasses = await getClasses(monthStart, monthEnd)
  const initialBookings = await getUserBookingsInRange(monthStart, monthEnd)

  const session = await auth()
  const currentUserId = session?.user?.id

  return (
    <ErrorBoundary>
      <Suspense fallback={<ReformerLoader />}>
        <ClientCalendarPage
          currentUserId={currentUserId}
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
