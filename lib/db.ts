// src/lib/db.ts

import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;

const client = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = client;
}

export default client;