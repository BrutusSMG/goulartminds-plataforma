// /pages/api/jornadas/start.js (VERSÃO CORRIGIDA E SEGURA)

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]'; // Caminho relativo para a configuração do NextAuth
import client from '../../../lib/db';

export default async function handler(req, res) {
  console.log('API /api/jornadas/start FOI CHAMADA');
  // 1. Proteger o endpoint verificando a sessão
  const session = await getServerSession(req, res, authOptions);

  // Se não houver sessão, a requisição não é autorizada
  if (!session) {
    return res.status(401).json({ message: 'Não autorizado. Faça login para iniciar uma jornada.' });
  }

  // 2. Garantir que o método é POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  // 3. Executar a lógica de negócio (agora com segurança)
  try {
    const { journeyId } = req.body;
    const userId = session.user.id; // Pegamos o ID do usuário da sessão segura

    if (!journeyId) {
      return res.status(400).json({ message: 'ID da jornada é obrigatório.' });
    }

    // Verificar se o usuário já tem uma jornada em andamento
    const existingProgress = await client.userJourneyProgress.findFirst({
      where: {
        userId: userId,
        status: 'IN_PROGRESS',
      },
    });

    if (existingProgress) {
      return res.status(409).json({ message: 'Você já possui uma jornada em andamento.' });
    }

    // Criar o novo progresso da jornada para o usuário
    const newProgress = await client.userJourneyProgress.create({
      data: {
        userId: userId,
        journeyId: journeyId,
        currentStep: 1, // Sempre começa na etapa 1
        status: 'IN_PROGRESS',
      },
    });

    return res.status(201).json(newProgress);

  } catch (error) {
    console.error('Erro na API /api/jornadas/start:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}
