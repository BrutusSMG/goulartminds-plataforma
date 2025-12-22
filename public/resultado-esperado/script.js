/**
 * Script para a ferramenta "Resultado Esperado".
 * Gerencia a navegação entre etapas e a lógica de cada assistente.
 */
document.addEventListener('DOMContentLoaded', () => {

    // =====================================================================
    // --- 1. VARIÁVEIS GLOBAIS E NAVEGAÇÃO PRINCIPAL                    ---
    // =====================================================================

    const steps = document.querySelectorAll('.step');
    const stepNextButtons = document.querySelectorAll('.btn-next');
    const stepPrevButtons = document.querySelectorAll('.btn-prev');
    const finalizeButton = document.getElementById('btn-finalizar');
    let currentStep = 0;

    const userAnswers = {};

    const startButton = document.querySelector('#step-0 .btn-next');
    if (startButton) {
        startButton.addEventListener('click', () => showStep(1));
    }

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

    stepNextButtons.forEach(button => {
        if (button !== startButton) {
            button.addEventListener('click', () => { if (currentStep < steps.length - 1) showStep(currentStep + 1); });
        }
    });

    stepPrevButtons.forEach(button => button.addEventListener('click', () => { if (currentStep > 0) showStep(currentStep - 1); }));
    
    finalizeButton.addEventListener('click', async () => {
        finalizeButton.disabled = true;
        finalizeButton.textContent = 'Finalizando...';
        try {
            console.log("Finalizando ferramenta. Tentando salvar a conclusão no perfil...");

        const response = await fetch('/api/tools/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ toolName: 'Resultado_esperado' }) // Identificador interno da ferramenta
        });

        if (!response.ok) {
            console.error('Falha ao salvar a conclusão da ferramenta no perfil.');
        } else {
            console.log('Conclusão da ferramenta salva com sucesso no perfil!');
        }

        generateFinalSummary();
        showStep(steps.length - 1);

        } catch (error) {
            // Captura qualquer erro inesperado (ex: problema de rede)
            console.error('Ocorreu um erro inesperado ao finalizar a ferramenta:', error);
            // Mesmo em caso de erro, tentamos mostrar o resumo para o usuário
            generateFinalSummary();
            showStep(steps.length - 1);
        } finally {
            // Este bloco SEMPRE é executado, garantindo que o botão seja reativado
            finalizeButton.disabled = false;
            finalizeButton.textContent = 'Finalizar e Ver Resumo';
        }
    });

    // =====================================================================
    // --- 2. LÓGICA DA ETAPA 1: OBJETIVO SMART                          ---
    // =====================================================================

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

    // **AJUSTE AQUI**: Captura a terceira pergunta
    btnStartSmart.addEventListener('click', () => {
        const problema = document.getElementById('q-expl-problema').value.trim();
        const ganho = document.getElementById('q-expl-ganho').value.trim();
        const indicacao = document.getElementById('q-expl-indicacao').value.trim(); // Captura a nova resposta

        if (problema === '' || ganho === '') {
            alert('Por favor, responda as duas primeiras perguntas para continuarmos.');
            return;
        }
        
        userAnswers['expl_problema'] = problema;
        userAnswers['expl_ganho'] = ganho;
        userAnswers['expl_indicacao'] = indicacao; // Salva a nova resposta
        
        recapExplorationText.innerHTML = `<strong>O que te trouxe aqui:</strong> ${problema}  
  
<strong>O que fará valer a pena:</strong> ${ganho}`;
        userAnswers['initial'] = problema;
        startSmartAssistant();
    });

    function startSmartAssistant() {
        smartState = 0;
        explorationContainer.classList.add('hidden');
        reviewContainer.classList.add('hidden');
        smartConversationContainer.classList.remove('hidden');
        updateSmartQuestion();
    }

    btnEditSmart.addEventListener('click', () => {
        reviewContainer.classList.add('hidden');
        smartState = smartQuestions.length - 1;
        updateSmartQuestion();
        smartConversationContainer.classList.remove('hidden');
    });

    function updateSmartQuestion() {
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
            attachTooltipEvents(template);
        }
        
        if (currentQuestion.type === 'final') {
            smartInput.classList.remove('hidden');
            smartInput.value = userAnswers[currentQuestion.key] || '';
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
                smartDateInputStart.value = userAnswers['temporal_start'] || '';
                smartDateInputEnd.value = userAnswers['temporal_end'] || '';
            } else {
                smartInput.classList.remove('hidden');
                smartInput.value = userAnswers[currentQuestion.key] || (currentQuestion.key === 'initial' ? userAnswers['initial'] : '') || '';
                smartInput.placeholder = "Sua resposta...";
            }
            nextSmartButton.textContent = 'Próximo';
        }
    }

    nextSmartButton.addEventListener('click', () => {
        const currentQuestion = smartQuestions[smartState];
        
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
        } else {
            const currentAnswer = smartInput.value.trim();
            if (currentAnswer === '') {
                alert('Por favor, preencha sua resposta.');
                return;
            }
            userAnswers[currentQuestion.key] = currentAnswer;
        }
        
        smartState++;
        if (smartState < smartQuestions.length) {
            updateSmartQuestion();
        } else {
            isSmartObjectiveDefined = true;
            setupStep1();
        }
    });
    
    prevSmartButton.addEventListener('click', () => {
        if (smartState > 0) {
            smartState--;
            updateSmartQuestion();
        }
    });

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

    // =====================================================================
    // --- 3. LÓGICA DA ETAPA 2: FOTOGRAFIA DO SUCESSO                   ---
    // =====================================================================
        
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
        const currentQuestion = photoQuestions[photoState];
        photoLabel.innerHTML = currentQuestion.label;
        photoInput.value = userAnswers[currentQuestion.key] || '';
        photoInput.placeholder = "Descreva em detalhes...";
        prevPhotoButton.classList.toggle('hidden', photoState === 0);
        photoDraftSummaryBox.classList.add('hidden');

        const oldTip = photoLabelWrapper.querySelector('.help-tip');
        if (oldTip) oldTip.remove();
        if (currentQuestion.help) {
            const template = document.getElementById('help-tip-template').firstElementChild.cloneNode(true);
            template.dataset.tooltip = currentQuestion.help;
            photoLabelWrapper.appendChild(template);
            attachTooltipEvents(template);
        }

        if (currentQuestion.type === 'final') {
            nextPhotoButton.textContent = 'Concluir';
            buildPhotoDraftSummary(); 
        } else {
            nextPhotoButton.textContent = 'Próximo';
        }
    }

    nextPhotoButton.addEventListener('click', () => {
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
    });

    prevPhotoButton.addEventListener('click', () => {
        if (photoState > 0) {
            photoState--;
            updatePhotoQuestion();
        }
    });

    editPhotoButton.addEventListener('click', () => {
        photoState = photoQuestions.length - 1;
        photoAssistantContainer.classList.remove('hidden');
        photoSummaryBox.classList.add('hidden');
        updatePhotoQuestion();
    });

    function showPhotoReviewMode() {
        photoAssistantContainer.classList.add('hidden');
        photoSummaryText.textContent = userAnswers['photo_final'];
        photoSummaryBox.classList.remove('hidden');
    }

    // =====================================================================
    // --- 4. LÓGICA DA ETAPA 4: COMPROMISSO E AÇÃO                      ---
    // =====================================================================

    function setupStep4() {
        const recapMotivacao = document.getElementById('recap-motivacao-step4');
        const recapAcessivel = document.getElementById('recap-acessivel-step4');
        recapMotivacao.textContent = userAnswers['relevant'] || "Seu benefício principal ainda não foi definido na Etapa 1.";
        recapAcessivel.textContent = userAnswers['achievable'] || "Seus recursos iniciais ainda não foram definidos na Etapa 1.";
    }

    const responsabilidadeSlider = document.getElementById('slider-responsabilidade');
    const responsabilidadeValue = document.getElementById('responsabilidade-value');
    const responsabilidadeExtraContainer = document.getElementById('responsabilidade-extra-container');

    if (responsabilidadeSlider) {
        responsabilidadeSlider.addEventListener('input', () => {
            const value = responsabilidadeSlider.value;
            responsabilidadeValue.textContent = `${value}%`;
            responsabilidadeExtraContainer.classList.toggle('hidden', value >= 100);
        });
    }

    const comprometimentoSlider = document.getElementById('slider-comprometimento');
    if(comprometimentoSlider) {
        const comprometimentoValue = document.getElementById('comprometimento-value');
        comprometimentoSlider.addEventListener('input', () => { comprometimentoValue.textContent = comprometimentoSlider.value; });
    }

    // =====================================================================
    // --- 5. LÓGICA DA ETAPA 5: RESUMO FINAL                            ---
    // =====================================================================

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

    // =====================================================================
    // --- 6. FUNCIONALIDADES GERAIS (TOOLTIP)                           ---
    // =====================================================================

    let activeTooltip = null;
    function attachTooltipEvents(element) {
        element.addEventListener('mouseenter', (event) => {
            if (activeTooltip) return;
            const icon = event.currentTarget;
            const tooltipText = icon.dataset.tooltip;
            activeTooltip = document.createElement('div');
            activeTooltip.className = 'dynamic-tooltip';
            activeTooltip.innerHTML = tooltipText;
            document.body.appendChild(activeTooltip);
            
            const iconRect = icon.getBoundingClientRect();
            const tooltipRect = activeTooltip.getBoundingClientRect();
            let top = iconRect.top - tooltipRect.height - 10;
            let left = iconRect.left + (iconRect.width / 2) - (tooltipRect.width / 2);
            if (left < 10) left = 10;
            if (left + tooltipRect.width > window.innerWidth - 10) left = window.innerWidth - tooltipRect.width - 10;
            if (top < 10) top = iconRect.bottom + 10;

            activeTooltip.style.top = `${top + window.scrollY}px`;
            activeTooltip.style.left = `${left + window.scrollX}px`;
            
            setTimeout(() => { if(activeTooltip) activeTooltip.classList.add('visible'); }, 10);
        });

        element.addEventListener('mouseleave', () => {
            if (activeTooltip) {
                activeTooltip.classList.remove('visible');
                setTimeout(() => {
                    if (activeTooltip && activeTooltip.parentElement) document.body.removeChild(activeTooltip);
                    activeTooltip = null;
                }, 300);
            }
        });
    }

    // =====================================================================
    // --- 7. FUNCIONALIDADE DE IMPRESSÃO                                ---
    // =====================================================================

    const printButton = document.getElementById('btn-print');
    const summaryStep = document.getElementById('step-5');

    if (printButton) {
        printButton.addEventListener('click', () => {
            // Adiciona uma classe temporária para que o CSS de impressão saiba qual etapa mostrar
            summaryStep.classList.add('printable');
            
            // Chama a janela de impressão do navegador
            window.print();
            
            // Remove a classe após a impressão ser chamada (seja confirmada ou cancelada)
            summaryStep.classList.remove('printable');
        });
    }

    // --- INICIALIZAÇÃO ---
    showStep(currentStep);
});
