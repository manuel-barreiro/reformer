"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  nombre: z.string().min(3, {
    message: "Ingrese un nombre válido",
  }),
  apellido: z.string().min(3, {
    message: "Ingrese un apellido válido",
  }),
  email: z.string().email({
    message: "Ingrese un email válido",
  }),
  telefono: z.string().min(8, {
    message: "Ingrese un teléfono válido",
  }),
  mensaje: z
    .string()
    .min(10, {
      message: "Mínimo 10 caracteres",
    })
    .max(160, {
      message: "Máximo 160 caracteres",
    }),
})

export default function ContactForm() {
  const { toast } = useToast()

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      mensaje: "",
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    // fetch("/api/send", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(values),
    // })
    toast({
      title: "Recibimos tu mensaje :)",
      description: "Te contactaremos a la brevedad.",
      className: "bg-midnight text-pearl",
    })
    form.reset()
  }

  return (
    <section className="grid h-auto w-full grid-cols-1 items-start gap-10 bg-midnight pt-20 text-pearl lg:grid-cols-3">
      <div className="col-span-1 flex items-center justify-start px-10 lg:justify-center lg:px-20">
        <p className="text-3xl">
          SI QUERÉS FORMAR PARTE, DEJANOS TU MENSAJE :)
        </p>
      </div>
      <div className="col-span-2 px-10 lg:px-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full"
            autoComplete="off"
          >
            {/* Inputs */}
            <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-0">
              <div className="flex w-full max-w-[90%] flex-col items-center justify-start gap-4 lg:col-span-1">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem className="w-full space-y-0">
                      <FormLabel className="sr-only m-0">Nombre</FormLabel>
                      <FormControl>
                        <input
                          placeholder="Nombre"
                          className="m-0 w-full border-b border-pearl bg-midnight pb-1 text-[16px] text-pearl placeholder:font-thin placeholder:text-pearl/80 focus:outline-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="pt-1 text-xs text-rust" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="apellido"
                  render={({ field }) => (
                    <FormItem className="w-full space-y-0">
                      <FormLabel className="sr-only m-0">Apellido</FormLabel>
                      <FormControl>
                        <input
                          placeholder="Apellido"
                          className="m-0 w-full border-b border-pearl bg-midnight pb-1 text-[16px] text-pearl placeholder:font-thin placeholder:text-pearl/80 focus:outline-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="pt-1 text-xs text-rust" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full space-y-0">
                      <FormLabel className="sr-only m-0">Email</FormLabel>
                      <FormControl>
                        <input
                          placeholder="Email"
                          className="m-0 w-full border-b border-pearl bg-midnight pb-1 text-[16px] text-pearl placeholder:font-thin placeholder:text-pearl/80 focus:outline-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="pt-1 text-xs text-rust" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem className="w-full space-y-0">
                      <FormLabel className="sr-only m-0">Teléfono</FormLabel>
                      <FormControl>
                        <input
                          placeholder="Teléfono"
                          className="m-0 w-full border-b border-pearl bg-midnight pb-1 text-[16px] text-pearl placeholder:font-thin placeholder:text-pearl/80 focus:outline-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="pt-1 text-xs text-rust" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex max-w-[90%] flex-col justify-between gap-6 lg:col-span-1">
                <FormField
                  control={form.control}
                  name="mensaje"
                  render={({ field }) => (
                    <FormItem className="min-h-[60%] w-full space-y-0">
                      <FormLabel className="sr-only">Mensaje</FormLabel>
                      <FormControl>
                        <textarea
                          placeholder="Mensaje"
                          className="scrollbar-hide m-0 h-full w-full resize-none border-b border-pearl bg-midnight pb-1 text-[16px] text-pearl placeholder:font-thin placeholder:text-pearl/80 focus:outline-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="pt-1 text-xs text-rust" />
                    </FormItem>
                  )}
                />
                {/* Submit button */}
                <div className="flex w-full justify-start">
                  <button
                    type="submit"
                    className="mt-4 h-10 w-full rounded-lg border border-pearl/80 bg-[#110f10] text-[16px] text-sm font-light text-pearl/80 outline-pearl/80 transition-all duration-100 ease-in-out hover:bg-[#110f10]/40 hover:outline lg:mt-0 lg:w-[60%]"
                  >
                    enviar
                  </button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </section>
  )
}
