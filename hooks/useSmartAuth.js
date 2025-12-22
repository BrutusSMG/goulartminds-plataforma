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

  // Caso 3: A ferramenta exige um plano. O plano do usuário está na lista?
  // A lógica de acesso agora é baseada no array 'tags' do usuário.
  // Verificamos se alguma das tags do usuário corresponde a algum dos pacotes da ferramenta.
  // Isso é mais flexível. Ex: se o usuário tem a tag 'premium' e a ferramenta
  // permite ['premium', 'pro'], o acesso é concedido.
  
  // Pega as tags do usuário. Se não houver, usa um array vazio.
  const userPlan = user.plan || 'free'; // Pega o plano da sessão.

  if (tool.packages.includes(userPlan)) {
    return true;
  }

  // Caso 4: O plano do usuário não concede acesso.
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

  if (status === 'loading') {
    return {
      status: 'loading',
      hasAccess: false,
      user: null,
      tool: null,
    };
  }

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
