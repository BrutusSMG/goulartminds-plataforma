// /lib/db.ts

import { PrismaClient } from '@prisma/client';

// Declara a variável 'client' que será exportada.
let client;

// Define o objeto de configuração do Prisma.
// A mudança crucial é passar a URL do banco de dados explicitamente.
// Isso força o Prisma a usar esta URL, resolvendo o problema de
// a variável de ambiente não ser encontrada durante o build na Vercel.
const prismaOptions = {
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
};

// Lógica para evitar múltiplas conexões em desenvolvimento.
if (process.env.NODE_ENV === 'production') {
  // Em produção, é seguro criar uma nova instância a cada vez.
  client = new PrismaClient(prismaOptions);
} else {
  // Em desenvolvimento, usamos um objeto 'global' para persistir a instância
  // do Prisma entre as recargas do Hot Module Replacement (HMR).
  
  // Se a instância global ainda não existe, crie-a.
  if (!global.prisma) {
    console.log("Desenvolvimento: Criando nova instância global do Prisma Client...");
    global.prisma = new PrismaClient(prismaOptions);
  }
  // Reutiliza a instância global existente.
  client = global.prisma;
}

// Exporta a instância única e configurada corretamente.
export default client;
