// /pages/api/feedback/send.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { fromEmail, subject, message } = req.body;

  if (!fromEmail || !subject || !message) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  // 1. Configura o "transportador" do Nodemailer com as credenciais da Brevo
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    secure: false, // true para porta 465, false para outras portas como 587
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASS,
    },
  });

  // 2. Define as opções do e-mail
  const mailOptions = {
    from: `"Feedback Goulart Minds" <${process.env.EMAIL_FROM}>`, // Remetente (pode ser o mesmo do seu .env)
    to: 'feedback@goulartminds.com.br', // ONDE VOCÊ QUER RECEBER O FEEDBACK
    replyTo: fromEmail, // Faz com que o botão "Responder" vá para o e-mail do usuário
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
  };

  // 3. Tenta enviar o e-mail
  try {
    await transporter.sendMail(mailOptions);
    // Se o envio for bem-sucedido, retorna uma resposta de sucesso
    res.status(200).json({ success: true, message: 'Feedback enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar e-mail de feedback via Nodemailer:', error);
    // Se falhar, retorna um erro genérico para o usuário
    res.status(500).json({ message: 'Ocorreu um erro ao enviar seu feedback.' });
  }
}