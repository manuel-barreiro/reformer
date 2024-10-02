import SideMenu from "@/components/modules/user/common/SideMenu"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex h-[100dvh] min-h-full items-start bg-grey_pebble md:items-center md:justify-center">
      <section className="flex h-full w-full flex-col items-center gap-5 bg-pearl px-8 pt-5 sm:px-12 md:h-auto md:w-auto md:min-w-[75%] md:flex-row md:gap-0 md:rounded-2xl md:px-0 md:py-16">
        <div className="w-full md:w-1/3">
          <SideMenu />
        </div>
        <div className="w-full border-midnight md:w-2/3 md:border-l">
          {children}
        </div>
      </section>
    </main>
  )
}
