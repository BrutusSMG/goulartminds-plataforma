// pages/resultado-esperado/index.js

import { useEffect } from 'react';
import Header from '../../components/Header';
import Modals from '../../components/Modals';
import Copyright from '../../components/Copyright';

export default function FerramentaResultadoEsperado() {

    useEffect(() => {
        function inicializarFerramenta() {

            // --- BLOCO 1: VARIÁVEIS DE NAVEGAÇÃO PRINCIPAL ---
            const steps = document.querySelectorAll('.step');
            if (steps.length === 0) {
                console.error("Nenhuma etapa (.step) foi encontrada. A ferramenta não pode ser inicializada.");
                return;
            }
            let currentStep = 0;
            const userAnswers = {};

            // --- BLOCO 2: VARIÁVEIS DA ETAPA 1 (ASSISTENTE SMART) ---
            const explorationContainer = document.getElementById('exploration-container');
            const btnStartSmart = document.getElementById('btn-start-smart');
            const smartConversationContainer = document.getElementById('smart-conversation-container');
            const reviewContainer = document.getElementById('review-container');
            const reviewSummaryText = document.getElementById('review-summary-text');
            const btnEditSmart = document.getElementById('btn-edit-smart');
            const recapExplorationText = document.getElementById('recap-exploration-text');
            const smartHistoryContainer = document.getElementById('smart-history-container');
            const smartLabel = document.getElementById('smart-label');
            const smartInput = document.getElementById('smart-input');
            const dateInputsContainer = document.getElementById('date-inputs-container'); 
            const smartDateInputStart = document.getElementById('smart-date-input-start');
            const smartDateInputEnd = document.getElementById('smart-date-input-end');
            const nextSmartButton = document.getElementById('btn-next-smart');
            const prevSmartButton = document.getElementById('btn-prev-smart');
            const smartSummaryBox = document.getElementById('smart-summary');
            const smartSummaryText = document.getElementById('smart-summary-text');
            const smartLabelWrapper = document.querySelector('#active-question-container .label-wrapper');
            let smartState = 0;
            let isSmartObjectiveDefined = false;
            const smartQuestions = [
                { label: "Para começar, qual é o seu grande objetivo ou sonho?", key: 'initial', title: 'Seu Ponto de Partida', help: "Seja o mais sincero(a) possível. Exemplo popular: 'Quero ganhar mais dinheiro'." },
                { label: "Ótimo. Agora, vamos <strong>aprofundar</strong> seu objetivo para torná-lo concreto e claro. O que, exatamente, você pretende alcançar? Quem são as pessoas envolvidas? Onde isso acontecerá?", key: 'specific', title: 'Aprofundando o Objetivo', help: "Um objetivo claro é fácil de explicar. Exemplo: Em vez de 'ganhar mais dinheiro', poderia ser 'ser promovido a gerente de projetos na minha empresa atual para aumentar meu salário'." },
                { label: "Excelente. Para tornar seu objetivo <strong>palpável</strong>, o que precisa acontecer para você dizer 'Eu consegui!'? Qual número, métrica ou fato observável comprovará seu sucesso?", key: 'measurable', title: 'Tornando o Objetivo Palpável', help: "O que pode ser medido, pode ser gerenciado. Exemplo: 'Receber um aumento salarial de 20% no meu holerite'." },
                { label: "Perfeito. Para que seu objetivo seja <strong>acessível</strong>, olhe para a sua situação atual. O que você já tem em mãos (habilidades, contatos, recursos) que pode te ajudar a chegar mais perto dessa conquista?", key: 'achievable', title: 'Tornando o Objetivo Acessível', help: "Isso conecta seu sonho à sua realidade. Exemplo: 'Eu já concluí dois cursos de gestão de projetos e tenho um bom relacionamento com meu chefe, o que torna a promoção uma possibilidade real'." },
                { label: "Estamos quase lá. Para garantir que seu objetivo seja <strong>realista</strong> e motivador, quais são os benefícios diretos que você terá ao concretizá-lo? Por que isso é tão importante para você?", key: 'relevant', title: 'Tornando o Objetivo Realista', help: "Essa é a sua verdadeira recompensa. Exemplo: 'Com o aumento de 20%, poderei finalmente quitar minhas dívidas e começar a investir no futuro da minha família'." },
                { label: "Para tornar o início <strong>concreto</strong>, qual é a data para começar a agir e qual é a sua linha de chegada?", key: 'temporal', title: 'Tornando o Início Concreto', type: 'date', help: "Um plano precisa de um ponto de partida e uma linha de chegada. Exemplo: 'Vou começar na próxima segunda-feira e meu objetivo é alcançar a promoção até o final deste semestre'." },
                { label: "Excelente trabalho! Você transformou um desejo em um plano. Com base em todo o seu histórico, reformule seu objetivo em uma frase final poderosa e inspiradora.", key: 'final', title: 'Seu Objetivo Final', type: 'final' }
            ];

            // --- BLOCO 3: VARIÁVEIS DA ETAPA 2 (FOTOGRAFIA DO SUCESSO) ---
            const photoAssistantContainer = document.getElementById('photo-assistant-container');
            const photoLabel = document.getElementById('photo-label');
            const photoInput = document.getElementById('photo-input');
            const nextPhotoButton = document.getElementById('btn-next-photo');
            const prevPhotoButton = document.getElementById('btn-prev-photo');
            const photoSummaryBox = document.getElementById('photo-summary');
            const photoSummaryText = document.getElementById('photo-summary-text');
            const editPhotoButton = document.getElementById('btn-edit-photo');
            const recapObjetivoStep2 = document.getElementById('recap-objetivo-step2');
            const photoDraftSummaryBox = document.getElementById('photo-draft-summary');
            const photoDraftSummaryText = document.getElementById('photo-draft-summary-text');
            const photoLabelWrapper = document.querySelector('#photo-assistant-container .label-wrapper');
            let photoState = 0;
            let isPhotoDefined = false;
            const photoQuestions = [
                { label: "Vamos planejar sua cena de sucesso. Qual <strong>seria</strong> o <strong>lugar</strong> ideal para você estar? Seria um local conhecido ou novo? Como ele <strong>seria</strong> (espaçoso, luxuoso, simples)?", key: 'lugar', title: 'O Lugar Ideal', help: "Pense em um local que simbolize sua vitória. Exemplo: '<strong>Seria</strong> na minha nova sala de gerente, que <strong>seria</strong> maior e com uma janela grande com vista para a cidade.'" },
                { label: "Ótimo. E nesse cenário, quem você <strong>gostaria</strong> de ver? Como as pessoas <strong>estariam</strong> vestidas? Como <strong>seria</strong> a decoração e a iluminação do ambiente?", key: 'visao', title: 'As Pessoas e o Cenário', help: "Pinte um quadro com palavras. Exemplo: 'Eu <strong>gostaria</strong> de ver meu parceiro(a) sorrindo para mim. A iluminação <strong>seria</strong> natural, vindo da janela.'" },
                { label: "Excelente. E o que você <strong>gostaria</strong> de ouvir? Seriam palavras específicas de reconhecimento? Alguma música estaria tocando?", key: 'audicao', title: 'Os Sons da Conquista', help: "Os sons ancoram a memória. Exemplo: 'Eu <strong>gostaria</strong> de ouvir meu chefe dizendo: 'Nós confiamos em você'. E depois, o som da notificação do banco com o novo salário.'" },
                { label: "Perfeito. Diante de todo esse cenário planejado, como você <strong>gostaria de se sentir</strong>? Qual emoção você buscaria ao viver essa cena?", key: 'emocao', title: 'A Sensação Desejada', help: "Conecte a conquista a um sentimento. Exemplo: 'Eu <strong>gostaria</strong> de sentir um profundo alívio e orgulho, e a segurança de poder proporcionar um futuro melhor para minha família.'" },
                { label: "Maravilha! Você planejou todos os elementos. Com base no rascunho da sua cena ideal, descreva agora, de forma organizada, como seria essa 'Fotografia do Sucesso'.", key: 'photo_final', title: 'Sua Fotografia do Sucesso', type: 'final' }
            ];
            
            // =================================================================
            // === 2. DEFINIÇÃO DAS FUNÇÕES PRINCIPAIS =========================
            // =================================================================
            
            // --- Funções de Navegação Geral ---
            function showStep(stepIndex) {
                if (stepIndex === 1) setupStep1();
                if (stepIndex === 2) setupStep2();
                if (stepIndex === 4) setupStep4();
                
                steps.forEach((step, index) => {
                    step.classList.toggle('active', index === stepIndex);
                });
                currentStep = stepIndex;
                window.scrollTo(0, 0);
            }

            // --- Funções da Etapa 1: Assistente SMART ---
            function setupStep1() {
            if (isSmartObjectiveDefined) {
                explorationContainer.classList.add('hidden');
                smartConversationContainer.classList.add('hidden');
                reviewContainer.classList.remove('hidden');
                reviewSummaryText.textContent = userAnswers['final'];
            } else {
                explorationContainer.classList.remove('hidden');
                smartConversationContainer.classList.add('hidden');
                reviewContainer.classList.add('hidden');
                }
            }

            function startSmartAssistant() {
                smartState = 0;
                explorationContainer.classList.add('hidden');
                reviewContainer.classList.add('hidden');
                smartConversationContainer.classList.remove('hidden');
                updateSmartQuestion();
            }

            function updateSmartQuestion() {
                smartInput.value = '';
                smartInput.classList.add('hidden');
                dateInputsContainer.classList.add('hidden');
                smartSummaryBox.classList.add('hidden');
                smartHistoryContainer.innerHTML = '';
                const currentQuestion = smartQuestions[smartState];
                smartLabel.innerHTML = currentQuestion.label;
                prevSmartButton.classList.toggle('hidden', smartState === 0);                
                
                const oldTip = smartLabelWrapper.querySelector('.help-tip');
                if (oldTip) oldTip.remove();

                if (currentQuestion.help) {
                    const template = document.getElementById('help-tip-template').firstElementChild.cloneNode(true);
                    template.dataset.tooltip = currentQuestion.help;
                    smartLabelWrapper.appendChild(template);
                }                
                if (currentQuestion.type === 'final') {
                    smartInput.classList.remove('hidden');
                    smartInput.defaultValue = userAnswers[currentQuestion.key] || '';
                    smartInput.placeholder = "Escreva aqui seu objetivo final...";
                    nextSmartButton.textContent = 'Concluir';
                    buildDraftSummary();
                } else {
                    for (let i = 0; i < smartState; i++) {
                        const question = smartQuestions[i];
                        let answer = userAnswers[question.key];
                        let displayAnswer = answer;
                        if (question.type === 'date' && answer) {
                            const start = userAnswers['temporal_start'] ? new Date(userAnswers['temporal_start'] + 'T00:00:00').toLocaleDateString('pt-BR') : '...';
                            const end = userAnswers['temporal_end'] ? new Date(userAnswers['temporal_end'] + 'T00:00:00').toLocaleDateString('pt-BR') : '...';
                            displayAnswer = `Início em ${start}, término em ${end}.`;
                        }
                        if (displayAnswer) {
                            const historyItem = document.createElement('div');
                            historyItem.className = 'history-item';
                            historyItem.innerHTML = `<strong>${question.title}</strong><p>${displayAnswer}</p>`;
                            smartHistoryContainer.appendChild(historyItem);
                        }
                    }
                    if (currentQuestion.type === 'date') {
                        dateInputsContainer.classList.remove('hidden');
                        smartDateInputStart.defaultValue = userAnswers['temporal_start'] || '';
                        smartDateInputEnd.defaultValue = userAnswers['temporal_end'] || '';
                    } else {
                        smartInput.classList.remove('hidden');
                        smartInput.defaultValue = userAnswers[currentQuestion.key] || (currentQuestion.key === 'initial' ? userAnswers['initial'] : '') || '';
                        smartInput.placeholder = "Sua resposta...";
                    }
                    nextSmartButton.textContent = 'Próximo';
                }
            }

            function buildDraftSummary() {
                const summaryTitle = document.getElementById('smart-summary-title');
                summaryTitle.textContent = 'Rascunho do seu Objetivo:';
                const specific = userAnswers['specific'] || '...';
                const measurable = userAnswers['measurable'] || '...';
                const relevant = userAnswers['relevant'] || '...';
                const startDate = userAnswers['temporal_start'] ? new Date(userAnswers['temporal_start'] + 'T00:00:00').toLocaleDateString('pt-BR') : '...';
                const endDate = userAnswers['temporal_end'] ? new Date(userAnswers['temporal_end'] + 'T00:00:00').toLocaleDateString('pt-BR') : '...';
                const draftSentence = `"A partir de <strong>${startDate}</strong>, eu vou <strong>${specific}</strong>, medido por <strong>${measurable}</strong>, com o objetivo de concluir até <strong>${endDate}</strong>. Isso é importante para mim porque <strong>${relevant}</strong>."`;
                smartSummaryText.innerHTML = draftSentence;
                smartSummaryBox.classList.remove('hidden');
            }

            // --- Funções da Etapa 2: Fotografia do Sucesso ---
            function setupStep2() {
                recapObjetivoStep2.textContent = userAnswers['final'] || "Seu objetivo ainda não foi definido na Etapa 1.";
                if (isPhotoDefined) {
                    showPhotoReviewMode();
                } else {
                    startPhotoAssistant();
                }
            }

            function startPhotoAssistant() {
                photoState = 0;
                isPhotoDefined = false;
                photoAssistantContainer.classList.remove('hidden');
                photoSummaryBox.classList.add('hidden');
                updatePhotoQuestion();
            }

            function buildPhotoDraftSummary() {
                const lugar = userAnswers['lugar'] || '...';
                const visao = userAnswers['visao'] || '...';
                const audicao = userAnswers['audicao'] || '...';
                const emocao = userAnswers['emocao'] || '...';
                photoDraftSummaryText.innerHTML = `No ambiente que descrevi como "<strong>${lugar}</strong>", eu veria "<strong>${visao}</strong>". Ao mesmo tempo, eu ouviria "<strong>${audicao}</strong>" e a sensação principal seria de "<strong>${emocao}</strong>".`;
                photoDraftSummaryBox.classList.remove('hidden');
            }

            function updatePhotoQuestion() {
                photoInput.value = '';
                const currentQuestion = photoQuestions[photoState];
                photoLabel.innerHTML = currentQuestion.label;
                photoInput.defaultValue = userAnswers[currentQuestion.key] || '';                
                photoInput.placeholder = "Descreva em detalhes...";
                prevPhotoButton.classList.toggle('hidden', photoState === 0);
                photoDraftSummaryBox.classList.add('hidden');

                const oldTip = photoLabelWrapper.querySelector('.help-tip');
                if (oldTip) oldTip.remove();
                if (currentQuestion.help) {
                    const template = document.getElementById('help-tip-template').firstElementChild.cloneNode(true);
                    template.dataset.tooltip = currentQuestion.help;
                    photoLabelWrapper.appendChild(template);
                }

                if (currentQuestion.type === 'final') {
                    nextPhotoButton.textContent = 'Concluir';
                    buildPhotoDraftSummary(); 
                } else {
                    nextPhotoButton.textContent = 'Próximo';
                }
            }            

            function showPhotoReviewMode() {
                photoAssistantContainer.classList.add('hidden');
                photoSummaryText.textContent = userAnswers['photo_final'];
                photoSummaryBox.classList.remove('hidden');
            }

            // --- Funções da Etapa 4: Compromisso ---
            function setupStep4() {
                const recapMotivacao = document.getElementById('recap-motivacao-step4');
                const recapAcessivel = document.getElementById('recap-acessivel-step4');

                if (recapMotivacao) {
                    recapMotivacao.textContent = userAnswers['relevant'] || "Seu benefício principal ainda não foi definido na Etapa 1.";
                }
                if (recapAcessivel) {
                    recapAcessivel.textContent = userAnswers['achievable'] || "Seus recursos iniciais ainda não foram definidos na Etapa 1.";
                }
            }

            // ===================================================================
            // SEÇÃO 3: EVENT LISTENERS
            // ===================================================================
            
            // Listener central para todos os cliques
            document.body.addEventListener('click', (e) => {
                const target = e.target; // Boa prática para não repetir e.target

                // --- Navegação Principal ---
                if (target.matches('#step-0 .btn-next')) {
                    showStep(1);
                    return;
                }

                if (target.classList.contains('btn-next')) {
                    const nextStepIndex = currentStep + 1;
                    if (nextStepIndex < steps.length) {
                        showStep(nextStepIndex);
                    }
                    return;
                }

                if (target.classList.contains('btn-prev')) {
                    const prevStepIndex = currentStep - 1;
                    if (prevStepIndex >= 0) {
                        showStep(prevStepIndex);
                    }
                    return;
                }

                // --- Assistente SMART (Etapa 1) ---
                if (target.id === 'btn-start-smart') {
                    const problema = document.getElementById('q-expl-problema').value.trim();
                    const ganho = document.getElementById('q-expl-ganho').value.trim();
                    const indicacao = document.getElementById('q-expl-indicacao').value.trim();

                    if (problema === '' || ganho === '') {
                        alert('Por favor, responda as duas primeiras perguntas para continuarmos.');
                        return; // Para a execução se a validação falhar
                    }
                    
                    userAnswers['expl_problema'] = problema;
                    userAnswers['expl_ganho'] = ganho;
                    userAnswers['expl_indicacao'] = indicacao;
                    
                    // Atualiza o box de recapitulação que aparece no modo assistente
                    if(recapExplorationText) {
                        recapExplorationText.innerHTML = `<strong>O que te trouxe aqui:</strong> ${problema}  
            
            <strong>O que fará valer a pena:</strong> ${ganho}`;
                    }

                    // Define o objetivo inicial para ser usado como base para o "Específico"
                    userAnswers['initial'] = problema; 
                    
                    // Inicia o assistente conversacional
                    startSmartAssistant();
                }
                if (target.id === 'btn-next-smart') {
                    const currentQuestion = smartQuestions[smartState];
        
                    // Lida com a pergunta especial de data
                    if (currentQuestion.type === 'date') {
                        const startDate = smartDateInputStart.value.trim();
                        const endDate = smartDateInputEnd.value.trim();
                        if (startDate === '' || endDate === '') {
                            alert('Por favor, preencha as datas de início e término.');
                            return;
                        }
                        userAnswers['temporal_start'] = startDate;
                        userAnswers['temporal_end'] = endDate;
                        userAnswers[currentQuestion.key] = `De ${startDate} a ${endDate}`;
                    } else { // Lida com as perguntas de texto normais
                        const currentAnswer = smartInput.value.trim();
                        if (currentAnswer === '') {
                            alert('Por favor, preencha sua resposta.');
                            return;
                        }
                        userAnswers[currentQuestion.key] = currentAnswer;
                    }
                    
                    // Avança para a próxima pergunta ou finaliza
                    smartState++;
                    if (smartState < smartQuestions.length) {
                        updateSmartQuestion();
                    } else {
                        isSmartObjectiveDefined = true;
                        // setupStep1() irá automaticamente mostrar o modo de revisão
                        setupStep1(); 
                    }
                }
                if (target.id === 'btn-prev-smart') {
                    // (A lógica que estava no listener do btn-prev-smart vai aqui)
                    if (smartState > 0) {
                        smartState--;
                        updateSmartQuestion();
                    }
                }
                if (target.id === 'btn-edit-smart') {
                    smartSummaryBox.classList.add('hidden');
                    smartConversationContainer.classList.remove('hidden');
                    smartState = 0;
                    updateSmartQuestion();
                }

                // --- Assistente Fotografia do Sucesso (Etapa 2) ---
                if (target.id === 'btn-next-photo') {
                    const currentAnswer = photoInput.value.trim();
                    if (currentAnswer === '') { alert('Por favor, preencha sua resposta.'); return; }
                    const currentKey = photoQuestions[photoState].key;
                    userAnswers[currentKey] = currentAnswer;
                    photoState++;
                    if (photoState < photoQuestions.length) {
                        updatePhotoQuestion();
                    } else {
                        isPhotoDefined = true;
                        showPhotoReviewMode();
                    }
                }
                if (target.id === 'btn-prev-photo') {
                    if (photoState > 0) {
                        photoState--;
                        updatePhotoQuestion();
                    }
                }
                if (target.id === 'btn-edit-photo') {
                    photoState = photoQuestions.length - 1;
                    photoAssistantContainer.classList.remove('hidden');
                    photoSummaryBox.classList.add('hidden');
                    updatePhotoQuestion();
                }
                
                // --- Ensaio Mental (Etapa 3) ---
                if (target.id === 'btn-concluir-ensaio') {
                    showStep(4); // Avança para a etapa de Compromisso
                }

                // --- Finalização e Impressão (Etapa 5) ---
                if (target.id === 'btn-finalizar') {
                    generateFinalSummary();
                    showStep(steps.length - 1);
                }
                if (target.id === 'btn-print') {
                    const summaryStep = document.getElementById('step-5');
                    if (summaryStep) {
                        summaryStep.classList.add('printable');
                        window.print();
                        summaryStep.classList.remove('printable');
                    }
                }
            });

            document.body.addEventListener('input', (e) => {
    
                // Lógica para o slider de responsabilidade
                if (e.target.id === 'slider-responsabilidade') {
                    const responsabilidadeValue = document.getElementById('responsabilidade-value');
                    const responsabilidadeExtraContainer = document.getElementById('responsabilidade-extra-container');
                    const value = e.target.value;

                    if (responsabilidadeValue) responsabilidadeValue.textContent = `${value}%`;
                    if (responsabilidadeExtraContainer) responsabilidadeExtraContainer.classList.toggle('hidden', value >= 100);
                }

                // Lógica para o slider de comprometimento
                if (e.target.id === 'slider-comprometimento') {
                    const comprometimentoValue = document.getElementById('comprometimento-value');
                    if (comprometimentoValue) comprometimentoValue.textContent = e.target.value;
                }
            });

            let activeTooltip = null; // Variável de controle, no escopo do script

            // MOSTRAR o tooltip ao passar o mouse sobre um .help-tip
            document.body.addEventListener('mouseover', (e) => {
                // Só continua se o alvo for um .help-tip
                if (!e.target.classList.contains('help-tip')) return;

                // Previne múltiplos tooltips se o mouse se mover rapidamente
                if (activeTooltip) return; 

                const icon = e.target;
                const tooltipText = icon.dataset.tooltip;

                // Cria o elemento do tooltip
                activeTooltip = document.createElement('div');
                activeTooltip.className = 'dynamic-tooltip';
                activeTooltip.innerHTML = tooltipText;
                document.body.appendChild(activeTooltip);

                // Calcula a posição ideal
                const iconRect = icon.getBoundingClientRect();
                const tooltipRect = activeTooltip.getBoundingClientRect();
                
                let top = iconRect.top - tooltipRect.height - 10; // Posição padrão: acima
                let left = iconRect.left + (iconRect.width / 2) - (tooltipRect.width / 2);

                // Ajusta para não sair da tela
                if (left < 10) left = 10;
                if (left + tooltipRect.width > window.innerWidth - 10) {
                    left = window.innerWidth - tooltipRect.width - 10;
                }
                if (top < 10) { // Se não couber em cima, posiciona embaixo
                    top = iconRect.bottom + 10;
                }

                // Aplica a posição (considerando o scroll da página)
                activeTooltip.style.top = `${top + window.scrollY}px`;
                activeTooltip.style.left = `${left + window.scrollX}px`;
                
                // Adiciona a classe para o efeito de fade-in
                setTimeout(() => { if (activeTooltip) activeTooltip.classList.add('visible'); }, 10);
            });

            // ESCONDER o tooltip ao tirar o mouse de um .help-tip
            document.body.addEventListener('mouseout', (e) => {
                // Só continua se o alvo for um .help-tip E se houver um tooltip ativo
                if (!e.target.classList.contains('help-tip') || !activeTooltip) return;

                // Inicia o processo de remoção
                activeTooltip.classList.remove('visible');
                
                // Remove o elemento do DOM após a transição de fade-out
                setTimeout(() => {
                    if (activeTooltip && activeTooltip.parentElement) {
                        document.body.removeChild(activeTooltip);
                    }
                    activeTooltip = null; // Libera a variável de controle
                }, 300); // O tempo deve ser igual à duração da transição no CSS
            });

            function generateFinalSummary() {
                const summaryContent = document.getElementById('summary-content');
            
                userAnswers['responsabilidade_quem'] = document.getElementById('q-responsabilidade-quem').value;
                userAnswers['responsabilidade_percent'] = document.getElementById('slider-responsabilidade').value;
                userAnswers['responsabilidade_extra'] = document.getElementById('q-responsabilidade-extra').value;
                userAnswers['motivacao_final'] = document.getElementById('q-motivacao').value;
                userAnswers['tarefa_inicial'] = document.getElementById('q-tarefa').value;

                // **AJUSTE AQUI**: Inclui a terceira pergunta da exploração no resumo
                summaryContent.innerHTML = `
                    <h3>🧭 Minha Exploração Inicial</h3>
                    <p>
                        <strong>O que me trouxe aqui:</strong> ${userAnswers['expl_problema'] || 'Não definido.'}  

                        <strong>O que fará valer a pena:</strong> ${userAnswers['expl_ganho'] || 'Não definido.'}  

                        <strong>Nível de satisfação para indicar:</strong> ${userAnswers['expl_indicacao'] || 'Não definido.'}
                    </p>

                    <h3>🎯 Meu Objetivo SMART</h3>
                    <p>${userAnswers['final'] || 'Não definido.'}</p>

                    <h3>📸 A Fotografia do Meu Sucesso</h3>
                    <p>${userAnswers['photo_final'] || 'Não definida.'}</p>

                    <h3>💪 Minha Responsabilidade</h3>
                    <p>
                        <strong>De quem é a responsabilidade:</strong> ${userAnswers['responsabilidade_quem'] || 'Não definido.'}  

                        <strong>Quanto depende de mim:</strong> ${userAnswers['responsabilidade_percent'] || '0'}%  

                        ${userAnswers['responsabilidade_percent'] < 100 && userAnswers['responsabilidade_extra'] ? `<strong>Como aumentar minha responsabilidade:</strong> ${userAnswers['responsabilidade_extra']}  
                    ` : ''}
                    </p>

                    <h3>🔥 Minha Motivação Profunda</h3>
                    <p>${userAnswers['motivacao_final'] || 'Não definida.'}</p>

                    <h3>🚀 Minha Próxima Tarefa</h3>
                    <p>${userAnswers['tarefa_inicial'] || 'Não definida.'}</p>
                `;
            }

            showStep(0);
        }
        // Chama a função principal que inicializa toda a ferramenta.
        inicializarFerramenta();           

    }, []);

    return (
        <>
            <div id="help-tip-template" style={{ display: 'none' }}>
                <span className="help-tip" data-tooltip="">?</span>
            </div>
        
            <div className="container">

                <Header />

                <div className="tool-wrapper">

                    {/* ===================================================================== */}
                    {/*   ETAPA 0: INTRODUÇÃO                                                 */}
                    {/* ===================================================================== */}

                    <section id="step-0" className="step active">
                        <div className="step-header">
                            <h1>🌟 Ferramenta: Resultado Esperado</h1>
                            <p>Esta ferramenta te guiará para transformar um desejo vago em um objetivo claro e poderoso. Responda com calma e sinceridade.</p>
                        </div>
                        <div className="step-content">
                            <div className="info-box">
                                <h4>O Segredo de um Objetivo Poderoso</h4>
                                <p>Muitas vezes, nossos desejos são sentimentos (ex: "quero ser feliz"). Para alcançá-los, precisamos transformá-los em algo concreto e palpável. Ao longo desta jornada, vamos te ajudar a fazer exatamente isso.</p>
                            </div>
                        </div>
                        <div className="step-navigation">
                            <button className="btn-next">Começar</button>
                        </div>
                    </section>

                    {/* ===================================================================== */}
                    {/*   ETAPA 1: RESULTADOS ESPERADOS (OBJETIVO SMART)                      */}
                    {/* ===================================================================== */}
                    <section id="step-1" className="step">
                        <div className="step-header">
                            <h2>Etapa 1: Definição do Objetivo</h2>
                            <p>Vamos começar entendendo o que te trouxe até aqui para, então, construir um objetivo claro e poderoso usando a metodologia SMART.</p>
                        </div>
                        <div className="step-content">

                            {/* PARTE A: EXPLORAÇÃO INICIAL */}
                            <div id="exploration-container">
                                <div className="question-block">
                                    <label htmlFor="q-expl-problema">O que te trouxe até aqui? O que fez você parar e dedicar seu tempo a esta ferramenta neste exato momento?</label>
                                    <textarea id="q-expl-problema" placeholder="Seja sincero(a). Ex: 'Sinto que estou estagnado(a) na carreira', 'Minha vida financeira está uma bagunça', 'Não tenho tempo para mim'..."></textarea>
                                </div>
                                <div className="question-block">
                                    <label htmlFor="q-expl-ganho">Imagine que você chegou ao final desta jornada. O que precisa ter acontecido para você dizer "Uau, valeu muito a pena!"?</label>
                                    <textarea id="q-expl-ganho" placeholder="Descreva o resultado ideal. Ex: 'Ter um plano claro para os próximos 6 meses', 'Sentir que retomei o controle da minha vida'..."></textarea>
                                </div>
                                <div className="question-block">
                                    <label htmlFor="q-expl-indicacao">E o que te deixaria tão satisfeito(a) a ponto de querer indicar esta ferramenta para um amigo querido?</label>
                                    <textarea id="q-expl-indicacao" placeholder="Qual nível de transformação você espera? Ex: 'Se eu conseguir destravar uma decisão importante', 'Se eu me sentir mais motivado(a) e com mais energia'..."></textarea>
                                </div>
                                <div className="subtask-navigation" style={{justifyContent: 'flex-end'}}>
                                    <button id="btn-start-smart" className="btn-next-small">Definir meu Objetivo</button>
                                </div>
                            </div>

                            {/* PARTE B: ASSISTENTE SMART */}
                            <div id="smart-conversation-container" className="hidden">
                                <div className="recap-box">
                                    <h4>Suas Reflexões Iniciais:</h4>
                                    <p id="recap-exploration-text">Carregando...</p>
                                </div>
                                <div id="smart-history-container"></div>
                                <div id="active-question-container">
                                    <div className="label-wrapper">
                                        <label id="smart-label" htmlFor="smart-input">...</label>
                                    </div>
                                    <div id="smart-summary" className="draft-box hidden">
                                        <h4 id="smart-summary-title"></h4>
                                        <p id="smart-summary-text"></p>
                                    </div>
                                    <div id="input-fields-wrapper">
                                        <textarea id="smart-input" placeholder="Escreva sua resposta aqui..."></textarea>
                                        <div id="date-inputs-container" className="hidden">
                                            <div className="date-input-wrapper">
                                                <label htmlFor="smart-date-input-start">Data de Início</label>
                                                <input type="date" id="smart-date-input-start"/>
                                            </div>
                                            <div className="date-input-wrapper">
                                                <label htmlFor="smart-date-input-end">Data de Término</label>
                                                <input type="date" id="smart-date-input-end"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="subtask-navigation">
                                    <button id="btn-prev-smart" className="btn-prev-small hidden">Voltar</button>
                                    <button id="btn-next-smart" className="btn-next-small">Próximo</button>
                                </div>
                            </div>

                            {/* PARTE C: MODO DE REVISÃO */}
                            <div id="review-container" className="hidden">
                                <div id="review-summary" className="draft-box">
                                    <h4>Seu Objetivo definido é:</h4>
                                    <p id="review-summary-text"></p>
                                </div>
                                <button id="btn-edit-smart" className="btn-prev-small" style={{marginTop: '1rem'}}>Editar Objetivo</button>
                            </div>
                        </div>
                        <div className="step-navigation">
                            <button className="btn-prev">Voltar</button>
                            <button className="btn-next">Avançar</button>
                        </div>
                    </section>

                    {/* ===================================================================== */}
                    {/*   ETAPA 2: FOTOGRAFIA DO SUCESSO                                      */}
                    {/* ===================================================================== */}
                    <section className="step" id="step-2">
                        <div className="step-header">
                            <h2>Etapa 2: A Fotografia do Sucesso</h2>
                            <p>Imagine que viajou no tempo e seu objetivo já foi alcançado. Vamos descrever essa cena com o máximo de detalhes racionais, como um planejamento.</p>
                        </div>
                        <div className="step-content">
                            <div className="recap-box">
                                <h4>Seu objetivo definido é:</h4>
                                <p id="recap-objetivo-step2">Carregando...</p>
                            </div>
                            <div id="photo-assistant-container">
                                <div className="label-wrapper">
                                    <label id="photo-label" htmlFor="photo-input">Pergunta inicial...</label>
                                </div>
                                <div id="photo-draft-summary" className="draft-box hidden">
                                    <h4>Rascunho da sua Cena:</h4>
                                    <p id="photo-draft-summary-text"></p>
                                </div>
                                <textarea id="photo-input" placeholder="Descreva em detalhes..."></textarea>
                                <div className="subtask-navigation">
                                    <button id="btn-prev-photo" className="btn-prev-small hidden">Voltar</button>
                                    <button id="btn-next-photo" className="btn-next-small">Próximo</button>
                                </div>
                            </div>
                            <div id="photo-summary" className="hidden">
                                <h4>Sua Fotografia do Sucesso:</h4>
                                <p id="photo-summary-text"></p>
                                <button id="btn-edit-photo" className="btn-prev-small" style={{marginTop: '1rem'}}>Editar Fotografia</button>
                            </div>
                        </div>
                        <div className="step-navigation">
                            <button className="btn-prev">Voltar</button>
                            <button className="btn-next">Avançar</button>
                        </div>
                    </section>
                    
                    {/* ===================================================================== */}
                    {/*   ETAPA 3: O ENSAIO MENTAL (VÍDEO + ÁUDIO)                            */}
                    {/* ===================================================================== */}
                    <section id="step-3" className="step">
                        <div className="step-header">
                            <h2>Etapa 3: O Ensaio Mental Guiado</h2>
                            <p>Esta é a etapa mais importante. Vamos transformar seu planejamento em uma experiência real e emocional.</p>
                        </div>
                        <div className="step-content">
                            <div className="media-wrapper">
                                <h4>Uma mensagem para você:</h4>
                                <video controls controlsList="nodownload" style={{width: '100%', borderRadius: '8px'}}>
                                    <source src="../assets/video-intro.mp4" type="video/mp4"/>
                                    Seu navegador não suporta o elemento de vídeo.
                                </video>
                            </div>
                            <div className="media-wrapper">
                                <h4>Seu Ensaio Mental:</h4>
                                <p style={{textAlign: 'center', marginBottom: '1rem'}}><em>"Agora, encontre uma posição confortável, feche os olhos e pressione 'Play'."</em></p>
                                <audio controls controlsList="nodownload" style={{width: '100%'}}>
                                    <source src="../assets/audio-ensaio.mp3" type="audio/mpeg"/>
                                    Seu navegador não suporta o elemento de áudio.
                                </audio>
                            </div>
                        </div>
                        <div className="step-navigation">
                            <button className="btn-prev">Voltar</button>
                            <button className="btn-next">Avançar</button>
                        </div>
                    </section>

                    {/* ===================================================================== */}
                    {/*   ETAPA 4: COMPROMISSO E AÇÃO                                         */}
                    {/* ===================================================================== */}
                    <section id="step-4" className="step">
                        <div className="step-header">
                            <h2>Etapa 4: Compromisso e Ação</h2>
                            <p>Você sentiu a emoção da conquista. Agora, vamos transformar essa energia em um plano de ação concreto.</p>
                        </div>
                        <div className="step-content">

                            {/* 1. Seção de Motivação (O "Porquê") */}
                            <div className="question-block">
                                <label htmlFor="q-motivacao">Para selar sua motivação, releia o benefício que você definiu na Etapa 1 e reforce: por que alcançar esse objetivo é inegociável para você?</label>
                                <div className="recap-box" style={{marginBottom: '1rem'}}>
                                    <h4>Lembre-se do seu "Porquê" (Benefício):</h4>
                                    <p id="recap-motivacao-step4">Carregando...</p>
                                </div>
                                <textarea id="q-motivacao" placeholder="Reforce sua motivação com suas próprias palavras..."></textarea>
                            </div>

                            {/* 2. Seção de Confiança (O "Como") */}
                            <div className="question-block">
                                <label>Para construir sua confiança, lembre-se dos recursos que você já possui.</label>
                                <div className="recap-box">
                                    <h4>Você já tem o que é preciso para começar (Recursos):</h4>
                                    <p id="recap-acessivel-step4">Carregando...</p>
                                </div>
                            </div>

                            {/* 3. Seção de Responsabilidade (O "Quem") */}
                            <div className="question-block">
                                <label htmlFor="q-responsabilidade-quem">De quem é a responsabilidade de conseguir isso?</label>
                                <textarea id="q-responsabilidade-quem" placeholder="Ex: Minha, minha e do meu chefe, etc."></textarea>
                                
                                <label htmlFor="slider-responsabilidade" style={{marginTop: '1rem'}}>De 0 a 100%, quanto o sucesso dessa jornada depende exclusivamente de você?</label>
                                <input type="range" id="slider-responsabilidade" min="0" max="100" defaultValue="80" className="slider"/>
                                <span id="responsabilidade-value" className="slider-value">80%</span>

                                {/* Esta pergunta só aparecerá se o slider for < 100% */}
                                <div id="responsabilidade-extra-container" className="hidden" style={{marginTop: '1rem'}}>
                                    <label htmlFor="q-responsabilidade-extra">O que você poderia fazer para que esse número aumente, para que dependa um pouquinho mais só de você?</label>
                                    <textarea id="q-responsabilidade-extra" placeholder="Ex: Em vez de esperar uma oportunidade, posso criar uma. Em vez de depender de alguém, posso aprender a fazer."></textarea>
                                </div>
                            </div>

                            {/* 4. Seção de Comprometimento (O "Quanto") */}
                            <div className="question-block">
                                <label htmlFor="slider-comprometimento">Com essa clareza e motivação, de 0 a 10, qual o seu nível de comprometimento em fazer o que for preciso para dar o próximo passo?</label>
                                <input type="range" id="slider-comprometimento" min="0" max="10" defaultValue="8" className="slider"/>
                                <span id="comprometimento-value" className="slider-value">8</span>
                            </div>

                            {/* 5. Seção de Ação (O "O Quê") */}
                            <div className="question-block">
                                <label htmlFor="q-tarefa">Excelente! Agora, qual é o <strong>primeiro e menor passo</strong> (algo que você possa fazer em até 15 minutos) que você dará na próxima semana para iniciar sua jornada?</label>
                                <textarea id="q-tarefa" placeholder="Ex: Enviar um e-mail para marcar aquela conversa; pesquisar por 15 minutos sobre o tema X; arrumar a gaveta do escritório..."></textarea>
                            </div>

                        </div>
                        <div className="step-navigation">
                            <button className="btn-prev">Voltar</button>
                            <button id="btn-finalizar">Finalizar e Ver Resumo</button>
                        </div>
                    </section>

                    {/* ===================================================================== */}
                    {/*   ETAPA 5: RESUMO FINAL                                               */}
                    {/* ===================================================================== */}
                    <section id="step-5" className="step">
                        <div className="step-header">
                            
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                                <h2>Seu Plano de Ação</h2>
                                <button id="btn-print" className="btn-icon" title="Imprimir ou Salvar como PDF">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                                </button>
                            </div>

                            {/* O parágrafo foi movido para fora do flexbox */}
                            <p>Parabéns por concluir a jornada! Guarde este plano e consulte-o sempre que precisar de motivação.</p>

                        </div>
                        <div id="summary-content" className="step-content">
                            {/* O resumo será gerado aqui pelo JavaScript */}
                        </div>
                        <div className="step-navigation">
                            <button className="btn-prev">Voltar</button>
                        </div>
                    </section>

                </div>
            </div>
            <Modals />
            <Copyright />
        </>
    );
}
