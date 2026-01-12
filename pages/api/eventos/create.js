// /pages/api/events/create.js

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

  // 1. Desestrutura o corpo da requisição
  const { date: dateString, ...otherData } = req.body;

  // 2. Validação ÚNICA e CORRETA
  if (!otherData.type || !dateString || !otherData.city || !otherData.registrationLink) {
    return res.status(400).json({ message: 'Campos obrigatórios (Tipo, Data, Cidade, Link de Inscrição) estão faltando.' });
  }

  // O segundo bloco de 'if' foi removido.

  try {
    const fullDateTimeString = `${dateString}T09:00:00.000-03:00`;

    const newEvent = await client.event.create({
      data: {
        ...otherData,
        date: new Date(fullDateTimeString),
      },
    });
    return res.status(201).json(newEvent);
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    if (process.env.NODE_ENV === 'development') {
      return res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
    }
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}
