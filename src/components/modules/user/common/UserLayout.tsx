import SideMenu from "@/components/modules/user/common/SideMenu"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex h-[100dvh] min-h-full cursor-default items-center bg-grey_pebble md:items-center md:justify-center">
      <section className="flex h-full w-full flex-col items-center gap-5 bg-pearl px-8 pt-5 sm:px-12 md:h-auto md:w-auto md:min-w-[75%] md:flex-row md:justify-stretch md:gap-0 md:rounded-2xl md:px-0 md:py-14 lg:py-20">
        <div className="w-full md:w-[30%]">
          <SideMenu />
        </div>
        <div className="h-full w-full border-midnight md:w-[70%] md:border-l">
          {children}
        </div>
      </section>
    </main>
  )
}
