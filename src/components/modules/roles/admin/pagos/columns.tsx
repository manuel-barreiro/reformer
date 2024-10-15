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

export const createColumns = (
  onOpenDetailModal: (payment: Payment & { user: User }) => void
): ColumnDef<Payment & { user: User }>[] => [
  {
    accessorKey: "user.name",
    header: "USUARIO",
    cell: ({ row }) => {
      const user = row.original.user
      return (
        <div className="flex justify-center">
          <HoverCard>
            <HoverCardTrigger>
              <span className="cursor-pointer whitespace-nowrap underline">
                {getFullName(user).length > 20
                  ? `${getFullName(user).slice(0, 20)}...`
                  : getFullName(user)}
              </span>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto min-w-60 bg-midnight text-pearl">
              <div className="space-y-2">
                <h4 className="font-marcellus text-sm font-semibold">
                  {getFullName(user)}
                </h4>
                <p className="font-dm_mono text-sm">{user.email}</p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      )
    },
  },
  {
    accessorKey: "dateCreated",
    header: "FECHA",
    cell: ({ row }) => new Date(row.original.dateCreated).toLocaleDateString(),
  },
  {
    accessorKey: "purchasedPackage.classPackage.name",
    header: "PAQUETE",
    cell: ({ row }) => row.original.description || "N/A",
  },
  {
    accessorKey: "total",
    header: "TOTAL",
    cell: ({ row }) => `${numberFormatter.format(row.original.total)}`,
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
          <Badge className="flex w-full justify-center bg-midnight py-1 font-dm_mono text-[10px] text-pearl">
            {paymentMethodMap[row.original.paymentTypeId] ||
              row.original.paymentTypeId}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      return (
        <div className="flex w-full justify-center">
          <Badge className="flex w-full justify-center bg-midnight py-1 font-dm_mono text-[10px] text-pearl">
            {statusMap[row.original.status] || row.original.status}
          </Badge>
        </div>
      )
    },
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
  },
]
