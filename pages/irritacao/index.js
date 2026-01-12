// pages/irritacao/index.js

import { useEffect } from 'react';
import { useSmartAuth } from '../../hooks/useSmartAuth';
import PageLayout from '../../components/PageLayout';
import { AccessDenied } from '../../components/AuthGuard';
import Modals from '@/componentes/Modals';
import styles from '../../styles/irritacao.module.css';

function exibirDiagnosticoPreliminar(scores) {
    const gatilhoDominante = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    const scoreDominante = scores[gatilhoDominante];

    const detalhesGatilhos = {
        'Injustiça': { icon: '⚖️', description: 'Você se sente mais reativo quando percebe que regras importantes foram quebradas ou que há falta de equidade.' },
        'Frustração': { icon: '😤', description: 'Sua reatividade aumenta quando obstáculos e ineficiências te impedem de progredir.' },
        'Cansaço': { icon: '🔋', description: 'Sua paciência se esgota quando suas reservas de energia física e mental estão no limite.' },
        'Medo de Julgamento': { icon: '👀', description: 'Você se torna mais reativo em situações de exposição, onde se sente avaliado ou em risco.' }
    };

    const detalhes = detalhesGatilhos[gatilhoDominante];
    const scorePercentual = (scoreDominante / 12) * 100;

    const htmlDiagnostico = `
        <div class="${styles.dominantTrigger}">
            <span class="${styles.triggerIcon}">${detalhes.icon}</span>
            <h3>${gatilhoDominante}</h3>
        </div>
        <p class="${styles.triggerDescription}">${detalhes.description}</p>
        <div class="${styles.scoreBarContainer}">
            <div class="${styles.scoreBar}" style="width: ${scorePercentual}%;"></div>
        </div>
        <p class="${styles.scoreText}">Nível de Reatividade: ${scoreDominante} de 12</p>
    `;

    const reportDiv = document.getElementById('diagnosis-report');
    if (reportDiv) {
        reportDiv.innerHTML = htmlDiagnostico;
    }
}

export default function FerramentaIrritacao() {    
    const { status, hasAccess } = useSmartAuth('irritacao');
    
    useEffect(() => {
        if (typeof window !== 'undefined' && hasAccess && status !== 'loading') {

            const handleCompleteTool = async (toolName) => {
                // Verifica se o usuário está logado antes de tentar salvar o progresso
                if (status !== 'authenticated') {
                    console.log("Usuário não autenticado. Progresso não será salvo.");
                    return;
                }

                try {
                    await fetch('/api/tools/complete', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ toolName }),
                    });
                    console.log(`Ferramenta '${toolName}' marcada como concluída.`);
                } catch (error) {
                    console.error('Erro ao marcar ferramenta como concluída:', error);
                }
            };

            function inicializarFerramenta() {

                // --- 1. DEFINIÇÕES E DADOS ---                
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
                const sliderLegends = { 0: "🧘 Nunca ou quase nunca", 1: "🤔 Raramente", 2: "😠 Às vezes", 3: "🗣️ Frequentemente", 4: "🔥 Sempre ou quase sempre" };
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
                        card.className = styles.questionCard;
                        card.innerHTML = `
                            <p class="${styles.questionText}"><b>${index + 1}.</b> ${q.text}</p>
                            <div class="${styles.sliderContainer}" data-question-id="${q.id}">
                                <input type="range" min="0" max="4" value="0" class="${styles.irritationSlider}">
                                <div class="${styles.sliderFeedback}">
                                    Nível de Incômodo: <span class="${styles.sliderValue}">0</span>  
                                    <span class="${styles.sliderLegend}">${sliderLegends[0]}</span>
                                </div>
                            </div>
                        `;
                        carouselStage.appendChild(card);
                    });
                }

                function updateCarousel() {
                    if (!carouselStage || !counterEl || !prevBtn || !nextBtn || !mainContinueBtn || !carouselNav) return;
                    const offset = -currentQuestionIndex * 100;
                    carouselStage.style.width = `${questions.length * 100}%`;
                    carouselStage.style.transform = `translateX(${offset / questions.length}%)`;
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



                document.body.addEventListener('input', e => {
                    if (e.target.matches(`.${styles.irritationSlider}`)) {
                        const slider = e.target;
                        const value = slider.value;
                        const feedbackContainer = slider.closest(`.${styles.sliderContainer}`).querySelector(`.${styles.sliderFeedback}`);
                        if (feedbackContainer) {
                            feedbackContainer.querySelector(`.${styles.sliderValue}`).textContent = value;
                            feedbackContainer.querySelector(`.${styles.sliderLegend}`).innerHTML = sliderLegends[value];
                        }
                    }
                    if (e.target.matches(`.${styles.reflectionSlider}`)) {
                        e.target.nextElementSibling.textContent = e.target.value;
                    }
                });

                document.getElementById('start-irritation-btn')?.addEventListener('click', () => {
                    const step0 = document.getElementById('step0');
                    const step1 = document.getElementById('step1');
                    if (step0 && step1) {
                        step0.classList.remove('active');
                        step1.classList.add('active');
                        window.scrollTo(0, 0);
                    }
                });

                if (nextBtn) nextBtn.addEventListener('click', () => { if (currentQuestionIndex < questions.length - 1) { currentQuestionIndex++; updateCarousel(); } });
                if (prevBtn) prevBtn.addEventListener('click', () => { if (currentQuestionIndex > 0) { currentQuestionIndex--; updateCarousel(); } });

                document.getElementById('goto-step2-btn')?.addEventListener('click', () => {
                    document.getElementById('step1').classList.remove('active');
                    document.getElementById('step2').classList.add('active');
                    window.scrollTo(0, 0);
                });

                document.getElementById('goto-step3-btn')?.addEventListener('click', async () => {
                    const reflection1 = document.getElementById('reflection1').value;
                    const reflection2 = document.getElementById('reflection2').value;
                    const reflection3 = document.getElementById('reflection3').value;
                    if (!reflection1 || !reflection2 || !reflection3) {
                        alert('Por favor, preencha todas as perguntas de reflexão para continuar.');
                        return;
                    }
                    
                    // Coleta todas as respostas dos sliders de uma vez
                    const respostas = {};
                    document.querySelectorAll(`.${styles.irritationSlider}`).forEach((slider, index) => {
                        respostas[`q${index + 1}`] = parseInt(slider.value, 10);
                    });
                    userResponses.respostas = respostas;

                    // Calcula os scores para a prévia
                    const r = userResponses.respostas;
                    const scores = { 'Injustiça': (r.q1 || 0) + (r.q5 || 0) + (r.q11 || 0), 'Frustração': (r.q2 || 0) + (r.q6 || 0) + (r.q9 || 0), 'Cansaço': (r.q3 || 0) + (r.q7 || 0) + (r.q12 || 0), 'Medo de Julgamento': (r.q4 || 0) + (r.q8 || 0) + (r.q10 || 0) };
                    
                    // Chama a nova função para exibir o diagnóstico melhorado
                    exibirDiagnosticoPreliminar(scores);

                    await handleCompleteTool('irritacao');
                    
                    document.getElementById('step2').classList.remove('active');
                    document.getElementById('step3').classList.add('active');
                    window.scrollTo(0, 0);
                });

                document.getElementById('send-report-btn')?.addEventListener('click', async (e) => {
                    const sendBtn = e.currentTarget;
                    const textoOriginalBotao = sendBtn.textContent;

                    const nome = document.getElementById('user-name').value.trim();
                    const email = document.getElementById('user-email').value.trim();
                    if (!nome || !email || !email.includes('@')) {
                        alert('Por favor, preencha seu nome e um e-mail válido.');
                        return;
                    }

                    sendBtn.disabled = true;
                    sendBtn.textContent = 'Enviando...';
                    document.dispatchEvent(new CustomEvent('showProgressModal'));

                    // Monta o payload final para o backend
                    const finalPayload = {
                        nome: nome,
                        email: email,
                        whatsapp: document.getElementById('user-whatsapp').value.trim(),
                        respostas: userResponses.respostas, // Já coletado na etapa anterior
                        querBrinde: document.getElementById('wants-gift').checked,
                        reflexao_como_foi: document.getElementById('reflection1').value,
                        reflexao_metafora: document.getElementById('reflection2').value,
                        reflexao_mudanca: document.getElementById('reflection3').value,
                        reflexao_nota: parseInt(document.getElementById('reflection-scale').value, 10)
                    };

                    try {
                        const response = await fetch('/api/capture-lead', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(finalPayload),
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || "O servidor não pôde processar a solicitação.");
                        }

                        // SUCESSO! O backend respondeu rápido.
                        document.dispatchEvent(new CustomEvent('hideProgressModal'));
                        document.dispatchEvent(new CustomEvent('showSuccessModal'));

                    } catch (error) {
                        console.error('Erro no envio:', error);
                        alert(`Ocorreu um erro: ${error.message}`);
                        document.dispatchEvent(new CustomEvent('hideProgressModal'));
                    } finally {
                        // Sempre reativa o botão, independentemente do resultado
                        sendBtn.disabled = false;
                        sendBtn.textContent = textoOriginalBotao;
                    }
                });

                // Chamada inicial
                renderQuestionsAsCarousel();
                updateCarousel();
            };

            inicializarFerramenta();
        }
    }, [status, hasAccess]);

    if (status === 'loading') {
        return <PageLayout title="Carregando..."><p style={{ textAlign: 'center', padding: '50px' }}>Verificando acesso...</p></PageLayout>;
    }
    if (!hasAccess) {
        return <PageLayout title="Acesso Restrito"><AccessDenied /></PageLayout>;
    }

    // --- RENDERIZAÇÃO DO JSX (Com mudanças) ---
    return (
        <>
            
            <Modals />

            <section id="step0" className="step active">
                <div className={styles.introContainer}>

                    {/* 1. Quebra de Padrão */}
                    <div className={styles.introHeader}>
                        <h1>Você não se irrita por causa das situações.</h1>                        
                        <p>Na prática, o que nos tira do controle quase nunca é o que acontece... <strong>é o gatilho interno que aquilo ativa.</strong></p>
                        <div className={styles.insight}>
                            👉 Não é falta de controle. <strong>É falta de consciência.</strong>
                        </div>
                    </div>

                    <hr className={styles.divider} />

                    {/* 2. Dor Silenciosa */}
                    <div className={styles.painPointSection}>
                        <h2>Isso soa familiar?</h2>
                        <p className={styles.scenario}>"Um comentário fora de hora. Um atraso inesperado. Uma sensação de injustiça. O cansaço acumulado."</p>
                        <p className={styles.reaction}>De repente, você reage de um jeito que nem você entende. Depois vem a culpa, o arrependimento ou o silêncio.</p>
                    </div>

                    <hr className={styles.divider} />

                    {/* 3. A Revelação */}
                    <div className={styles.revelationSection}>
                        <h2>A irritação não surge do nada. Ela segue um padrão.</h2>
                        <p>Cada pessoa tem um <strong>gatilho dominante</strong> que acende a raiva mais rápido do que os outros. Conheça os 4 principais:</p>
                        <div className={styles.triggersGrid}>
                            <div className={styles.triggerCard}>
                                <h4>Frustração</h4>
                                <p>Quando algo não sai como o esperado.</p>
                            </div>
                            <div className={styles.triggerCard}>
                                <h4>Injustiça</h4>
                                <p>Quando algo fere seu senso de certo e errado.</p>
                            </div>
                            <div className={styles.triggerCard}>
                                <h4>Medo de Julgamento</h4>
                                <p>Quando você se sente exposto ou criticado.</p>
                            </div>
                            <div className={styles.triggerCard}>
                                <h4>Cansaço</h4>
                                <p>Quando o corpo e a mente já passaram do limite.</p>
                            </div>
                        </div>
                    </div>

                    <hr className={styles.divider} />

                    {/* 4. Apresente a Ferramenta */}
                    <div className={styles.toolIntroSection}>
                        <h2>O Mapa da Irritação</h2>
                        <p>Um teste rápido com <strong>12 perguntas</strong>, criado para identificar qual desses gatilhos tem mais influência sobre suas reações emocionais no dia a dia.</p>
                        <h4>Em poucos minutos, você descobre:</h4>
                        <ol>
                            <li>Qual é o seu gatilho dominante.</li>
                            <li>Por que certas situações te afetam mais que outras.</li>
                            <li>Onde você perde energia tentando "se controlar".</li>
                            <li>Por onde começar a mudar sem se reprimir.</li>
                        </ol>
                    </div>

                    {/* 5 & 6. Diferencial e Urgência */}
                    <div className={styles.whyNowSection}>
                        <h3>Esse teste não é sobre rotular você. É sobre entender o ponto exato onde você perde o controle.</h3>
                        <p className={styles.goldSentence}>"A raiva não é o problema. O problema é não saber de onde ela vem."</p>
                        <p>Sem esse mapa, você continua reagindo no automático. Com o mapa, <strong>você age antes da explosão.</strong></p>
                    </div>

                    {/* 7. CTA */}
                    <div className={styles.ctaSection}>
                        <button id="start-irritation-btn" className="primary-btn large-btn">
                            Descobrir Meu Gatilho Dominante
                        </button>
                        <p>Teste rápido e gratuito.</p>
                    </div>
                </div>
            </section>

            <section id="step1" className="step">
                <h2>Responda às 12 situações abaixo:</h2>
                <div className={styles.instructionsBox}>
                    Para cada situação, use o controle deslizante para indicar seu nível de incômodo, de 0 (nenhum) a 4 (máximo).
                </div>
                <div id="carousel-container" className={styles.carouselContainer}>
                    <div id="carousel-stage" className={styles.carouselStage}></div>
                </div>
                <div id="carousel-navigation" className={styles.carouselNavigation}>
                    <button id="carousel-prev" className="secondary-btn" disabled>&larr; Anterior</button>
                    <span id="carousel-counter">1 / 12</span>
                    <button id="carousel-next" className="secondary-btn">Próximo &rarr;</button>
                </div>
                <button id="goto-step2-btn" className="primary-btn hidden">Enviar Respostas e Continuar</button>
            </section>

            <section id="step2" className="step">
                <div className={styles.congratsMessage}>
                    <h2>🎉 Parabéns! 🎉</h2>
                    <h3>Sua Autoavaliação foi <b>🥇 Concluída. 🥇</b></h3>
                    <p>O passo mais difícil é sempre o primeiro, e você acaba de completá-lo. A maioria das pessoas evita olhar para o que as incomoda. O fato de você ter respondido a estas perguntas já te coloca em um grupo seleto que decidiu parar de reagir no piloto automático e começar a assumir o controle.</p>
                    <p>Essa jornada de autoconhecimento é um ato de coragem.</p>
                </div>
                <hr />
                <div className={styles.reflectionQuestions}>
                    <h3>Antes de ver seu resultado, um convite para uma breve reflexão.</h3>
                    <p>Suas respostas aqui são confidenciais e me ajudarão a entender ainda melhor o seu momento.</p>
                    <div className={styles.formGroup}>
                        <label htmlFor="reflection1">1. Como foi, para você, parar e refletir sobre estas situações ao responder o teste?*</label>
                        <textarea id="reflection1" rows="3" placeholder="Seja honesto, não há resposta certa ou errada..."></textarea>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="reflection2">2. Se você pudesse dar um nome ou usar uma metáfora para descrever o que você sente no exato momento em que a raiva assume o controle, qual seria? (Ex: "Uma onda que me arrasta", "Um curto-circuito na mente").*</label>
                        <textarea id="reflection2" rows="3" placeholder="Qual é a sua metáfora?"></textarea>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="reflection3">3. Ao buscar entender seu gatilho com este teste, qual é a principal mudança que você espera ver em sua vida?*</label>
                        <textarea id="reflection3" rows="3" placeholder="O que você espera alcançar?"></textarea>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="reflection-scale">Por fim, em uma escala de 0 a 10, o quanto esta pesquisa te ajudou a refletir sobre suas próprias reações?*</label>
                        <div className={styles.sliderGroup}>
                            <input type="range" min="0" max="10" defaultValue="5" className={styles.reflectionSlider} id="reflection-scale" />
                            <span className={styles.sliderValue}>5</span>
                        </div>
                    </div>
                </div>
                <button id="goto-step3-btn" className="primary-btn">Ver Meu Resultado Preliminar</button>
            </section>

            <section id="step3" className="step">
                <h2>Seu Diagnóstico Preliminar</h2>
                <div id="diagnosis-report" className={styles.instructionsBox}></div>
                <hr />
                <div className={styles.emailForm}>
                    <h3>Receba seu relatório completo e um plano de ação.</h3>
                    <p>Para receber a análise detalhada e o plano de ação no seu e-mail, preencha os campos abaixo.</p>
                    <input type="text" id="user-name" placeholder="Seu nome*" />
                    <input type="email" id="user-email" placeholder="Seu melhor e-mail*" />
                    <input type="tel" id="user-whatsapp" placeholder="Seu WhatsApp (Opcional)" />
                    <div className={styles.giftOption}>
                        <input type="checkbox" id="wants-gift" />
                        {/*<label htmlFor="wants-gift">Quero receber um presente!</label>*/}
                    </div>
                    <button id="send-report-btn" className="primary-btn">Quero Receber Meu Relatório</button>
                </div>
            </section>
        </>
    );
}
