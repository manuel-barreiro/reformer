"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { loginSchema } from "@/lib/zod-schemas"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { loginAction } from "@/actions/auth-actions"
import { useState, useTransition } from "react"
import GoogleLoginButton from "./login-google-button"
import { Separator } from "@radix-ui/react-separator"

interface FormLoginProps {
  isVerified: boolean
  OAuthAccountNotLinked: boolean
}
export default function SignInForm({
  isVerified,
  OAuthAccountNotLinked,
}: FormLoginProps) {
  const [error, setError] = useState<string | null>("")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onLogin(values: z.infer<typeof loginSchema>) {
    setError(null)
    startTransition(async () => {
      const login = await loginAction(values)
      if (login.error) {
        setError(login.error)
      } else {
        router.push("/dashboard")
      }
    })
  }

  return (
    <section className="flex items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onLogin)}
          className="w-auto min-w-96 space-y-6 rounded-lg"
        >
          {isVerified && (
            <p className="text-green-500">
              Email verified, log into your account.
            </p>
          )}
          {OAuthAccountNotLinked && (
            <p className="text-red-500">
              To confirm your identity, sign in with the same account you used
              originally.
            </p>
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="EMAIL"
                    className="bg-inputBg border-rust py-6 font-dm_mono text-midnight ring-rust ring-offset-rust placeholder:text-midnight"
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
                <FormControl>
                  <Input
                    type="password"
                    placeholder="PASSWORD"
                    className="bg-inputBg border-rust py-6 font-dm_mono text-midnight ring-rust ring-offset-rust placeholder:text-midnight"
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
            SIGN IN
          </Button>
          <div className="flex w-full items-center justify-around">
            <Separator
              orientation="horizontal"
              className="h-[0.5px] w-32 bg-rust"
            />
            <p className="w-auto font-dm_mono text-xs">O TAMBIÉN</p>
            <Separator
              orientation="horizontal"
              className="h-[0.5px] w-32 bg-rust"
            />
          </div>

          <GoogleLoginButton />
        </form>
      </Form>
    </section>
  )
}
