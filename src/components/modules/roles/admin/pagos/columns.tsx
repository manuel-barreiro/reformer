import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Payment, User } from "@prisma/client"
import { paymentMethodMap, statusMap } from "./constants"
import { numberFormatter } from "@/lib/numberFormatter"
import { MercadoPagoLogo } from "@/assets/icons"
import { ReceiptText } from "lucide-react"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { getFullName } from "@/components/modules/roles/admin/pagos/lib/getFullName"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export const createColumns = (
  onOpenDetailModal: (payment: Payment & { user: User }) => void
): ColumnDef<Payment & { user: User }>[] => [
  {
    accessorKey: "user.name",
    header: "USUARIO",
    cell: ({ row }) => {
      const user = row.original.user
      return (
        <Link
          href={`/admin/usuarios/${user.id}`}
          className="whitespace-nowrap underline hover:text-blue-600"
        >
          {getFullName(user).length > 20
            ? `${getFullName(user).slice(0, 20)}...`
            : getFullName(user)}
        </Link>
      )
    },
    enableSorting: true,
  },
  {
    accessorKey: "dateCreated",
    header: "FECHA",
    cell: ({ row }) =>
      new Date(row.original.dateCreated).toLocaleDateString("es-ES"),
    enableSorting: true,
  },
  {
    accessorKey: "purchasedPackage.classPackage.name",
    header: "PAQUETE",
    cell: ({ row }) => row.original.description || "N/A",
    enableSorting: false,
  },
  {
    accessorKey: "total",
    header: "TOTAL",
    cell: ({ row }) => `${numberFormatter.format(row.original.total)}`,
    enableSorting: true,
  },
  {
    accessorKey: "paymentTypeId",
    header: "MEDIO",
    cell: ({ row }) => {
      if (row.original.paymentType === "mercadopago") {
        return <MercadoPagoLogo className="mx-auto w-24" />
      }

      return (
        <div className="flex w-full justify-center">
          <Badge className="flex w-full justify-center bg-grey_pebble py-1 font-dm_mono text-[10px] text-pearl">
            {paymentMethodMap[row.original.paymentTypeId] ||
              row.original.paymentTypeId}
          </Badge>
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      return (
        <div className="flex w-full justify-center">
          <Badge className="flex w-full justify-center bg-grey_pebble py-1 font-dm_mono text-[10px] text-pearl">
            {statusMap[row.original.status] || row.original.status}
          </Badge>
        </div>
      )
    },
    enableSorting: true,
  },
  {
    accessorKey: "detail",
    header: "DETALLE",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Button variant="ghost" onClick={() => onOpenDetailModal(row.original)}>
          <ReceiptText className="w-6" />
        </Button>
      </div>
    ),
    enableSorting: false,
  },
]
