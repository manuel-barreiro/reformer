import React from "react"
import { ProfileImageMockup } from "@/assets/icons"
import LogoutButtonDesktop from "@/components/modules/auth/logout-button-desktop"
import LogoutButtonMobile from "@/components/modules/auth/logout-button-mobile"
import SideMenuButton from "@/components/modules/user/common/SideMenuButton"
import { auth } from "@/auth"
import Image from "next/image"

const menuItems = [
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
]

export default async function SideMenu() {
  const session = await auth()

  return (
    <div className="flex w-full flex-col items-start justify-evenly gap-10 text-sm md:items-center">
      <div className="flex w-full items-center justify-between gap-12 md:flex-col">
        <span className="ml-12 self-start font-marcellus text-4xl font-medium text-grey_pebble">
          Admin
        </span>
        <div className="flex items-center justify-between gap-3">
          {session?.user?.image ? (
            <Image
              src={session?.user?.image}
              width={76}
              height={76}
              alt="profile pic"
            />
          ) : (
            <ProfileImageMockup className="h-[50px] w-[50px] rounded-full text-grey_pebble sm:h-[55px] sm:w-[55px] md:h-[45px] md:w-[45px]" />
          )}
          <div>
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
