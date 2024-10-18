import CalendarPage from "@/components/modules/roles/admin/calendario/CalendarPage"

export default async function page() {
  return (
    <main className="flex min-h-[86dvh] flex-col items-center justify-center gap-5">
      <CalendarPage />
    </main>
  )
}
