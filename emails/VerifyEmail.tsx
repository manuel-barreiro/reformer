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
import { color } from "framer-motion"
import * as React from "react"

interface VerifyEmailProps {
  name: string
  verificationUrl: string
}

export const VerifyEmail = ({ name, verificationUrl }: VerifyEmailProps) => (
  <Html>
    <Head />
    <Preview>Verifica tu email para comenzar a usar Reformer</Preview>
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
          Gracias por registrarte en Reformer. Para comenzar a usar tu cuenta,
          necesitamos verificar tu dirección de email.
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={verificationUrl}>
            Verificar email
          </Button>
        </Section>
        <Text style={paragraph}>
          Si no creaste esta cuenta, puedes ignorar este email.
        </Text>
        <Text style={paragraph}>
          Saludos,
          <br />
          El equipo de Reformer
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          <a href="https://www.reformer.com.ar/">Reformer | Wellness Club</a>
        </Text>
      </Container>
    </Body>
  </Html>
)

export default VerifyEmail

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
