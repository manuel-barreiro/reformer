import { Suspense } from "react"
import ClientCalendarPage from "./ClientCalendarPage"
import { getClasses } from "@/actions/class"
import { startOfDay, endOfDay } from "date-fns"

async function CalendarPage() {
  const initialDate = new Date()
  const dayStart = startOfDay(initialDate)
  const dayEnd = endOfDay(initialDate)
  const initialClasses = await getClasses(dayStart, dayEnd)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientCalendarPage
        initialDate={initialDate}
        initialClasses={initialClasses}
      />
    </Suspense>
  )
}

export default CalendarPage
