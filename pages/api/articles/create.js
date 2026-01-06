// src/pages/api/articles/create.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import client from '../../../lib/db';

export default async function handle(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Acesso negado.' });
  }

  const { title, subtitle, slug, imageUrl, description, content } = req.body;

  if (!title || !slug || !imageUrl || !description || !content) {
    return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
  }

  try {
    const authorId = session.user.id; 

    const newArticle = await client.article.create({
      data: {
        title,
        subtitle,
        slug,
        imageUrl,
        description,
        content,
        author: {         // 2. Adiciona a relação com o autor
          connect: {
            id: authorId, // 3. Conecta com o ID do usuário logado
          },
        },                // 4. Fim da adição
      },
    });
    // 👆 --- FIM DA CORREÇÃO --- 👆

    res.status(201).json(newArticle);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Erro: O "slug" (URL) já existe. Escolha outro.' });
    }
    console.error("Erro ao criar artigo:", error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}
