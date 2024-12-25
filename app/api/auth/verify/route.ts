import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const locale = searchParams.get('locale') || 'en'

    if (!token) {
      return new NextResponse('Missing token', { status: 400 })
    }

    // Find user with verification token
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    })

    if (!user) {
      return new NextResponse('Invalid token', { status: 400 })
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
      },
    })

    // Redirect to success page with locale
    return NextResponse.redirect(new URL(`/${locale}/auth/verify-success`, request.url))
  } catch (error) {
    console.error('[VERIFY_EMAIL_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
