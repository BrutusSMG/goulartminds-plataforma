// src/pages/api/events/create.js

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import client from '../../../lib/db';

export default async function handle(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido.' });
  }

  const session = await getServerSession(req, res, authOptions);
  
  if (!session || session.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Acesso negado.' });
  }

  const data = req.body;

  // Nova validação simplificada
  if (!data.type || !data.date || !data.city || !data.registrationLink) {
    return res.status(400).json({ message: 'Campos obrigatórios (Tipo, Data, Cidade, Link de Inscrição) estão faltando.' });
  }

  try {
    const newEvent = await client.event.create({
      data: {
        ...data,
        date: new Date(data.date),
      },
    });
    return res.status(201).json(newEvent);
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}
