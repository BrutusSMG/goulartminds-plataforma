// Arquivo: pages/api/capture-lead.js (VERSÃO "DISPARE E ESQUEÇA")

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

    // ===============================================================
    // MUDANÇA PRINCIPAL: "DISPARE E ESQUEÇA"
    // Nós iniciamos a requisição, mas não esperamos (await) por ela.
    // Isso libera o nosso servidor para responder ao cliente imediatamente.
    // ===============================================================
    fetch(googleScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientData),
      redirect: 'follow'
    }).catch(error => {
      // Adicionamos um .catch aqui para logar qualquer erro de rede
      // que possa acontecer durante o "disparo", mas não vamos
      // fazer o cliente esperar por isso.
      console.error('[API Fire-and-Forget] Erro de rede ao disparar para o Google:', error.message);
    });

    // ===============================================================
    // Responde imediatamente ao frontend com sucesso.
    // ===============================================================
    res.status(200).json({ success: true, message: 'Requisição recebida e sendo processada.' });

  } catch (error) {
    // Este catch agora só pegará erros que acontecem ANTES do fetch
    console.error('[API Fire-and-Forget] Erro no processo:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
}
