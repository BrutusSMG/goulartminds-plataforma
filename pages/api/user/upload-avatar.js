// pages/api/user/upload-avatar.js

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/db';
import { v2 as cloudinary } from 'cloudinary';
import { IncomingForm } from 'formidable';

// Configura o Cloudinary com as suas credenciais do .env.local
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Desativa o bodyParser padrão do Next.js para esta rota,
// pois o formidable precisa do stream bruto da requisição.
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handle(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ message: 'Não autorizado.' });
  }

  try {
    // Usa o formidable para processar o formulário de upload
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Erro ao processar o formulário:', err);
        return res.status(500).json({ message: 'Erro ao processar o upload.' });
      }

      const imageFile = files.profileImage?.[0];

      if (!imageFile) {
        return res.status(400).json({ message: 'Nenhuma imagem enviada.' });
      }

      // Faz o upload do arquivo para o Cloudinary
      const uploadResult = await cloudinary.uploader.upload(imageFile.filepath, {
        folder: `goulartminds/avatars`, // Organiza os avatares em uma pasta no Cloudinary
        public_id: session.user.id,     // Usa o ID do usuário como nome do arquivo (sobrescreve o antigo)
        overwrite: true,
        format: 'jpg', // Converte para jpg para otimizar
        transformation: [ // Cria uma versão otimizada
          { width: 250, height: 250, gravity: "face", crop: "thumb" }
        ]
      });

      // Pega a URL segura da imagem otimizada
      const newImageUrl = uploadResult.secure_url;

      // Salva a nova URL da imagem no banco de dados
      await prisma.user.update({
        where: { id: session.user.id },
        data: { image: newImageUrl },
      });

      // Retorna a nova URL para o frontend
      return res.status(200).json({ newImageUrl });
    });
  } catch (error) {
    console.error('API Error: Falha no upload do avatar.', error);
    return res.status(500).json({ message: 'Ocorreu um erro no servidor ao fazer o upload.' });
  }
}
