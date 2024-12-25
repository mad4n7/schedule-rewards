import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createBusinessSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  planId: z.string().min(1),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const json = await req.json()
    const body = createBusinessSchema.parse(json)

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    const plan = await prisma.plan.findUnique({
      where: { id: body.planId },
    })

    if (!plan) {
      return new NextResponse('Plan not found', { status: 404 })
    }

    const business = await prisma.business.create({
      data: {
        name: body.name,
        description: body.description,
        userId: user.id,
        planId: plan.id,
      },
    })

    // Create a payment record
    const payment = await prisma.payment.create({
      data: {
        amount: plan.price,
        status: 'PENDING',
        pixCode: generatePixCode(business.id, plan.price),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        businessId: business.id,
      },
    })

    return NextResponse.json({ business, payment })
  } catch (error) {
    console.error('Error creating business:', error)
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 })
    }
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        Business: {
          include: {
            plan: true,
            payments: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    return NextResponse.json(user.Business)
  } catch (error) {
    console.error('Error fetching businesses:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

// Helper function to generate PIX code
function generatePixCode(businessId: string, amount: number): string {
  // In a real application, you would integrate with a payment provider
  // This is just a placeholder that generates a random code
  return `PIX${businessId}${amount}${Date.now()}`
}
