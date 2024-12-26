import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Delete existing data in the correct order
    await prisma.city.deleteMany()
    await prisma.state.deleteMany()
    await prisma.categories.deleteMany()
    await prisma.plan.deleteMany()

    console.log('Existing data deleted')

    // Seed US states
    const states = [
      {
        id: 'CA',
        name: 'California',
        abbreviation: 'CA',
        cities: ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Fresno']
      },
      {
        id: 'NY',
        name: 'New York',
        abbreviation: 'NY',
        cities: ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse']
      },
      {
        id: 'TX',
        name: 'Texas',
        abbreviation: 'TX',
        cities: ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth']
      },
      {
        id: 'FL',
        name: 'Florida',
        abbreviation: 'FL',
        cities: ['Jacksonville', 'Miami', 'Tampa', 'Orlando', 'St. Petersburg']
      },
      {
        id: 'IL',
        name: 'Illinois',
        abbreviation: 'IL',
        cities: ['Chicago', 'Aurora', 'Rockford', 'Joliet', 'Naperville']
      }
    ]

    console.log('Creating US states and cities...')

    // Create states and cities
    for (const state of states) {
      await prisma.state.create({
        data: {
          id: state.id,
          name: state.name,
          abbreviation: state.abbreviation,
          country_code: 'US',
          cities: {
            create: state.cities.map(cityName => ({
              name: cityName
            }))
          }
        }
      })
    }

    // Seed Brazilian states
    const brStates = [
      {
        id: 'SP',
        name: 'São Paulo',
        name_pt: 'São Paulo',
        abbreviation: 'SP',
        cities: ['São Paulo', 'Campinas', 'Santos', 'São José dos Campos', 'Ribeirão Preto']
      },
      {
        id: 'RJ',
        name: 'Rio de Janeiro',
        name_pt: 'Rio de Janeiro',
        abbreviation: 'RJ',
        cities: ['Rio de Janeiro', 'Niterói', 'São Gonçalo', 'Duque de Caxias', 'Nova Iguaçu']
      },
      {
        id: 'MG',
        name: 'Minas Gerais',
        name_pt: 'Minas Gerais',
        abbreviation: 'MG',
        cities: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim']
      }
    ]

    console.log('Creating Brazilian states and cities...')

    // Create Brazilian states and cities
    for (const state of brStates) {
      await prisma.state.create({
        data: {
          id: state.id,
          name: state.name,
          name_pt: state.name_pt,
          abbreviation: state.abbreviation,
          country_code: 'BR',
          cities: {
            create: state.cities.map(cityName => ({
              name: cityName,
              name_pt: cityName
            }))
          }
        }
      })
    }

    console.log('Creating plans...')

    // Seed plans
    const plans = [
      {
        name: 'Basic',
        description: 'For small businesses',
        price: new Prisma.Decimal(29.99),
        duration: 30,
        features: ['Up to 100 appointments', 'Basic analytics', 'Email support']
      },
      {
        name: 'Pro',
        description: 'For growing businesses',
        price: new Prisma.Decimal(49.99),
        duration: 30,
        features: ['Unlimited appointments', 'Advanced analytics', 'Priority support', 'Custom branding']
      },
      {
        name: 'Enterprise',
        description: 'For large businesses',
        price: new Prisma.Decimal(99.99),
        duration: 30,
        features: ['Everything in Pro', 'API access', 'Dedicated support', 'Custom integrations']
      }
    ]

    for (const plan of plans) {
      await prisma.plan.create({
        data: plan
      })
    }

    console.log('Creating categories...')

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

    for (const category of categories) {
      await prisma.categories.create({
        data: category
      })
    }
  

    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
