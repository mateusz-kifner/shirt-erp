import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
} from "@react-email/components";

interface SignInEmailProps {
  email: string;
  validationCode: string;
}

const getBaseUrl = () => {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

const baseUrl = getBaseUrl();

export const SignInEmail = ({ email, validationCode }: SignInEmailProps) => (
  <Html>
    <Head />
    <Preview>Your login code for Tyfons Lab</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>Tyfons Lab</Heading>
        <Section style={buttonContainer}>
          <Button
            style={button}
            href={`${baseUrl}/auth/magic-link/${email}/${validationCode}`}
          >
            Sign in
          </Button>
        </Section>
      </Container>
    </Body>
  </Html>
);

SignInEmail.PreviewProps = {
  validationCode: "abc1234567890",
} as SignInEmailProps;

export default SignInEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "17px 0 0",
};

const buttonContainer = {
  padding: "27px 0 27px",
};

const button = {
  backgroundColor: "#3b82f6",
  borderRadius: "3px",
  fontWeight: "600",
  color: "#fff",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "11px 23px",
};
