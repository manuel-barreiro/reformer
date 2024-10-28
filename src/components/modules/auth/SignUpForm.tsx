"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { registerSchema } from "@/lib/zod-schemas"
import { Button } from "@/components/ui/button"
import { Separator } from "@radix-ui/react-separator"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { registerAction } from "@/actions/auth-actions"
import GoogleLoginButton from "./login-google-button"

export default function SignUpForm() {
  const [error, setError] = useState<string | null>("")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      surname: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "", // Add this line
    },
  })

  function onRegister(values: z.infer<typeof registerSchema>) {
    setError(null)
    startTransition(async () => {
      const register = await registerAction(values)
      if (register.error) {
        setError(register.error)
      } else {
        router.push("/paquetes")
      }
    })
  }

  return (
    <section className="flex items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onRegister)}
          className="w-auto min-w-96 space-y-6 rounded-lg px-10"
        >
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Nombre</FormLabel>
                  <FormControl>
                    <Input
                      className="border-rust bg-inputBg py-6 font-dm_mono text-midnight ring-rust ring-offset-rust placeholder:text-midnight"
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
                <FormItem>
                  <FormLabel className="sr-only">Surname</FormLabel>
                  <FormControl>
                    <Input
                      className="border-rust bg-inputBg py-6 font-dm_mono text-midnight ring-rust ring-offset-rust placeholder:text-midnight"
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

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Celular</FormLabel>
                <FormControl>
                  <Input
                    className="border-rust bg-inputBg py-6 font-dm_mono text-midnight ring-rust ring-offset-rust placeholder:text-midnight"
                    type="phone"
                    placeholder="CELULAR"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Contraseña</FormLabel>
                <FormControl>
                  <Input
                    className="border-rust bg-inputBg py-6 font-dm_mono text-midnight ring-rust ring-offset-rust placeholder:text-midnight"
                    type="password"
                    placeholder="CONTRASEÑA"
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
            SIGN UP
          </Button>
          <div className="flex w-full items-center justify-around">
            <Separator
              orientation="horizontal"
              className="h-[0.5px] w-24 bg-rust md:w-32"
            />
            <p className="w-auto font-dm_mono text-xs">O TAMBIÉN</p>
            <Separator
              orientation="horizontal"
              className="h-[0.5px] w-24 bg-rust md:w-32"
            />
          </div>
          <GoogleLoginButton />
        </form>
      </Form>
    </section>
  )
}
