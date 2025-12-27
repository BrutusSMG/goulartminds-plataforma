// pages/api/auth/[...nextauth].js

import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import EmailProvider from 'next-auth/providers/email';
import client from '../../../lib/db'; 
import GoogleProvider from 'next-auth/providers/google';

// Variável para o nome do cookie de produção
const prodCookieName = '__Secure-next-auth.session-token';

export const authOptions = {
  adapter: PrismaAdapter(client),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
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
  ],

  session: {
    strategy: 'jwt',
  },

  // --- CORREÇÃO APLICADA AQUI ---
  // Lógica de cookies condicional ao ambiente
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? prodCookieName 
        : 'next-auth.session-token', // Nome diferente e mais simples para dev
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        // 'secure' será true apenas em produção
        secure: process.env.NODE_ENV === 'production',
        // 'domain' será definido apenas em produção
        domain: process.env.NODE_ENV === 'production' 
          ? '.goulartminds.com.br' 
          : undefined, // Em dev, o navegador usará 'localhost'
      }
    },
  },

  callbacks: {
    // Seus callbacks jwt e session permanecem exatamente como estão.
    // Eles já estão corretos.
    async jwt({ token, user, trigger, account, session } ) {

      // 1. Lógica para quando a sessão é atualizada via update() no frontend
      if (trigger === "update" && session) {
        // Atualiza o token com os novos dados recebidos
        if (session.name) {
          token.name = session.name;
        }
        if (session.image) {
          token.picture = session.image;
        }
        if (session.discProfile !== undefined) {
          token.discProfile = session.discProfile;
        }
        // Retorna o token imediatamente atualizado
        return token;
      }
      
      // 2. Lógica para o login inicial e para a verificação normal da sessão
      const userId = token.id || user?.id || token.sub;
      if (!userId) {
        return token;
      }

      // Busca o usuário no banco de dados
      let dbUser = await client.user.findUnique({
        where: { id: userId },
      });

      if (!dbUser) {
        // Se o usuário não for encontrado no DB, invalida o token
        return null;
      }

    const toolTags = dbUser.tags.filter(tag => tag.startsWith('tool_'));

    if (toolTags.length > 0) {
      // Extrai os nomes das ferramentas (ex: 'tool_irritacao_completed' -> 'Irritacao')
      const newTools = toolTags.map(tag => {
        const name = tag.replace('tool_', '').replace('_completed', '');
        return name.charAt(0).toUpperCase() + name.slice(1); // Capitaliza: 'irritacao' -> 'Irritacao'
      });

      // Filtra as ferramentas que ainda não estão em 'completedTools'
      const uniqueNewTools = newTools.filter(tool => !dbUser.completedTools.includes(tool));

      if (uniqueNewTools.length > 0) {
        // Filtra as tags antigas, removendo as que foram movidas
        const remainingTags = dbUser.tags.filter(tag => !tag.startsWith('tool_'));

        // Atualiza o usuário no banco de dados em uma única operação
        dbUser = await client.user.update({
          where: { id: dbUser.id },
          data: {
            completedTools: {
              push: uniqueNewTools, // Adiciona as novas ferramentas
            },
            tags: remainingTags, // Define a nova lista de tags (sem as de ferramentas)
          },
        });
        console.log(`Sincronizadas ${uniqueNewTools.length} ferramentas para o usuário ${dbUser.email}.`);
      }
    }

    // Preenche o token com os dados mais recentes do banco de dados
    return {
      ...token, // Mantém os dados existentes no token (como 'sub', 'iat', 'exp')
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      picture: dbUser.image, // Use 'picture' para a imagem, é o padrão do JWT
      plan: dbUser.plan,
      tags: dbUser.tags,
      discProfile: dbUser.discProfile, // Pega o discProfile do banco de dados
      completedTools: dbUser.completedTools,
      celular: dbUser.celular,
      cidade: dbUser.cidade,
      role: dbUser.role,
    };
  },

  async session({ session, token }) {
    // --- INÍCIO DA CORREÇÃO ---

    // Passa os dados atualizados do token para o objeto de sessão do frontend
    if (token && session.user) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.image = token.picture; // Passa a imagem para o frontend
      session.user.plan = token.plan;
      session.user.tags = token.tags;
      session.user.discProfile = token.discProfile; // Passa o discProfile para o frontend
      session.user.completedTools = token.completedTools;
      session.user.celular = token.celular;
      session.user.cidade = token.cidade;
      session.user.role = token.role;
    }
    
    return session;
    },
  },

  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
    error: '/auth/error',
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// Seu wrapper de erro pode permanecer como está.
export default async function auth(req, res) {
  try {
    return await NextAuth(req, res, authOptions);
  } catch (error) {
    console.error("ERRO CATASTRÓFICO NA INICIALIZAÇÃO DO NEXTAUTH:", error);
    res.status(500).json({
      success: false,
      message: "Falha crítica na inicialização do NextAuth.",
      errorDetails: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    });
  }
}
