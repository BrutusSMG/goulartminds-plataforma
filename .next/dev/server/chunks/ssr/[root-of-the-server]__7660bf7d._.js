module.exports = [
"[project]/pages/irritacao/index.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FerramentaIrritacao
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
(()=>{
    const e = new Error("Cannot find module '../components/Header'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '../components/Copyright'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '../components/Modals'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
;
;
;
function FerramentaIrritacao() {
    // O useEffect garante que o código rode apenas no navegador,
    // depois que o HTML for renderizado.
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        document.addEventListener('componentsLoaded', ()=>{
            // --- 1. DEFINIÇÕES E DADOS ---
            const sliderLegends = {
                0: "🧘 Nunca ou quase nunca",
                1: "🤔 Raramente",
                2: "😠 Às vezes",
                3: "🗣️ Frequentemente",
                4: "🔥 Sempre ou quase sempre"
            };
            const questions = [
                {
                    id: 'q1',
                    text: 'Você explica algo importante e a pessoa parece não ter prestado atenção, te forçando a repetir.',
                    type: 'injustica'
                },
                {
                    id: 'q2',
                    text: 'A tecnologia que você precisa usar (internet, um software, o celular) fica lenta ou para de funcionar no meio de uma tarefa.',
                    type: 'frustracao'
                },
                {
                    id: 'q3',
                    text: 'Você está mentalmente cansado após um dia longo e alguém te pede "só mais uma coisinha".',
                    type: 'cansaco'
                },
                {
                    id: 'q4',
                    text: 'Você está prestes a apresentar uma ideia e percebe que pode ser julgado ou criticado negativamente.',
                    type: 'medo'
                },
                {
                    id: 'q5',
                    text: 'Você se esforça em um projeto e outra pessoa que fez menos recebe o mesmo (ou mais) reconhecimento.',
                    type: 'injustica'
                },
                {
                    id: 'q6',
                    text: 'Você está com pressa e a pessoa na sua frente está fazendo as coisas de forma lenta e ineficiente.',
                    type: 'frustracao'
                },
                {
                    id: 'q7',
                    text: 'Você dormiu mal e precisa lidar com problemas e interrupções que normalmente não te afetariam.',
                    type: 'cansaco'
                },
                {
                    id: 'q8',
                    text: 'Você comete um pequeno erro e imediatamente pensa: "O que vão pensar de mim?".',
                    type: 'medo'
                },
                {
                    id: 'q9',
                    text: 'Você precisa realizar uma tarefa simples, mas o processo é cheio de burocracia e etapas desnecessárias.',
                    type: 'frustracao'
                },
                {
                    id: 'q10',
                    text: 'Alguém questiona sua competência ou sua decisão na frente de outras pessoas.',
                    type: 'medo'
                },
                {
                    id: 'q11',
                    text: 'Você percebe que está dando muito mais em um relacionamento (pessoal ou profissional) do que está recebendo.',
                    type: 'injustica'
                },
                {
                    id: 'q12',
                    text: 'Sua rotina é constantemente interrompida por demandas de outras pessoas, te impedindo de focar.',
                    type: 'cansaco'
                }
            ];
            let userResponses = {};
            let currentQuestionIndex = 0; // Variável para controlar o slide atual
            // --- 2. ELEMENTOS DO DOM ---
            const carouselStage = document.getElementById('carousel-stage');
            const prevBtn = document.getElementById('carousel-prev');
            const nextBtn = document.getElementById('carousel-next');
            const counterEl = document.getElementById('carousel-counter');
            const mainContinueBtn = document.getElementById('goto-step2-btn');
            const carouselNav = document.getElementById('carousel-navigation');
            // --- 3. LÓGICA DO CARROSSEL ---
            function renderQuestionsAsCarousel() {
                if (!carouselStage) return;
                carouselStage.innerHTML = ''; // Limpa o palco
                questions.forEach((q, index)=>{
                    const card = document.createElement('div');
                    card.className = 'question-card';
                    card.innerHTML = `
                        <p className="question-text"><b>${index + 1}.</b> ${q.text}</p>
                        <div className="slider-container" data-question-id="${q.id}">
                            <input type="range" min="0" max="4" value="0" className="irritation-slider">
                            <div className="slider-feedback">
                                Nível de Incômodo: <span className="slider-value">0</span><br><span className="slider-legend">${sliderLegends[0]}</span>
                            </div>
                        </div>
                    `;
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
                nextBtn.addEventListener('click', ()=>{
                    if (currentQuestionIndex < questions.length - 1) {
                        currentQuestionIndex++;
                        updateCarousel();
                    }
                });
            }
            if (prevBtn) {
                prevBtn.addEventListener('click', ()=>{
                    if (currentQuestionIndex > 0) {
                        currentQuestionIndex--;
                        updateCarousel();
                    }
                });
            }
            // --- 4. LÓGICA DE INTERAÇÃO E NAVEGAÇÃO GLOBAL ---
            document.body.addEventListener('input', (e)=>{
                if (e.target.classList.contains('irritation-slider')) {
                    const slider = e.target;
                    const value = slider.value;
                    const feedbackContainer = slider.closest('.slider-container').querySelector('.slider-feedback');
                    if (feedbackContainer) {
                        const valueSpan = feedbackContainer.querySelector('.slider-value');
                        const legendSpan = feedbackContainer.querySelector('.slider-legend');
                        if (valueSpan) valueSpan.textContent = value;
                        if (legendSpan) legendSpan.innerHTML = sliderLegends[value];
                    }
                }
                if (e.target.classList.contains('reflection-slider')) {
                    e.target.nextElementSibling.textContent = e.target.value;
                }
            });
            document.body.addEventListener('click', (e)=>{
                const target = e.target;
                if (target.id === 'goto-step2-btn') {
                    userResponses.respostas = {};
                    questions.forEach((q)=>{
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
                    userResponses.reflexao = {
                        comoFoi: reflection1,
                        metafora: reflection2,
                        mudancaEsperada: reflection3,
                        notaReflexao: document.getElementById('reflection-scale').value
                    };
                    const r = userResponses.respostas;
                    const scores = {
                        'Injustiça': (r.q1 || 0) + (r.q5 || 0) + (r.q11 || 0),
                        'Frustração': (r.q2 || 0) + (r.q6 || 0) + (r.q9 || 0),
                        'Cansaço': (r.q3 || 0) + (r.q7 || 0) + (r.q12 || 0),
                        'Medo do Julgamento': (r.q4 || 0) + (r.q8 || 0) + (r.q10 || 0)
                    };
                    const total = Object.values(scores).reduce((a, b)=>a + b, 0);
                    const sortedScores = Object.entries(scores).sort(([, a], [, b])=>b - a);
                    const topGatilho = sortedScores[0][0];
                    const topScore = sortedScores[0][1];
                    const scoreClass = (score)=>score >= 9 ? 'Alto' : score >= 5 ? 'Moderado' : 'Baixo';
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
                    fetch(webAppUrl, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(userResponses)
                    }).then(()=>{
                        document.dispatchEvent(new CustomEvent('showSuccess'));
                    }).catch((error)=>{
                        console.error('Falha de rede na requisição:', error);
                        alert('Ocorreu um erro de conexão. Verifique sua internet e tente novamente.');
                    });
                }
            });
            renderQuestionsAsCarousel();
            updateCarousel();
        });
    }, []); // O array vazio [] faz o código rodar uma vez.
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "container",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Header, {}, void 0, false, {
                    fileName: "[project]/pages/irritacao/index.js",
                    lineNumber: 189,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                    id: "step1",
                    className: "step active",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                            children: "Responda às 12 situações abaixo:"
                        }, void 0, false, {
                            fileName: "[project]/pages/irritacao/index.js",
                            lineNumber: 193,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "instructions-box",
                            children: "Para cada situação, use o controle deslizante para indicar seu nível de incômodo, de 0 (nenhum) a 4 (máximo)."
                        }, void 0, false, {
                            fileName: "[project]/pages/irritacao/index.js",
                            lineNumber: 194,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            id: "carousel-container",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                id: "carousel-stage"
                            }, void 0, false, {
                                fileName: "[project]/pages/irritacao/index.js",
                                lineNumber: 198,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/irritacao/index.js",
                            lineNumber: 197,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            id: "carousel-navigation",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    id: "carousel-prev",
                                    className: "secondary-btn",
                                    disabled: true,
                                    children: "← Anterior"
                                }, void 0, false, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 202,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    id: "carousel-counter",
                                    children: "1 / 12"
                                }, void 0, false, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 203,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    id: "carousel-next",
                                    className: "secondary-btn",
                                    children: "Próximo →"
                                }, void 0, false, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 204,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/irritacao/index.js",
                            lineNumber: 201,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            id: "goto-step2-btn",
                            className: "primary-btn",
                            children: "Enviar Respostas e Continuar"
                        }, void 0, false, {
                            fileName: "[project]/pages/irritacao/index.js",
                            lineNumber: 206,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/irritacao/index.js",
                    lineNumber: 192,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                    id: "step2",
                    className: "step",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "congrats-message",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                    children: "🎉 Parabéns! 🎉"
                                }, void 0, false, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 212,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                    children: [
                                        "Sua Autoavaliação foi",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/pages/irritacao/index.js",
                                            lineNumber: 213,
                                            columnNumber: 50
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("b", {
                                            children: "🥇 Concluída. 🥇"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/irritacao/index.js",
                                            lineNumber: 213,
                                            columnNumber: 55
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 213,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    children: "O passo mais difícil é sempre o primeiro, e você acaba de completá-lo. A maioria das pessoas evita olhar para o que as incomoda. O fato de você ter respondido a estas perguntas já te coloca em um grupo seleto que decidiu parar de reagir no piloto automático e começar a assumir o controle."
                                }, void 0, false, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 214,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    children: "Essa jornada de autoconhecimento é um ato de coragem."
                                }, void 0, false, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 215,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/irritacao/index.js",
                            lineNumber: 211,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("hr", {}, void 0, false, {
                            fileName: "[project]/pages/irritacao/index.js",
                            lineNumber: 217,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "reflection-questions",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                    children: "Antes de ver seu resultado, um convite para uma breve reflexão."
                                }, void 0, false, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 219,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    children: "Suas respostas aqui são confidenciais e me ajudarão a entender ainda melhor o seu momento."
                                }, void 0, false, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 220,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "form-group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            for: "reflection1",
                                            children: "Como foi, para você, parar e refletir sobre estas situações ao responder o teste?*"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/irritacao/index.js",
                                            lineNumber: 223,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                            id: "reflection1",
                                            rows: "3",
                                            placeholder: "Seja honesto, não há resposta certa ou errada..."
                                        }, void 0, false, {
                                            fileName: "[project]/pages/irritacao/index.js",
                                            lineNumber: 224,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 222,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "form-group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            for: "reflection2",
                                            children: 'Se você pudesse dar um nome ou usar uma metáfora para descrever o que você sente no exato momento em que a raiva assume o controle, qual seria? (Ex: "Uma onda que me arrasta", "Um curto-circuito na mente").*'
                                        }, void 0, false, {
                                            fileName: "[project]/pages/irritacao/index.js",
                                            lineNumber: 227,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                            id: "reflection2",
                                            rows: "3",
                                            placeholder: "Qual é a sua metáfora?"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/irritacao/index.js",
                                            lineNumber: 228,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 226,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "form-group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            for: "reflection3",
                                            children: "Ao buscar entender seu gatilho com este teste, qual é a principal mudança que você espera ver em sua vida?*"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/irritacao/index.js",
                                            lineNumber: 231,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                            id: "reflection3",
                                            rows: "3",
                                            placeholder: "O que você espera alcançar?"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/irritacao/index.js",
                                            lineNumber: 232,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 230,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "form-group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            for: "reflection-scale",
                                            children: "Por fim, em uma escala de 0 a 10, o quanto esta pesquisa te ajudou a refletir sobre suas próprias reações?*"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/irritacao/index.js",
                                            lineNumber: 235,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "slider-group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                    type: "range",
                                                    min: "0",
                                                    max: "10",
                                                    value: "5",
                                                    className: "reflection-slider",
                                                    id: "reflection-scale"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/irritacao/index.js",
                                                    lineNumber: 237,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "slider-value",
                                                    children: "5"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/irritacao/index.js",
                                                    lineNumber: 238,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/irritacao/index.js",
                                            lineNumber: 236,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 234,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/irritacao/index.js",
                            lineNumber: 218,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            id: "goto-step3-btn",
                            className: "primary-btn",
                            children: "Ver Meu Resultado Preliminar"
                        }, void 0, false, {
                            fileName: "[project]/pages/irritacao/index.js",
                            lineNumber: 242,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/irritacao/index.js",
                    lineNumber: 210,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                    id: "step3",
                    className: "step",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                            children: "Seu Diagnóstico Preliminar"
                        }, void 0, false, {
                            fileName: "[project]/pages/irritacao/index.js",
                            lineNumber: 246,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            id: "diagnosis-report"
                        }, void 0, false, {
                            fileName: "[project]/pages/irritacao/index.js",
                            lineNumber: 247,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("hr", {}, void 0, false, {
                            fileName: "[project]/pages/irritacao/index.js",
                            lineNumber: 248,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "email-form",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                    children: "Receba seu relatório completo e um plano de ação."
                                }, void 0, false, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 250,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    children: "Para receber a análise detalhada e o plano de ação no seu e-mail, preencha os campos abaixo."
                                }, void 0, false, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 251,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    id: "user-name",
                                    placeholder: "Seu nome*"
                                }, void 0, false, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 252,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                    type: "email",
                                    id: "user-email",
                                    placeholder: "Seu melhor e-mail*"
                                }, void 0, false, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 253,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                    type: "tel",
                                    id: "user-whatsapp",
                                    placeholder: "Seu WhatsApp (Opcional)"
                                }, void 0, false, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 254,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "gift-option",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            id: "wants-gift"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/irritacao/index.js",
                                            lineNumber: 257,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            for: "wants-gift",
                                            children: "Quero receber um presente!"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/irritacao/index.js",
                                            lineNumber: 258,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 256,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    id: "send-report-btn",
                                    className: "primary-btn",
                                    children: "Quero Receber Meu Relatório"
                                }, void 0, false, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 261,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/irritacao/index.js",
                            lineNumber: 249,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/irritacao/index.js",
                    lineNumber: 245,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Modals, {}, void 0, false, {
                    fileName: "[project]/pages/irritacao/index.js",
                    lineNumber: 265,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Copyright, {}, void 0, false, {
                    fileName: "[project]/pages/irritacao/index.js",
                    lineNumber: 266,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/irritacao/index.js",
            lineNumber: 188,
            columnNumber: 13
        }, this)
    }, void 0, false);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7660bf7d._.js.map