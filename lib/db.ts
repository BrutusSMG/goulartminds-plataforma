// /lib/db.js

import { PrismaClient } from '@prisma/client';

let client = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export default client;
