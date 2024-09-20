"use server";

import { signIn } from "@/auth";
import { loginSchema, registerSchema } from "@/lib/zod-schemas";
import { prisma } from "@/lib/prisma";
import { AuthError } from "next-auth";
import { z } from "zod";
import bcrypt from "bcryptjs";

export const loginAction = async (values: z.infer<typeof loginSchema>) => {
  try {
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    return { success: true };
  } catch (error: any) {
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message };
    }
    return { error: error.message };
  }
};

export const registerAction = async (
  values: z.infer<typeof registerSchema>
) => {
  try {
    // Validate the data server-side
    const { data, success } = await registerSchema.safeParse(values);
    if (!success) {
      throw new Error("Invalid credentials");
    }

    // Check if the user already exists
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (user) {
      throw new Error("Email already in use");
    }

    // logic to salt and hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create the user in the database
    await prisma.user.create({
      data: {
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
      },
    });

    // Log in the user
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    return { success: true };
  } catch (error: any) {
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message };
    }
    return { error: error.message };
  }
};
