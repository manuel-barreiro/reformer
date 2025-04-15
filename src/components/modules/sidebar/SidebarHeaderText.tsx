"use client"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
// Removed unused import: import { title } from "process"

// Define a type for the header items for better type safety
type HeaderTextItem = {
  title: React.ReactNode // Allow JSX elements like the Link
  url?: string // Make url optional if match is used
  match?: (path: string) => boolean
}

const headerTexts: HeaderTextItem[] = [
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
    title: "Admin | Pagos",
    url: "/admin/pagos",
  },
  {
    title: "Admin | Paquetes",
    url: "/admin/paquetes",
  },
  {
    title: "Admin | Calendario",
    url: "/admin/calendario",
  },
  {
    title: "Admin | Usuarios",
    url: "/admin/usuarios",
  },
  {
    title: "Admin | Categorias",
    url: "/admin/categorias",
  },
  // Dynamic route definition - place it before more general ones if needed,
  // though the logic below handles precedence correctly.
  {
    title: (
      <Link
        href="/admin/usuarios"
        className="flex items-center text-sm text-gray-500 hover:text-gray-700"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Volver a usuarios
      </Link>
    ),
    // Match function to check if the path starts with /admin/usuarios/
    // and is not the base /admin/usuarios page itself.
    match: (path: string) =>
      path.startsWith("/admin/usuarios/") && path !== "/admin/usuarios",
    // url is not needed here as match is used
  },
]

export default function SidebarHeaderText() {
  const pathname = usePathname()

  // Find the matching header text using the updated logic
  const matchingHeader = headerTexts.find((header) => {
    // Prioritize the match function if it exists
    if (header.match) {
      return header.match(pathname)
    }
    // Fallback to exact URL match if match function doesn't exist or didn't match
    if (header.url) {
      return header.url === pathname
    }
    // If neither match nor url is defined, it can't match
    return false
  })

  const headerText = matchingHeader?.title

  // Render only if a matching title is found
  if (!headerText) {
    return null
  }

  return <div className="font-dm_mono uppercase">{headerText}</div> // Changed p to div for ReactNode compatibility
}
