import SideMenu from "@/components/modules/user/common/SideMenu"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex min-h-[85.7dvh] cursor-default flex-col bg-pearl md:h-full md:items-center md:justify-center md:bg-grey_pebble">
      <section className="flex min-h-full w-full flex-col items-center gap-5 bg-pearl px-8 pt-5 sm:px-12 md:h-auto md:min-h-0 md:flex-row md:justify-stretch md:gap-0 md:rounded-2xl md:px-0 md:py-14 lg:w-[90%] lg:py-20 xl:w-[70%]">
        <div className="w-full flex-grow md:w-[30%]">
          <SideMenu />
        </div>
        <div className="h-full w-full flex-grow border-midnight md:w-[70%] md:border-l md:pr-9 lg:pr-12">
          {children}
        </div>
      </section>
    </main>
  )
}
