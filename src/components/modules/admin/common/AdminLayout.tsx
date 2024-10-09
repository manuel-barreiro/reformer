import SideMenu from "@/components/modules/user/common/SideMenu"
import AdminSideMenu from "./AdminSideMenu"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex h-auto w-full cursor-default flex-col justify-between bg-pearl md:flex-row md:items-center">
      <div className="w-full flex-grow md:w-[20%]">
        <AdminSideMenu />
      </div>
      <div className="flex-grow border-midnight md:w-[70%] md:border-l">
        {children}
      </div>
    </main>
  )
}
