import { Suspense } from "react"
import { ClassWithBookings } from "@/components/modules/roles/common/calendario/types"
import { getClasses } from "@/actions/class"
import { startOfMonth, endOfMonth } from "date-fns"
import ErrorBoundary from "@/components/modules/roles/common/calendario/ErrorBoundary"
import { auth } from "@/auth"
import ReformerLoader from "@/components/ui/ReformerLoader"
import { BookingWithClass } from "@/components/modules/roles/user/reservas/ReservasPage"
import { redirect } from "next/navigation"
import ClientCalendarPage from "@/components/modules/roles/common/calendario/ClientCalendarPage"
import Link from "next/link" // Import Link

export default async function CalendarPage() {
  const session = await auth()
  console.log("Session object:", session)

  // --- Redirect Logic ---
  if (session?.user) {
    const userRole = session.user.role
    console.log("User is logged in. User data:", session.user)
    console.log("Determined user role:", userRole)

    if (userRole === "admin" || userRole === "user") {
      console.log("Redirecting to /calendario...")
      redirect("/calendario")
    } else {
      console.log("Role is not admin or user, treating as guest.")
    }
  } else {
    console.log("User is not logged in (guest).")
  }
  // --- End Redirect Logic ---

  // --- Guest Logic ---
  const initialDate = new Date()
  const monthStart = startOfMonth(initialDate)
  const monthEnd = endOfMonth(initialDate)
  const currentUserId = undefined
  const actualUserRole = "guest"
  const initialBookings: BookingWithClass[] = []

  // Use the correct type for initialClasses
  let initialClasses: ClassWithBookings[] = []
  try {
    // Fetch classes - ensure getClasses returns Promise<ClassWithBookings[]>
    initialClasses = await getClasses(monthStart, monthEnd)
  } catch (error) {
    console.error("Error fetching initial classes for guest view:", error)
  }

  // This return is only reached by guests
  return (
    <div className="flex min-h-screen flex-col items-start justify-center bg-pearl">
      {" "}
      {/* Added background and text color */}
      <div className="my-4">
        {" "}
        {/* Add margin below the link */}
        <Link href="/" className="px-4 text-midnight hover:underline lg:p-10">
          &larr; Volver a la página principal
        </Link>
      </div>
      <ErrorBoundary>
        <Suspense fallback={<ReformerLoader />}>
          {/* Removed the outer div to avoid double centering */}
          <ClientCalendarPage
            currentUserId={currentUserId}
            initialDate={initialDate}
            initialClasses={initialClasses}
            userRole={actualUserRole}
            userBookings={initialBookings}
          />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
