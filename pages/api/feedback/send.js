// /pages/api/feedback/send.js
import { Resend } from 'resend';

// Pega a chave de API do Resend das suas variáveis de ambiente
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { fromEmail, subject, message } = req.body;

  if (!fromEmail || !subject || !message) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    await resend.emails.send({
      from: 'Feedback Goulart Minds <feedback@goulartminds.com.br>', // Um e-mail verificado no seu domínio no Resend
      to: ['goulartminds@gmail.com'], // O E-MAIL ONDE VOCÊ QUER RECEBER O FEEDBACK
      subject: `Novo Feedback: ${subject}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>Novo feedback recebido na plataforma Goulart Minds</h2>
          <p><strong>De:</strong> ${fromEmail}</p>
          <p><strong>Assunto:</strong> ${subject}</p>
          <hr>
          <h3>Mensagem:</h3>
          <p>${message.replace(/\n/g, ' ')}</p>
        </div>
      `,
    });

    res.status(200).json({ success: true, message: 'Feedback enviado com sucesso!' });

  } catch (error) {
    console.error('Erro ao enviar e-mail de feedback:', error);
    res.status(500).json({ message: 'Ocorreu um erro ao enviar seu feedback.' });
  }
}
