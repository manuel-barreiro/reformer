import CalendarPage from "@/components/modules/roles/common/calendario/CalendarPage"
import { auth } from "@/auth"

type UserRole = "admin" | "user" | "guest"

export default async function page() {
  const session = await auth()
  const userRole = session?.user?.role as UserRole
  return <CalendarPage userRole={userRole ?? "user"} />
}
