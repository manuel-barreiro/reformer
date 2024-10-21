import CalendarPage from "@/components/modules/roles/common/calendario/CalendarPage"
import { auth } from "@/auth"

export default async function page() {
  const session = await auth()
  const userRole = session?.user?.role
  return <CalendarPage userRole={userRole ?? "user"} />
}
