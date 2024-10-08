import React from "react"
import { ProfileImageMockup } from "@/assets/icons"
import LogoutButtonDesktop from "@/components/modules/auth/logout-button-desktop"
import LogoutButtonMobile from "@/components/modules/auth/logout-button-mobile"
import SideMenuButton from "@/components/modules/user/common/SideMenuButton"
import { auth } from "@/auth"
import Image from "next/image"

const menuItems = [
  {
    title: "PAQUETES",
    href: "/paquetes",
  },
  {
    title: "RESERVAS",
    href: "/reservas",
  },
  {
    title: "PERFIL",
    href: "/perfil",
  },
]

export default async function SideMenu() {
  const session = await auth()

  return (
    <div className="flex w-full flex-col items-start justify-evenly gap-3 text-sm md:items-center">
      <div className="flex w-full items-center justify-between md:flex-col">
        <div className="flex items-center justify-between gap-3 md:flex-col">
          {session?.user?.image ? (
            <Image
              src={session?.user?.image}
              width={76}
              height={76}
              alt="profile pic"
              className="h-[50px] w-[50px] rounded-full sm:h-[55px] sm:w-[55px] md:h-[76px] md:w-[76px]"
            />
          ) : (
            <ProfileImageMockup className="h-[50px] w-[50px] rounded-full text-grey_pebble sm:h-[55px] sm:w-[55px] md:h-[76px] md:w-[76px]" />
          )}
          <div className="md:text-center">
            <p className="sm font-dm_sans text-base font-medium text-grey_pebble md:text-lg">
              {session?.user?.name}
            </p>
            <p className="sm:text-md cursor-default text-sm font-medium text-grey_pebble/50 md:text-base">
              {session?.user?.email && session.user.email.length > 30
                ? `${session.user.email.slice(0, 27)}...`
                : session?.user?.email}
            </p>
          </div>
        </div>
        <LogoutButtonMobile />
      </div>

      <div className="flex w-full gap-2 md:w-[75%] md:flex-col">
        {menuItems.map((item) => (
          <SideMenuButton key={item.href} title={item.title} href={item.href} />
        ))}
        <div className="hidden w-full md:block">
          <LogoutButtonDesktop />
        </div>
      </div>
    </div>
  )
}
