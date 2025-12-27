// /pages/api/articles/like.js
import client from '../../../lib/db';

export default async function handle(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { slug } = req.body;
  if (!slug) {
    return res.status(400).json({ message: 'O slug do artigo é obrigatório.' });
  }

  try {
    // Usa 'update' para incrementar o campo 'likes' em 1.
    // Esta é uma operação atômica, segura para múltiplas chamadas.
    const updatedArticle = await client.article.update({
      where: { slug: slug },
      data: {
        likes: {
          increment: 1,
        },
      },
    });

    res.status(200).json({ likes: updatedArticle.likes });
  } catch (error) {
    console.error('Erro ao dar like no artigo:', error);
    res.status(500).json({ message: 'Erro ao processar a solicitação.' });
  }
}
