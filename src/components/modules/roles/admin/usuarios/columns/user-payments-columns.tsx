import { ColumnDef } from "@tanstack/react-table"
import { Payment } from "@prisma/client"
import { Badge } from "@/components/ui/badge"

interface UserPaymentsColumnsProps {
  formatDate: (date: Date) => string
  formatPaymentStatus: (status: string) => string
  getStatusBadgeColor: (status: string) => string
}

export const userPaymentsColumns = (
  formatDate: (date: Date) => string,
  formatPaymentStatus: (status: string) => string,
  getStatusBadgeColor: (status: string) => string
): ColumnDef<Payment>[] => [
  {
    accessorKey: "paymentId",
    header: "ID de Pago",
    enableSorting: false,
  },
  {
    accessorKey: "dateCreated",
    header: "Fecha",
    cell: ({ row }) => formatDate(row.original.dateCreated),
    enableSorting: true,
  },
  {
    accessorKey: "description",
    header: "Descripción",
    enableSorting: true,
  },
  {
    accessorKey: "total",
    header: "Monto",
    cell: ({ row }) => `$${row.original.total.toFixed(2)}`,
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge
          className={`${getStatusBadgeColor(row.original.status)} text-pearl`}
        >
          {formatPaymentStatus(row.original.status)}
        </Badge>
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "paymentType",
    header: "Tipo de Pago",
    enableSorting: true,
  },
]
