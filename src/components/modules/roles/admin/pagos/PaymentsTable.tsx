"use client"
import React, { useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { columns } from "./columns"
import { PaginationControls } from "./PaginationControls"
import { Payment, User } from "@prisma/client"
import { AddPaymentModal } from "./AddPaymentModal"

interface PaymentsTableProps {
  initialPayments: (Payment & { user: User })[]
}

export function PaymentsTable({ initialPayments }: PaymentsTableProps) {
  const [data, setData] =
    useState<(Payment & { user: User })[]>(initialPayments)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })

  const handleAddPayment = (newPayment: Payment & { user: User }) => {
    setData([...data, newPayment])
    setIsAddModalOpen(false)
  }
  return (
    <div className="w-full max-w-4xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-marcellus text-2xl font-bold uppercase">Pagos</h2>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-midnight font-dm_mono"
        >
          <Plus className="mr-2 h-4 w-4" /> Agregar pago
        </Button>
      </div>
      <div className="rounded-md border">
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader className="sticky top-0 bg-pearlVariant3 font-dm_sans font-black text-midnight">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="font-dm_sans text-sm font-semibold text-midnight"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="bg-pearlVariant text-sm text-tableContent">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-b border-grey_pebble"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      <PaginationControls table={table} />
      <AddPaymentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddPayment={handleAddPayment}
      />
    </div>
  )
}
