import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Introduce una dirección de correo electrónico válida" }),
  password: z.string().min(1, { message: "Se requiere contraseña" }),
})

export const registerSchema = z
  .object({
    name: z.string().min(1, "Se requiere nombre"),
    surname: z.string().min(1, "Se requiere apellido"),
    email: z.string().email("Correo electrónico no válido"),
    phone: z.string().min(1, "Se requiere teléfono"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export const userInfoSchema = z.object({
  name: z.string().min(2, { message: "Se requiere nombre" }),
  surname: z.string().min(2, { message: "Se requiere apellido" }),
  email: z
    .string()
    .email({ message: "Introduce una dirección de correo electrónico válida" }),
  phone: z.string().min(10, { message: "Se requiere número de teléfono" }),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email("Correo electrónico no válido"),
})

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })
