import React, { useEffect } from 'react';
import Head from 'next/head';

// 1. Importações necessárias do nosso sistema
import { useSmartAuth } from '../../hooks/useSmartAuth';
import PageLayout from '../../components/PageLayout';
import { AccessDenied } from '../../components/AuthGuard';

// 2. A função de inicialização, com a lógica do script.js diretamente dentro dela
function inicializarFerramentaValores() {
    // ===============================================================
    // SEÇÃO 1: DECLARAÇÃO DE VARIÁVEIS, CONSTANTES E DADOS
    // ===============================================================
    const MIN_SELECTION = 10;
    const TOP_VALUES_COUNT = 5;
    const initialValues = [
        { name: 'Autonomia', description: 'Ser independente e ter controle sobre suas próprias ações e decisões.', scenario: 'Ter a liberdade de definir seus próprios horários e métodos de trabalho.' },
        { name: 'Aventura', description: 'Buscar novas experiências, riscos e desafios.', scenario: 'Aceitar um projeto desafiador em uma área que você não domina completamente.' },
        { name: 'Amor', description: 'Dar e receber afeto, carinho e conexão profunda.', scenario: 'Dedicar uma noite por semana exclusivamente para estar com pessoas que você ama, sem distrações.' },
        { name: 'Aprendizado', description: 'Adquirir conhecimento, habilidades e sabedoria continuamente.', scenario: 'Investir tempo e dinheiro em um curso para desenvolver uma nova habilidade.' },
        { name: 'Compromisso', description: 'Ser leal e dedicado às suas promessas e responsabilidades.', scenario: 'Manter sua palavra em um projeto, mesmo que isso exija um esforço extra inesperado.' },
        { name: 'Compaixão', description: 'Sentir e agir para aliviar o sofrimento dos outros.', scenario: 'Oferecer ajuda a um colega que está visivelmente sobrecarregado, mesmo que atrase seu próprio trabalho.' },
        { name: 'Conexão', description: 'Sentir-se parte de algo maior, conectado a outras pessoas.', scenario: 'Participar ativamente de uma comunidade ou grupo que compartilha seus interesses.' },
        { name: 'Coragem', description: 'Agir apesar do medo, defender o que é certo.', scenario: 'Apresentar uma ideia inovadora em uma reunião, sabendo que ela pode ser recebida com ceticismo.' },
        { name: 'Criatividade', description: 'Expressar-se de formas novas e originais, inovar.', scenario: 'Propor uma solução completamente nova para um problema antigo, em vez de usar o método tradicional.' },
        { name: 'Crescimento', description: 'Desenvolver-se pessoal e profissionalmente de forma constante.', scenario: 'Buscar feedback honesto sobre seus pontos fracos para poder melhorá-los.' },
        { name: 'Curiosidade', description: 'Ter um forte desejo de explorar, descobrir e aprender.', scenario: 'Dedicar tempo para pesquisar um tópico aleatório que despertou seu interesse, sem um objetivo prático.' },
        { name: 'Dever', description: 'Cumprir com suas obrigações e responsabilidades morais.', scenario: 'Finalizar uma tarefa importante e prometida, mesmo quando se sente cansado e desmotivado.' },
        { name: 'Disciplina', description: 'Ter autocontrole e a capacidade de seguir regras e rotinas.', scenario: 'Manter uma rotina de exercícios ou estudos, mesmo nos dias em que a vontade é de desistir.' },
        { name: 'Diversão', description: 'Procurar alegria, prazer e entretenimento na vida.', scenario: 'Reservar um tempo na sua agenda para um hobby ou atividade que te dá puro prazer.' },
        { name: 'Equilíbrio', description: 'Manter a harmonia entre diferentes áreas da vida (trabalho, lazer, saúde).', scenario: 'Desconectar-se completamente do trabalho no final do dia para focar na vida pessoal.' },
        { name: 'Espiritualidade', description: 'Conectar-se com um propósito maior, o transcendente ou o sagrado.', scenario: 'Praticar meditação ou passar um tempo na natureza para se reconectar consigo mesmo.' },
        { name: 'Excelência', description: 'Esforçar-se para ser o melhor possível em tudo o que faz.', scenario: 'Revisar um trabalho várias vezes para garantir a máxima qualidade, mesmo que já esteja "bom o suficiente".' },
        { name: 'Família', description: 'Priorizar o bem-estar e a conexão com os entes queridos.', scenario: 'Recusar um compromisso social para estar presente em um evento familiar importante.' },
        { name: 'Fé', description: 'Ter crença e confiança em algo ou alguém, mesmo sem provas.', scenario: 'Confiar que as coisas darão certo no final, mesmo durante um período de incerteza.' },
        { name: 'Flexibilidade', description: 'Adaptar-se facilmente a novas situações e mudanças.', scenario: 'Mudar seus planos de última hora sem estresse para acomodar uma nova oportunidade ou imprevisto.' },
        { name: 'Generosidade', description: 'Dar e compartilhar com os outros sem esperar algo em troca.', scenario: 'Compartilhar seu conhecimento com um colega para ajudá-lo a crescer, sem esperar nada em troca.' },
        { name: 'Gratidão', description: 'Ser grato e apreciar o que você tem na vida.', scenario: 'Terminar o dia listando três coisas pelas quais você é grato, por menores que sejam.' },
        { name: 'Honestidade', description: 'Ser verdadeiro, sincero e transparente em suas ações e palavras.', scenario: 'Admitir um erro que você cometeu, em vez de tentar escondê-lo ou culpar outros.' },
        { name: 'Humildade', description: 'Reconhecer suas limitações e não se considerar superior aos outros.', scenario: 'Ouvir atentamente a opinião de alguém com menos experiência, reconhecendo que pode aprender com ela.' },
        { name: 'Independência', description: 'Ser autossuficiente e não depender dos outros.', scenario: 'Tomar uma decisão importante por conta própria, confiando em seu próprio julgamento.' },
        { name: 'Inovação', description: 'Criar e implementar novas ideias, métodos ou soluções.', scenario: 'Automatizar uma tarefa repetitiva para liberar tempo para atividades mais estratégicas.' },
        { name: 'Justiça', description: 'Lutar pela igualdade, imparcialidade e direitos para todos.', scenario: 'Defender um colega que está sendo tratado de forma injusta, mesmo que isso te coloque em uma posição desconfortável.' },
        { name: 'Lealdade', description: 'Ser fiel e apoiar seus amigos, família ou causas.', scenario: 'Apoiar a decisão de um amigo, mesmo que você não concorde totalmente com ela.' },
        { name: 'Liberdade', description: 'Ter o poder de agir, falar e pensar sem restrições.', scenario: 'Escolher um caminho profissional menos convencional, mas que está alinhado com sua paixão.' },
        { name: 'Liderança', description: 'Inspirar e guiar outras pessoas para alcançar um objetivo comum.', scenario: 'Tomar a iniciativa de organizar uma equipe para resolver um problema que todos estão ignorando.' },
        { name: 'Ordem', description: 'Manter a organização, a estrutura e a previsibilidade.', scenario: 'Organizar seu ambiente de trabalho e planejar sua semana antes de começar as tarefas.' },
        { name: 'Originalidade', description: 'Ser único e autêntico, não apenas seguir os outros.', scenario: 'Expressar uma opinião impopular, mas autêntica, em vez de concordar com a maioria.' },
        { name: 'Otimismo', description: 'Manter uma atitude positiva e esperar o melhor resultado.', scenario: 'Encarar um feedback negativo como uma oportunidade de crescimento, e não como uma crítica pessoal.' },
        { name: 'Paciência', description: 'Manter a calma e a tolerância em situações difíceis.', scenario: 'Explicar algo pela terceira vez a alguém, com a mesma calma da primeira vez.' },
        { name: 'Paz', description: 'Buscar a tranquilidade interior e a ausência de conflitos.', scenario: 'Escolher não entrar em uma discussão desnecessária, mesmo que você tenha razão.' },
        { name: 'Performance', description: 'Alcançar resultados mensuráveis e de alto nível.', scenario: 'Focar em atingir uma meta específica e mensurável, acompanhando seu progresso de perto.' },
        { name: 'Poder', description: 'Ter influência, controle ou autoridade sobre os outros ou sobre si mesmo.', scenario: 'Assumir a liderança de um projeto importante que pode impulsionar sua carreira.' },
        { name: 'Praticidade', description: 'Focar em soluções realistas, eficientes e úteis.', scenario: 'Escolher a solução mais simples e rápida para um problema, em vez da mais "elegante" ou complexa.' },
        { name: 'Prestígio', description: 'Ter respeito e admiração por suas realizações e status.', scenario: 'Receber um prêmio ou reconhecimento público pelo seu trabalho.' },
        { name: 'Reconhecimento', description: 'Receber crédito e apreciação pelo seu trabalho e esforço.', scenario: 'Ter seu chefe elogiando seu esforço e dedicação na frente da equipe.' },
        { name: 'Resiliência', description: 'Recuperar-se rapidamente de dificuldades e adversidades.', scenario: 'Após uma falha, analisar o que deu errado e tentar novamente com uma nova abordagem.' },
        { name: 'Respeito', description: 'Tratar os outros com dignidade e consideração.', scenario: 'Ouvir a perspectiva de outra pessoa até o fim, sem interromper, mesmo que você discorde.' },
        { name: 'Risco', description: 'Estar disposto a correr riscos para alcançar recompensas maiores.', scenario: 'Investir em uma ideia com alto potencial de retorno, mas também com chance de perda.' },
        { name: 'Sabedoria', description: 'Usar o conhecimento e a experiência para fazer bons julgamentos.', scenario: 'Dar um conselho ponderado a um amigo, baseado em suas próprias experiências de vida.' },
        { name: 'Saúde', description: 'Priorizar o bem-estar físico e mental.', scenario: 'Fazer uma pausa para se alongar e descansar, mesmo em um dia de trabalho agitado.' },
        { name: 'Segurança', description: 'Sentir-se protegido de perigos e ameaças.', scenario: 'Optar por um emprego estável e com benefícios, em vez de um trabalho mais arriscado e com maior potencial de ganho.' },
        { name: 'Serviço', description: 'Ajudar e contribuir para o bem-estar dos outros.', scenario: 'Ser voluntário em uma causa ou ajudar alguém sem esperar reconhecimento.' },
        { name: 'Silêncio', description: 'Valorizar momentos de quietude e introspecção.', scenario: 'Reservar 15 minutos do seu dia para ficar em silêncio, sem celular ou outras distrações.' },
        { name: 'Tradição', description: 'Respeitar e seguir costumes e crenças passados de geração em geração.', scenario: 'Manter uma tradição familiar, como um almoço de domingo, por seu valor simbólico.' }
    ];
    
    // --- Estado da Aplicação ---
    let allValues = [...initialValues];
    let selectedValues = new Set();
    let userResponses = {};
    let draggedItem = null; // Item sendo arrastado no momento
    let confrontationPairs = [];
    let currentPairIndex = 0;
    let scores = {};

    // --- Elementos do DOM (Constantes para melhor performance) ---
    const valuesContainer = document.getElementById('values-list-container');
    const selectionCountEl = document.getElementById('selection-count');
    const newValueInput = document.getElementById('new-value-input');
    const selectedValuesPool = document.getElementById('selected-values-pool');
    const definitionsContainer = document.getElementById('definitions-container');
    const dualityContainer = document.getElementById('duality-container');
    const confrontationContainer = document.getElementById('confrontation-container');
    const diagnosisReport = document.getElementById('diagnosis-report');
    
    // ===============================================================
    // VERIFICAÇÃO CRÍTICA DO ELEMENTO-PAI
    // ===============================================================
    // O nome da sua variável pode ser diferente, mas o ID é o mesmo.
    
    if (!valuesContainer) {
        console.error("[Valores Script] ERRO FATAL: Elemento 'values-list-container' não encontrado!");
        return;
    }

    // ===============================================================
    // SUA FUNÇÃO DE RENDERIZAÇÃO (COM LOGS)
    // ===============================================================
    function renderAllValues() {
        if (!valuesContainer) {
            console.error("[Valores Script] ERRO dentro de renderAllValues: a variável 'valuesContainer' é nula.");
            return;
        }
        valuesContainer.innerHTML = '';
        
        // A sua variável pode ser 'initialValues' ou 'allValues'
        initialValues.forEach(valueObj => { 
            // ... (lógica da createValueCard) ...
            const card = createValueCard(valueObj); 
            valuesContainer.appendChild(card);
        });
    }

    // ===============================================================
    // SEÇÃO 2: DEFINIÇÃO DAS FUNÇÕES PRINCIPAIS
    // ===============================================================

    /**
     * Navega para uma etapa específica da ferramenta.
     * @param {number} stepNumber - O número da etapa para exibir.
     */
    function navigateToStep(stepNumber) {
        document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
        const nextStep = document.getElementById(`step${stepNumber}`);
        if (nextStep) {
            nextStep.classList.add('active');
            window.scrollTo(0, 0);
        }
    }

    // --- Funções da Etapa 1 ---
    function createValueCard(valueObj) {
        const card = document.createElement('div');
        card.className = 'value-card';
        card.textContent = valueObj.name;
        card.dataset.value = valueObj.name;
        card.title = valueObj.description;
        return card;
    }

    function renderAllValues() {
        if (!valuesContainer) return;
        valuesContainer.innerHTML = '';
        allValues.forEach(valueObj => {
            const card = createValueCard(valueObj);
            if (selectedValues.has(valueObj.name)) {
                card.classList.add('selected');
            }
            valuesContainer.appendChild(card);
        });
    }

    function updateSelectionCount() {
        const count = selectedValues.size;
        const gotoStep2Btn = document.getElementById('goto-step2-btn');
        if (selectionCountEl) selectionCountEl.textContent = count;
        if (gotoStep2Btn) {
            gotoStep2Btn.disabled = count < MIN_SELECTION;
            gotoStep2Btn.textContent = count >= MIN_SELECTION ? `Continuar com ${count} valores` : 'Continuar para o Próximo Passo';
        }
    }

    // --- Funções da Etapa 2 ---
    function populateStep2() {
        if (!selectedValuesPool) return;
        selectedValuesPool.innerHTML = '<h3>Sua Lista de Valores</h3>';
        selectedValues.forEach(valueName => {
            const valueObj = allValues.find(v => v.name === valueName);
            if (valueObj) {
                const card = createValueCard(valueObj);
                card.classList.add('draggable');
                card.draggable = true;
                selectedValuesPool.appendChild(card);
            }
        });
    }

    function checkTop5Completion() {
        const dropZones = document.querySelectorAll('#top-5-list .drop-zone');
        const count = Array.from(dropZones).filter(zone => zone.firstElementChild).length;
        const gotoStep3Btn = document.getElementById('goto-step3-btn');
        if (gotoStep3Btn) gotoStep3Btn.disabled = count !== TOP_VALUES_COUNT;
    }

    // --- Funções da Etapa 3 ---
    function populateStep3() {
        if (!definitionsContainer) return;
        definitionsContainer.innerHTML = '';
        userResponses.top5Essenciais.forEach(valueName => {
            const group = document.createElement('div');
            group.className = 'definition-group';
            group.innerHTML = `<label for="def-${valueName}">${valueName}</label><textarea id="def-${valueName}" data-value="${valueName}" rows="2" placeholder="Para mim, ${valueName.toLowerCase()} significa..."></textarea>`;
            definitionsContainer.appendChild(group);
        });
    }

    // --- Funções da Etapa 4 ---
    function populateStep4() {
        if (!dualityContainer) return;
        dualityContainer.innerHTML = '';
        userResponses.top5Essenciais.forEach((valueName, index) => {
            const group = document.createElement('div');
            group.className = 'duality-group';
            group.innerHTML = `
                <h4>${index + 1}. ${valueName}</h4>
                <div class="form-group">
                    <label for="motivator-${valueName}">Motivador: Como ter o valor '${valueName}' te ajuda a avançar rumo à realização do seu objetivo?</label>
                    <textarea id="motivator-${valueName}" data-value="${valueName}" data-type="motivator" rows="3" placeholder="Ex: Minha 'Honestidade' me ajuda a construir confiança..."></textarea>
                </div>
                <div class="form-group">
                    <label for="saboteur-${valueName}">Sabotador: Como ter o valor '${valueName}' te atrapalha a realizar seu objetivo?</label>
                    <textarea id="saboteur-${valueName}" data-value="${valueName}" data-type="saboteur" rows="3" placeholder="Ex: Às vezes, minha 'Honestidade' excessiva me faz criar conflitos..."></textarea>
                </div>
            `;
            dualityContainer.appendChild(group);
        });
    }

    // --- Funções da Etapa 5 ---
    function startConfrontation() {
        const values = userResponses.top5Essenciais;
        confrontationPairs = [];
        scores = {};
        for (let i = 0; i < values.length; i++) {
            scores[values[i]] = 0;
            for (let j = i + 1; j < values.length; j++) {
                confrontationPairs.push([values[i], values[j]]);
            }
        }
        currentPairIndex = 0;
        displayNextPair();
    }

    function displayNextPair() {
        const counter = document.getElementById('confrontation-counter');
        const btnA = document.getElementById('optionA');
        const btnB = document.getElementById('optionB');
        const confrontationBox = document.querySelector('.confrontation-box');

        if (!counter || !btnA || !btnB || !confrontationBox) return;

        if (currentPairIndex >= confrontationPairs.length) {
            counter.textContent = 'Confronto finalizado!';
            confrontationBox.style.display = 'none';
            const gotoStep6Btn = document.getElementById('goto-step6-btn');
            if (gotoStep6Btn) gotoStep6Btn.disabled = false;
            return;
        }
        
        confrontationBox.style.display = 'flex';
        counter.textContent = `Escolha ${currentPairIndex + 1} de ${confrontationPairs.length}`;
        
        const [valueNameA, valueNameB] = confrontationPairs[currentPairIndex];
        const valueA = allValues.find(v => v.name === valueNameA);
        const valueB = allValues.find(v => v.name === valueNameB);

        if (!valueA || !valueB) return; // Segurança

        btnA.innerHTML = `${valueA.name}<span class="scenario">"${valueA.scenario}"</span>`;
        btnB.innerHTML = `${valueB.name}<span class="scenario">"${valueB.scenario}"</span>`;
        btnA.dataset.value = valueA.name;
        btnB.dataset.value = valueB.name;
    }

    // --- Funções da Etapa 6 ---
    function calculateFinalResult() {
        const sortedValues = Object.entries(scores).sort(([, a], [, b]) => b - a);
        userResponses.resultadoFinal = sortedValues.map(item => item[0]);
        if (diagnosisReport) {
            diagnosisReport.innerHTML = `
                <p>Seu valor fundamental, com base nas suas escolhas, é <strong>${userResponses.resultadoFinal[0]}</strong>.</p>
                <p>Sua hierarquia de valores neste momento é:</p>
                <ol>
                    ${userResponses.resultadoFinal.map(v => `<li><strong>${v}</strong></li>`).join('')}
                </ol>
                <p>Lembrando que esta é uma fotografia do seu momento atual. Viver alinhado a essa hierarquia pode trazer mais clareza e propósito para suas decisões.</p>
            `;
        }
    }

    function sendDataToApi() {
        const name = document.getElementById('user-name').value;
        const email = document.getElementById('user-email').value;
        if (!name || !email) {
            alert('Por favor, preencha seu nome e e-mail para continuar.');
            return;
        }
        userResponses.nome = name;
        userResponses.email = email;
        userResponses.whatsapp = document.getElementById('user-whatsapp').value;

        const sendReportBtn = document.getElementById('send-report-btn');
        if (sendReportBtn) sendReportBtn.disabled = true;

        const webAppUrl = 'https://script.google.com/macros/s/AKfycbysIFVX-92bgdD8XyWwoWxU0xzGrmTfdmkzfLdTr_OZEuOI33kDaJvxMEYP-jFBz3c/exec';
        
        fetch(webAppUrl, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userResponses)
        })
        .then(() => {
            alert('Relatório enviado com sucesso! Verifique seu e-mail.');
            location.reload();
        })
        .catch(error => {
            console.error('Erro ao enviar os dados:', error);
            alert('Ocorreu um erro ao enviar seu relatório. Por favor, tente novamente.');
            if (sendReportBtn) sendReportBtn.disabled = false;
        });
    }

    // ===============================================================
    // SEÇÃO 3: EVENT LISTENERS GLOBAIS
    // ===============================================================

    // --- Listener para Cliques ---
    document.body.addEventListener('click', (e) => {
        const target = e.target;

        // ETAPA 1: Seleção de valores e adição de novo valor
        if (target.classList.contains('value-card') && target.closest('#values-list-container')) {
            const value = target.dataset.value;
            if (selectedValues.has(value)) {
                selectedValues.delete(value);
                target.classList.remove('selected');
            } else {
                selectedValues.add(value);
                target.classList.add('selected');
            }
            updateSelectionCount();
        }
        if (target.id === 'add-value-btn') {
            const newName = newValueInput.value.trim();
            if (newName && !allValues.some(v => v.name.toLowerCase() === newName.toLowerCase())) {
                const newValueObj = { name: newName, description: 'Valor adicionado por você.', scenario: 'Viver este valor que é unicamente seu.' };
                allValues.push(newValueObj);
                const card = createValueCard(newValueObj);
                valuesContainer.appendChild(card);
                newValueInput.value = '';
            }
        }

        // NAVEGAÇÃO entre etapas
        if (target.id === 'goto-step2-btn') {
            userResponses.valoresSelecionados = Array.from(selectedValues);
            navigateToStep(2);
            populateStep2();
        }
        if (target.id === 'goto-step3-btn') {
            const top5Values = [];
            document.querySelectorAll('#top-5-list .drop-zone').forEach(zone => {
                if (zone.firstElementChild) top5Values.push(zone.firstElementChild.dataset.value);
            });
            userResponses.top5Essenciais = top5Values;
            navigateToStep(3);
            populateStep3();
        }
        if (target.id === 'goto-step4-btn') {
            userResponses.definicoes = {};
            document.querySelectorAll('#definitions-container textarea').forEach(t => { userResponses.definicoes[t.dataset.value] = t.value; });
            navigateToStep(4);
            populateStep4();
        }
        if (target.id === 'goto-step5-btn') {
            userResponses.dualidade = {};
            document.querySelectorAll('#duality-container textarea').forEach(t => {
                const value = t.dataset.value;
                const type = t.dataset.type;
                if (!userResponses.dualidade[value]) userResponses.dualidade[value] = {};
                userResponses.dualidade[value][type] = t.value;
            });
            navigateToStep(5);
            startConfrontation();
        }
        if (target.id === 'goto-step6-btn') {
            calculateFinalResult();
            navigateToStep(6);
        }

        // ETAPA 5: Escolha no confronto
        if (target.closest('.confrontation-box') && target.tagName === 'BUTTON') {
            const chosenValue = target.dataset.value;
            scores[chosenValue]++;
            currentPairIndex++;
            displayNextPair();
        }

        // ETAPA 6: Envio do relatório
        if (target.id === 'send-report-btn') {
            sendDataToApi();
        }
    });

    // --- Listener para Inputs (validação em tempo real) ---
    document.body.addEventListener('input', (e) => {
        const target = e.target;

        // ETAPA 3: Validação das definições
        if (target.closest('#definitions-container')) {
            const textareas = document.querySelectorAll('#definitions-container textarea');
            const allFilled = Array.from(textareas).every(t => t.value.trim() !== '');
            const gotoStep4Btn = document.getElementById('goto-step4-btn');
            if (gotoStep4Btn) gotoStep4Btn.disabled = !allFilled;
        }

        // ETAPA 4: Validação da dualidade
        if (target.closest('#duality-container')) {
            const textareas = document.querySelectorAll('#duality-container textarea');
            const allFilled = Array.from(textareas).every(t => t.value.trim() !== '');
            const gotoStep5Btn = document.getElementById('goto-step5-btn');
            if (gotoStep5Btn) gotoStep5Btn.disabled = !allFilled;
        }
    });

    // --- Listeners para Drag and Drop ---
    document.body.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('draggable')) {
            draggedItem = e.target;
            setTimeout(() => { e.target.style.display = 'none'; }, 0);
        }
    });

    document.body.addEventListener('dragend', (e) => {
        if (draggedItem) {
            draggedItem.style.display = 'block';
            draggedItem = null;
        }
    });

    document.body.addEventListener('dragover', (e) => {
        e.preventDefault(); // Necessário para permitir o 'drop'
    });

    document.body.addEventListener('drop', (e) => {
        e.preventDefault();
        if (!draggedItem) return;

        const dropZoneTarget = e.target.closest('.drop-zone');
        const poolTarget = e.target.closest('#selected-values-pool');
        
        draggedItem.style.display = 'block'; // Garante que o item volte a ser visível

        if (dropZoneTarget) { // Se soltou em uma drop-zone do Top 5
            if (dropZoneTarget.firstElementChild) { // Se a zona já tinha um item
                selectedValuesPool.appendChild(dropZoneTarget.firstElementChild); // Devolve o item antigo para o pool
            }
            dropZoneTarget.appendChild(draggedItem); // Adiciona o novo item
        } else if (poolTarget) { // Se soltou de volta no pool de seleção
            poolTarget.appendChild(draggedItem);
        }
        
        draggedItem = null;
        checkTop5Completion(); // Verifica se os 5 slots estão preenchidos
    });
    // ===============================================================
    // SEÇÃO 4: CHAMADA INICIAL
    // ===============================================================
    renderAllValues();
    updateSelectionCount();
}

const FerramentaValores = () => {
    // 3. Usando nosso hook de autenticação inteligente
    const { status, hasAccess } = useSmartAuth('valores');

    // 4. useEffect refatorado para o nosso padrão
    useEffect(() => {
        // A condição principal continua a mesma
        if (typeof window !== 'undefined' && hasAccess && status !== 'loading') {

            // 1. Criamos um "manipulador" que chama sua função
            const handleDOMReady = () => {
                try {
                    inicializarFerramentaValores();
                } catch (error) {
                }
            };

            // 2. Verificamos se o DOM já está pronto. Se estiver, rodamos na hora.
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                handleDOMReady();
            } 
            // 3. Se não estiver pronto, "agendamos" a execução para quando ele ficar pronto.
            else {
                window.addEventListener('DOMContentLoaded', handleDOMReady);
            }

            // 4. Função de limpeza: remove o "agendamento" se o usuário sair da página antes.
            return () => {
                window.removeEventListener('DOMContentLoaded', handleDOMReady);
            };
        }
    }, [hasAccess, status]);

    // 5. Renderização condicional (padrão)
    if (status === 'loading') {
        return (
            <PageLayout title="Carregando Ferramenta...">
                <p style={{ textAlign: 'center', padding: '50px' }}>Verificando acesso...</p>
            </PageLayout>
        );
    }

    // Embora seja uma ferramenta pública, mantemos isso por consistência
    if (!hasAccess) {
        return (
            <PageLayout title="Acesso Restrito">
                <AccessDenied toolName="Hierarquia de Valores" />
            </PageLayout>
        );
    }

    // 6. O JSX da ferramenta, agora dentro do PageLayout
    return (
        <PageLayout title="Mapa dos Seus Valores">
            <Head>
                {/* O CSS específico da ferramenta continua aqui */}
                <link rel="stylesheet" href="/valores/style.css" />
            </Head>

            {/* Todo o HTML da sua ferramenta, de ETAPA 1 a ETAPA 6 */}
            
            {/* ETAPA 1: SELEÇÃO DE VALORES */}
            <section id="step1" className="step active">
                <h2>Passo 1 de 5: Seus Valores Fundamentais</h2>
                <div className="instructions-box">
                    <p>Abaixo está uma lista de valores. Clique em todos aqueles que você considera importantes.   
                    <strong>Selecione pelo menos 10 valores para continuar.</strong></p>
                    <p>Valores selecionados: <strong id="selection-count">0</strong> de 10 (mínimo).</p>
                </div>
                <div id="values-list-container"></div>
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

            {/* ETAPA 3: DEFINIÇÃO PESSOAL */}
            <section id="step3" className="step">
                <h2>Passo 3 de 5: O que esses valores significam para VOCÊ?</h2>
                <div className="instructions-box">
                    <p>Um mesmo valor pode ter significados diferentes para cada pessoa. Descreva em uma frase o que cada um dos seus 5 valores essenciais representa na sua vida hoje.</p>
                </div>
                <div id="definitions-container"></div>
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
                        <li><strong>Ajuda (Motivador):</strong> "Minha 'Honestidade' me ajuda a construir confiança com meus clientes..."</li>
                        <li><strong>Atrapalha (Sabotador):</strong> "Às vezes, minha 'Honestidade' excessiva me atrapalha..."</li>
                    </ul>
                </div>
                <div id="duality-container"></div>
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
                <div id="diagnosis-report"></div>
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

        </PageLayout>
    );
};

export default FerramentaValores;
