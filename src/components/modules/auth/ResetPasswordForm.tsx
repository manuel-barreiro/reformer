"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { resetPasswordSchema } from "@/lib/zod-schemas"
import { resetPasswordAction } from "@/actions/auth-actions"
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

interface ResetPasswordFormProps {
  token: string
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [error, setError] = useState<string | null>("")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    setError(null)
    startTransition(async () => {
      const result = await resetPasswordAction(token, values)
      if (result.error) {
        setError(result.error)
      } else {
        router.push("/sign-in?reset=true")
      }
    })
  }

  return (
    <section className="flex items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-auto min-w-96 space-y-6 rounded-lg px-10"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Nueva Contraseña</FormLabel>
                <FormControl>
                  <Input
                    className="border-rust bg-inputBg py-6 font-dm_mono text-midnight ring-rust ring-offset-rust placeholder:text-midnight"
                    type="password"
                    placeholder="NUEVA CONTRASEÑA"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Confirmar Contraseña</FormLabel>
                <FormControl>
                  <Input
                    className="border-rust bg-inputBg py-6 font-dm_mono text-midnight ring-rust ring-offset-rust placeholder:text-midnight"
                    type="password"
                    placeholder="CONFIRMAR CONTRASEÑA"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && <FormMessage>{error}</FormMessage>}
          <Button
            type="submit"
            className="w-full bg-midnight py-6 font-dm_mono text-pearl duration-300 ease-in-out hover:bg-rust"
            disabled={isPending}
          >
            {isPending ? "GUARDANDO..." : "GUARDAR CONTRASEÑA"}
          </Button>
        </form>
      </Form>
    </section>
  )
}
