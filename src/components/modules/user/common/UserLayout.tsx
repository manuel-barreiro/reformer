import SideMenu from "@/components/modules/user/common/SideMenu"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-grey_pebble">
      <section className="flex h-auto w-auto min-w-[75%] rounded-2xl bg-pearl py-16">
        <div className="w-1/3">
          <SideMenu />
        </div>
        <div className="w-2/3 border-l border-midnight">{children}</div>
      </section>
    </main>
  )
}
