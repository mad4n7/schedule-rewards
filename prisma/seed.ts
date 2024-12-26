import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Delete existing data
  await prisma.plan.deleteMany()
  await prisma.categories.deleteMany()

  // Seed categories
  const categories = [
    { name: 'Hair Salon', slug: 'hair-salon', description: 'Hair cutting, styling, and coloring services' },
    { name: 'Barbershop', slug: 'barbershop', description: 'Men\'s grooming and hair cutting services' },
    { name: 'Spa & Wellness', slug: 'spa-wellness', description: 'Massage, facials, and wellness treatments' },
    { name: 'Nail Salon', slug: 'nail-salon', description: 'Manicure, pedicure, and nail art services' },
    { name: 'Beauty Salon', slug: 'beauty-salon', description: 'Full-service beauty treatments' },
    { name: 'Fitness Center', slug: 'fitness-center', description: 'Gym, fitness classes, and personal training' },
    { name: 'Yoga Studio', slug: 'yoga-studio', description: 'Yoga classes and meditation' },
    { name: 'Medical Spa', slug: 'medical-spa', description: 'Medical-grade aesthetic treatments' },
    { name: 'Dental Clinic', slug: 'dental-clinic', description: 'Dental care and oral health services' },
    { name: 'Chiropractic', slug: 'chiropractic', description: 'Chiropractic adjustments and therapy' },
    { name: 'Physical Therapy', slug: 'physical-therapy', description: 'Rehabilitation and physical therapy services' },
    { name: 'Pet Grooming', slug: 'pet-grooming', description: 'Pet grooming and care services' },
    { name: 'Auto Service', slug: 'auto-service', description: 'Automotive repair and maintenance' },
    { name: 'Restaurant', slug: 'restaurant', description: 'Food and dining services' },
    { name: 'Coffee Shop', slug: 'coffee-shop', description: 'Coffee, beverages, and light fare' }
  ]

  // Portuguese categories (commented out)
  /*
  const categoriesPt = [
    { name: 'Salão de Cabelo', slug: 'salao-de-cabelo', description: 'Serviços de corte, penteado e coloração de cabelo' },
    { name: 'Barbearia', slug: 'barbearia', description: 'Serviços de barbearia e cuidados masculinos' },
    { name: 'Spa & Bem-estar', slug: 'spa-bem-estar', description: 'Massagens, tratamentos faciais e terapias de bem-estar' },
    { name: 'Salão de Unhas', slug: 'salao-de-unhas', description: 'Serviços de manicure, pedicure e nail art' },
    { name: 'Salão de Beleza', slug: 'salao-de-beleza', description: 'Tratamentos completos de beleza' },
    { name: 'Academia', slug: 'academia', description: 'Academia, aulas de fitness e treino personalizado' },
    { name: 'Estúdio de Yoga', slug: 'estudio-de-yoga', description: 'Aulas de yoga e meditação' },
    { name: 'Spa Médico', slug: 'spa-medico', description: 'Tratamentos estéticos de nível médico' },
    { name: 'Clínica Odontológica', slug: 'clinica-odontologica', description: 'Serviços de cuidados dentários e saúde bucal' },
    { name: 'Quiropraxia', slug: 'quiropraxia', description: 'Ajustes quiropráticos e terapia' },
    { name: 'Fisioterapia', slug: 'fisioterapia', description: 'Serviços de reabilitação e fisioterapia' },
    { name: 'Pet Shop', slug: 'pet-shop', description: 'Serviços de banho e tosa para animais de estimação' },
    { name: 'Oficina Mecânica', slug: 'oficina-mecanica', description: 'Reparo e manutenção automotiva' },
    { name: 'Restaurante', slug: 'restaurante', description: 'Serviços de alimentação e gastronomia' },
    { name: 'Cafeteria', slug: 'cafeteria', description: 'Café, bebidas e refeições leves' }
  ]
  */

  for (const category of categories) {
    await prisma.categories.create({
      data: category
    })
  }

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

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
