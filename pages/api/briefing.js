import prisma from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const data = req.body;

    // 1. Salva no Banco de Dados
    const novoBriefing = await prisma.briefing.create({
      data: {
        nome: data.nome || 'Não informado',
        email: data.email || 'Não informado',
        whatsapp: data.whatsapp || 'Não informado',
        empresa: data.empresa || '',
        redes: data.redes || '',
        respostas: data,
      },
    });

    // Variáveis do seu .env.local
    const brevoApiKey = process.env.BREVO_API_KEY; 
    const emailRemetente = process.env.EMAIL_FROM;
    
    // ID da sua lista no Brevo
    const idDaListaBrevo = 10; 

    // =================================================================
    // AÇÃO 1: ADICIONAR O CONTATO NA LISTA DO BREVO
    // =================================================================
    try {
      const brevoContactResponse = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': brevoApiKey
        },
        body: JSON.stringify({
          email: data.email,
          attributes: {
            FIRSTNAME: data.nome,
            WHATSAPP_LEAD: data.whatsapp,
            EMPRESA: data.empresa || 'Não informada'
          },
          listIds: [idDaListaBrevo],
          updateEnabled: true 
        } )
      });

      if (!brevoContactResponse.ok) {
        const erroBrevo = await brevoContactResponse.json();
        console.error("❌ O Brevo recusou o contato. Motivo:", erroBrevo);
      } else {
        console.log("✅ Contato adicionado à lista do Brevo com todos os campos!");
      }
    } catch (err) {
      console.error("❌ Erro de rede ao conectar com o Brevo:", err);
    }

    // =================================================================
    // AÇÃO 2: ENVIAR O E-MAIL DE AVISO PARA VOCÊ
    // =================================================================
    const formatarResposta = (valor) => Array.isArray(valor) ? valor.join(', ') : valor;
    
    const htmlContent = `
      <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10B981;">Novo Briefing de Tráfego Recebido!</h2>
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p><strong>👤 Nome:</strong> ${data.nome}</p>
          <p><strong>🏢 Empresa:</strong> ${data.empresa || 'Não informada'}</p>
          <p><strong>📱 WhatsApp:</strong> ${data.whatsapp}</p>
          <p><strong>✉️ E-mail:</strong> ${data.email}</p>
        </div>
        <h3>Respostas do Formulário:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${Object.entries(data).map(([chave, valor]) => `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold; text-transform: capitalize; width: 40%;">${chave.replace(/_/g, ' ')}</td>
              <td style="padding: 10px 0; color: #555;">${formatarResposta(valor)}</td>
            </tr>
          `).join('')}
        </table>
          

        <a href="https://wa.me/55${data.whatsapp?.replace(/\D/g, '' )}" style="display: inline-block; background-color: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Chamar no WhatsApp</a>
      </div>
    `;

    try {
      const brevoEmailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': brevoApiKey
        },
        body: JSON.stringify({
          sender: { email: emailRemetente, name: "Goulart Minds" },
          to: [{ email: emailRemetente, name: "Martins" }], 
          subject: `🔥 Novo Briefing: ${data.empresa || data.nome}`,
          htmlContent: htmlContent
        } )
      });

      if (!brevoEmailResponse.ok) {
        const erroEmail = await brevoEmailResponse.json();
        console.error("❌ Erro ao enviar e-mail:", erroEmail);
      } else {
        console.log("✅ E-mail de notificação enviado com sucesso!");
      }
    } catch (err) {
      console.error("❌ Erro de rede ao enviar e-mail:", err);
    }

    // Retorna sucesso para o frontend
    return res.status(201).json({ success: true, briefing: novoBriefing });
    
  } catch (error) {
    console.error('Erro detalhado:', error);
    return res.status(500).json({ success: false, error: 'Erro interno' });
  }
}
