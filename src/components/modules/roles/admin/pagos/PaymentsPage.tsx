"use client"

import React, { useState, useMemo, useCallback } from "react"
import { Payment, User } from "@prisma/client"
import { createColumns } from "./columns"
import { ReformerTable } from "@/components/ui/table/ReformerTable"
import { AddPaymentModal } from "./AddPaymentModal"
import { PaymentDetailModal } from "./PaymentDetailModal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { updatePayment, deletePayment } from "@/actions/payment-actions" // Assuming these actions exist and work as expected

interface PaymentsPageProps {
  initialPayments: (Payment & { user: User })[]
  isLoading?: boolean // Add isLoading prop if fetching data
}

// Define the combined type explicitly for filterKeys
type PaymentWithUser = Payment & { user: User }

export function PaymentsPage({
  initialPayments,
  isLoading,
}: PaymentsPageProps) {
  const [data, setData] = useState<PaymentWithUser[]>(initialPayments)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentWithUser | null>(null)

  const handleOpenDetailModal = useCallback((payment: PaymentWithUser) => {
    setSelectedPayment(payment)
    setIsDetailModalOpen(true)
  }, [])

  const columns = useMemo(
    () => createColumns(handleOpenDetailModal),
    [handleOpenDetailModal]
  )

  const handleAddPayment = (newPayment: PaymentWithUser) => {
    // Assuming newPayment includes the user object
    setData((prevData) => [newPayment, ...prevData]) // Add to the beginning
    setIsAddModalOpen(false)
  }

  const handleUpdatePayment = async (
    paymentId: string,
    newStatus: string,
    newPaymentMethod: string // Assuming paymentTypeId is meant here
  ) => {
    try {
      // Add UI feedback for loading state if desired
      const updatedFields = await updatePayment(
        paymentId,
        newStatus,
        newPaymentMethod
      ) // Assuming updatePayment returns the updated fields or the full object
      setData((prevData) =>
        prevData.map((payment) =>
          payment.paymentId === paymentId
            ? { ...payment, ...updatedFields }
            : payment
        )
      )
      // Update selected payment if it's the one being edited
      if (selectedPayment?.paymentId === paymentId) {
        setSelectedPayment((prev) =>
          prev ? { ...prev, ...updatedFields } : null
        )
      }
      setIsDetailModalOpen(false) // Close modal on success
    } catch (error) {
      console.error("Failed to update payment:", error)
      // Add user feedback (e.g., toast notification)
    }
  }

  const handleDeletePayment = async (paymentId: string) => {
    try {
      // Add UI feedback for loading state if desired
      await deletePayment(paymentId)
      setData((prevData) =>
        prevData.filter((payment) => payment.paymentId !== paymentId)
      )
      setIsDetailModalOpen(false) // Close modal after deletion
      setSelectedPayment(null)
    } catch (error) {
      console.error("Failed to delete payment:", error)
      // Add user feedback (e.g., toast notification)
    }
  }

  // Define which keys to use for the global search
  // Include top-level keys and nested keys using dot notation.
  const filterKeys = [
    "paymentId", // Add the payment ID
    "user.name", // Add user's name (nested)
    "user.surname", // Add user's surname (nested) - if applicable
    "user.email", // Add user's email (nested)
  ]

  return (
    <>
      <ReformerTable
        columns={columns}
        data={data}
        filterKeys={filterKeys}
        searchPlaceholder="Buscar por ID, Usuario, Email..."
        isLoading={isLoading}
        noResultsMessage="No se encontraron pagos."
        initialPageSize={10} // Example initial page size
      >
        {/* Children: Title and Add Button */}
        <div className="flex w-full flex-col items-start justify-between gap-3 lg:flex-row">
          <h2 className="font-marcellus text-2xl font-bold uppercase">Pagos</h2>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex w-full items-center justify-center bg-midnight font-dm_mono text-pearl hover:bg-midnight/90 lg:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="inline">Cargar Pago | Asignar Paquete</span>{" "}
          </Button>
        </div>
      </ReformerTable>

      {/* Modals remain the same */}
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
          onDeletePayment={handleDeletePayment}
        />
      )}
    </>
  )
}
