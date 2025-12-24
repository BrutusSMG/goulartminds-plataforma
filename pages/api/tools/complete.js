// /pages/api/tools/complete.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import client from '../../../lib/db'; 

export default async function handle(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ message: 'Não autorizado.' });
  }

  const { toolName } = req.body;
  if (!toolName || typeof toolName !== 'string') {
    return res.status(400).json({ message: 'O nome da ferramenta (string) é obrigatório.' });
  }

  try {
    await client.user.updateMany({
      where: { 
        id: session.user.id,
        NOT: {
          completedTools: {
            has: toolName,
          },
        },
      },
      data: {
        completedTools: {
          push: toolName,
        },
      },
    });

    res.status(200).json({ success: true, message: 'Progresso salvo.' });
  } catch (error) {
    console.error('API Error: Falha ao salvar a ferramenta concluída.', error);
    res.status(500).json({ message: 'Ocorreu um erro no servidor.' });
  }
}
