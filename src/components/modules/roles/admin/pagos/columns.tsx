import { ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { Payment } from "./types"
import {
  paymentMethodMap,
  statusMap,
  productMap,
  manualPaymentMap,
  manualPaymentStatusMap,
} from "./constants"
import { numberFormatter } from "@/lib/numberFormatter"
import { MercadoPagoLogo } from "@/assets/icons"
import { useState } from "react"
import { PaymentDetailModal } from "./PaymentDetailModal"
import { ReceiptText } from "lucide-react"

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "user.name",
    header: "CLIENTE",
  },
  {
    accessorKey: "dateCreated",
    header: "FECHA",
    cell: ({ row }) => row.original.dateCreated.toLocaleDateString(),
  },
  {
    accessorKey: "packageType",
    header: "PRODUCTO",
    cell: ({ row }) =>
      productMap[row.original.packageType] || row.original.packageType,
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
      const [isModalOpen, setIsModalOpen] = useState(false)

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
      const isMercadoPago = [
        "account_money",
        "credit_card",
        "debit_card",
      ].includes(row.original.paymentTypeId)

      if (isMercadoPago) {
        return statusMap[row.original.status] || row.original.status
      }

      return statusMap[row.original.status] || row.original.status
    },
  },
  {
    accessorKey: "detail",
    header: "DETAIL",
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
