import nodemailer from 'nodemailer'
import { render } from '@react-email/render'
import { VerifyEmailTemplate } from '../emails/verify-email'
import en from '../messages/en.json'
import pt from '../messages/pt.json'

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '2525'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const messages = { en, pt }

export async function sendVerificationEmail({
  email,
  token,
  name,
  locale = 'en',
}: {
  email: string
  token: string
  name?: string
  locale?: string
}) {
  const verificationLink = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`
  const translations = messages[locale as keyof typeof messages].auth.emailVerification

  const emailHtml = render(
    VerifyEmailTemplate({
      verificationLink,
      name,
      translations,
    })
  )

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: translations.subject,
    html: emailHtml,
  })

  return info
}
