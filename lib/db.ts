// Arquivo: lib/db.js

import { PrismaClient } from '@prisma/client';

// Declara uma variável global para armazenar a instância do Prisma Client.
// Isso é crucial para evitar criar novas conexões a cada recarregamento em desenvolvimento.
const globalForPrisma = global;

// Cria uma instância do Prisma Client, mas de forma "preguiçosa".
// Se já existir uma instância global, ela será reutilizada.
// Se não, uma nova será criada.
const client = globalForPrisma.prisma || new PrismaClient({
  // Opcional: você pode adicionar logs para ver o que o Prisma está fazendo.
  // log: ['query', 'info', 'warn', 'error'],
});

// Em ambiente de desenvolvimento, armazena a instância criada na variável global.
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = client;
}

// Exporta a instância única do Prisma Client.
export default client;
