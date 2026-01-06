// /pages/api/comments/react.js

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import client from '../../../lib/db';

export default async function handle(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Método ${req.method} não permitido.` });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Acesso não autorizado.' });
  }

  const { commentId, reactionType } = req.body;
  const userId = session.user.id;

  if (!commentId || !reactionType) {
    return res.status(400).json({ message: 'ID do comentário e tipo de reação são obrigatórios.' });
  }

  try {
    // A chave para a lógica de "toggle" (ligar/desligar)
    const existingReaction = await client.commentReaction.findUnique({
      where: {
        commentId_userId_type: { // Usando o índice @@unique que criamos
          commentId: commentId,
          userId: userId,
          type: reactionType,
        },
      },
    });

    if (existingReaction) {
      // Se a reação já existe, o usuário está "desfazendo" a ação.
      await client.commentReaction.delete({
        where: {
          id: existingReaction.id,
        },
      });
    } else {
      // Se não existe, o usuário está adicionando uma nova reação.
      await client.commentReaction.create({
        data: {
          commentId: commentId,
          userId: userId,
          type: reactionType,
        },
      });
    }

    // Após adicionar ou remover, buscamos a nova contagem total de reações
    const reactionCount = await client.commentReaction.count({
      where: { commentId: commentId },
    });

    // Retornamos a nova contagem para o frontend atualizar a UI
    return res.status(200).json({ newReactionCount: reactionCount });

  } catch (error) {
    console.error('Erro ao processar reação:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}
