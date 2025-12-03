// prisma.config.cjs

// Exporta a configuração usando a sintaxe CommonJS, que é universal.
// O ambiente da Vercel injetará as variáveis de ambiente em process.env.
module.exports = {
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
};
