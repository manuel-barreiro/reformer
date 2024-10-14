import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ClassPackage } from "@prisma/client"
import { updatePackage } from "@/actions/package-actions"

const packageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  classCount: z.coerce.number().min(1, "Class count must be at least 1"),
  price: z.coerce.number().min(0, "Price must be non-negative"),
  durationMonths: z.coerce.number().min(1, "Duration must be at least 1 day"),
})

type PackageFormValues = z.infer<typeof packageSchema>

interface EditPackageFormProps {
  pack: ClassPackage
  onSuccess: () => void
}

export function EditPackageForm({ pack, onSuccess }: EditPackageFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      name: pack.name,
      description: pack.description || "",
      classCount: pack.classCount,
      price: pack.price,
      durationMonths: pack.durationMonths,
    },
  })

  async function onSubmit(data: PackageFormValues) {
    setIsSubmitting(true)
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString())
    })

    const result = await updatePackage(pack.id, formData)
    setIsSubmitting(false)

    if (result.error) {
      console.error(result.error)
    } else {
      console.log("Package updated successfully:", result.package)
      onSuccess()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Paquete</FormLabel>
              <FormControl>
                <Input
                  className="border border-grey_pebble/40 bg-pearlVariant"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input
                  className="border border-grey_pebble/40 bg-pearlVariant"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="classCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cantidad de clases</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  className="border border-grey_pebble/40 bg-pearlVariant"
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  className="border border-grey_pebble/40 bg-pearlVariant"
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="durationMonths"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duración (meses)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  className="border border-grey_pebble/40 bg-pearlVariant"
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-rust py-6 font-dm_mono text-pearl duration-300 ease-in-out hover:bg-rust/90"
        >
          {isSubmitting ? "Actualizando..." : "Actualizar Paquete"}
        </Button>
      </form>
    </Form>
  )
}
