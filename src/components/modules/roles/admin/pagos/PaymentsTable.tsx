"use client"
import React, { useState, useCallback } from "react"
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
import { createColumns } from "./columns"
import { PaginationControls } from "./PaginationControls"
import { Payment, User } from "@prisma/client"
import { AddPaymentModal } from "./AddPaymentModal"
import { PaymentDetailModal } from "./PaymentDetailModal"
import { updatePayment } from "@/actions/payment-actions"

interface PaymentsTableProps {
  initialPayments: (Payment & { user: User })[]
}

export function PaymentsTable({ initialPayments }: PaymentsTableProps) {
  const [data, setData] =
    useState<(Payment & { user: User })[]>(initialPayments)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<
    (Payment & { user: User }) | null
  >(null)

  const handleOpenDetailModal = useCallback(
    (payment: Payment & { user: User }) => {
      setSelectedPayment(payment)
      setIsDetailModalOpen(true)
    },
    []
  )

  const columns = createColumns(handleOpenDetailModal)

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

  const handleUpdatePayment = async (
    paymentId: string,
    newStatus: string,
    newPaymentMethod: string
  ) => {
    try {
      const updatedPayment = await updatePayment(
        paymentId,
        newStatus,
        newPaymentMethod
      )

      // Update the local state
      setData((prevData) =>
        prevData.map((payment) =>
          payment.paymentId === paymentId
            ? { ...payment, ...updatedPayment }
            : payment
        )
      )

      // Close the modal after updating
      setIsDetailModalOpen(false)
    } catch (error) {
      console.error("Failed to update payment:", error)
      // Handle the error (e.g., show an error message to the user)
    }
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
                      className="text-center font-dm_sans text-sm font-semibold text-midnight"
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
                      <TableCell key={cell.id} className="text-center">
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
      {selectedPayment && (
        <PaymentDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          payment={selectedPayment}
          onUpdatePayment={handleUpdatePayment}
        />
      )}
    </div>
  )
}
