import { auth } from "@/auth"

export default async function page() {
  const session = await auth()

  return (
    <main className="flex min-h-[86dvh] flex-col items-center justify-center gap-5">
      <p className="text-5xl font-bold text-grey_pebble">
        Paquetes ("/admin/paquetes")
      </p>
      {session?.user?.role !== "admin" ? (
        <p className="text-5xl font-bold text-red-500">You are not an admin!</p>
      ) : (
        <pre>
          <code>{JSON.stringify(session, null, 2)}</code>
        </pre>
      )}
    </main>
  )
}
