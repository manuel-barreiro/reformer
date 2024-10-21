import { Suspense } from "react"
import ClientCalendarPage from "./ClientCalendarPage"
import { getClasses } from "@/actions/class"
import { startOfMonth, endOfMonth } from "date-fns"
import ErrorBoundary from "./ErrorBoundary"

async function CalendarPage() {
  const initialDate = new Date()
  const monthStart = startOfMonth(initialDate)
  const monthEnd = endOfMonth(initialDate)
  const initialClasses = await getClasses(monthStart, monthEnd)

  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <ClientCalendarPage
          initialDate={initialDate}
          initialClasses={initialClasses}
        />
      </Suspense>
    </ErrorBoundary>
  )
}

export default CalendarPage
