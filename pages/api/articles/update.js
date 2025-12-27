// src/pages/api/articles/update.js

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import client from '../../../lib/db';

export default async function handle(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Acesso negado.' });
  }

  const { originalSlug, title, subtitle, content, imageUrl } = req.body;

  try {
    const updatedArticle = await client.article.update({
      where: { slug: originalSlug }, // Encontra o artigo pelo slug original
      data: {
        title,
        subtitle,
        content,
        imageUrl,
        slug: slugify(title), // Gera um novo slug caso o título mude
      },
    });
    res.status(200).json(updatedArticle);
  } catch (error) {
    console.error("Erro ao atualizar o artigo:", error);
    res.status(500).json({ message: 'Erro no servidor ao atualizar o artigo.' });
  }
}
