import { Suspense } from "react"
import ClientCalendarPage from "@/components/modules/roles/common/calendario/ClientCalendarPage"
import { getClasses } from "@/actions/class"
import { startOfMonth, endOfMonth } from "date-fns"
import ErrorBoundary from "@/components/modules/roles/common/calendario/ErrorBoundary"
import { getUserBookingsInRange } from "@/actions/booking-actions"
import { auth } from "@/auth"
import ReformerLoader from "@/components/ui/ReformerLoader"
import { BookingWithClass } from "@/components/modules/roles/user/reservas/ReservasPage" // Import the type if not already imported

export default async function CalendarPage() {
  // Removed userRole prop, we'll determine it from session
  const initialDate = new Date()
  const monthStart = startOfMonth(initialDate)
  const monthEnd = endOfMonth(initialDate)

  // Fetch classes - this should be accessible to everyone
  const initialClasses = await getClasses(monthStart, monthEnd)

  const session = await auth()
  const currentUserId = session?.user?.id
  let initialBookings: BookingWithClass[] = [] // Default to empty array for guests
  let actualUserRole: "admin" | "user" | "guest" = "guest" // Default role

  // Only attempt to fetch bookings and determine user/admin role if logged in
  if (session?.user) {
    try {
      // Fetch bookings for the logged-in user
      initialBookings = await getUserBookingsInRange(monthStart, monthEnd)
      // Determine role based on your session/auth logic
      // Example: assuming session.user.role exists
      actualUserRole = session.user.role === "admin" ? "admin" : "user"
    } catch (error) {
      console.error("Error fetching user bookings:", error)
      // Optionally handle the error, but the function call should now be safe
      initialBookings = [] // Fallback to empty array on error
      actualUserRole = "guest" // Fallback role on error? Or keep as user/admin? Adjust as needed.
    }
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<ReformerLoader />}>
        <div className="flex min-h-screen items-center justify-center">
          <ClientCalendarPage
            currentUserId={currentUserId} // Pass ID (will be undefined for guests)
            initialDate={initialDate}
            initialClasses={initialClasses}
            userRole={actualUserRole} // Pass the determined role
            userBookings={initialBookings} // Pass fetched bookings or empty array
          />
        </div>
      </Suspense>
    </ErrorBoundary>
  )
}
