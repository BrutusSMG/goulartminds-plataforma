// pages/api/tag-user.js
import prisma from '../../lib/db'; // Precisaremos criar este arquivo de conexão

export default async function handle(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, tag } = req.body;

  if (!email || !tag) {
    return res.status(400).json({ message: 'Email and tag are required' });
  }

  try {
    // Encontra o usuário ou cria um novo se não existir
    const user = await prisma.user.upsert({
      where: { email: email },
      update: {}, // Não atualiza nada aqui, só queremos garantir que ele exista
      create: {
        email: email,
        // Podemos adicionar um nome padrão se quisermos
        name: email.split('@')[0], 
      },
    });

    // Adiciona a nova tag apenas se ela já não existir no array
    const updatedTags = [...new Set([...user.tags, tag])];

    // Atualiza o usuário com a nova lista de tags
    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: { tags: updatedTags },
    });

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error tagging user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
