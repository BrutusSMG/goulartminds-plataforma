// /pages/api/comments/list.js

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import client from '../../../lib/db';

// Função auxiliar para construir o 'include' complexo. Evita repetição de código.
const getCommentInclude = (userId) => ({
  author: {
    select: { id: true, name: true, image: true },
  },
  // Inclui as reações que o usuário logado deu
  reactions: userId ? { where: { userId: userId } } : false,
  // O _count total ainda é útil para um resumo rápido
  _count: {
    select: { reactions: true },
  },
});

export default async function handle(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Método ${req.method} não permitido.` });
  }

  const { articleId } = req.query;
  if (!articleId) {
    return res.status(400).json({ message: 'O ID do artigo é obrigatório.' });
  }

  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.id;

  try {
    // 1. Busca principal dos comentários e suas respostas
    const comments = await client.comment.findMany({
      where: { articleId: String(articleId), parentId: null },
      include: {
        ...getCommentInclude(userId), // Usa a função auxiliar
        replies: { // Nível 2
          orderBy: { createdAt: 'asc' },
          include: {
            ...getCommentInclude(userId),
            replies: { // Nível 3
              orderBy: { createdAt: 'asc' },
              include: {
                ...getCommentInclude(userId),
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // 2. Busca as contagens de reações agrupadas por tipo
    const commentIds = comments.flatMap(c => [c.id, ...c.replies.map(r => r.id), ...c.replies.flatMap(r => r.replies.map(sr => sr.id))]);
    
    const reactionCounts = await client.commentReaction.groupBy({
      by: ['commentId', 'type'],
      where: { commentId: { in: commentIds } },
      _count: {
        type: true,
      },
    });

    // 3. Mapeia as contagens de volta para os comentários
    const reactionCountsMap = reactionCounts.reduce((acc, curr) => {
      if (!acc[curr.commentId]) {
        acc[curr.commentId] = {};
      }
      acc[curr.commentId][curr.type] = curr._count.type;
      return acc;
    }, {});

    // 4. Anexa as contagens individuais a cada comentário no objeto final
    const attachCounts = (commentList) => {
      return commentList.map(comment => ({
        ...comment,
        reactionCounts: reactionCountsMap[comment.id] || {},
        replies: comment.replies ? attachCounts(comment.replies) : [],
      }));
    };

    const commentsWithCounts = attachCounts(comments);

    return res.status(200).json(commentsWithCounts);

  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    return res.status(500).json({ message: 'Ocorreu um erro no servidor.' });
  }
}
