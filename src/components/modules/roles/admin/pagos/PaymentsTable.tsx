"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

interface Payment {
  id: string
  paymentId: string
  packageType: string
  dateCreated: Date
  total: number
  status: string
  paymentTypeId: string
  user: {
    name: string
  }
}

const paymentMethodMap: { [key: string]: string } = {
  cash: "Efectivo",
  bank_transfer: "Transferencia Bancaria",
  debit_card: "Tarjeta de Débito",
  credit_card: "Tarjeta de Crédito",
}

const statusMap: { [key: string]: string } = {
  pending: "ESPERANDO PAGO",
  paid: "PAGADA",
}

const columns: ColumnDef<Payment>[] = [
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
  },
  {
    accessorKey: "total",
    header: "TOTAL",
    cell: ({ row }) => `$${row.original.total.toFixed(2)}`,
  },
  {
    accessorKey: "paymentTypeId",
    header: "MEDIO DE PAGO",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-full justify-start">
            {paymentMethodMap[row.original.paymentTypeId] ||
              row.original.paymentTypeId}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Cambiar medio de pago</DropdownMenuLabel>
          {Object.entries(paymentMethodMap).map(([key, value]) => (
            <DropdownMenuItem key={key}>{value}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  {
    accessorKey: "status",
    header: "ESTADO DE LA COMPRA",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-full justify-start">
            {statusMap[row.original.status] || row.original.status}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Cambiar estado</DropdownMenuLabel>
          {Object.entries(statusMap).map(([key, value]) => (
            <DropdownMenuItem key={key}>{value}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

interface PaymentsTableProps {
  initialPayments: Payment[]
}

export function PaymentsTable({ initialPayments }: PaymentsTableProps) {
  const [data] = React.useState(initialPayments)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
