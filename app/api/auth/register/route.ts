import { NextResponse } from 'next/server'
import { hash } from 'bcrypt'
import { prisma } from '@/lib/prisma'
import { signUpSchema } from '@/lib/validations/auth.schema'
import { sendVerificationEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, name } = signUpSchema.parse(body)

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return new NextResponse('User already exists', { status: 409 })
    }

    const hashedPassword = await hash(password, 10)
    const verificationToken = crypto.randomBytes(32).toString('hex')

    // Create user with verification token
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: null,
        verificationToken,
      },
    })

    // Send verification email
    await sendVerificationEmail({
      email,
      token: verificationToken,
      name,
      locale: body.locale || 'en',
    })

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error('[REGISTER_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
