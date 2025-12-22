// Arquivo: pages/api/capture-lead.js (VERSÃO CORRIGIDA - AGUARDANDO RESPOSTA)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido.' });
  }

  try {
    const clientData = req.body;
    const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;
    if (!googleScriptUrl) {
      throw new Error('URL do Google Script não configurada no servidor.');
    }

    // Dispara a requisição para o Google e NÃO espera por ela.
    fetch(googleScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientData),
      redirect: 'follow'
    }).catch(error => {
      // Apenas loga o erro no servidor, não afeta o cliente.
      console.error('[API Fire-and-Forget] Erro de rede ao disparar para o Google:', error.message);
    });

    // Responde IMEDIATAMENTE ao frontend com sucesso.
    res.status(200).json({ success: true, message: 'Requisição recebida e sendo processada em segundo plano.' });

  } catch (error) {
    console.error('[API] Erro antes do disparo:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}
