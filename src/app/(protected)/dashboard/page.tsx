import { Button } from "@/components/ui/button"
import Link from "next/link"
import { auth } from "@/auth"
import LogoutButton from "@/components/routes/auth/logout-button"

export default async function Dashboard() {
  const session = await auth()

  if (!session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5">
        <p className="text-5xl font-bold text-blue-500">
          Dashboard page ("/dashboard")
        </p>
        <p className="text-5xl font-bold text-red-500">NOT AUTHENTICATED</p>
        <Link href={"/login"}>
          <Button variant={"default"}>Login</Button>
        </Link>

        <Link href={"/register"}>
          <Button variant={"secondary"}>Register</Button>
        </Link>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5">
      <p className="text-5xl font-bold text-blue-500">
        Dashboard page ("/dashboard")
      </p>

      <pre>
        <code>{JSON.stringify(session, null, 2)}</code>
      </pre>

      <LogoutButton />
    </main>
  )
}
