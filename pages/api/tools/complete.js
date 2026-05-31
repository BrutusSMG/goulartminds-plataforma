// /pages/api/tools/complete.js

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import client from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user || !session.user.id) {
    return res.status(403).json({ message: 'Acesso negado. Usuário não autenticado.' });
  }
  const userId = session.user.id;

  const { toolId, journeyId, data } = req.body;

  if (!toolId || !journeyId || !data) {
    return res.status(400).json({ message: 'Dados incompletos. toolId, journeyId e data são obrigatórios.' });
  }

  try {
    const result = await client.$transaction(async (prisma) => {
      // Salva as respostas da ferramenta
      const toolResponse = await prisma.toolResponse.create({
        data: {
          toolId: toolId,
          userId: userId,
          journeyId: journeyId,
          data: data,
        },
      });

      // Encontra o progresso atual do usuário na jornada
      const userProgress = await prisma.userJourneyProgress.findUnique({
        where: {
          userId_journeyId: {
            userId: userId,
            journeyId: journeyId,
          },
        },
        include: {
          journey: {
            include: {
              steps: {
                orderBy: {
                  order: 'asc',
                },
              },
            },
          },
        },
      });

      if (!userProgress) {
        // Se não houver progresso, cria um novo
        await prisma.userJourneyProgress.create({
          data: {
            userId: userId,
            journeyId: journeyId,
            currentStep: 1,
            status: 'IN_PROGRESS',
          },
        });
      } else {
        // Se o progresso existe, avança para a próxima etapa
        const currentStepIndex = userProgress.journey.steps.findIndex(
          (step) => step.order === userProgress.currentStep
        );
        
        const nextStep = userProgress.journey.steps[currentStepIndex + 1];

        if (nextStep) {
          // Se houver próxima etapa, atualiza o progresso
          await prisma.userJourneyProgress.update({
            where: { id: userProgress.id },
            data: { currentStep: nextStep.order },
          });
        } else {
          // Se não houver, marca a jornada como concluída
          await prisma.userJourneyProgress.update({
            where: { id: userProgress.id },
            data: {
              status: 'COMPLETED',
              completedAt: new Date(),
            },
          });
        }
      }
      
      return toolResponse;
    });

    res.status(200).json({ success: true, message: 'Progresso salvo com sucesso!', data: result });

  } catch (error) {
    console.error("Erro ao salvar progresso da ferramenta:", error);
    res.status(500).json({ message: 'Erro interno do servidor ao salvar o progresso.' });
  }
}
