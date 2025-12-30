// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Adicionando a configuração de imagens que faltava
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      
      {
        protocol: 'https',
        hostname: 'www.goulartminds.com.br',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'goulartminds.com.br',
        port: '',
        pathname: '/**',
      },
    ],
  },
};


module.exports = nextConfig;
