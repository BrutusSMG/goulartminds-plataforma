// lib/tool-mappings.js

// Este objeto é a nossa "fonte da verdade" para os nomes das ferramentas.
export const TOOL_DISPLAY_NAMES = {
  // 'identificador_interno': 'Nome Que Aparece Para o Usuário'
  'Irritacao': 'Mapa da Irritação',
  'Valores': 'Valores Pessoais',
  'SWOT': 'Análise SWOT',
  // Adicione aqui todas as suas futuras ferramentas
  // 'Proposito': 'Encontrando seu Propósito',
};

/**
 * Uma função auxiliar que busca o nome de exibição de uma ferramenta.
 * Se não encontrar, retorna o próprio identificador para não quebrar a interface.
 * @param {string} internalName - O nome interno da ferramenta (ex: 'Irritacao').
 * @returns {string} - O nome de exibição (ex: 'Mapa da Irritação').
 */
export const getToolDisplayName = (internalName) => {
  return TOOL_DISPLAY_NAMES[internalName] || internalName;
};
