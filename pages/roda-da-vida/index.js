import React, { useEffect } from 'react';
import Head from 'next/head';

// Importe seus componentes reutilizáveis (ajuste os caminhos se necessário)
import Header from '../../components/Header';
import Copyright from '../../components/Copyright';
import Modals from '../../components/Modals';

const FerramentaRodaDaVida = () => {
  // Este useEffect carrega os scripts necessários APÓS o HTML ser renderizado.
  useEffect(() => {
    // --- INÍCIO DO CARREGAMENTO EM CADEIA ---

    // 1. Cria o script do html2canvas
    const html2canvasScript = document.createElement('script');
    html2canvasScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    html2canvasScript.async = true;
    
    // 2. Cria o script do Chart.js
    const chartScript = document.createElement('script' );
    chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
    chartScript.async = true;

    // 3. Cria o script principal da nossa ferramenta
    const mainScript = document.createElement('script' );
    mainScript.src = '/roda-da-vida/script.js';
    mainScript.async = true;

    // 4. Define a ordem de carregamento (a "corrida de revezamento")
    html2canvasScript.onload = () => {
        console.log('html2canvas carregado. Carregando Chart.js...');
        document.body.appendChild(chartScript); // Só carrega o Chart.js DEPOIS do html2canvas
    };

    chartScript.onload = () => {
        console.log('Chart.js carregado. Carregando script principal...');
        document.body.appendChild(mainScript); // Só carrega o script principal DEPOIS do Chart.js
    };

    // 5. Inicia a cadeia, carregando o primeiro script
    console.log('Iniciando carregamento de dependências...');
    document.body.appendChild(html2canvasScript);

    // --- FIM DO CARREGAMENTO EM CADEIA ---

    // Função de "limpeza" para remover todos os scripts ao sair da página
    return () => {
        console.log('Limpando scripts da Roda da Vida...');
        if (document.body.contains(html2canvasScript)) {
            document.body.removeChild(html2canvasScript);
        }
        if (document.body.contains(chartScript)) {
            document.body.removeChild(chartScript);
        }
        if (document.body.contains(mainScript)) {
            document.body.removeChild(mainScript);
        }
    };
  }, []); // O array vazio [] garante que o efeito rode apenas uma vez.

  return (
    <>
      <Head>
        <title>Roda da Vida - Goulart Minds</title>
        {/* Carrega os arquivos de estilo */}
        <link rel="stylesheet" href="/assets/global-style.css" />
        <link rel="stylesheet" href="/roda-da-vida/style.css" />
      </Head>

      {/* Renderiza seus componentes de layout */}
      <Header />
      <Modals />

      <div className="container">
        {/* ================================================================== */}
        {/* TODO O CONTEÚDO DO SEU ANTIGO <body> VEM AQUI, CONVERTIDO PARA JSX */}
        {/* ================================================================== */}

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
      </div>

      <Copyright />
    </>
  );
};

export default FerramentaRodaDaVida;
