// /pages/api/comments/delete.js

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import client from '../../../lib/db';

export default async function handle(req, res) {
  // 1. Usamos o método DELETE, que é o padrão HTTP para exclusão.
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).json({ message: `Método ${req.method} não permitido.` });
  }

  // 2. Verificar se o usuário está autenticado.
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Acesso não autorizado.' });
  }

  // 3. Obter o ID do comentário a ser excluído. Em requisições DELETE, é comum passar dados via query string.
  const { commentId } = req.query;

  if (!commentId) {
    return res.status(400).json({ message: 'O ID do comentário é obrigatório.' });
  }

  try {
    // 4. Encontrar o comentário para verificar o autor.
    const commentToDelete = await client.comment.findUnique({
      where: { id: String(commentId) },
    });

    if (!commentToDelete) {
      return res.status(404).json({ message: 'Comentário não encontrado.' });
    }

    // 5. VERIFICAÇÃO DE SEGURANÇA: O usuário é o autor do comentário?
    // (Poderíamos adicionar uma verificação de admin aqui também, ex: || session.user.role === 'ADMIN')
    if (commentToDelete.authorId !== session.user.id) {
      return res.status(403).json({ message: 'Você não tem permissão para excluir este comentário.' });
    }

    // 6. Se tudo estiver certo, deletar o comentário.
    // O Prisma cuidará de deletar as respostas e reações em cascata.
    await client.comment.delete({
      where: { id: String(commentId) },
    });

    // 7. Retornar sucesso.
    return res.status(200).json({ message: 'Comentário excluído com sucesso.' });

  } catch (error) {
    console.error('Erro ao excluir o comentário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}
