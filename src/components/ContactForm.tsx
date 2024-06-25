"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  nombre: z.string().min(1, {
    message: "Ingrese un nombre válido",
  }),
  apellido: z.string().min(1, {
    message: "Ingrese un apellido válido",
  }),
  email: z.string().min(1, {
    message: "Ingrese un apellido válido",
  }),
  telefono: z.string().min(1, {
    message: "Ingrese un teléfono válido",
  }),
  mensaje: z
    .string()
    .min(1, {
      message: "Mínimo 10 caracteres",
    })
    .max(16, {
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
      variant: "reformer",
    })
    form.reset()
  }

  return (
    <section
      className="grid h-auto w-full scroll-mt-28 grid-cols-1 items-start gap-10 bg-midnight px-10 pt-20 text-pearl lg:grid-cols-3 lg:px-20"
      id="contacto"
    >
      <div className="col-span-1 flex items-center justify-start text-pretty lg:justify-center">
        <p className="text-3xl">
          SI QUERÉS FORMAR PARTE, DEJANOS TU MENSAJE :)
        </p>
      </div>
      <div className="col-span-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full"
            autoComplete="off"
          >
            {/* Inputs */}
            <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-16">
              <div className="flex w-full flex-col items-center justify-start gap-6 lg:col-span-1">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem className="w-full space-y-0">
                      <FormLabel className="sr-only m-0">Nombre</FormLabel>
                      <FormControl>
                        <input
                          placeholder="Nombre"
                          className="m-0 w-full rounded-none border-b border-pearl bg-midnight pb-1 text-[16px] text-pearl placeholder:font-thin placeholder:text-pearl/80 focus:outline-none"
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
                          className="m-0 w-full rounded-none border-b border-pearl bg-midnight pb-1 text-[16px] text-pearl placeholder:font-thin placeholder:text-pearl/80 focus:outline-none"
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
                          className="m-0 w-full rounded-none border-b border-pearl bg-midnight pb-1 text-[16px] text-pearl placeholder:font-thin placeholder:text-pearl/80 focus:outline-none"
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
                          className="m-0 w-full rounded-none border-b border-pearl bg-midnight pb-1 text-[16px] text-pearl placeholder:font-thin placeholder:text-pearl/80 focus:outline-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="pt-1 text-xs text-rust" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col justify-between gap-6 lg:col-span-1">
                <FormField
                  control={form.control}
                  name="mensaje"
                  render={({ field }) => (
                    <FormItem className="min-h-[60%] w-full space-y-0">
                      <FormLabel className="sr-only">Mensaje</FormLabel>
                      <FormControl>
                        <textarea
                          placeholder="Mensaje"
                          className="scrollbar-hide m-0 h-full w-full resize-none rounded-none border-b border-pearl bg-midnight pb-1 text-[16px] text-pearl placeholder:font-thin placeholder:text-pearl/80 focus:outline-none"
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
