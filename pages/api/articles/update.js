// src/pages/api/articles/update.js

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import client from '../../../lib/db';
import slugify from 'slugify';

export default async function handle(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Acesso negado.' });
  }

  const { originalSlug, title, subtitle, content, imageUrl, published, description } = req.body;

  if (!originalSlug) {
    return res.status(400).json({ message: 'O slug original do artigo é necessário para a atualização.' });
  }

  try {
    const updatedArticle = await client.article.update({
      where: { slug: originalSlug }, // Encontra o artigo pelo slug original
      data: {
        title,
        subtitle,
        content,
        imageUrl,
        description, // Adicionado para consistência
        slug: slugify(title, { lower: true, strict: true }), // Gera um novo slug caso o título mude
        published: !!published,
      },
    });
    res.status(200).json(updatedArticle);
  } catch (error) {
    console.error("Erro ao atualizar o artigo:", error);
    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
        return res.status(409).json({ message: 'Erro: O novo título gera um "slug" (URL) que já existe. Por favor, ajuste o título.' });
    }
    res.status(500).json({ message: 'Erro no servidor ao atualizar o artigo.' });
  }
}