"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { User } from "@prisma/client"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

interface UserDetailModalProps {
  isOpen: boolean
  onClose: () => void
  user: User
  onUpdateUser: (userId: string, userData: Partial<User>) => Promise<void>
}

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  surname: z.string().optional(),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  role: z.enum(["user", "admin"]),
})

export function UserDetailModal({
  isOpen,
  onClose,
  user,
  onUpdateUser,
}: UserDetailModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      surname: user.surname || "",
      email: user.email,
      phone: user.phone || "",
      role: user.role,
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await onUpdateUser(user.id, values)
      onClose()
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-marcellus text-xl text-grey_pebble">
            Detalles del Usuario
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 px-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-grey_pebble">Nombre</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="border border-rust/50 bg-pearlVariant font-semibold text-grey_pebble/60"
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
                      <FormLabel className="text-grey_pebble">
                        Apellido
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="border border-rust/50 bg-pearlVariant font-semibold text-grey_pebble/60"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-grey_pebble">Email</FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          {...field}
                          className="border border-rust/50 bg-pearlVariant font-semibold text-grey_pebble/60"
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
                      <FormLabel className="text-grey_pebble">
                        Teléfono
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="border border-rust/50 bg-pearlVariant font-semibold text-grey_pebble/60"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-grey_pebble">Rol</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-rust/50 bg-pearlVariant font-semibold text-grey_pebble/60">
                            <SelectValue placeholder="Seleccionar rol" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-grey_pebble text-pearl">
                          <SelectItem
                            className="border-b border-pearl/50 capitalize hover:!bg-pearlVariant3"
                            value="user"
                          >
                            Usuario
                          </SelectItem>
                          <SelectItem
                            className="border-b border-pearl/50 capitalize hover:!bg-pearlVariant3"
                            value="admin"
                          >
                            Administrador
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-2 border-t border-grey_pebble/20 px-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-grey_pebble/20 text-grey_pebble hover:bg-grey_pebble/10"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-rust text-pearl hover:bg-rust/90"
                >
                  Guardar Cambios
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
