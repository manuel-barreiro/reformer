import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email({ message: "Enter valid e-mail address" }),
  password: z.string().min(1, { message: "Password is required" }),
})

export const registerSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  surname: z.string().min(2, { message: "Surname is required" }),
  email: z.string().email({ message: "Enter valid e-mail address" }),
  phone: z.string().min(10, { message: "Phone number is required" }),
  password: z.string().min(1, { message: "Password is required" }),
})

export const userInfoSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  surname: z.string().min(2, { message: "Surname is required" }),
  email: z.string().email({ message: "Enter valid e-mail address" }),
  phone: z.string().min(10, { message: "Phone number is required" }),
})
