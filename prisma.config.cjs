// prisma.config.cjs
module.exports = {
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
};
