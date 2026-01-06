// src/pages/api/eventos/update.js

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import client from '../../../lib/db';

export default async function handle(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Método não permitido.' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Acesso negado.' });
  }

  const { id, ...eventData } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'O ID do evento é obrigatório.' });
  }

  try {
    const updatedEvent = await client.event.update({
      where: { id: id },
      data: {
        ...eventData,
        date: new Date(eventData.date), // Garante que a data seja um objeto Date
      },
    });
    return res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}
