import { Separator } from "@/components/ui/separator"
import SideMenu from "./SideMenu"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-auto min-h-[86dvh] w-full cursor-default flex-col justify-start overflow-hidden bg-pearl px-10 pb-10 xl:h-[86dvh] xl:justify-center xl:px-20 xl:pb-0">
      <div className="flex w-full flex-col items-start justify-between gap-10 xl:flex-row xl:gap-0">
        <nav className="w-full xl:w-auto xl:basis-1/5 xl:pr-10">
          <SideMenu />
        </nav>
        <Separator
          orientation="vertical"
          className="hidden h-full w-[1px] bg-midnight/50 xl:block"
        />
        <section className="w-full xl:w-auto xl:basis-4/5">{children}</section>
      </div>
    </main>
  )
}
