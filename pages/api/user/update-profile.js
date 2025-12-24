// pages/api/user/update-profile.js

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import client from '../../../lib/db';

export default async function handle(req, res) {
  // Verifica se o método da requisição é POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Pega a sessão do usuário no lado do servidor
  const session = await getServerSession(req, res, authOptions); 

  // Verifica se a sessão e o ID do usuário existem
  if (!session?.user?.id) {
    console.error("API LOG: ERRO! Acesso negado porque o ID do usuário não foi encontrado na sessão.");
    return res.status(401).json({ message: 'Não autorizado.' });
  }

  // 1. Pega TODOS os dados enviados pelo formulário
  const { name, discProfile, celular, cidade } = req.body;

  // 2. Cria um objeto dinâmico SÓ com os dados que realmente foram enviados
  //    Isso evita erros caso um dos campos venha como 'undefined'.
  const dataToUpdate = {};
  if (name !== undefined) {
    dataToUpdate.name = name;
  }
  if (discProfile !== undefined) {
    dataToUpdate.discProfile = discProfile;
  }
  if (celular !== undefined) {
    dataToUpdate.celular = celular;
  }
  if (cidade !== undefined) {
    dataToUpdate.cidade = cidade;
  }

  // 3. Verifica se há algo para atualizar. Se o usuário só clicou em "Salvar"
  //    sem mudar nada, não precisamos acessar o banco de dados.
  if (Object.keys(dataToUpdate).length === 0) {
    return res.status(400).json({ message: 'Nenhum dado novo para atualizar.' });
  }

  try {
    // 4. Atualiza o usuário no banco de dados com o objeto dinâmico
    const updatedUser = await client.user.update({
      where: { id: session.user.id },
      data: dataToUpdate, 
    });

    return res.status(200).json({ success: true, user: updatedUser });

  } catch (error) {
    console.error('API Error: Falha ao atualizar o perfil no banco de dados.', error);
    return res.status(500).json({ message: 'Ocorreu um erro no servidor ao salvar os dados.' });
  }
}