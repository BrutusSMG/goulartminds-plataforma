// lib/db.ts (Versão Simples e Correta)

import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// Previne múltiplas instâncias do PrismaClient em ambiente de desenvolvimento
const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;

export default client;
