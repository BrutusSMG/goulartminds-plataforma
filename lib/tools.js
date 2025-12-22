// lib/tools.js

/**
 * Envia o nome de uma ferramenta concluída para a API de perfil.
 * @param {string} toolName - O nome da ferramenta a ser salva (ex: 'SWOT', 'Irritacao').
 * @returns {Promise<boolean>} - Retorna true se for bem-sucedido, false se falhar.
 */
export const completeTool = async (toolName) => {
  if (!toolName) {
    console.error("O nome da ferramenta não pode ser vazio.");
    return false;
  }

  try {
    const response = await fetch('/api/tools/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toolName }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao salvar o progresso da ferramenta no perfil.');
    }

    console.log(`Ferramenta '${toolName}' concluída e salva com sucesso no perfil!`);
    return true;

  } catch (error) {
    console.error(`Erro ao concluir a ferramenta '${toolName}':`, error);
    return false;
  }
};
