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

interface PurchaseConfirmationProps {
  name: string
  packageName: string
  classCount: number
  durationMonths: number
  total: number
}

export const PurchaseConfirmation = ({
  name,
  packageName,
  classCount,
  durationMonths,
  total,
}: PurchaseConfirmationProps) => (
  <Html>
    <Head />
    <Preview>¡Gracias por tu compra en Reformer!</Preview>
    <Body style={main}>
      <Container style={container}>
        <a href="https://www.reformer.com.ar/">
          <Img
            src={`https://www.reformer.com.ar/icons/opengraph-image.png`}
            width="200"
            height="200"
            alt="Reformer"
            style={logo}
          />
        </a>

        <Text style={paragraph}>Hola {name},</Text>
        <Text style={paragraph}>
          ¡Tu compra ha sido procesada exitosamente! A continuación, te
          detallamos tu paquete:
        </Text>

        <Section style={detailsContainer}>
          <Text style={details}>
            <strong>Paquete:</strong> {packageName}
            <br />
            <strong>Clases:</strong> {classCount}
            <br />
            <strong>Duración:</strong> {durationMonths} mes(es)
            <br />
            <strong>Total:</strong> ${total}
          </Text>
        </Section>

        <Text style={paragraph}>
          Ya puedes comenzar a reservar tus clases desde nuestra plataforma.
        </Text>

        <Section style={btnContainer}>
          <Button style={button} href="https://www.reformer.com.ar/dashboard">
            Ir a mi cuenta
          </Button>
        </Section>

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

export default PurchaseConfirmation

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

const detailsContainer = {
  backgroundColor: "#f7f7f7",
  padding: "20px",
  borderRadius: "5px",
  margin: "20px 0",
}

const details = {
  fontSize: "16px",
  lineHeight: "24px",
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
  color: "#414141",
  fontSize: "12px",
}
