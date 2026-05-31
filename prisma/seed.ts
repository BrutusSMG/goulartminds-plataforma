import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient() 

async function main() {
  // 1. Criar as 4 Jornadas Mestre
  const jornadas = [
    { id: 'emocoes', name: 'Emoções', order: 1, description: 'Lidar com o que se sente (irritação, ansiedade, culpa).' },
    { id: 'clareza-interna', name: 'Clareza Interna', order: 2, description: 'Resolver confusão sobre si mesmo e objetivos.' },
    { id: 'valores-identidade', name: 'Valores e Identidade', order: 3, description: 'Alinhamento entre quem se é e como se vive.' },
    { id: 'acao-responsabilidade', name: 'Ação e Responsabilidade', order: 4, description: 'Sustentação da mudança e consistência.' },
  ]

  for (const j of jornadas) {
    await prisma.journey.upsert({
      where: { id: j.id },
      update: j,
      create: j,
    })
  }

  // 2. Criar os Steps Iniciais (Exemplos)
  const steps = [
    { id: 'mapa-da-irritacao', name: 'Mapa da Irritação', path: '/jornadas/emocoes/irritacao', order: 1, journeyId: 'emocoes', isPublic: true },
    { id: 'valores', name: 'Mapa dos Valores', path: '/jornadas/valores-identidade/valores', order: 1, journeyId: 'valores-identidade' },
    { id: 'roda-da-vida', name: 'Roda da Vida', path: '/jornadas/valores-identidade/roda-da-vida', order: 2, journeyId: 'valores-identidade' },
    { id: 'resultado-esperado', name: 'Resultado Esperado', path: '/jornadas/clareza-interna/resultado-esperado', order: 1, journeyId: 'clareza-interna' },
  ]

  for (const s of steps) {
    await prisma.step.upsert({
      where: { id: s.id },
      update: s,
      create: s,
    })
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })