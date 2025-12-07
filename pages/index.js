// No Next.js, cada página é um "componente".
// Esta função representa a sua página inicial.
import PageLayout from '../components/PageLayout';

export default function HomePage() {  
  return (
    <PageLayout title="Início">
        <div className="home-intro">
            <h2>Bem-vindo(a) à Plataforma Goulart Minds</h2>
            <p>Um espaço dedicado ao seu desenvolvimento pessoal e profissional. Explore nossas ferramentas e inicie sua jornada de autoconhecimento.</p>
        </div>

        <div className="tools-grid">

            {/* Card da Ferramenta 1: Mapa da Irritação */}
            <a href="/irritacao/" className="tool-card" data-tool-id="irritacao">
                <span className="card-icon">😠</span>
                <h3>Mapa da Sua Irritação</h3>
                <p>Descubra o que realmente aciona sua reatividade e aprenda a retomar o controle em momentos de estresse.</p>
                <span className="card-cta">Começar Agora &rarr;</span>
            </a>

            {/* Card da Ferramenta 2: Mapa dos Valores */}
            <a href="/valores/" className="tool-card" data-tool-id="valores">
                <span className="card-icon">🧭</span>
                <h3>Mapa dos Seus Valores</h3>
                <p>Identifique seus valores fundamentais e entenda como eles influenciam suas decisões, motivações e satisfação.</p>
                <span className="card-cta">Começar Agora &rarr;</span>
            </a>
            
            {/* Card da Ferramenta 3: Roda da Vida */}
            <a href="/roda-da-vida/" className="tool-card" data-tool-id="roda-da-vida">
                <span className="card-icon">🎯</span>
                <h3>Roda da Vida</h3>
                <p>Faça uma análise completa do seu estado atual e descubra qual área da sua vida, quando melhorada, pode alavancar todas as outras.</p>
                <span className="card-cta">Começar Agora &rarr;</span>
            </a>

            {/* Card da Ferramenta 4: Resultado Esperado */}
            <a href="/resultado-esperado/" className="tool-card" data-tool-id="resultado-esperado">
                <span className="card-icon">🌟</span>
                <h3>Resultado Esperado</h3>
                <p>Visualize e defina com clareza o futuro que você deseja construir, alinhando suas ações com seus objetivos de vida.</p>
                <span className="card-cta">Começar Agora &rarr;</span>
            </a>
            
            {/* Card da Ferramenta 5: Análise Swot (Em Breve) */}
            <a href="#" className="tool-card disabled" data-tool-id="swot">
                <span className="card-badge">Em breve</span>
                <span className="card-icon">🔍</span>
                <h3>Análise Swot Pessoal</h3>
                <p>Identifique suas Forças, Fraquezas, Oportunidades e Ameaças para traçar um plano de desenvolvimento estratégico.</p>
                <span className="card-cta">Começar Agora &rarr;</span>
            </a>

            {/* Card da Ferramenta 6: Missão de Vida (Em Breve) */}
            <a href="#" className="tool-card disabled" data-tool-id="missao">
                <span className="card-badge">Em breve</span>
                <span className="card-icon">🚀</span>
                <h3>Declaração de Missão</h3>
                <p>Crie uma declaração poderosa que servirá como sua bússola, guiando suas escolhas e seu propósito de vida.</p>
                <span className="card-cta">Começar Agora &rarr;</span>
            </a>

        </div>
    </PageLayout>
  );
}
