import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Delete existing plans
  await prisma.plan.deleteMany()

  // Create basic plan
  await prisma.plan.create({
    data: {
      name: 'Basic',
      description: 'Perfect for small businesses',
      price: new Prisma.Decimal(29.90),
      duration: 30,
      features: [
        'Up to 5 employees',
        'Basic scheduling',
        'Email support',
        'Customer rewards',
        'Basic analytics'
      ]
    }
  })

  // Create professional plan
  await prisma.plan.create({
    data: {
      name: 'Professional',
      description: 'Great for growing businesses',
      price: new Prisma.Decimal(59.90),
      duration: 30,
      features: [
        'Up to 15 employees',
        'Advanced scheduling',
        'Priority support',
        'Enhanced rewards program',
        'Advanced analytics',
        'Custom branding',
        'Email notifications'
      ]
    }
  })

  // Create enterprise plan
  await prisma.plan.create({
    data: {
      name: 'Enterprise',
      description: 'For large organizations',
      price: new Prisma.Decimal(99.90),
      duration: 30,
      features: [
        'Unlimited employees',
        'Custom features',
        '24/7 support',
        'Premium rewards program',
        'Advanced analytics',
        'API access',
        'White-label solution',
        'Dedicated account manager',
        'Custom integrations'
      ]
    }
  })

  console.log('Plans seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
