// lib/db.ts
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// Usamos a POSTGRES_URL que a Vercel nos deu
const connectionString = `${process.env.POSTGRES_URL}?sslmode=require`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const client = globalThis.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;

export default client;
