// /pages/api/comments/update.js

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import client from '../../../lib/db';

export default async function handle(req, res) {
  // 1. Aceitar apenas o método PUT (ou PATCH), que é o padrão para atualizações.
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).json({ message: `Método ${req.method} não permitido.` });
  }

  // 2. Verificar se o usuário está autenticado.
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Acesso não autorizado.' });
  }

  // 3. Obter o ID do comentário e o novo conteúdo do corpo da requisição.
  const { commentId, content } = req.body;

  if (!commentId) {
    return res.status(400).json({ message: 'O ID do comentário é obrigatório.' });
  }
  if (!content || content.trim() === '') {
    return res.status(400).json({ message: 'O conteúdo do comentário não pode estar vazio.' });
  }

  try {
    // 4. Encontrar o comentário original no banco de dados.
    const commentToUpdate = await client.comment.findUnique({
      where: { id: commentId },
    });

    // Verificar se o comentário existe.
    if (!commentToUpdate) {
      return res.status(404).json({ message: 'Comentário não encontrado.' });
    }

    // 5. A VERIFICAÇÃO DE SEGURANÇA MAIS IMPORTANTE:
    // Garantir que o ID do usuário da sessão é o mesmo que o ID do autor do comentário.
    if (commentToUpdate.authorId !== session.user.id) {
      return res.status(403).json({ message: 'Você não tem permissão para editar este comentário.' });
    }

    // 6. Se todas as verificações passaram, atualizar o comentário.
    const updatedComment = await client.comment.update({
      where: { id: commentId },
      data: {
        content: content,
      },
      // O 'include' é uma propriedade no mesmo nível de 'where' e 'data'.
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      }, // A vírgula aqui separa 'data' de 'include'
    });

    return res.status(200).json(updatedComment);

  } catch (error) {
    console.error('Erro ao atualizar o comentário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor ao tentar atualizar o comentário.' });
  }
}
