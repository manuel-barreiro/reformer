"use client"

import React, { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { User, ClassPackage, Payment } from "@prisma/client"
import { useTransition } from "react"
import { numberFormatter } from "@/lib/numberFormatter"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
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
import { UserSearch } from "@/components/modules/roles/common/UserSearch"
import { createManualPayment } from "@/actions/manual-payment"
import { fetchClassPackages } from "@/actions/fetch-class-packages"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  user: z
    .object({
      id: z.string(),
      name: z.string(),
      surname: z.string().nullable(),
      email: z.string().email(),
      phone: z.string().nullable(),
      password: z.string().nullable(),
      emailVerified: z.date().nullable(),
      image: z.string().nullable(),
      role: z.enum(["user", "admin"]),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
    .nullable(),
  classPackageId: z.string(),
  paymentTypeId: z.enum(["cash", "bank_transfer"]),
})

interface ManualPaymentFormProps {
  onAddPayment: (payment: Payment & { user: User }) => void
  onClose: () => void
}

export function ManualPaymentForm({
  onAddPayment,
  onClose,
}: ManualPaymentFormProps) {
  const [isPending, startTransition] = useTransition()
  const [classPackages, setClassPackages] = useState<ClassPackage[]>([])
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: null,
      classPackageId: "",
      paymentTypeId: "cash",
    },
  })

  useEffect(() => {
    fetchClassPackages().then(setClassPackages)
  }, [])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        if (!values.user) {
          throw new Error("Please select a user")
        }
        const selectedPackage = classPackages.find(
          (pkg) => pkg.id === values.classPackageId
        )
        if (!selectedPackage) {
          throw new Error("Selected package not found")
        }
        const payment = await createManualPayment(
          values.user.id,
          values.classPackageId,
          selectedPackage.price,
          values.paymentTypeId
        )
        onAddPayment({ ...payment, user: values.user })
        form.reset()
        toast({
          title: "Pago registrado",
          description: "El pago manual se ha registrado exitosamente.",
          variant: "reformer",
        })
      } catch (error) {
        console.error("Error al registrar el pago:", error)
        toast({
          title: "Error",
          description: "Error al registrar el pago. Por favor, intente nuevamente.",
          variant: "destructive",
        })
      }})
    
  }

  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="user"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuario</FormLabel>
              <FormControl>
                <UserSearch
                  onSelectUser={(user: User | null) => field.onChange(user)}
                  selectedUser={field.value}
                />
              </FormControl>
              <FormDescription>Busca y selecciona un usuario.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="classPackageId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paquete</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-rust/50 bg-pearlVariant font-semibold text-grey_pebble/60">
                    <SelectValue
                      placeholder="Selecciona un paquete"
                      className="uppercase placeholder:uppercase"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-grey_pebble text-pearl">
                  {classPackages.map((pkg) => (
                    <SelectItem
                      key={pkg.id}
                      value={pkg.id}
                      className="border-b border-pearl/50 uppercase hover:!bg-pearlVariant3"
                    >
                      {pkg.name} - {numberFormatter.format(pkg.price)}
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
          name="paymentTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Método de Pago</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-rust/50 bg-pearlVariant font-semibold text-grey_pebble/60">
                    <SelectValue
                      placeholder="Selecciona un método de pago"
                      className="uppercase placeholder:uppercase"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-grey_pebble text-pearl">
                  <SelectItem
                    value="cash"
                    className="border-b border-pearl/50 uppercase hover:!bg-pearlVariant2"
                  >
                    Efectivo
                  </SelectItem>
                  <SelectItem
                    value="bank_transfer"
                    className="border-b border-pearl/50 uppercase hover:!bg-pearlVariant2"
                  >
                    Transferencia bancaria
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <div className="text-red-500">{error}</div>}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-rust py-6 font-dm_mono text-pearl duration-300 ease-in-out hover:bg-rust/90"
        >
          {isPending ? "Registrando..." : "Cargar Pago | Asignar Paquete"}
        </Button>
      </form>
    </Form>
  )
}
