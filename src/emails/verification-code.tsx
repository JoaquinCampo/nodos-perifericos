import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface VerificationCodeEmailProps {
  verificationCode: string;
  clinicName?: string;
}

export const VerificationCodeEmail = ({
  verificationCode,
  clinicName = "Nodos Periféricos",
}: VerificationCodeEmailProps) => (
  <Html>
    <Head />
    <Preview>Tu código de verificación es {verificationCode}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Verificación de Email</Heading>
        <Text style={text}>Hola! Gracias por registrarte en {clinicName}.</Text>
        <Text style={text}>Tu código de verificación es:</Text>
        <Section style={codeContainer}>
          <Text style={code}>{verificationCode}</Text>
        </Section>
        <Text style={text}>Este código expirará en 10 minutos.</Text>
        <Text style={text}>
          Si no solicitaste este código, puedes ignorar este correo de forma
          segura.
        </Text>
        <Text style={footer}>
          Saludos,
          <br />
          El equipo de {clinicName}
        </Text>
      </Container>
    </Body>
  </Html>
);

export default VerificationCodeEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
  textAlign: "center" as const,
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  textAlign: "center" as const,
  padding: "0 40px",
};

const codeContainer = {
  background: "#f4f4f4",
  borderRadius: "8px",
  margin: "32px auto",
  padding: "24px",
  width: "fit-content",
};

const code = {
  color: "#000",
  fontSize: "36px",
  fontWeight: "bold",
  letterSpacing: "8px",
  textAlign: "center" as const,
  margin: "0",
};

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "24px",
  textAlign: "center" as const,
  padding: "0 40px",
  marginTop: "32px",
};
