import nodemailer from 'nodemailer'
import { render } from '@react-email/render'
import { VerifyEmailTemplate } from '../emails/verify-email'
import en from '../messages/en.json'
import pt from '../messages/pt.json'

interface SendVerificationEmailParams {
  email: string
  token: string
  name: string
  locale: string
}

const messages = { en, pt }

export async function sendVerificationEmail({
  email,
  token,
  name,
  locale = 'en',
}: SendVerificationEmailParams) {
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('Missing SMTP configuration')
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '2525'),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      secure: false,
      tls: {
        rejectUnauthorized: false,
      },
    })

    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const verificationUrl = `${baseUrl}/api/auth/verify?token=${token}&locale=${locale}`

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@example.com',
      to: email,
      subject: locale === 'pt' ? 'Verifique seu email' : 'Verify your email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">${locale === 'pt' ? 'Olá' : 'Hello'} ${name}!</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            ${
              locale === 'pt'
                ? 'Clique no botão abaixo para verificar seu email:'
                : 'Click the button below to verify your email:'
            }
          </p>
          <a 
            href="${verificationUrl}"
            style="display: inline-block; background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;"
          >
            ${locale === 'pt' ? 'Verificar Email' : 'Verify Email'}
          </a>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            ${
              locale === 'pt'
                ? 'Se você não criou uma conta, você pode ignorar este email.'
                : 'If you did not create an account, you can safely ignore this email.'
            }
          </p>
        </div>
      `,
    }

    console.log('Sending verification email to:', email)
    const info = await transporter.sendMail(mailOptions)
    console.log('Verification email sent:', info.messageId)
    return info
  } catch (error) {
    console.error('[SEND_VERIFICATION_EMAIL_ERROR]', error)
    throw new Error('Failed to send verification email')
  }
}
