import { Resend } from "resend"
import { VerifyEmail } from "../../emails/VerifyEmail"
import { ResetPassword } from "../../emails/ResetPassword"
import { render } from "@react-email/render"

const resend = new Resend(process.env.AUTH_RESEND_KEY)

export const sendEmailVerification = async (
  email: string,
  name: string,
  token: string
) => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_URL}/api/auth/verify-email?token=${token}`

  try {
    const html = render(
      VerifyEmail({
        name: name,
        verificationUrl,
      })
    )

    const send = await resend.emails.send({
      from: "Reformer | Wellness Club <welcome@reformer.com.ar>",
      to: email,
      subject: "Verifica tu correo electrónico",
      html: html,
    })

    console.log("Confirmation email sent to", email)
    return { success: true }
  } catch (error) {
    console.log(error)
    return { error: true }
  }
}

export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  token: string
) => {
  const resetUrl = `${process.env.NEXT_PUBLIC_URL}/reset-password?token=${token}`

  try {
    const html = render(
      ResetPassword({
        name,
        resetUrl,
      })
    )

    await resend.emails.send({
      from: "Reformer | Wellness Club <welcome@reformer.com.ar>",
      to: email,
      subject: "Restablecer contraseña",
      html: html,
    })
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: true }
  }
}
