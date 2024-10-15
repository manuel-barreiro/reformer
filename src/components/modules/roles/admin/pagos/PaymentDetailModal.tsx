"use client"
import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Payment, User } from "@prisma/client"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { manualPaymentMap, statusMap } from "./constants"
import { getFullName } from "@/components/modules/roles/admin/pagos/lib/getFullName"
import { numberFormatter } from "@/lib/numberFormatter"

const formSchema = z.object({
  status: z.string().min(1, { message: "Por favor seleccione un estado" }),
  paymentMethod: z
    .string()
    .min(1, { message: "Por favor seleccione un método de pago" }),
})

interface PaymentDetailModalProps {
  isOpen: boolean
  onClose: () => void
  payment: Payment & { user: User }
  onUpdatePayment: (
    paymentId: string,
    newStatus: string,
    newPaymentMethod: string
  ) => Promise<void>
}

export function PaymentDetailModal({
  isOpen,
  onClose,
  payment,
  onUpdatePayment,
}: PaymentDetailModalProps) {
  const isManualPayment = payment.paymentType === "manual"

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: payment.status,
      paymentMethod: payment.paymentTypeId,
    },
    values: {
      status: payment.status,
      paymentMethod: payment.paymentTypeId,
    },
  })

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        status: payment.status,
        paymentMethod: payment.paymentTypeId,
      })
    }
  }, [isOpen, payment, form])

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    await onUpdatePayment(
      payment.paymentId,
      values.status,
      values.paymentMethod
    )
    onClose()
  }

  const paymentDetails = [
    {
      label: "Usuario",
      value:
        getFullName(payment.user).length > 20
          ? `${getFullName(payment.user).slice(0, 20)}...`
          : getFullName(payment.user),
    },
    { label: "Email", value: payment.user.email },
    { label: "Total", value: numberFormatter.format(payment.total) },
    { label: "ID de Pago", value: payment.paymentId },
    {
      label: "Fecha de Creación",
      value: new Date(payment.dateCreated).toLocaleString(),
    },
    {
      label: "Última Actualización",
      value: new Date(payment.dateLastUpdated).toLocaleString(),
    },
    ...(payment.paymentType === "mercadopago"
      ? [
          {
            label: "Fecha de Liberación",
            value: payment.moneyReleaseDate
              ? new Date(payment.moneyReleaseDate).toLocaleString()
              : "N/A",
          },
        ]
      : []),
    { label: "Descripción", value: payment.description || "N/A" },
    { label: "Estado Detallado", value: payment.statusDetail || "N/A" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="mb-2 text-2xl font-bold">
            Detalles del Pago
          </DialogTitle>
        </DialogHeader>
        <Table>
          <TableBody className="bg-pearlVariant text-sm text-tableContent">
            {paymentDetails.map((detail, index) => (
              <TableRow key={index} className="border-b border-grey_pebble">
                <TableCell className="font-medium">{detail.label}</TableCell>
                <TableCell>{detail.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {isManualPayment && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado del Pago</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-rust/50 bg-pearlVariant font-semibold text-grey_pebble/60">
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-grey_pebble text-pearl">
                        {Object.entries(statusMap).map(([key, value]) => (
                          <SelectItem
                            key={key}
                            value={key}
                            className="border-b border-pearl/50 uppercase hover:!bg-pearlVariant3"
                          >
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de Pago</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-rust/50 bg-pearlVariant font-semibold text-grey_pebble/60">
                          <SelectValue placeholder="Seleccionar método de pago" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-grey_pebble text-pearl">
                        {Object.entries(manualPaymentMap).map(
                          ([key, value]) => (
                            <SelectItem
                              key={key}
                              value={key}
                              className="border-b border-pearl/50 uppercase hover:!bg-pearlVariant3"
                            >
                              {value}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-rust py-6 font-dm_mono text-pearl duration-300 ease-in-out hover:bg-rust/90"
              >
                Actualizar Pago
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
