"use client"
import { usePathname } from "next/navigation"
import { title } from "process"

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
  {
    title: "Mi Perfil",
    url: "/perfil",
  },
  {
    title: "Pagos",
    url: "/admin/pagos",
  },
  {
    title: "Paquetes",
    url: "/admin/paquetes",
  },
  {
    title: "Calendario",
    url: "/admin/calendario",
  },
  {
    title: "Usuarios",
    url: "/admin/usuarios",
  },
  {
    title: "Categorias",
    url: "/admin/categorias",
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
