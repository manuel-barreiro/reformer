import React from "react"
import { ProfileImageMockup } from "@/assets/icons"
import LogoutButtonDesktop from "@/components/modules/auth/logout-button-desktop"
import LogoutButtonMobile from "@/components/modules/auth/logout-button-mobile"
import SideMenuButton from "@/components/modules/roles/common/SideMenuButton"
import { auth } from "@/auth"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ReformerDropdownMenu } from "@/components/modules/roles/common/ReformerDropdownMenu"

const adminMenuItems = [
  {
    title: "PAGOS",
    href: "/admin/pagos",
  },
  {
    title: "PAQUETES",
    href: "/admin/paquetes",
  },
  {
    title: "CALENDARIO",
    href: "/admin/calendario",
  },
  {
    title: "USUARIOS",
    href: "/admin/usuarios",
  },
  {
    title: "CATEGORÍAS",
    href: "/admin/categorias",
  },
]

const userMenuItems = [
  {
    title: "PAQUETES",
    href: "/paquetes",
  },
  {
    title: "RESERVAS",
    href: "/reservas",
  },
  {
    title: "CALENDARIO",
    href: "/calendario",
  },
  {
    title: "MIS DATOS",
    href: "/perfil",
  },
]

export default async function SideMenu() {
  const session = await auth()
  const userRole = session?.user?.role
  const menuItems = userRole === "admin" ? adminMenuItems : userMenuItems

  return (
    <div className="flex w-full flex-col items-start justify-center gap-6 pt-5 text-sm md:items-start xl:gap-10 xl:pt-0">
      <div className="flex w-full items-center justify-between gap-12 xl:flex-col">
        <span className="hidden self-start font-marcellus text-4xl font-medium text-grey_pebble xl:block">
          {userRole === "admin" ? "Admin" : "Mi Perfil"}
        </span>
        <div className="flex w-full flex-row items-center gap-3">
          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full lg:h-8 lg:w-8 xl:h-14 xl:w-14">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt="profile pic"
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            ) : (
              <ProfileImageMockup className="h-full w-full text-grey_pebble" />
            )}
          </div>
          <div className="text-left">
            <p className="font-dm_sans text-base font-medium text-grey_pebble xl:text-lg">
              {session?.user?.name}
            </p>
            <p className="cursor-default text-xs font-medium text-grey_pebble/50 xl:text-base">
              {session?.user?.email && session.user.email.length > 30
                ? `${session.user.email.slice(0, 27)}...`
                : session?.user?.email}
            </p>
          </div>
        </div>
        {/* <LogoutButtonMobile /> */}
        <ReformerDropdownMenu items={menuItems} />
      </div>

      <div
        className={cn(
          "grid w-full gap-2 xl:flex-col",
          // userRole === "admin" ? "grid-cols-3" : "grid-cols-2"
          "hidden grid-cols-2 xl:flex"
        )}
      >
        {menuItems.map((item) => (
          <SideMenuButton key={item.href} title={item.title} href={item.href} />
        ))}
        <div className="hidden w-full xl:block">
          <LogoutButtonDesktop />
        </div>
      </div>
    </div>
  )
}
