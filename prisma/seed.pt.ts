import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Delete existing data
  await prisma.plan.deleteMany()
  await prisma.categories.deleteMany()
  await prisma.city.deleteMany()
  await prisma.state.deleteMany()

  // Estados brasileiros
  const states = [
    {
      name: 'Acre',
      abbreviation: 'AC',
      cities: ['Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira']
    },
    {
      name: 'Alagoas',
      abbreviation: 'AL',
      cities: ['Maceió', 'Arapiraca', 'Rio Largo']
    },
    {
      name: 'Amapá',
      abbreviation: 'AP',
      cities: ['Macapá', 'Santana', 'Laranjal do Jari']
    },
    {
      name: 'Amazonas',
      abbreviation: 'AM',
      cities: ['Manaus', 'Parintins', 'Itacoatiara']
    },
    {
      name: 'Bahia',
      abbreviation: 'BA',
      cities: ['Salvador', 'Feira de Santana', 'Vitória da Conquista']
    },
    {
      name: 'Ceará',
      abbreviation: 'CE',
      cities: ['Fortaleza', 'Caucaia', 'Juazeiro do Norte']
    },
    {
      name: 'Distrito Federal',
      abbreviation: 'DF',
      cities: ['Brasília', 'Ceilândia', 'Taguatinga']
    },
    {
      name: 'Espírito Santo',
      abbreviation: 'ES',
      cities: ['Vitória', 'Vila Velha', 'Serra']
    },
    {
      name: 'Goiás',
      abbreviation: 'GO',
      cities: ['Goiânia', 'Aparecida de Goiânia', 'Anápolis']
    },
    {
      name: 'Maranhão',
      abbreviation: 'MA',
      cities: ['São Luís', 'Imperatriz', 'São José de Ribamar']
    },
    {
      name: 'Mato Grosso',
      abbreviation: 'MT',
      cities: ['Cuiabá', 'Várzea Grande', 'Rondonópolis']
    },
    {
      name: 'Mato Grosso do Sul',
      abbreviation: 'MS',
      cities: ['Campo Grande', 'Dourados', 'Três Lagoas']
    },
    {
      name: 'Minas Gerais',
      abbreviation: 'MG',
      cities: ['Belo Horizonte', 'Uberlândia', 'Contagem']
    },
    {
      name: 'Pará',
      abbreviation: 'PA',
      cities: ['Belém', 'Ananindeua', 'Santarém']
    },
    {
      name: 'Paraíba',
      abbreviation: 'PB',
      cities: ['João Pessoa', 'Campina Grande', 'Santa Rita']
    },
    {
      name: 'Paraná',
      abbreviation: 'PR',
      cities: ['Curitiba', 'Londrina', 'Maringá']
    },
    {
      name: 'Pernambuco',
      abbreviation: 'PE',
      cities: ['Recife', 'Jaboatão dos Guararapes', 'Olinda']
    },
    {
      name: 'Piauí',
      abbreviation: 'PI',
      cities: ['Teresina', 'Parnaíba', 'Picos']
    },
    {
      name: 'Rio de Janeiro',
      abbreviation: 'RJ',
      cities: ['Rio de Janeiro', 'São Gonçalo', 'Duque de Caxias']
    },
    {
      name: 'Rio Grande do Norte',
      abbreviation: 'RN',
      cities: ['Natal', 'Mossoró', 'Parnamirim']
    },
    {
      name: 'Rio Grande do Sul',
      abbreviation: 'RS',
      cities: ['Porto Alegre', 'Caxias do Sul', 'Pelotas']
    },
    {
      name: 'Rondônia',
      abbreviation: 'RO',
      cities: ['Porto Velho', 'Ji-Paraná', 'Ariquemes']
    },
    {
      name: 'Roraima',
      abbreviation: 'RR',
      cities: ['Boa Vista', 'Caracaraí', 'Rorainópolis']
    },
    {
      name: 'Santa Catarina',
      abbreviation: 'SC',
      cities: ['Florianópolis', 'Joinville', 'Blumenau']
    },
    {
      name: 'São Paulo',
      abbreviation: 'SP',
      cities: ['São Paulo', 'Guarulhos', 'Campinas']
    },
    {
      name: 'Sergipe',
      abbreviation: 'SE',
      cities: ['Aracaju', 'Nossa Senhora do Socorro', 'Lagarto']
    },
    {
      name: 'Tocantins',
      abbreviation: 'TO',
      cities: ['Palmas', 'Araguaína', 'Gurupi']
    }
  ]

  // Create states and cities
  for (const state of states) {
    await prisma.state.create({
      data: {
        name: state.name,
        abbreviation: state.abbreviation,
        country_code: 'BR',
        cities: {
          create: state.cities.map(cityName => ({
            name: cityName
          }))
        }
      }
    })
  }

  // Categorias
  const categories = [
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

  for (const category of categories) {
    await prisma.categories.create({
      data: category
    })
  }

  // Plano básico
  await prisma.plan.create({
    data: {
      name: 'Básico',
      description: 'Perfeito para pequenas empresas',
      price: new Prisma.Decimal(29.90),
      duration: 30,
      features: [
        'Até 5 funcionários',
        'Agendamento básico',
        'Suporte por email',
        'Programa de fidelidade',
        'Análises básicas'
      ]
    }
  })

  // Plano profissional
  await prisma.plan.create({
    data: {
      name: 'Profissional',
      description: 'Ótimo para empresas em crescimento',
      price: new Prisma.Decimal(59.90),
      duration: 30,
      features: [
        'Até 15 funcionários',
        'Agendamento avançado',
        'Suporte prioritário',
        'Programa de fidelidade aprimorado',
        'Análises avançadas',
        'Personalização da marca',
        'Notificações por email'
      ]
    }
  })

  // Plano empresarial
  await prisma.plan.create({
    data: {
      name: 'Empresarial',
      description: 'Para grandes organizações',
      price: new Prisma.Decimal(99.90),
      duration: 30,
      features: [
        'Funcionários ilimitados',
        'Recursos personalizados',
        'Suporte 24/7',
        'Programa de fidelidade premium',
        'Análises avançadas',
        'Acesso à API',
        'Solução white-label',
        'Gerente de conta dedicado',
        'Integrações personalizadas'
      ]
    }
  })

  console.log('Banco de dados populado com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
