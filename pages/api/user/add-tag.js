// pages/api/user/add-tag.js

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/db';

export default async function handle(req, res) {
  // 1. Valida o método da requisição
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  // 2. Tenta obter a sessão da forma padrão e segura
  const session = await getServerSession(req, res, authOptions);

  // 3. Se não houver sessão, o usuário não está logado. Acesso negado.
  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ message: 'Não autenticado' });
  }

  // 4. Se a sessão for válida, extrai os dados necessários
  const userId = session.user.id;
  const { tag } = req.body;

  // 5. Valida o corpo da requisição
  if (!tag || typeof tag !== 'string') {
    return res.status(400).json({ message: 'Tag inválida fornecida' });
  }

  // 6. Executa a lógica de negócio (adicionar a tag)
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado no banco de dados' });
    }

    // Se o usuário já tiver a tag, não faça nada e retorne sucesso.
    if (user.tags.includes(tag)) {
      return res.status(200).json({ message: 'Tag já existente, nenhuma ação necessária' });
    }

    // Adiciona a nova tag ao array de tags existente
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        tags: {
          push: tag,
        },
      },
    });

    // 7. Retorna uma resposta de sucesso
    res.status(200).json({ success: true, tags: updatedUser.tags });

  } catch (error) {
    console.error('Erro ao interagir com o banco de dados:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao tentar adicionar a tag' });
  }
}
