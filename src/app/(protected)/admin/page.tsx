import { auth } from "@/auth"
import LogoutButton from "@/components/modules/auth/logout-button"

export default async function page() {
  const session = await auth()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5">
      <p className="text-5xl font-bold text-blue-500">Admin page ("/admin")</p>
      {session?.user?.role !== "admin" ? (
        <p className="text-5xl font-bold text-red-500">You are not an admin!</p>
      ) : (
        <pre>
          <code>{JSON.stringify(session, null, 2)}</code>
        </pre>
      )}
      <LogoutButton />
    </main>
  )
}
