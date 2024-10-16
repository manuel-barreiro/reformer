import SideMenu from "./SideMenu"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-auto w-full cursor-default flex-col justify-between overflow-hidden bg-pearl px-10 xl:h-[86dvh] xl:flex-row xl:items-center xl:px-20">
      <div className="h-full w-full flex-grow xl:w-[25%]">
        <SideMenu />
      </div>
      <div className="flex-grow border-midnight xl:w-[75%] xl:border-l">
        {children}
      </div>
    </main>
  )
}
