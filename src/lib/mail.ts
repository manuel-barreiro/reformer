import { Resend } from "resend"
import { VerifyEmail } from "@/emails/VerifyEmail"
import { ResetPassword } from "@/emails/ResetPassword"
import { render } from "@react-email/render"

const resend = new Resend(process.env.AUTH_RESEND_KEY)

export const sendEmailVerification = async (
  email: string,
  name: string,
  token: string
) => {
  try {
    const verificationUrl = `${process.env.NEXT_PUBLIC_URL}/api/auth/verify-email?token=${token}`
    const html = render(VerifyEmail({ name, verificationUrl }))

    await resend.emails.send({
      from: "Reformer Club <welcome@reformer.com.ar>",
      to: email,
      subject: "Verifica tu correo electrónico",
      html,
    })

    return { success: true }
  } catch (error) {
    console.error("Verification email error:", error)
    return { error: true }
  }
}

export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  token: string
) => {
  try {
    const resetUrl = `${process.env.NEXT_PUBLIC_URL}/reset-password?token=${token}`
    const html = render(ResetPassword({ name, resetUrl }))

    await resend.emails.send({
      from: "Reformer Club <reset-password@reformer.com.ar>",
      to: email,
      subject: "Restablecer contraseña",
      html,
    })

    return { success: true }
  } catch (error) {
    console.error("Reset password email error:", error)
    return { error: true }
  }
}
