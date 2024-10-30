"use client"
import React, { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { updateProfile } from "@/actions/profile"
import { useToast } from "@/components/ui/use-toast"

const userInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  surname: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email(),
})

interface UserInfo {
  name: string
  surname: string
  phone: string
  email: string
  id: string
}

export default function UserInfoForm({ userInfo }: { userInfo: UserInfo }) {
  const [error, setError] = useState<string | null>("")
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof userInfoSchema>>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      name: userInfo.name,
      surname: userInfo?.surname,
      phone: userInfo?.phone,
      email: userInfo.email,
    },
  })

  function onSubmitUserInfo(values: z.infer<typeof userInfoSchema>) {
    setError(null)
    startTransition(async () => {
      const { name, surname, phone } = values
      const result = await updateProfile(userInfo.id, {
        name,
        surname,
        phone,
      })

      if (result.success) {
        toast({
          title: "Perfil actualizado :)",
          description: "Tu perfil ha sido actualizado correctamente.",
          variant: "reformer",
        })
        router.refresh()
      } else {
        setError(result.error ?? "Unknown error")
        toast({
          title: "Error al actualizar el perfil",
          description: error,
          variant: "destructive",
        })
      }
    })
  }

  return (
    <section className="flex items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitUserInfo)}
          className="w-full space-y-6 py-5 md:p-10"
        >
          <div className="flex w-full gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel className="sr-only">Nombre</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full border-rust bg-pearlVariant py-6 font-dm_mono font-bold text-grey_pebble/50 ring-rust ring-offset-rust placeholder:text-grey_pebble/50"
                      type="text"
                      placeholder="NOMBRE"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel className="sr-only">Surname</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full border-rust bg-pearlVariant py-6 font-dm_mono font-bold text-grey_pebble/50 ring-rust ring-offset-rust placeholder:text-grey_pebble/50"
                      type="text"
                      placeholder="APELLIDO"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Email</FormLabel>
                <FormControl>
                  <Input
                    className="border-rust bg-pearlVariant py-6 font-dm_mono text-grey_pebble/50 ring-rust ring-offset-rust placeholder:text-grey_pebble/50"
                    type="email"
                    placeholder="EMAIL"
                    disabled
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Celular</FormLabel>
                <FormControl>
                  <Input
                    className="border-rust bg-pearlVariant py-6 font-dm_mono font-bold text-grey_pebble/50 ring-rust ring-offset-rust placeholder:text-grey_pebble/50"
                    type="tel"
                    placeholder="CELULAR"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-midnight py-6 font-dm_mono text-pearl duration-300 ease-in-out hover:bg-rust disabled:opacity-50"
            disabled={isPending}
          >
            {isPending ? "ACTUALIZANDO..." : "GUARDAR"}
          </Button>

          {error && <p className="text-center text-red-500">{error}</p>}
        </form>
      </Form>
    </section>
  )
}
