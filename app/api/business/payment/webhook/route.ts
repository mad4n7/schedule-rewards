import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const webhookSchema = z.object({
  pixCode: z.string(),
  status: z.enum(['PAID', 'EXPIRED', 'CANCELLED']),
  paidAt: z.string().datetime().optional(),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = webhookSchema.parse(json)

    const payment = await prisma.payment.findFirst({
      where: { pixCode: body.pixCode },
      include: { business: true },
    })

    if (!payment) {
      return new NextResponse('Payment not found', { status: 404 })
    }

    // Update payment status
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: body.status,
        paidAt: body.paidAt ? new Date(body.paidAt) : undefined,
      },
    })

    // If payment is successful, activate the business
    if (body.status === 'PAID') {
      await prisma.business.update({
        where: { id: payment.businessId },
        data: { active: true },
      })
    }

    return NextResponse.json(updatedPayment)
  } catch (error) {
    console.error('Error processing webhook:', error)
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 })
    }
    return new NextResponse('Internal Error', { status: 500 })
  }
}
