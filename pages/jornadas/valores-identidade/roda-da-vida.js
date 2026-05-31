// pages/jornadas/valores-identidade/roda-da-vida.js 

import React, { useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script'; 
import { useSmartAuth } from '../../../hooks/useSmartAuth';
import PageLayout from '../../../components/PageLayout';
import { AccessDenied } from '../../../components/AuthGuard';
import Modals from '@/componentes/Modals';
import styles from '../../../styles/jornadas/roda-da-vida.module.css';

const FerramentaRodaDaVida = () => {
  // Função para chamar a API de tagueamento (sem alterações, já estava ótima).
  const handleTagUser = async (tag) => {
    try {
      const response = await fetch('/api/user/add-tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag: tag }),
      });
      if (response.ok) {
        console.log(`[React] Tag '${tag}' adicionada com sucesso via API.`);
      } else {
        console.error(`[React] Falha ao adicionar tag. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('[React] Erro de rede ao chamar API:', error);
    }
  };

  // 1. Proteção de acesso via hook personalizado (sem alterações).
  const { status, hasAccess } = useSmartAuth('roda-da-vida');

  // MUDANÇA: useEffect simplificado para cuidar apenas da comunicação segura.
  useEffect(() => {
    // Função que será acionada quando o script.js disparar o evento 'tagUser'.
    const handleTagRequest = (event) => {
      const { tag } = event.detail; // Pega a 'tag' enviada pelo script.
      if (tag) {
        console.log(`[React] Evento 'tagUser' recebido com a tag: ${tag}`);
        handleTagUser(tag); // Chama a função para contatar a API.
      }
    };

    // Adiciona um "ouvinte" de eventos ao documento.
    document.addEventListener('tagUser', handleTagRequest);

    // Função de limpeza: remove o "ouvinte" quando o componente é desmontado para evitar vazamentos de memória.
    return () => {
      document.removeEventListener('tagUser', handleTagRequest);
    };
  }, []); // O array vazio [] garante que esta configuração rode apenas uma vez.

  // Lógica de renderização condicional (Carregando... / Acesso Negado).
  if (status === 'loading') {
    return (
      <PageLayout title="Carregando..." hideLoginButton={true}>
        <p style={{ textAlign: 'center', padding: '50px' }}>Verificando acesso...</p>
      </PageLayout>
    );
  }

  if (!hasAccess) {
    return (
      <PageLayout title="Acesso Restrito" hideLoginButton={true}>
        <AccessDenied />
      </PageLayout>
    );
  }

  // Renderização principal para usuários com acesso.
  return (
    <PageLayout title="Roda da Vida" hideProgressBar={true}>
      <Head>
        <title>Ferramenta Roda da Vida - Goulart Minds</title>
        {/* MUDANÇA: As tags <link> de CSS foram removidas daqui, pois o CSS agora é importado via JS. */}
      </Head>

      {/* MUDANÇA: Carregamento otimizado dos scripts com o componente <Script> do Next.js. */}
      {/* Eles carregarão de forma assíncrona sem bloquear a renderização da página. */}
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" strategy="lazyOnload" />
      <Script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js" strategy="lazyOnload" />
      <Script src="/roda-da-vida/script.js" strategy="lazyOnload" />

      <Modals />
        
      {/* ETAPA 1: A RODA DA VIDA INTERATIVA (ESQUELETO ) */}
      <section id="step1" className="step active">
        <div className={styles.instructionsBox}>
          <h4>Como usar a Roda da Vida?</h4>
          <p>Esta é uma poderosa ferramenta de autoanálise que te ajudará a ter clareza sobre o seu momento atual. Ao final, você verá um mapa visual da sua vida, identificando áreas de sucesso e pontos que merecem sua atenção.</p>
          <p><strong>Siga os 3 passos:</strong></p>
          <ol>
            <li><strong>Reflita com calma:</strong> Para cada uma das 12 áreas, pense sobre o seu nível de satisfação <strong>hoje</strong>.</li>
            <li><strong>Dê uma nota de 1 a 10:</strong> Clique no número que melhor representa sua satisfação atual em cada fatia da roda.</li>
            <li><strong>Descubra sua área de alavanca:</strong> Após preencher tudo, observe o resultado.</li>
          </ol>
        </div>
        
        {/* ======================================================================= */}
        {/* === A "PONTE" ENTRE REACT E O SCRIPT LEGADO === */}
        {/* O script.js vai ler os atributos 'data-style-*' para saber quais nomes de classe usar. */}
        {/* ======================================================================= */}
        <div 
          id="roda-container-wrapper" 
          className={styles.rodaContainerWrapper}
          data-style-fatiacontainer={styles.fatiaContainer}
          data-style-anel={styles.anel}
          data-style-subareatitulo={styles.subAreaTitulo}
          data-style-linhainterna={styles.linhaInterna}
        >
          {/* MUDANÇA: Elementos estáticos agora usam as classes do objeto 'styles'. */}
          <div className={`${styles.linhaDemarcatoria} ${styles.linhaVertical}`}></div>
          <div className={`${styles.linhaDemarcatoria} ${styles.linhaHorizontal}`}></div>
          
          <div className={`${styles.anelGrandeArea} ${styles.anelTexto}`}>
            <div className={`${styles.quadranteCor} ${styles.corPessoal}`}></div>
            <div className={`${styles.quadranteCor} ${styles.corQualidade}`}></div>
            <div className={`${styles.quadranteCor} ${styles.corRelacionamentos}`}></div>
            <div className={`${styles.quadranteCor} ${styles.corProfissional}`}></div>
            <div className={`${styles.quadranteTitulo} ${styles.tituloPessoal}`}>PESSOAL</div>
            <div className={`${styles.quadranteTitulo} ${styles.tituloQualidade}`}>QUALIDADE DE VIDA</div>
            <div className={`${styles.quadranteTitulo} ${styles.tituloRelacionamentos}`}>RELACIONAMENTOS</div>
            <div className={`${styles.quadranteTitulo} ${styles.tituloProfissional}`}>PROFISSIONAL</div>
          </div>
          
          {/* Contêiner que será preenchido pelo script.js */}
          <div id="anel-sub-area" className={`${styles.anelSubArea} ${styles.anelTexto}`}></div>
          
          {/* Contêiner que será preenchido pelo script.js */}
          <div id="roda-da-vida-container" className={styles.rodaDaVidaContainer}></div>
          <div className={styles.anelCentral}></div>
        </div>

        <div id="reflection-questions-step1" className={`${styles.reflectionQuestions} ${styles.hidden}`}>
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

      {/* ETAPA 2: RESULTADO E FORMULÁRIO (ESQUELETO) */}
      <section id="step2" className="step">
        <h2>Sua Roda da Vida - Resultado</h2>
        <div id="resultado-container" className={styles.resultadoContainer}>
          <div className={styles.resultadoColuna}>
            <h4>Sua Roda da Vida</h4>
            <div id="imagem-roda-container" className={styles.imagemRodaContainer}></div> 
          </div>
          <div className={styles.resultadoColuna}>
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
