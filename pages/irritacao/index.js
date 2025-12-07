// pages/irritacao/index.js

import { useEffect } from 'react';
import { useSmartAuth } from '../../hooks/useSmartAuth';
import PageLayout from '../../components/PageLayout';
import { AccessDenied } from '../../components/AuthGuard';
import Head from 'next/head';

export default function FerramentaIrritacao() {
    // 1. Proteção de acesso via hook personalizado
    const { status, hasAccess } = useSmartAuth('irritacao'); // Use o slug correto da ferramenta

    // 2. Lógica da ferramenta, que só roda se o usuário tiver acesso
    useEffect(() => {
        // Garante que o código só execute no navegador e se o usuário tiver acesso
        if (typeof window !== 'undefined' && hasAccess && status !== 'loading') {

            // Função de inicialização da ferramenta
            function inicializarFerramenta() {

                // --- 1. DEFINIÇÕES E DADOS ---
                const sliderLegends = { 0: "🧘 Nunca ou quase nunca", 1: "🤔 Raramente", 2: "😠 Às vezes", 3: "🗣️ Frequentemente", 4: "🔥 Sempre ou quase sempre" };
                const questions = [
                    { id: 'q1', text: 'Você explica algo importante e a pessoa parece não ter prestado atenção, te forçando a repetir.', type: 'injustica' },
                    { id: 'q2', text: 'A tecnologia que você precisa usar (internet, um software, o celular) fica lenta ou para de funcionar no meio de uma tarefa.', type: 'frustracao' },
                    { id: 'q3', text: 'Você está mentalmente cansado após um dia longo e alguém te pede "só mais uma coisinha".', type: 'cansaco' },
                    { id: 'q4', text: 'Você está prestes a apresentar uma ideia e percebe que pode ser julgado ou criticado negativamente.', type: 'medo' },
                    { id: 'q5', text: 'Você se esforça em um projeto e outra pessoa que fez menos recebe o mesmo (ou mais) reconhecimento.', type: 'injustica' },
                    { id: 'q6', text: 'Você está com pressa e a pessoa na sua frente está fazendo as coisas de forma lenta e ineficiente.', type: 'frustracao' },
                    { id: 'q7', text: 'Você dormiu mal e precisa lidar com problemas e interrupções que normalmente não te afetariam.', type: 'cansaco' },
                    { id: 'q8', text: 'Você comete um pequeno erro e imediatamente pensa: "O que vão pensar de mim?".', type: 'medo' },
                    { id: 'q9', text: 'Você precisa realizar uma tarefa simples, mas o processo é cheio de burocracia e etapas desnecessárias.', type: 'frustracao' },
                    { id: 'q10', text: 'Alguém questiona sua competência ou sua decisão na frente de outras pessoas.', type: 'medo' },
                    { id: 'q11', text: 'Você percebe que está dando muito mais em um relacionamento (pessoal ou profissional) do que está recebendo.', type: 'injustica' },
                    { id: 'q12', text: 'Sua rotina é constantemente interrompida por demandas de outras pessoas, te impedindo de focar.', type: 'cansaco' }
                ];
                let userResponses = {};
                let currentQuestionIndex = 0;

                // --- 2. ELEMENTOS DO DOM ---
                const carouselStage = document.getElementById('carousel-stage');
                const prevBtn = document.getElementById('carousel-prev');
                const nextBtn = document.getElementById('carousel-next');
                const counterEl = document.getElementById('carousel-counter');
                const mainContinueBtn = document.getElementById('goto-step2-btn');
                const carouselNav = document.getElementById('carousel-navigation');

                if (!carouselStage || !prevBtn || !nextBtn || !counterEl || !mainContinueBtn) {
                    console.error("Erro crítico: Um ou mais elementos do carrossel não foram encontrados no DOM.");
                    return;
                }

                // --- 3. LÓGICA DO CARROSSEL ---
                function renderQuestionsAsCarousel() {
                    if (!carouselStage) return;
                    carouselStage.innerHTML = '';
                    questions.forEach((q, index) => {
                        const card = document.createElement('div');
                        card.className = 'question-card';
                        const questionText = document.createElement('p');
                        questionText.className = 'question-text';
                        questionText.innerHTML = `<b>${index + 1}.</b> ${q.text}`;
                        const sliderContainer = document.createElement('div');
                        sliderContainer.className = 'slider-container';
                        sliderContainer.dataset.questionId = q.id;
                        const sliderInput = document.createElement('input');
                        sliderInput.type = 'range';
                        sliderInput.min = '0';
                        sliderInput.max = '4';
                        sliderInput.defaultValue = '0';
                        sliderInput.className = 'irritation-slider';
                        const feedbackDiv = document.createElement('div');
                        feedbackDiv.className = 'slider-feedback';
                        feedbackDiv.innerHTML = `Nível de Incômodo: <span class="slider-value">0</span> <span class="slider-legend">${sliderLegends[0]}</span>`;

                        sliderInput.addEventListener('input', (e) => {
                            const currentValue = e.target.value;
                            const valueSpan = sliderContainer.querySelector('.slider-value');
                            const legendSpan = sliderContainer.querySelector('.slider-legend');
                            if (valueSpan) valueSpan.textContent = currentValue;
                            if (legendSpan) legendSpan.innerHTML = sliderLegends[currentValue];
                        });

                        sliderContainer.appendChild(sliderInput);
                        sliderContainer.appendChild(feedbackDiv);
                        card.appendChild(questionText);
                        card.appendChild(sliderContainer);
                        carouselStage.appendChild(card);
                    });
                }

                function updateCarousel() {
                    if (!carouselStage || !counterEl || !prevBtn || !nextBtn || !mainContinueBtn || !carouselNav) return;
                    const offset = -currentQuestionIndex * (100 / questions.length);
                    carouselStage.style.transform = `translateX(${offset}%)`;
                    counterEl.textContent = `${currentQuestionIndex + 1} / ${questions.length}`;
                    prevBtn.disabled = currentQuestionIndex === 0;
                    nextBtn.disabled = currentQuestionIndex === questions.length - 1;
                    if (currentQuestionIndex === questions.length - 1) {
                        mainContinueBtn.classList.remove('hidden');
                        carouselNav.classList.add('hidden');
                    } else {
                        mainContinueBtn.classList.add('hidden');
                        carouselNav.classList.remove('hidden');
                    }
                }

                // --- 4. EVENT LISTENERS ---
                if (nextBtn) {
                    nextBtn.addEventListener('click', () => {
                        // CAPTURA A RESPOSTA ANTES DE AVANÇAR
                        const sliderAtual = document.querySelectorAll('.irritation-slider')[currentQuestionIndex];
                        if (sliderAtual) {
                            const idPergunta = `q${currentQuestionIndex + 1}`;
                            userResponses[idPergunta] = parseInt(sliderAtual.value, 10);
                        }

                        if (currentQuestionIndex < questions.length - 1) {
                            currentQuestionIndex++;
                            updateCarousel();
                        }
                    });
                }
                if (prevBtn) {
                    prevBtn.addEventListener('click', () => {
                        if (currentQuestionIndex > 0) {
                            currentQuestionIndex--;
                            updateCarousel();
                        }
                    });
                }

                // Listener para os botões principais de navegação entre etapas
                document.body.addEventListener('click', (e) => {
                    const target = e.target;

                    if (target.id === 'goto-step2-btn') {
                        // Captura a resposta da ÚLTIMA pergunta antes de avançar
                        const ultimoSlider = document.querySelector('.question-card:last-child .irritation-slider');
                        if (ultimoSlider) {
                            userResponses[`q${questions.length}`] = parseInt(ultimoSlider.value, 10);
                        }

                        document.getElementById('step1').classList.remove('active');
                        document.getElementById('step2').classList.add('active');
                        window.scrollTo(0, 0);
                    }


                    // 1. Seleciona os elementos pelo ID e pela classe
                    const reflectionSlider = document.getElementById('reflection-scale');
                    const reflectionValueSpan = document.querySelector('.slider-group .slider-value'); // Seleciona o span dentro do grupo

                    // 2. Verifica se ambos os elementos existem na página para evitar erros
                    if (reflectionSlider && reflectionValueSpan) {

                        // 3. Adiciona o "ouvinte" de eventos ao slider
                        // O evento 'input' dispara continuamente enquanto o slider é arrastado.
                        reflectionSlider.addEventListener('input', () => {

                            // 4. Atualiza o texto do <span> com o novo valor do slider
                            reflectionValueSpan.textContent = reflectionSlider.value;
                        });
                    } else {
                        // Log de segurança para o caso de os elementos não serem encontrados
                        console.warn("Aviso: O slider de reflexão ('reflection-scale') ou seu span de valor não foram encontrados.");
                    }

                    if (target.id === 'goto-step3-btn') {
                        const reflection1 = document.getElementById('reflection1').value;
                        const reflection2 = document.getElementById('reflection2').value;
                        const reflection3 = document.getElementById('reflection3').value;
                        const reflectionScale = document.getElementById('reflection-scale').value;

                        if (!reflection1 || !reflection2 || !reflection3) {
                            alert('Por favor, preencha todas as perguntas de reflexão para continuar.');
                            return;
                        }

                        // Salva os dados de reflexão diretamente no objeto principal
                        userResponses.reflexao_como_foi = reflection1;
                        userResponses.reflexao_metafora = reflection2;
                        userResponses.reflexao_mudanca = reflection3;
                        userResponses.reflexao_nota = parseInt(reflectionScale, 10);

                        const r = userResponses;
                        const scores = { 'Injustiça': (r.q1 || 0) + (r.q5 || 0) + (r.q11 || 0), 'Frustração': (r.q2 || 0) + (r.q6 || 0) + (r.q9 || 0), 'Cansaço': (r.q3 || 0) + (r.q7 || 0) + (r.q12 || 0), 'Medo do Julgamento': (r.q4 || 0) + (r.q8 || 0) + (r.q10 || 0) };
                        const total = Object.values(scores).reduce((a, b) => a + b, 0);
                        const sortedScores = Object.entries(scores).sort(([, a], [, b]) => b - a);
                        const topGatilho = sortedScores[0][0];
                        const topScore = sortedScores[0][1];
                        const scoreClass = (score) => (score >= 9 ? 'Alto' : (score >= 5 ? 'Moderado' : 'Baixo'));
                        const diagnosisReport = document.getElementById('diagnosis-report');
                        if (diagnosisReport) {
                            diagnosisReport.innerHTML = `<p>Seu gatilho dominante parece ser o de <strong>${topGatilho}</strong>, com uma pontuação de <strong>${topScore}</strong> (Nível ${scoreClass(topScore)}).</p><p>Sua reatividade geral está em <strong>${total}</strong> de 48.</p>`;
                        }
                        document.getElementById('step2').classList.remove('active');
                        document.getElementById('step3').classList.add('active');
                        window.scrollTo(0, 0);
                    }
                    
                });

                const sendReportBtn = document.getElementById('send-report-btn');
                const userNameInput = document.getElementById('user-name');
                const userEmailInput = document.getElementById('user-email');
                const userWhatsappInput = document.getElementById('user-whatsapp');

                if (sendReportBtn) {
                    sendReportBtn.addEventListener('click', async () => {
                        // --- Início do Bloco de Substituição ---
                        const nome = userNameInput.value.trim();
                        const email = userEmailInput.value.trim();
                        const whatsapp = userWhatsappInput.value.trim();
                        const wantsGiftCheckbox = document.getElementById('wants-gift');
                        const querBrinde = wantsGiftCheckbox ? wantsGiftCheckbox.checked : false; //

                        // 1. Validação simples dos campos
                        if (!nome || !email || !email.includes('@')) {
                            alert('Por favor, preencha seu nome e um e-mail válido.');
                            return;
                        }

                        // 2. Feedback visual para o usuário
                        sendReportBtn.disabled = true;
                        sendReportBtn.textContent = 'Enviando seu relatório...';

                        try {
                            // 3. Coleta dos dados brutos dos sliders usando a classe correta
                            const todosOsSliders = document.querySelectorAll('.irritation-slider');
                            const respostas = {};

                            if (todosOsSliders.length > 0) {
                                todosOsSliders.forEach((slider, index) => {
                                    const chaveResposta = `q${index + 1}`;
                                    respostas[chaveResposta] = parseInt(slider.value, 10);
                                });
                            }

                            // Verificação de segurança para garantir que os sliders foram encontrados
                            if (Object.keys(respostas).length === 0) {
                                throw new Error("Falha na coleta dos sliders. Verifique a classe CSS '.irritation-slider'.");
                            }

                            // 4. Monta o objeto de dados para enviar ao backend
                            const rawData = {
                                nome: nome,
                                email: email,
                                whatsapp: whatsapp,
                                respostas: respostas, // Agora este objeto terá os dados corretos
                                querBrinde: querBrinde,
                                reflexao_como_foi: userResponses.reflexao_como_foi || '',
                                reflexao_metafora: userResponses.reflexao_metafora || '',
                                reflexao_mudanca: userResponses.reflexao_mudanca || '',
                                reflexao_nota: userResponses.reflexao_nota || 0
                            };

                            // 5. Envia os dados para o nosso API Route (o "Proxy")
                            const response = await fetch('/api/capture-lead', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(rawData),
                            });

                            const result = await response.json();

                            // 6. Verifica se o backend (Google) retornou sucesso
                            if (!response.ok || !result.success) {
                                throw new Error(result.error || 'Ocorreu uma falha ao processar seu relatório.');
                            }

                            // 7. Mostra a mensagem de sucesso final para o usuário
                            const emailForm = document.querySelector('.email-form');
                            if (emailForm) {
                                emailForm.innerHTML = `
                                <div style="text-align: center; padding: 20px; background-color: #e8f5e9; border-radius: 5px;">
                                    <h3>Pronto!</h3>
                                    <p>Seu relatório personalizado foi enviado para <strong>${email}</strong>.</p>
                                    <p>Por favor, verifique sua caixa de entrada (e a pasta de spam/promoções).</p>
                                </div>
                                `;
                            }

                        } catch (error) {
                            // 8. Tratamento de erro
                            console.error('Erro ao capturar lead:', error);
                            alert(`Erro ao enviar: ${error.message}`);
                            sendReportBtn.disabled = false;
                            sendReportBtn.textContent = 'Tentar Novamente';
                        }

                        // --- Fim do Bloco de Substituição ---
                    });
                }

                // --- 5. CHAMADA INICIAL ---
                renderQuestionsAsCarousel();
                updateCarousel();
            }

            const handleDOMContentLoaded = () => {
                inicializarFerramenta();
            };

            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                handleDOMContentLoaded();
            } else {
                window.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
            }

            // Função de limpeza para remover o listener ao sair da página
            return () => {
                window.removeEventListener('DOMContentLoaded', handleDOMContentLoaded);
            };
        } else {
        }
    }, [status, hasAccess]); // O array de dependência garante que o script rode no momento certo.

    // 3. Renderização condicional com PageLayout
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

    // 4. Conteúdo da ferramenta (o JSX que será renderizado)
    return (
        <PageLayout title="Mapeamento de Irritação">
            <Head>
                {/* Adicione aqui os links de CSS específicos desta ferramenta */}
                <link rel="stylesheet" href="/irritacao/style.css" />
            </Head>

            {/* O HTML da sua ferramenta vai aqui dentro do PageLayout */}
            <section id="step1" className="step active">
                <h2>Responda às 12 situações abaixo:</h2>
                <div className="instructions-box">
                    Para cada situação, use o controle deslizante para indicar seu nível de incômodo, de 0 (nenhum) a 4 (máximo).
                </div>
                <div id="carousel-container">
                    <div id="carousel-stage"></div>
                </div>
                <div id="carousel-navigation">
                    <button id="carousel-prev" className="secondary-btn" disabled>&larr; Anterior</button>
                    <span id="carousel-counter">1 / 12</span>
                    <button id="carousel-next" className="secondary-btn">Próximo &rarr;</button>
                </div>
                <button id="goto-step2-btn" className="primary-btn hidden">Enviar Respostas e Continuar</button>
            </section>

            <section id="step2" className="step">
                <div className="congrats-message">
                    <h2>🎉 Parabéns! 🎉</h2>
                    <h3>Sua Autoavaliação foi<br /><b>🥇 Concluída. 🥇</b></h3>
                    <p>O passo mais difícil é sempre o primeiro, e você acaba de completá-lo. A maioria das pessoas evita olhar para o que as incomoda. O fato de você ter respondido a estas perguntas já te coloca em um grupo seleto que decidiu parar de reagir no piloto automático e começar a assumir o controle.</p>
                    <p>Essa jornada de autoconhecimento é um ato de coragem.</p>
                </div>
                <hr />
                <div className="reflection-questions">
                    <h3>Antes de ver seu resultado, um convite para uma breve reflexão.</h3>
                    <p>Suas respostas aqui são confidenciais e me ajudarão a entender ainda melhor o seu momento.</p>

                    <div className="form-group">
                        <label htmlFor="reflection1">Como foi, para você, parar e refletir sobre estas situações ao responder o teste?*</label>
                        <textarea id="reflection1" rows="3" placeholder="Seja honesto, não há resposta certa ou errada..."></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="reflection2">Se você pudesse dar um nome ou usar uma metáfora para descrever o que você sente no exato momento em que a raiva assume o controle, qual seria? (Ex: "Uma onda que me arrasta", "Um curto-circuito na mente").*</label>
                        <textarea id="reflection2" rows="3" placeholder="Qual é a sua metáfora?"></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="reflection3">Ao buscar entender seu gatilho com este teste, qual é a principal mudança que você espera ver em sua vida?*</label>
                        <textarea id="reflection3" rows="3" placeholder="O que você espera alcançar?"></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="reflection-scale">Por fim, em uma escala de 0 a 10, o quanto esta pesquisa te ajudou a refletir sobre suas próprias reações?*</label>
                        <div className="slider-group">
                            <input type="range" min="0" max="10" defaultValue="5" className="reflection-slider" id="reflection-scale" />
                            <span className="slider-value">5</span>
                        </div>
                    </div>
                </div>
                <button id="goto-step3-btn" className="primary-btn">Ver Meu Resultado Preliminar</button>
            </section>

            <section id="step3" className="step">
                <h2>Seu Diagnóstico Preliminar</h2>
                <div id="diagnosis-report"></div>
                <hr />
                <div className="email-form">
                    <h3>Receba seu relatório completo e um plano de ação.</h3>
                    <p>Para receber a análise detalhada e o plano de ação no seu e-mail, preencha os campos abaixo.</p>
                    <input type="text" id="user-name" placeholder="Seu nome*" />
                    <input type="email" id="user-email" placeholder="Seu melhor e-mail*" />
                    <input type="tel" id="user-whatsapp" placeholder="Seu WhatsApp (Opcional)" />

                    <div className="gift-option">
                        <input type="checkbox" id="wants-gift" />
                        <label htmlFor="wants-gift">Quero receber um presente!</label>
                    </div>

                    <button id="send-report-btn" className="primary-btn">Quero Receber Meu Relatório</button>
                </div>
            </section>

        </PageLayout>
    );
}
