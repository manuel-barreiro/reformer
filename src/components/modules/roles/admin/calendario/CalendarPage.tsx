import { Suspense } from "react"
import ClientCalendarPage from "./ClientCalendarPage"
// import { fetchClasses } from '@/lib/api' // You'll need to implement this function
import { Class, mockClasses } from "./mockClasses"

async function CalendarPage() {
  const initialDate = new Date()
  const classes: Class[] = mockClasses

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientCalendarPage initialDate={initialDate} initialClasses={classes} />
    </Suspense>
  )
}

export default CalendarPage
