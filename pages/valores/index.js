import React, { useEffect } from 'react';
import Head from 'next/head';

import Header from '../../components/Header';
import Copyright from '../../components/Copyright';
import Modals from '../../components/Modals';

const FerramentaValores = () => {
  // O useEffect carrega o script do lado do cliente
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/valores/script.js'; // Caminho para o script na pasta 'public'
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <>
        <Head>
            <title>Mapa dos Seus Valores - Goulart Minds</title>
            {/* O Next.js coloca esses links no <head> da página */}
            <link rel="stylesheet" href="/assets/global-style.css" />
            <link rel="stylesheet" href="/valores/style.css" />
        </Head>

      <div className="container">

        <Header />

        {/* ETAPA 1: SELEÇÃO DE VALORES (EXISTENTE) */}
        <section id="step1" className="step active">
            <h2>Passo 1 de 5: Seus Valores Fundamentais</h2>
            <div className="instructions-box">
                <p>Abaixo está uma lista de valores. Clique em todos aqueles que você considera importantes.   
                <strong>Selecione pelo menos 10 valores para continuar.</strong></p>
                <p>Valores selecionados: <strong id="selection-count">0</strong> de 10 (mínimo).</p>
            </div>
            
            <div id="values-list-container">
                {/* Lista de valores (JS) */}
            </div>
            <div className="add-value-form">
                <input type="text" id="new-value-input" placeholder="Não encontrou um valor? Adicione o seu aqui..." />
                <button id="add-value-btn">Adicionar</button>
            </div>
            
            <button id="goto-step2-btn" className="primary-btn" disabled>Continuar para o Próximo Passo</button>
        </section>

        {/* ETAPA 2: FILTRAR PARA O TOP 5 */}
        <section id="step2" className="step">
            <h2>Passo 2 de 5: Filtre seus 5 Valores Essenciais</h2>
            <div className="instructions-box">
                <p>Excelente! Agora, da sua lista, arraste os <strong>5 valores mais essenciais</strong> para a coluna da direita. A ordem ainda não importa.</p>
            </div>
            <div className="prioritization-container">
                <div className="column" id="selected-values-pool">
                    <h3>Sua Lista de Valores</h3>
                    {/* Valores da Etapa 1 (JS) */}
                </div>
                <div className="column" id="top-5-list">
                    <h3>Seus 5 Essenciais</h3>
                    <div className="drop-zone" data-placeholder="Arraste um valor essencial aqui"></div>
                    <div className="drop-zone" data-placeholder="Arraste um valor essencial aqui"></div>
                    <div className="drop-zone" data-placeholder="Arraste um valor essencial aqui"></div>
                    <div className="drop-zone" data-placeholder="Arraste um valor essencial aqui"></div>
                    <div className="drop-zone" data-placeholder="Arraste um valor essencial aqui"></div>
                </div>
            </div>
            <button id="goto-step3-btn" className="primary-btn" disabled>Definir Meus Valores</button>
        </section>

        {/* ETAPA 3: DEFINIÇÃO PESSOAL (NOVA) */}
        <section id="step3" className="step">
            <h2>Passo 3 de 5: O que esses valores significam para VOCÊ?</h2>
            <div className="instructions-box">
                <p>Um mesmo valor pode ter significados diferentes para cada pessoa. Descreva em uma frase o que cada um dos seus 5 valores essenciais representa na sua vida hoje.</p>
            </div>
            <div id="definitions-container">
                {/* Campos de texto para cada valor serão inseridos aqui (JS) */}
            </div>
            <button id="goto-step4-btn" className="primary-btn" disabled>Continuar para a Priorização</button>
        </section>

        {/* ETAPA 4: LUZ E SOMBRA */}
        <section id="step4" className="step">
            <h2>Passo 4 de 5: A Luz e a Sombra dos Seus Valores</h2>
            <div className="instructions-box">
                <p>Todo valor tem duas faces: a "luz" que te impulsiona (seu <strong>Motivador</strong>) e a "sombra" que te limita (seu <strong>Sabotador</strong>). Descreva brevemente como cada valor atua na sua vida.</p>
            </div>

            <div className="example-box">
                <p><strong>Exemplo prático para o valor "Honestidade":</strong></p>
                <ul>
                    <li><strong>Ajuda (Motivador):</strong> "Minha 'Honestidade' me ajuda a construir confiança com meus clientes, pois sou transparente sobre prazos e desafios, o que fortalece a relação a longo prazo."</li>
                    <li><strong>Atrapalha (Sabotador):</strong> "Às vezes, minha 'Honestidade' excessiva me atrapalha, pois dou feedbacks diretos demais em momentos inoportunos, o que pode magoar pessoas e gerar conflitos desnecessários."</li>
                </ul>
            </div>

            <div id="duality-container">
                {/* Campos para Motivador/Sabotador serão inseridos aqui (JS) */}
            </div>
            <button id="goto-step5-btn" className="primary-btn" disabled>Continuar para a Priorização</button>
        </section>

        {/* ETAPA 5: CONFRONTO */}
        <section id="step5" className="step">
            <h2>Passo 5 de 5: A Escolha Difícil - Priorização Final</h2>
            <div className="instructions-box">
                <p>Para cada par de cenários abaixo, clique naquele que é <strong>mais importante para você neste momento da sua vida</strong>. Seja honesto, não há resposta errada.</p>
            </div>
            <div id="confrontation-container">
                <p id="confrontation-counter"></p>
                <div className="confrontation-box">
                    <button id="optionA"></button>
                    <span>vs</span>
                    <button id="optionB"></button>
                </div>
            </div>
            <button id="goto-step6-btn" className="primary-btn" disabled>Ver Meu Resultado Final</button>
        </section>

        {/* ETAPA 6: RESULTADO */}
        <section id="step6" className="step">
            <h2>Seu Diagnóstico de Valores</h2>
            <div id="diagnosis-report">
                {/* O diagnóstico final será inserido aqui (JS) */}
            </div>
            <hr />
            <div className="email-form">
                <h3>Receba seu relatório completo de valores.</h3>
                <p>Para receber a análise detalhada dos seus valores no seu e-mail, preencha os campos abaixo.</p>
                <input type="text" id="user-name" placeholder="Seu nome*" />
                <input type="email" id="user-email" placeholder="Seu melhor e-mail*" />
                <input type="tel" id="user-whatsapp" placeholder="Seu WhatsApp (Opcional)" />
                <button id="send-report-btn" className="primary-btn">Quero Receber Meu Relatório</button>
            </div>
        </section>

        {/* Placeholders para componentes globais */}
        <div id="footer-placeholder"></div>
        <div id="copyright-placeholder"></div>


      </div>
    </>
  );
};

export default FerramentaValores;