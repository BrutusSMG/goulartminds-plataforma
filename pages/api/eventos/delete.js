// src/pages/api/eventos/delete.js

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import client from '../../../lib/db';

export default async function handle(req, res) {
  // Este endpoint só aceita o método DELETE
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Método não permitido.' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Acesso negado.' });
  }

  // O ID virá no corpo (body) da requisição
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'O ID do evento é obrigatório.' });
  }

  try {
    await client.event.delete({
      where: { id: id },
    });
    // Retorna 204 No Content, um padrão para exclusões bem-sucedidas
    return res.status(204).end();
  } catch (error) {
    console.error('Erro ao excluir evento:', error);
    // Trata o caso em que o evento a ser deletado não foi encontrado
    if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Evento não encontrado.' });
    }
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}
