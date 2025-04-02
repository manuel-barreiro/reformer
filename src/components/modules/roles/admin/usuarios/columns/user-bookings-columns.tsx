import { ColumnDef } from "@tanstack/react-table"
import { ExtendedBooking } from "@/components/modules/roles/admin/usuarios/tabs/UserBookingsTab"
import { Badge } from "@/components/ui/badge"

interface UserBookingsColumnsProps {
  formatDate: (date: Date) => string
  formatTime: (date: Date) => string
  formatBookingStatus: (status: string) => string
  getStatusBadgeColor: (status: string) => string
}

export const userBookingsColumns = (
  formatDate: (date: Date) => string,
  formatTime: (date: Date) => string,
  formatBookingStatus: (status: string) => string,
  getStatusBadgeColor: (status: string) => string
): ColumnDef<ExtendedBooking>[] => [
  {
    accessorKey: "class.category.name",
    header: "Clase",
    cell: ({ row }) =>
      `${row.original.class.category.name} - ${row.original.class.subcategory.name}`,
    enableSorting: true,
  },
  {
    accessorKey: "class.date",
    header: "Fecha Clase",
    cell: ({ row }) => formatDate(row.original.class.date),
  },
  {
    accessorKey: "class.startTime",
    header: "Horario",
    cell: ({ row }) =>
      `${formatTime(row.original.class.startTime)} - ${formatTime(
        row.original.class.endTime
      )}`,
    enableSorting: true,
  },
  {
    accessorKey: "class.instructor",
    header: "Instructor",
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge
          className={`${getStatusBadgeColor(row.original.status)} text-pearl`}
        >
          {formatBookingStatus(row.original.status)}
        </Badge>
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "createdAt",
    header: "Creación Reserva",
    cell: ({ row }) => formatDate(row.original.createdAt),
    enableSorting: true,
  },
]
