import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import * as React from "react"

interface ResetPasswordProps {
  name: string
  resetUrl: string
}

const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000"

export const ResetPassword = ({ name, resetUrl }: ResetPasswordProps) => (
  <Html>
    <Head />
    <Preview>Restablece tu contraseña de Reformer</Preview>
    <Body style={main}>
      <Container style={container}>
        <a href="https://www.reformer.com.ar/">
          <Img
            src={`https://www.reformer.com.ar/icons/opengraph-image.png`}
            width="200"
            height="200"
            alt="Reformer"
            style={logo}
            className="rounded-full"
          />
        </a>
        <Text style={paragraph}>Hola {name},</Text>
        <Text style={paragraph}>
          Has solicitado restablecer tu contraseña. Haz clic en el botón a
          continuación para crear una nueva contraseña.
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={resetUrl}>
            Restablecer contraseña
          </Button>
        </Section>
        <Text style={paragraph}>
          Si no solicitaste restablecer tu contraseña, puedes ignorar este
          email.
        </Text>
        <Text style={paragraph}>Este enlace expirará en 1 hora.</Text>
        <Text style={paragraph}>
          Saludos,
          <br />
          El equipo de Reformer
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          {" "}
          <a href="https://www.reformer.com.ar/">Reformer | Wellness Club</a>
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ResetPassword

const main = {
  backgroundColor: "#fff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
}

const logo = {
  margin: "0 auto",
  borderRadius: "300000px",
}

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
}

const btnContainer = {
  textAlign: "center" as const,
}

const button = {
  backgroundColor: "#893f24",
  borderRadius: "3px",
  color: "#F7F5ED",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
  cursor: "pointer",
}

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
}

const footer = {
  color: "#414141 !important",
  fontSize: "12px",
}
