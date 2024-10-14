import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { PackageType, User } from "@prisma/client"
import { useTransition } from "react"

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
import { Input } from "@/components/ui/input"
import { UserSearch } from "@/components/modules/roles/common/UserSearch"
import { createManualPayment } from "@/actions/manual-payment"

const formSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  }),
  packageType: z.nativeEnum(PackageType),
  amount: z.number().positive(),
  paymentMethod: z.enum(["efectivo", "transferencia"]),
})

export function ManualPaymentForm() {
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      packageType: PackageType.pkg_1,
      amount: 0,
      paymentMethod: "efectivo",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        await createManualPayment(
          values.user.id,
          values.packageType,
          values.amount,
          values.paymentMethod
        )
        alert("Pago registrado exitosamente")
        form.reset()
      } catch (error) {
        console.error("Error al registrar el pago:", error)
        alert("Error al registrar el pago")
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="user"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuario</FormLabel>
              <FormControl>
                <UserSearch
                  onSelectUser={(user: User) => field.onChange(user)}
                />
              </FormControl>
              <FormDescription>Busca y selecciona un usuario.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="packageType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Paquete</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un paquete" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={PackageType.pkg_1}>1 Clase</SelectItem>
                  <SelectItem value={PackageType.pkg_4}>4 Clases</SelectItem>
                  <SelectItem value={PackageType.pkg_8}>8 Clases</SelectItem>
                  <SelectItem value={PackageType.pkg_12}>12 Clases</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un método de pago" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="transferencia">
                    Transferencia bancaria
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Registrando..." : "Registrar Pago"}
        </Button>
      </form>
    </Form>
  )
}
