"use client"
import React, { useState, useCallback, useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
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
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
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
  const [globalFilter, setGlobalFilter] = useState("")

  const handleOpenDetailModal = useCallback(
    (payment: Payment & { user: User }) => {
      setSelectedPayment(payment)
      setIsDetailModalOpen(true)
    },
    []
  )

  const columns = useMemo(
    () => createColumns(handleOpenDetailModal),
    [handleOpenDetailModal]
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const searchValue = filterValue.toLowerCase()
      const payment = row.original
      return (
        payment.paymentId.toLowerCase().includes(searchValue) ||
        payment.user.name.toLowerCase().includes(searchValue) ||
        (payment.user.surname || "").toLowerCase().includes(searchValue) ||
        payment.user.email.toLowerCase().includes(searchValue)
      )
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })

  const handleAddPayment = (newPayment: Payment & { user: User }) => {
    setData((prevData) => [newPayment, ...prevData])
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

      setData((prevData) =>
        prevData.map((payment) =>
          payment.paymentId === paymentId
            ? { ...payment, ...updatedPayment }
            : payment
        )
      )

      setIsDetailModalOpen(false)
    } catch (error) {
      console.error("Failed to update payment:", error)
    }
  }

  return (
    <div className="w-full max-w-4xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-marcellus text-2xl font-bold uppercase">Pagos</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-80 rounded-lg border border-rust/50 bg-pearlVariant pl-10 font-semibold text-grey_pebble/60 shadow-md"
              placeholder="Buscar..."
            />
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-midnight font-dm_mono"
          >
            <Plus className="mr-2 h-4 w-4" /> Agregar pago
          </Button>
        </div>
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
                    No se encontraron resultados.
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
