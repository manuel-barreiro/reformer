import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { User, Role } from "@prisma/client"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react" // Import the Eye icon
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CheckIcon, ChevronDownIcon } from "lucide-react"
import Link from "next/link"

export const createColumns = (
  roleFilter: Role | "all",
  setRoleFilter: (role: Role | "all") => void
): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: "NOMBRE",
    cell: ({ row }) => {
      const user = row.original
      const fullName = user.surname ? `${user.name} ${user.surname}` : user.name

      return (
        <Link
          href={`/admin/usuarios/${user.id}`}
          className="whitespace-nowrap underline hover:text-blue-600"
        >
          {fullName}
        </Link>
      )
    },
  },
  {
    accessorKey: "email",
    header: "EMAIL",
    cell: ({ row }) => row.original.email,
  },
  {
    accessorKey: "phone",
    header: "TELÉFONO",
    cell: ({ row }) => row.original.phone || "N/A",
    enableSorting: false,
  },
  {
    accessorKey: "role",
    header: () => {
      const roleOptions = [
        { label: "Todos", value: "all" },
        { label: "Usuario", value: "user" },
        { label: "Admin", value: "admin" },
      ]

      return (
        <div className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="data-[state=open]:bg-accent h-8 border-none"
              >
                <span>ROL</span>
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[150px] bg-grey_pebble text-pearl"
            >
              {roleOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setRoleFilter(option.value as Role | "all")}
                  className="cursor-pointer border-b border-pearl/50 capitalize hover:!bg-pearlVariant3"
                >
                  <span className="flex-1">{option.label}</span>
                  {roleFilter === option.value && (
                    <CheckIcon className="ml-2 h-4 w-4" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
    cell: ({ row }) => (
      <div className="flex w-full justify-center">
        <Badge className="flex w-full justify-center bg-grey_pebble py-1 font-dm_mono text-[10px] text-pearl">
          {row.original.role === "admin" ? "Admin" : "Usuario"}
        </Badge>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: "FECHA REGISTRO",
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString("es-ES"),
  },
  {
    id: "view",
    header: "VER",
    cell: ({ row }) => {
      const user = row.original
      return (
        <Link href={`/admin/usuarios/${user.id}`}>
          <Button variant="ghost" className="hover:bg-grey_pebble/10">
            <Eye className="h-5 w-5 text-midnight" />
          </Button>
        </Link>
      )
    },
    enableSorting: false,
  },
]
