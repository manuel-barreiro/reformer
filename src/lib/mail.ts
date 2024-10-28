import { Resend } from "resend"

const resend = new Resend(process.env.AUTH_RESEND_KEY)

export const sendEmailVerification = async (email: string, token: string) => {
  console.log("Sending email verification to", email)
  try {
    const send = await resend.emails.send({
      from: "Reformer | Wellness Club <welcome@reformer.com.ar>",
      to: email,
      subject: "Verifica tu correo electrónico",
      html: `
        <p>Clickea el siguiente enlace para verificar tu cuenta</p>
        <a href="${process.env.NEXT_PUBLIC_URL}/api/auth/verify-email?token=${token}">Verify email</a>
      `,
    })
    // ${process.env.NEXTAUTH_URL}
    console.log("Confirmation email sent to", email)

    return {
      success: true,
    }
  } catch (error) {
    console.log(error)
    return {
      error: true,
    }
  }
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
  try {
    await resend.emails.send({
      from: "Reformer | Wellness Club <welcome@reformer.com.ar>",
      to: email,
      subject: "Restablecer contraseña",
      html: `
        <p>Has solicitado restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
        <a href="${process.env.NEXT_PUBLIC_URL}/reset-password?token=${token}">
          Restablecer contraseña
        </a>
        <p>Este enlace expirará en 1 hora.</p>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: true }
  }
}
