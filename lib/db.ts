// /lib/db.ts

import { PrismaClient } from '@prisma/client';

// 1. Declara uma variável global para o Prisma Client com tipagem.
// Isso informa ao TypeScript sobre a nossa propriedade 'prisma' personalizada no objeto global.
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// 2. Cria a instância do cliente.
// Em produção, 'globalThis.prisma' será sempre 'undefined', criando uma nova instância.
// Em desenvolvimento, ele reutilizará a instância armazenada no objeto global, se existir.
const client = globalThis.prisma || new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// 3. Em ambiente de desenvolvimento, armazena a instância recém-criada no objeto global.
// Isso garante que na próxima recarga (hot-reload), a instância será reutilizada.
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = client;
}

// 4. Exporta a instância única e segura.
export default client;