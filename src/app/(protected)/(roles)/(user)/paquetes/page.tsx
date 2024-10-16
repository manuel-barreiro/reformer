import PackagesPage from "@/components/modules/roles/user/paquetes/PackagesPage"
import { getUserPackages } from "@/actions/purchased-packages"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function MisPaquetes() {
  const session = await auth()
  if (!session || !session.user) {
    redirect("/sign-in")
  }

  const userId = session.user.id
  if (!userId) {
    throw new Error("User ID is missing")
  }

  const initialPackages = await getUserPackages(userId)

  return <PackagesPage initialPackages={initialPackages} />
}
