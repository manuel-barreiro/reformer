"use client"
import { usePathname } from "next/navigation"

const headerTexts = [
  {
    title: "Mis Paquetes",
    url: "/paquetes",
  },
  {
    title: "Mis Reservas",
    url: "/reservas",
  },
  {
    title: "Calendario de clases",
    url: "/calendario",
  },
]

export default function SidebarHeaderText() {
  const pathname = usePathname()
  const headerText = headerTexts.find(
    (header) => header.url === pathname
  )?.title
  if (headerText === undefined || headerText === "") return null
  return <p className="font-dm_mono uppercase">{headerText}</p>
}
