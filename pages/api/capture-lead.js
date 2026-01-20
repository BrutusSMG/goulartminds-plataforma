// Arquivo: pages/api/capture-lead.js 

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

    const googleResponse = await fetch(googleScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientData),
      redirect: 'follow'
    });

    if (!googleResponse.ok) {
      // Tenta ler a mensagem de erro do Google Script, se houver
      const errorText = await googleResponse.text();
      console.error('[API] Erro na resposta do Google Script:', errorText);
      throw new Error(`O servidor do Google respondeu com um erro: ${googleResponse.status}`);
    }

    const googleData = await googleResponse.json();

    if (googleData.status !== 'received') {
      console.error('[API] Google Script reportou um erro interno:', googleData.message);
      throw new Error('O processamento dos dados falhou no servidor do Google.');
    }


    // Responde IMEDIATAMENTE ao frontend com sucesso.
    res.status(200).json({ success: true, message: 'Requisição recebida e sendo processada em segundo plano.' });

  } catch (error) {
    console.error('[API] Erro no fluxo de captura:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}
