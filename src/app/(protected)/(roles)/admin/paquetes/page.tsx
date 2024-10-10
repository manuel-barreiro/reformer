import { auth } from "@/auth"

export default async function page() {
  const session = await auth()

  return (
    <main className="flex min-h-[86dvh] flex-col items-center justify-center gap-5">
      <h1>Paquetes</h1>
    </main>
  )
}
