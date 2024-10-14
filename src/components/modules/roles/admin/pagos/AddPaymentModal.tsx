"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Payment } from "./types"
import { ManualPaymentForm } from "./ManualPaymentForm"

interface AddPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onAddPayment: (payment: Payment) => void
}

export function AddPaymentModal({
  isOpen,
  onClose,
  onAddPayment,
}: AddPaymentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Payment</DialogTitle>
        </DialogHeader>
        <ManualPaymentForm />
      </DialogContent>
    </Dialog>
  )
}
