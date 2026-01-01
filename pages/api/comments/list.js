// src/pages/api/comments/list.js

import client from '../../../lib/db'; // Importa o seu cliente Prisma

export default async function handle(req, res) {
  // 1. Verificar se o método da requisição é GET
  // Esta API é apenas para buscar dados, então só aceitamos o método GET.
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Método ${req.method} não permitido.` });
  }

  // 2. Obter o ID do artigo a partir dos parâmetros da URL
  // O frontend fará uma chamada como: /api/comments/list?articleId=cuid_do_artigo
  const { articleId } = req.query;

  // 3. Validar se o articleId foi fornecido
  if (!articleId) {
    return res.status(400).json({ message: 'O ID do artigo é obrigatório.' });
  }

  try {
    // 4. Usar o Prisma para buscar os comentários no banco de dados
    const comments = await client.comment.findMany({
      // A condição de busca: onde o 'articleId' da tabela de comentários
      // é igual ao 'articleId' que recebemos na requisição.
      where: {
        articleId: String(articleId),
      },
      // Incluir dados relacionados para cada comentário encontrado
      include: {
        // Para cada comentário, inclua os dados do autor (usuário)
        author: {
          select: {
            id: true,
            name: true,
            image: true, // A imagem do perfil do autor do comentário
          },
        },
        // Para cada comentário, inclua a contagem de curtidas
        _count: {
          select: {
            likes: true, // 'likes' é o nome da relação no schema.prisma
          },
        },
      },
      // Ordenar os comentários, do mais recente para o mais antigo
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 5. Retornar os comentários encontrados com sucesso
    return res.status(200).json(comments);

  } catch (error) {
    // 6. Lidar com possíveis erros do banco de dados ou outros problemas
    console.error('Erro ao buscar comentários:', error);
    return res.status(500).json({ message: 'Ocorreu um erro no servidor ao buscar os comentários.' });
  }
}
