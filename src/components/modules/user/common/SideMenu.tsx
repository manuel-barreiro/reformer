import React from "react"
import { ProfileImageMockup } from "@/assets/icons"
import LogoutButton from "@/components/modules/auth/logout-button"
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
    <div className="flex w-full flex-col items-center justify-evenly gap-3">
      {session?.user?.image ? (
        <Image
          src={session?.user?.image}
          height={96}
          width={96}
          alt="profile pic"
          className="rounded-full"
        />
      ) : (
        <ProfileImageMockup className="h-24 w-24 text-grey_pebble" />
      )}
      <div className="text-center">
        <p className="font-dm_sans text-lg font-medium text-grey_pebble">
          {session?.user?.name}
        </p>
        <p className="text-md font-medium text-grey_pebble/50">
          {session?.user?.email && session.user.email.length > 30
            ? `${session.user.email.slice(0, 27)}...`
            : session?.user?.email}
        </p>
      </div>

      <div className="flex w-[80%] flex-col gap-2">
        {menuItems.map((item) => (
          <SideMenuButton key={item.href} title={item.title} href={item.href} />
        ))}
      </div>

      <LogoutButton />
    </div>
  )
}
