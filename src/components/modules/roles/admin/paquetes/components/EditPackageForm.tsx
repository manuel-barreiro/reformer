"use client"
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
import { updatePackage, PackageResponse } from "@/actions/package-actions"
import { Checkbox } from "@/components/ui/checkbox"

const packageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  classCount: z.coerce.number().min(1, "Class count must be at least 1"),
  price: z.coerce.number().min(0, "Price must be non-negative"),
  durationMonths: z.coerce.number().min(1, "Duration must be at least 1 day"),
  isVisible: z.boolean().default(true), // Add isVisible
})

type PackageFormValues = z.infer<typeof packageSchema>

interface EditPackageFormProps {
  pack: ClassPackage
  onSuccess: (updatedPackage: ClassPackage) => void
}

const isErrorResponse = (
  response: PackageResponse
): response is { success: false; error: string | Record<string, string[]> } => {
  return !response.success
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
      isVisible: pack.isVisible, // Set default from pack
    },
  })

  async function onSubmit(data: PackageFormValues) {
    setIsSubmitting(true)
    const formData = new FormData()
    // Append all data including isVisible
    Object.entries(data).forEach(([key, value]) => {
      // Convert boolean to string for FormData
      if (typeof value === "boolean") {
        formData.append(key, value.toString())
      } else {
        formData.append(key, value != null ? value.toString() : "")
      }
    })

    try {
      const result = await updatePackage(pack.id, formData)
      if (!isErrorResponse(result)) {
        console.log("Package updated successfully:", result.package)
        onSuccess(result.package)
      } else {
        console.error("Failed to update package:", result.error)
        // Handle potential validation errors from server
        if (typeof result.error === "object") {
          Object.entries(result.error).forEach(([field, messages]) => {
            form.setError(field as keyof PackageFormValues, {
              type: "server",
              message: messages.join(", "),
            })
          })
        }
      }
    } catch (error) {
      console.error("Error updating package:", error)
    } finally {
      setIsSubmitting(false)
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
        <FormField
          control={form.control}
          name="isVisible"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Visible para Usuarios</FormLabel>
                <FormMessage />
              </div>
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
