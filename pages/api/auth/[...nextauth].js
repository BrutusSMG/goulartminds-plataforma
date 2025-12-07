// pages/api/auth/[...nextauth].js

import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import EmailProvider from 'next-auth/providers/email';
import client from '../../../lib/db'; // Importa nossa instância do Prisma Client

// -> MUDANÇA: Definimos toda a configuração em uma constante exportável 'authOptions'
export const authOptions = {
  // 1. Adaptador: Conecta o NextAuth ao nosso banco de dados Prisma
  adapter: PrismaAdapter(client),

  // 2. Provedores: Os métodos de login que vamos oferecer
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASS,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    // Futuramente, podemos adicionar outros provedores aqui:
    // GoogleProvider({ ... }),
  ],

  // 3. Estratégia de Sessão: Usaremos JSON Web Tokens (JWT)
  session: {
    strategy: 'jwt',
  },

  // 4. Callbacks: Permite customizar o comportamento
  callbacks: {
    async jwt({ token }) {
      // Esta função agora será mais simples, mas muito mais robusta.
      // A cada vez que um token JWT é verificado (ex: carregamento de página),
      // nós vamos buscar os dados mais recentes do usuário no banco de dados.

      // Se o token não tiver um ID, não podemos fazer nada.
      if (!token.sub) {
        return token;
      }

      // Busca o usuário no banco de dados usando o ID do token (o campo 'sub' é o ID padrão do JWT)
      const dbUser = await client.user.findUnique({
        where: {
          id: token.sub,
        },
      });

      // Se o usuário não for encontrado no banco, algo está errado.
      if (!dbUser) {
        return token;
      }

      // Atualiza o token com os dados mais recentes do banco de dados.
      token.name = dbUser.name;
      token.email = dbUser.email;
      token.plan = dbUser.plan;
      token.id = dbUser.id; // Garante que nosso 'id' customizado também esteja lá

      return token;
    },

    async session({ session, token }) {
      // Agora, a sessão sempre receberá os dados mais frescos que o JWT acabou de buscar.
      if (session.user) {
        session.user.id = token.id;
        session.user.plan = token.plan;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },

  // 5. Páginas Customizadas (Opcional, mas recomendado)
  pages: {
  signIn: '/auth/signin', // Uma página de login customizada
  verifyRequest: '/auth/verify-request', // Página para "Verifique seu e-mail"
  error: '/auth/error', // Página para exibir erros de autenticação
  },

  // 6. Segredos: Uma chave secreta para assinar os tokens
  secret: process.env.NEXTAUTH_SECRET,
};

// -> MUDANÇA: A exportação padrão agora simplesmente usa a constante 'authOptions'
export default NextAuth(authOptions);
