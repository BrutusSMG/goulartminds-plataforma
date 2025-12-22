// /pages/api/tools/complete.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/db'; // Ajuste o caminho se necessário

export default async function handle(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ message: 'Não autorizado.' });
  }

  const { toolName } = req.body;
  if (!toolName) {
    return res.status(400).json({ message: 'O nome da ferramenta é obrigatório.' });
  }

  try {
    // Adiciona a nova ferramenta ao array 'completedTools'
    // Usando 'push' para não duplicar se o usuário refizer a ferramenta
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user.completedTools.includes(toolName)) {
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                completedTools: {
                    push: toolName,
                },
            },
        });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('API Error: Falha ao salvar a ferramenta concluída.', error);
    res.status(500).json({ message: 'Ocorreu um erro no servidor.' });
  }
}
