// src/pages/api/upload-image.js

import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';

// Desabilita o 'bodyParser' padrão do Next.js para esta rota,
// pois o 'formidable' vai cuidar do parsing do corpo da requisição.
export const config = {
  api: {
    bodyParser: false,
  },
};

// Configura o Cloudinary com suas credenciais do .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handle(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const form = formidable({});
    
    // O 'form.parse' processa a requisição e extrai o arquivo
    const [fields, files] = await form.parse(req);
    
    const imageFile = files.image?.[0];

    if (!imageFile) {
      return res.status(400).json({ message: 'Nenhum arquivo de imagem enviado.' });
    }

    // Envia o arquivo para o Cloudinary
    const result = await cloudinary.uploader.upload(imageFile.filepath, {
      folder: 'goulartminds_articles', // Organiza os uploads em uma pasta no Cloudinary
    });

    // Retorna a URL segura da imagem que o Cloudinary gerou
    res.status(200).json({ imageUrl: result.secure_url });

  } catch (error) {
    console.error('Erro no upload para o Cloudinary:', error);
    res.status(500).json({ message: 'Erro no servidor ao fazer o upload da imagem.' });
  }
}
