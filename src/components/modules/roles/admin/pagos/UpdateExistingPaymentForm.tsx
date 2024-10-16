"use client"
import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
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
import { manualPaymentMap, statusMap } from "./constants"

const formSchema = z.object({
  status: z.string().min(1, { message: "Por favor seleccione un estado" }),
  paymentMethod: z
    .string()
    .min(1, { message: "Por favor seleccione un método de pago" }),
})

interface PaymentUpdateFormProps {
  payment: Payment & { user: User }
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>
  isPending: boolean
}

export function UpdateExistingPaymentForm({
  payment,
  onSubmit,
  isPending,
}: PaymentUpdateFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: payment.status,
      paymentMethod: payment.paymentTypeId,
    },
  })

  React.useEffect(() => {
    form.reset({
      status: payment.status,
      paymentMethod: payment.paymentTypeId,
    })
  }, [payment, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="col-span-1 w-full">
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
              <FormItem className="col-span-1 w-full">
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
                    {Object.entries(manualPaymentMap).map(([key, value]) => (
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
        </div>
        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-rust py-6 font-dm_mono text-pearl duration-300 ease-in-out hover:bg-rust/90"
        >
          {isPending ? "Actualizando..." : "Actualizar Pago"}
        </Button>
      </form>
    </Form>
  )
}
