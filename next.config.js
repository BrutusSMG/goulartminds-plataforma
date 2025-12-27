// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Adicionando a configuração de imagens que faltava
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      // Adicione o domínio de produção aqui também para quando fizer o deploy
      {
        protocol: 'https',
        hostname: 'www.goulartminds.com.br',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Mantendo sua configuração de 'env' original
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
    EMAIL_SERVER_PASS: process.env.EMAIL_SERVER_PASS,
    EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
    EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
    EMAIL_FROM: process.env.EMAIL_FROM,
  },
};

// 👇 Mantendo a sua sintaxe de exportação original, que está correta para o seu projeto
module.exports = nextConfig;
