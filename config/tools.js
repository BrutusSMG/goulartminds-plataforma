// config/tools.js

/**
 * ==================================================================
 * DEFINIÇÃO DOS PACOTES/PLANOS
 * ==================================================================
 * Estes são os identificadores únicos para cada plano de assinatura.
 * Eles serão usados no banco de dados para definir o nível de acesso de um usuário.
 */
export const PLAN_LEVELS = {
  FREE: 'free',     // Plano padrão para todos os usuários logados.
  BASICO: 'basico',   // Um pacote pago inicial.
  AVANCADO: 'avancado', // Um pacote pago mais completo.
};


/**
 * ==================================================================
 * LISTA MESTRA DE FERRAMENTAS
 * ==================================================================
 * Esta é a fonte única da verdade para todas as ferramentas da plataforma.
 * Para controlar o acesso, adicione ou remova um plano da propriedade `packages`.
 * Se a propriedade `packages` não existir, a ferramenta é considerada PÚBLICA (acessível a todos).
 */
export const tools = [
  // --- FERRAMENTAS PÚBLICAS (NÃO PRECISAM DE LOGIN) ---
  {
    id: 'irritacao',
    name: 'Ferramenta de Irritacao',
    description: 'Descubra o que te realmente te deixa irritado',
    path: '/jornadas/emocoes/irritacao',
    // Sem a propriedade 'packages', o acesso é público.
  },

  {
    id: 'valores',
    name: 'Ferramenta de Valores',
    description: 'Descubra o que é mais importante para você em minutos.',
    path: '/jornadas/valores-identidade/valores',
    // Sem a propriedade 'packages', o acesso é público.
  },

  // --- FERRAMENTAS DO PLANO FREE (PRECISAM APENAS DE LOGIN) ---
  {
    id: 'roda-da-vida',
    name: 'Roda da Vida',
    description: 'Avalie as áreas da sua vida e encontre equilíbrio.',
    path: '/jornadas/valores-identidade/roda-da-vida',
    packages: [PLAN_LEVELS.FREE, PLAN_LEVELS.BASICO, PLAN_LEVELS.AVANCADO],
  },
  
  {
    id: 'resultado-esperado',
    name: 'Resultado Esperado',
    description: 'Transforme desejos vagos em objetivos claros e poderosos.',
    path: '/jornadas/clareza-interna/resultado-esperado',
    packages: [PLAN_LEVELS.FREE, PLAN_LEVELS.BASICO, PLAN_LEVELS.AVANCADO],
  },

  // --- FERRAMENTAS DO PACOTE BÁSICO (EXEMPLO) ---
  {
    id: 'mapa-mental',
    name: 'Mapa Mental Interativo',
    description: 'Organize suas ideias visualmente e encontre novas conexões.',
    path: '/ferramentas/mapa-mental',
    packages: [PLAN_LEVELS.BASICO, PLAN_LEVELS.AVANCADO],
  },

  // --- FERRAMENTAS DO PACOTE AVANÇADO (EXEMPLO) ---
  {
    id: 'planejador-pro',
    name: 'Planejador Semanal PRO',
    description: 'Organize sua semana com foco e produtividade com recursos avançados.',
    path: '/ferramentas/planejador-pro',
    packages: [PLAN_LEVELS.AVANCADO],
  },
];
