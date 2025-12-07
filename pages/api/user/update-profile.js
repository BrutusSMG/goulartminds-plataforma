// pages/api/user/update-profile.js

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/db';

export default async function handle(req, res) {
  // Verifica se o método da requisição é POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Pega a sessão do usuário no lado do servidor
  const session = await getServerSession(req, res, authOptions); 

  // Verifica se a sessão e o ID do usuário existem
  if (!session?.user?.id) {
    console.error("API LOG: ERRO! Acesso negado porque o ID do usuário não foi encontrado na sessão.");
    return res.status(401).json({ message: 'Não autorizado.' });
  }

  try {
    // Pega o nome enviado pelo formulário
    const { name } = req.body;

    // Tenta atualizar o usuário no banco de dados
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name: name },
    });

    // ---- ESPIÃO 3: Confirma que a atualização no banco de dados funcionou ----
    return res.status(200).json({ success: true, user: updatedUser });

  } catch (error) {
    // ---- ESPIÃO 4: Se algo der errado, mostra o erro exato ----
    console.error('API LOG: ERRO! Ocorreu um problema ao tentar atualizar o banco de dados.');
    console.error('API LOG: O erro detalhado do Prisma é:', error);
    return res.status(500).json({ message: 'Ocorreu um erro no servidor.' });
  }
}
