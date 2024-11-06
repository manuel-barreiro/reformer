"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { forgotPasswordSchema } from "@/lib/zod-schemas"
import { forgotPasswordAction } from "@/actions/auth-actions"
import { isError } from "@/types"
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

export default function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>("")
  const [success, setSuccess] = useState<boolean>(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setError(null)
    startTransition(async () => {
      const result = await forgotPasswordAction(values)
      if (isError(result)) {
        setError(result.error)
      } else {
        setSuccess(true)
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
          {success ? (
            <div className="text-center text-green-600">
              Te enviamos un email con las instrucciones para restablecer tu
              contraseña
            </div>
          ) : (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Email</FormLabel>
                    <FormControl>
                      <Input
                        className="border-rust bg-inputBg py-6 font-dm_mono text-midnight ring-rust ring-offset-rust placeholder:text-midnight"
                        type="email"
                        placeholder="EMAIL"
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
                {isPending ? "ENVIANDO..." : "ENVIAR EMAIL"}
              </Button>
            </>
          )}
          <p className="mt-4 text-center text-sm text-grey_pebble">
            Nota: Si creaste tu cuenta con Google, deberás iniciar sesión usando
            Google.
          </p>
        </form>
      </Form>
    </section>
  )
}
