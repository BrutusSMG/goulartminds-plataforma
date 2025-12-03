import { useEffect } from 'react';
import Header from '../../components/Header';
import Copyright from '../../components/Copyright';
import Modals from '../../components/Modals';

export default function FerramentaIrritacao() {
    
    useEffect(() => {

        function inicializarFerramenta() {
        
            // --- 1. DEFINIÇÕES E DADOS (sem alteração) ---
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
                return; // Para a execução da função aqui.
            }

            // --- 3. LÓGICA DO CARROSSEL ---
            function renderQuestionsAsCarousel() {
                if (!carouselStage) return;
                carouselStage.innerHTML = '';

                questions.forEach((q, index) => {
                    // --- CORREÇÃO: CONSTRUINDO OS ELEMENTOS MANUALMENTE ---

                    // 1. Cria o card principal
                    const card = document.createElement('div');
                    card.className = 'question-card';

                    // 2. Cria o parágrafo da pergunta
                    const questionText = document.createElement('p');
                    questionText.className = 'question-text';
                    questionText.innerHTML = `<b>${index + 1}.</b> ${q.text}`; // innerHTML aqui é seguro para o <b>

                    // 3. Cria o contêiner do slider
                    const sliderContainer = document.createElement('div');
                    sliderContainer.className = 'slider-container';
                    sliderContainer.dataset.questionId = q.id;

                    // 4. Cria o input do slider
                    const sliderInput = document.createElement('input');
                    sliderInput.type = 'range';
                    sliderInput.min = '0';
                    sliderInput.max = '4';
                    sliderInput.defaultValue = '0'; // Usamos defaultValue
                    sliderInput.className = 'irritation-slider';

                    // 5. Cria o contêiner de feedback
                    const feedbackDiv = document.createElement('div');
                    feedbackDiv.className = 'slider-feedback';
                    feedbackDiv.innerHTML = `Nível de Incômodo: <span class="slider-value">0</span> <span class="slider-legend">${sliderLegends[0]}</span>`;

                    // 6. Adiciona o "ouvinte" de evento DIRETAMENTE no elemento que acabamos de criar
                    sliderInput.addEventListener('input', (e) => {
                        const currentValue = e.target.value;
                        // Agora procuramos o feedback a partir do sliderContainer, que sabemos que existe
                        const valueSpan = sliderContainer.querySelector('.slider-value');
                        const legendSpan = sliderContainer.querySelector('.slider-legend');
                        
                        if (valueSpan) valueSpan.textContent = currentValue;
                        if (legendSpan) legendSpan.innerHTML = sliderLegends[currentValue];
                    });

                    // 7. Monta o quebra-cabeça: aninha os elementos
                    sliderContainer.appendChild(sliderInput);
                    sliderContainer.appendChild(feedbackDiv);
                    
                    card.appendChild(questionText);
                    card.appendChild(sliderContainer);

                    // 8. Adiciona o card completo ao palco do carrossel
                    carouselStage.appendChild(card);
                });
            }

            function updateCarousel() {
                // Garante que os elementos existem antes de tentar usá-los
                if (!carouselStage || !counterEl || !prevBtn || !nextBtn || !mainContinueBtn || !carouselNav) return;

                const offset = -currentQuestionIndex * (100 / questions.length);
                carouselStage.style.transform = `translateX(${offset}%)`;
                counterEl.textContent = `${currentQuestionIndex + 1} / ${questions.length}`;

                prevBtn.disabled = currentQuestionIndex === 0;
                nextBtn.disabled = currentQuestionIndex === questions.length - 1;

                // Mostra o botão principal de continuar apenas no último slide
                if (currentQuestionIndex === questions.length - 1) {
                    mainContinueBtn.classList.remove('hidden');
                    carouselNav.classList.add('hidden'); // Esconde a navegação do carrossel
                } else {
                    mainContinueBtn.classList.add('hidden');
                    carouselNav.classList.remove('hidden');
                }
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
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

            document.body.addEventListener('click', (e) => {
                const target = e.target;

                if (target.id === 'goto-step2-btn') {
                    userResponses.respostas = {};
                    questions.forEach(q => {
                        const slider = document.querySelector(`.slider-container[data-question-id="${q.id}"] .irritation-slider`);
                        if (slider) {
                            userResponses.respostas[q.id] = parseInt(slider.value, 10);
                        }
                    });
                    document.getElementById('step1').classList.remove('active');
                    document.getElementById('step2').classList.add('active');
                    window.scrollTo(0, 0);
                }

                if (target.id === 'goto-step3-btn') {
                    // Lógica da Etapa 2 para 3 (sem alterações)
                    const reflection1 = document.getElementById('reflection1').value;
                    const reflection2 = document.getElementById('reflection2').value;
                    const reflection3 = document.getElementById('reflection3').value;
                    if (!reflection1 || !reflection2 || !reflection3) {
                        alert('Por favor, preencha todas as perguntas de reflexão para continuar.');
                        return;
                    }
                    userResponses.reflexao = { comoFoi: reflection1, metafora: reflection2, mudancaEsperada: reflection3, notaReflexao: document.getElementById('reflection-scale').value };
                    const r = userResponses.respostas;
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

                if (target.id === 'send-report-btn') {
                    // Lógica de envio final (sem alterações)
                    const nomeInput = document.getElementById('user-name');
                    const emailInput = document.getElementById('user-email');
                    if (!nomeInput.value || !emailInput.value) {
                        alert('Por favor, preencha seu nome e e-mail para receber o relatório.');
                        return;
                    }
                    userResponses.nome = nomeInput.value;
                    userResponses.email = emailInput.value;
                    userResponses.whatsapp = document.getElementById('user-whatsapp').value;
                    userResponses.querBrinde = document.getElementById('wants-gift').checked;
                    document.dispatchEvent(new CustomEvent('showProgress'));
                    const webAppUrl = 'https://script.google.com/macros/s/AKfycbyZ3-z22JopJar4BWi7iSzAruNBVX-sZTJSaihfK2OGyCuorHgF-3SjdVU40fPitdRU/exec';
                    fetch(webAppUrl, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(userResponses) })
                        .then(() => { document.dispatchEvent(new CustomEvent('showSuccess')); })
                        .catch(error => { console.error('Falha de rede na requisição:', error); alert('Ocorreu um erro de conexão. Verifique sua internet e tente novamente.'); });
                }
            });

            renderQuestionsAsCarousel();
            updateCarousel();

        }
        inicializarFerramenta();

    }, []); // O array vazio [] faz o código rodar uma vez.

        return (
        <>
            <div className="container">
                <Header />
                {/* Todo o seu HTML da ferramenta de irritação aqui */}
                
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
                    <button id="goto-step2-btn" className="primary-btn">Enviar Respostas e Continuar</button>
                </section>

                
                <section id="step2" className="step">
                    <div className="congrats-message">
                        <h2>🎉 Parabéns! 🎉</h2>
                        <h3>Sua Autoavaliação foi<br/><b>🥇 Concluída. 🥇</b></h3>
                        <p>O passo mais difícil é sempre o primeiro, e você acaba de completá-lo. A maioria das pessoas evita olhar para o que as incomoda. O fato de você ter respondido a estas perguntas já te coloca em um grupo seleto que decidiu parar de reagir no piloto automático e começar a assumir o controle.</p>
                        <p>Essa jornada de autoconhecimento é um ato de coragem.</p>
                    </div>
                    <hr/>
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
                                    <input type="range" min="0" max="10" defaultValue="5" className="reflection-slider" id="reflection-scale"/>
                                    <span className="slider-value">5</span>
                                </div>
                            </div>
                        </div>
                        <button id="goto-step3-btn" className="primary-btn">Ver Meu Resultado Preliminar</button>
                </section>
                
                <section id="step3" className="step">
                    <h2>Seu Diagnóstico Preliminar</h2>
                    <div id="diagnosis-report"></div>
                    <hr/>
                    <div className="email-form">
                        <h3>Receba seu relatório completo e um plano de ação.</h3>
                        <p>Para receber a análise detalhada e o plano de ação no seu e-mail, preencha os campos abaixo.</p>
                        <input type="text" id="user-name" placeholder="Seu nome*"/>
                        <input type="email" id="user-email" placeholder="Seu melhor e-mail*"/>
                        <input type="tel" id="user-whatsapp" placeholder="Seu WhatsApp (Opcional)"/>

                        <div className="gift-option">
                            <input type="checkbox" id="wants-gift"/>
                                <label htmlFor="wants-gift">Quero receber um presente!</label>
                        </div>

                        <button id="send-report-btn" className="primary-btn">Quero Receber Meu Relatório</button>
                    </div>
                </section>

                <Modals />
                <Copyright />
            </div>
        </>
    );
}