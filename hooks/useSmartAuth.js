// hooks/useSmartAuth.js

import { useSession } from 'next-auth/react';
import { tools } from '../config/tools';

/**
 * Verifica se um usuário tem acesso a uma determinada ferramenta.
 * @param {object} user - O objeto de usuário da sessão do NextAuth.
 * @param {object} tool - O objeto de configuração da ferramenta de /config/tools.js.
 * @returns {boolean} - True se o usuário tiver acesso, false caso contrário.
 */
function checkAccess(user, tool) {
  // Caso 1: A ferramenta é pública (não tem a propriedade 'packages').
  // Acesso liberado para todos, logados ou não.
  if (!tool.packages) {
    return true;
  }

  // A partir daqui, a ferramenta não é pública e exige um usuário.
  
  // Caso 2: A ferramenta exige um usuário, mas não há ninguém logado.
  if (!user) {
    return false;
  }

  // Caso 3: O usuário está logado. Verificamos se o plano dele dá acesso.
  // O plano do usuário vem da sessão. Usamos 'free' como padrão se não estiver definido.
  const userPlan = user.plan || 'free';

  // A mágica: a ferramenta inclui o plano do usuário em sua lista de pacotes permitidos?
  if (tool.packages.includes(userPlan)) {
    return true;
  }

  // Caso 4: O usuário está logado, mas seu plano não concede acesso.
  return false;
}


/**
 * Hook de autenticação inteligente para proteger páginas de ferramentas.
 * @param {string} toolId - O 'id' da ferramenta que está sendo protegida.
 * @returns {object} - Um objeto com o status da autenticação e se o usuário tem acesso.
 */
export function useSmartAuth(toolId) {
  // Pega o status da sessão (loading, authenticated, unauthenticated) e os dados do usuário
  const { status, data: session } = useSession();

  // Encontra a configuração da ferramenta com base no ID fornecido.
  const toolConfig = tools.find(t => t.id === toolId);

  // Se o ID da ferramenta for inválido, consideramos como se não tivesse acesso.
  if (!toolConfig) {
    return {
      status: 'error',
      hasAccess: false,
      user: null,
      tool: null,
    };
  }

  // Extrai o objeto do usuário da sessão, se existir.
  const user = session?.user || null;

  // Usa nossa função auxiliar para determinar o acesso.
  const hasAccess = checkAccess(user, toolConfig);

  return {
    status,      // 'loading', 'authenticated', 'unauthenticated'
    hasAccess,   // true ou false
    user,        // O objeto do usuário logado, ou null
    tool: toolConfig, // A configuração da ferramenta para uso na página
  };
}
