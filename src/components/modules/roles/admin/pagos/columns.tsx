import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Payment, User } from "@prisma/client"
import { paymentMethodMap, statusMap } from "./constants"
import { numberFormatter } from "@/lib/numberFormatter"
import { MercadoPagoLogo } from "@/assets/icons"
import { useState } from "react"
import { PaymentDetailModal } from "./PaymentDetailModal"
import { ReceiptText } from "lucide-react"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

const getFullName = (user: User) => {
  return user.surname ? `${user.name} ${user.surname}` : user.name
}

export const columns: ColumnDef<Payment & { user: User }>[] = [
  {
    accessorKey: "user.name",
    header: "USUARIO",
    cell: ({ row }) => {
      const user = row.original.user
      return (
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
      const isMercadoPago = [
        "account_money",
        "credit_card",
        "debit_card",
      ].includes(row.original.paymentTypeId)

      if (isMercadoPago) {
        return <MercadoPagoLogo className="mx-auto w-8" />
      }

      return (
        <span>
          {paymentMethodMap[row.original.paymentTypeId] ||
            row.original.paymentTypeId}
        </span>
      )
    },
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      return statusMap[row.original.status] || row.original.status
    },
  },
  {
    accessorKey: "detail",
    header: "DETALLE",
    cell: ({ row }) => {
      const [isModalOpen, setIsModalOpen] = useState(false)
      return (
        <>
          <Button variant="ghost" onClick={() => setIsModalOpen(true)}>
            <ReceiptText className="w-6" />
          </Button>
          <PaymentDetailModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            payment={row.original}
          />
        </>
      )
    },
  },
]
