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
  },
  {
    accessorKey: "dateCreated",
    header: "Fecha",
    cell: ({ row }) => formatDate(row.original.dateCreated),
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    accessorKey: "total",
    header: "Monto",
    cell: ({ row }) => `$${row.original.total.toFixed(2)}`,
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
  },
  {
    accessorKey: "paymentType",
    header: "Tipo de Pago",
  },
]
