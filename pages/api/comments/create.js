// src/pages/api/comments/create.js

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]'; 
import client from '../../../lib/db';

export default async function handle(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Acesso não autorizado. Por favor, faça o login.' });
  }

  // Esperamos 'content', 'articleId', e um 'parentId' opcional
  const { content, articleId, parentId } = req.body;

  if (!content || content.trim() === '') {
    return res.status(400).json({ message: 'O comentário não pode estar vazio.' });
  }
  if (!articleId) {
    return res.status(400).json({ message: 'ID do artigo não encontrado.' });
  }

  try {
    const dataToCreate = {
      content: content,
      articleId: articleId,
      authorId: session.user.id,
    };

    // Se um parentId foi fornecido, adicionamos ao objeto de dados
    if (parentId) {
      dataToCreate.parentId = parentId;
    }

    const newComment = await client.comment.create({
      data: dataToCreate,
      include: {
        author: {
          select: { name: true, image: true },
        },
      },
    });

    const commentForFrontend = {
      ...newComment,
      replies: [], // Um novo comentário nunca tem respostas
      _count: { reactions: 0 }, // Um novo comentário sempre começa com 0 reações
    };

    return res.status(201).json(commentForFrontend);

  } catch (error) {
    console.error("Erro ao criar comentário:", error);
    return res.status(500).json({ message: 'Erro interno do servidor ao tentar criar o comentário.' });
  }
}
