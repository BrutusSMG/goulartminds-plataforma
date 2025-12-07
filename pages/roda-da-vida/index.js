// pages/roda-da-vida/index.js

import React, { useEffect } from 'react';
import Head from 'next/head';
import { useAuthProtection, AccessDenied } from '../../components/AuthGuard';
import { useSmartAuth } from '../../hooks/useSmartAuth';
import PageLayout from '../../components/PageLayout';
import Modals from '@/componentes/Modals';
import { getSession } from 'next-auth/react';

const FerramentaRodaDaVida = ({ serverSideSecret }) => {

  // NOVA FUNÇÃO DE TAGUEAMENTO DENTRO DO REACT
  const handleTagUser = async (tag) => {
    try {
      // A chamada fetch mais simples possível.
      // O navegador DEVERIA lidar com os cookies automaticamente.
      const response = await fetch('/api/user/add-tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag: tag }),
      });

      if (response.ok) {
        console.log(`[React] Tag '${tag}' adicionada com sucesso.`);
      } else {
        console.error(`[React] Falha ao adicionar tag. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('[React] Erro de rede:', error);
    }
  };

  // 1. Proteção de acesso via hook personalizado
  const { status, hasAccess } = useSmartAuth('roda-da-vida');

  // -> MUDANÇA: O useEffect agora depende do 'status' e 'hasAccess'.
  useEffect(() => {
    // SÓ executa o carregamento dos scripts se a autenticação foi verificada E o usuário tem acesso.
    if (status === 'authenticated' && hasAccess) {

      window.handleTagUser = handleTagUser;

      const html2canvasScript = document.createElement('script');
      html2canvasScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      html2canvasScript.async = true;
      
      const chartScript = document.createElement('script' );
      chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
      chartScript.async = true;

      const mainScript = document.createElement('script' );
      mainScript.src = '/roda-da-vida/script.js';
      mainScript.async = true;

      html2canvasScript.onload = () => {
        document.body.appendChild(chartScript);
      };

      chartScript.onload = () => {
        document.body.appendChild(mainScript);
      };

      document.body.appendChild(html2canvasScript);

      // Função de "limpeza" para remover os scripts ao sair da página
      return () => {
        if (document.body.contains(html2canvasScript)) document.body.removeChild(html2canvasScript);
        if (document.body.contains(chartScript)) document.body.removeChild(chartScript);
        if (document.body.contains(mainScript)) document.body.removeChild(mainScript);
      };
    }
  }, [status, hasAccess]); // -> MUDANÇA: O array de dependência foi atualizado.

  // -> MUDANÇA: A lógica de renderização condicional agora usa 'status' e 'hasAccess'.

  // Enquanto a sessão está sendo verificada, mostre uma mensagem de carregamento
  if (status === 'loading') {
    return (
      <PageLayout title="Carregando..." hideLoginButton={true}>
        <p style={{ textAlign: 'center', padding: '50px' }}>Verificando acesso...</p>
      </PageLayout>
    );
  }

  // Se a verificação terminou e o usuário NÃO tem acesso, mostre a tela de acesso negado.
  if (!hasAccess) {
    return (
      <PageLayout title="Acesso Restrito" hideLoginButton={true}>
        <AccessDenied />
      </PageLayout>
    );
  }
  // Se chegou aqui, o usuário tem acesso. Renderize a ferramenta completa.

  return (
    <PageLayout title="Roda da Vida">
      
      <Head>
        <link rel="stylesheet" href="/assets/global-style.css" />
        <link rel="stylesheet" href="/roda-da-vida/style.css" />
      </Head>
      <Modals />
        
      {/* ETAPA 1: A RODA DA VIDA INTERATIVA */}
      <section id="step1" className="step active">
        <div className="instructions-box">
          <h4>Como usar a Roda da Vida?</h4>
          <p>
            Esta é uma poderosa ferramenta de autoanálise que te ajudará a ter clareza sobre o seu momento atual. Ao final, você verá um mapa visual da sua vida, identificando áreas de sucesso e pontos que merecem sua atenção.
          </p>
          <p><strong>Siga os 3 passos:</strong></p>
          <ol>
            <li><strong>Reflita com calma:</strong> Para cada uma das 12 áreas, pense sobre o seu nível de satisfação <strong>hoje</strong>. Não há resposta certa ou errada.</li>
            <li><strong>Dê uma nota de 1 a 10:</strong> Clique no número que melhor representa sua satisfação atual em cada fatia da roda.</li>
            <li><strong>Descubra sua área de alavanca:</strong> Após preencher tudo, observe o resultado. Qual área, se você dedicasse um pouco mais de energia, poderia impulsionar todas as outras?</li>
          </ol>
        </div>
        
        <div id="roda-container-wrapper">
          <div className="linha-demarcatoria" id="linha-vertical"></div>
          <div className="linha-demarcatoria" id="linha-horizontal"></div>
          
          <div id="anel-grande-area" className="anel-texto">
            <div className="quadrante-cor" id="cor-pessoal"></div>
            <div className="quadrante-cor" id="cor-qualidade"></div>
            <div className="quadrante-cor" id="cor-relacionamentos"></div>
            <div className="quadrante-cor" id="cor-profissional"></div>
            <div className="quadrante-titulo" id="titulo-pessoal">PESSOAL</div>
            <div className="quadrante-titulo" id="titulo-qualidade">QUALIDADE DE VIDA</div>
            <div className="quadrante-titulo" id="titulo-relacionamentos">RELACIONAMENTOS</div>
            <div className="quadrante-titulo" id="titulo-profissional">PROFISSIONAL</div>
          </div>

          <div id="anel-sub-area" className="anel-texto">
            {/* Os 12 títulos das subáreas serão inseridos aqui pelo JavaScript */}
          </div>
          
          <div id="roda-da-vida-container">
            {/* As 12 fatias serão inseridas aqui */}
            <div id="anel-central"></div>
          </div>
        </div>

        <div id="reflection-questions-step1" className="reflection-questions hidden">
          <h3>Perguntas para Reflexão</h3>
          <div className="question-group">
            <label htmlFor="reflexao1">Olhando para essa Roda, qual o seu nível de satisfação geral com os resultados da sua vida?</label>
            <textarea id="reflexao1" rows="4" placeholder="Seja honesto(a) com você mesmo(a). Descreva seus sentimentos e percepções..."></textarea>
          </div>
          <div className="question-group">
            <label htmlFor="reflexao2">Qual dessas áreas, ao receber um pouco mais de foco e energia, poderia influenciar positivamente o maior número de outras áreas? (Sua Área de Alavanca)</label>
            <textarea id="reflexao2" rows="4" placeholder="Identifique sua área de alavanca e explique por que você acredita que ela tem tanto poder..."></textarea>
          </div>
        </div>

        <button id="goto-step2-btn" className="primary-btn">Ver Minha Roda da Vida</button>
      </section>

      {/* ETAPA 2: RESULTADO E FORMULÁRIO */}
      <section id="step2" className="step">
        <h2>Sua Roda da Vida - Resultado</h2>
        <div id="resultado-container">
          <div className="resultado-coluna">
            <h4>Sua Roda da Vida</h4>
            <div id="imagem-roda-container"></div> 
          </div>
          <div className="resultado-coluna">
            <h4>Gráfico de Equilíbrio</h4>
            <canvas id="graficoRodaDaVida"></canvas>
          </div>
        </div>
        <hr />
        <div className="email-form">
          <h3>Receba sua análise completa por e-mail.</h3>
          <input type="text" id="user-name" placeholder="Seu nome*" />
          <input type="email" id="user-email" placeholder="Seu melhor e-mail*" />
          <input type="tel" id="user-whatsapp" placeholder="Seu WhatsApp (Opcional )" />
          <button id="send-report-btn" className="primary-btn">Quero Receber Minha Análise</button>
        </div>
      </section>

    </PageLayout>
  );
};


export default FerramentaRodaDaVida;
