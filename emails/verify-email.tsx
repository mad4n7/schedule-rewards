import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface VerifyEmailTemplateProps {
  verificationLink: string
  name?: string
  locale?: string
  translations: {
    subject: string
    greeting: string
    message: string
    button: string
    expires: string
    ignoreMessage: string
  }
}

export const VerifyEmailTemplate = ({
  verificationLink,
  name = '',
  translations,
}: VerifyEmailTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>{translations.subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Text style={paragraph}>
              {translations.greeting.replace('{name}', name || '')}
            </Text>
            <Text style={paragraph}>{translations.message}</Text>
            <Button pX={20} pY={12} style={button} href={verificationLink}>
              {translations.button}
            </Button>
            <Text style={paragraph}>{translations.expires}</Text>
            <Hr style={hr} />
            <Text style={footer}>{translations.ignoreMessage}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const box = {
  padding: '0 48px',
}

const paragraph = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
}

const button = {
  backgroundColor: '#656ee8',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
}
