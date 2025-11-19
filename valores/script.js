// valores/script.js (Versão 10.1 - VERDADEIRAMENTE COMPLETA com Etapas 1 e 2)

document.addEventListener('DOMContentLoaded', () => {
    // =================================================================
    // === DEFINIÇÕES GLOBAIS E DADOS INICIAIS =========================
    // =================================================================
    const MIN_SELECTION = 10;
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
    let allValues = [...initialValues];
    let selectedValues = new Set();
    let userResponses = {};
    let draggedItem = null;

    // --- Elementos do DOM ---
    const valuesContainer = document.getElementById('values-list-container');
    const selectionCountEl = document.getElementById('selection-count');
    const newValueInput = document.getElementById('new-value-input');
    const addValueBtn = document.getElementById('add-value-btn');
    const selectedValuesPool = document.getElementById('selected-values-pool');
    
    const gotoStep2Btn = document.getElementById('goto-step2-btn');
    const gotoStep3Btn = document.getElementById('goto-step3-btn');
    const gotoStep4Btn = document.getElementById('goto-step4-btn');
    const gotoStep5Btn = document.getElementById('goto-step5-btn');
    const gotoStep6Btn = document.getElementById('goto-step6-btn');
    const sendReportBtn = document.getElementById('send-report-btn');

    // =================================================================
    // === ETAPA 1: SELEÇÃO DE VALORES =================================
    // =================================================================
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
        selectionCountEl.textContent = count;
        gotoStep2Btn.disabled = count < MIN_SELECTION;
        gotoStep2Btn.textContent = count >= MIN_SELECTION ? `Continuar com ${count} valores` : 'Continuar para o Próximo Passo';
    }

    if (valuesContainer) {
        valuesContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('value-card')) {
                const card = e.target;
                const value = card.dataset.value;
                if (selectedValues.has(value)) {
                    selectedValues.delete(value);
                    card.classList.remove('selected');
                } else {
                    selectedValues.add(value);
                    card.classList.add('selected');
                }
                updateSelectionCount();
            }
        });
    }

    if (addValueBtn) {
        addValueBtn.addEventListener('click', () => {
            const newName = newValueInput.value.trim();
            if (newName && !allValues.some(v => v.name.toLowerCase() === newName.toLowerCase())) {
                const newValueObj = { name: newName, description: 'Valor adicionado por você.', scenario: 'Viver este valor que é unicamente seu.' };
                allValues.push(newValueObj);
                const card = createValueCard(newValueObj);
                valuesContainer.appendChild(card);
                newValueInput.value = '';
            }
        });
    }

    // =================================================================
    // === ETAPA 2: FILTRO TOP 5 (DRAG AND DROP) =======================
    // =================================================================
    function populateStep2() {
        selectedValuesPool.innerHTML = '<h3>Sua Lista de Valores</h3>';
        selectedValues.forEach(valueName => {
            const valueObj = allValues.find(v => v.name === valueName);
            const card = createValueCard(valueObj);
            card.classList.add('draggable');
            card.draggable = true;
            selectedValuesPool.appendChild(card);
        });
    }

    document.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('draggable')) {
            draggedItem = e.target;
            setTimeout(() => { e.target.style.display = 'none'; }, 0);
        }
    });

    document.addEventListener('dragend', () => {
        if (draggedItem) {
            draggedItem.style.display = 'block';
            draggedItem = null;
        }
    });

    document.addEventListener('dragover', (e) => { e.preventDefault(); });

    document.addEventListener('drop', (e) => {
        e.preventDefault();
        if (!draggedItem) return;
        const dropZoneTarget = e.target.closest('.drop-zone');
        const poolTarget = e.target.closest('#selected-values-pool');
        draggedItem.style.display = 'block';
        if (dropZoneTarget) {
            if (dropZoneTarget.firstElementChild) {
                selectedValuesPool.appendChild(dropZoneTarget.firstElementChild);
            }
            dropZoneTarget.appendChild(draggedItem);
        } else if (poolTarget) {
            poolTarget.appendChild(draggedItem);
        }
        draggedItem = null;
        checkTop5Completion();
    });

    function checkTop5Completion() {
        const dropZones = document.querySelectorAll('#top-5-list .drop-zone');
        let count = 0;
        dropZones.forEach(zone => {
            if (zone.firstElementChild) { count++; }
        });
        gotoStep3Btn.disabled = count !== 5;
    }

    // =================================================================
    // === ETAPA 3: DEFINIÇÃO PESSOAL ==================================
    // =================================================================
    function populateStep3() {
        const container = document.getElementById('definitions-container');
        container.innerHTML = '';
        userResponses.top5Essenciais.forEach(valueName => {
            const group = document.createElement('div');
            group.className = 'definition-group';
            group.innerHTML = `<label for="def-${valueName}">${valueName}</label><textarea id="def-${valueName}" data-value="${valueName}" rows="2" placeholder="Para mim, ${valueName.toLowerCase()} significa..."></textarea>`;
            container.appendChild(group);
        });
        container.addEventListener('input', () => {
            const textareas = document.querySelectorAll('#definitions-container textarea');
            const allFilled = Array.from(textareas).every(t => t.value.trim() !== '');
            gotoStep4Btn.disabled = !allFilled;
        });
    }

    // =================================================================
    // === ETAPA 4: LUZ E SOMBRA (NOVA) ================================
    // =================================================================
    // Em valores/script.js, SUBSTITUA a função populateStep4

    function populateStep4() {
        const container = document.getElementById('duality-container');
        container.innerHTML = '';
        userResponses.top5Essenciais.forEach((valueName, index) => {
            const group = document.createElement('div');
            group.className = 'duality-group';
            
            // A mágica está aqui: novo HTML com layout vertical e perguntas específicas
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
            container.appendChild(group);
        });

        // A lógica de validação continua a mesma
        container.addEventListener('input', () => {
            const textareas = document.querySelectorAll('#duality-container textarea');
            const allFilled = Array.from(textareas).every(t => t.value.trim() !== '');
            gotoStep5Btn.disabled = !allFilled;
        });
    }

    // =================================================================
    // === ETAPA 5: CONFRONTO DE PARES =================================
    // =================================================================
    let confrontationPairs = [];
    let currentPairIndex = 0;
    let scores = {};

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

        if (currentPairIndex >= confrontationPairs.length) {
            counter.textContent = 'Confronto finalizado!';
            confrontationBox.style.display = 'none';
            gotoStep6Btn.disabled = false;
            return;
        }
        
        confrontationBox.style.display = 'flex';
        counter.textContent = `Escolha ${currentPairIndex + 1} de ${confrontationPairs.length}`;
        
        const [valueNameA, valueNameB] = confrontationPairs[currentPairIndex];
        
        const valueA = allValues.find(v => v.name === valueNameA);
        const valueB = allValues.find(v => v.name === valueNameB);

        btnA.innerHTML = `${valueA.name}<span class="scenario">"${valueA.scenario}"</span>`;
        btnB.innerHTML = `${valueB.name}<span class="scenario">"${valueB.scenario}"</span>`;

        btnA.dataset.value = valueA.name;
        btnB.dataset.value = valueB.name;
    }

    document.querySelector('.confrontation-box').addEventListener('click', (e) => {
        const clickedButton = e.target.closest('button');
        if (clickedButton && clickedButton.closest('.confrontation-box')) {
            const chosenValue = clickedButton.dataset.value;
            scores[chosenValue]++;
            currentPairIndex++;
            displayNextPair();
        }
    });

    // =================================================================
    // === ETAPA 6: RESULTADO E CAPTURA ================================
    // =================================================================
    function calculateFinalResult() {
        const sortedValues = Object.entries(scores).sort(([, a], [, b]) => b - a);
        userResponses.resultadoFinal = sortedValues.map(item => item[0]);
        const diagnosisReport = document.getElementById('diagnosis-report');
        diagnosisReport.innerHTML = `
            <p>Seu valor fundamental, com base nas suas escolhas, é <strong>${userResponses.resultadoFinal[0]}</strong>.</p>
            <p>Sua hierarquia de valores neste momento é:</p>
            <ol>
                ${userResponses.resultadoFinal.map(v => `<li><strong>${v}</strong></li>`).join('')}
            </ol>
            <p>Lembrando que esta é uma fotografia do seu momento atual. Viver alinhado a essa hierarquia pode trazer mais clareza e propósito para suas decisões.</p>
        `;
    }

    if (sendReportBtn) {
        sendReportBtn.addEventListener('click', () => {
            const name = document.getElementById('user-name').value;
            const email = document.getElementById('user-email').value;
            if (!name || !email) {
                alert('Por favor, preencha seu nome e e-mail para continuar.');
                return;
            }
            userResponses.nome = name;
            userResponses.email = email;
            userResponses.whatsapp = document.getElementById('user-whatsapp').value;
            const progressOverlay = document.querySelector('#footer-placeholder .modal-overlay');
            if (progressOverlay) progressOverlay.style.display = 'flex';
            sendReportBtn.disabled = true;
            const webAppUrl = 'https://script.google.com/macros/s/AKfycbysIFVX-92bgdD8XyWwoWxU0xzGrmTfdmkzfLdTr_OZEuOI33kDaJvxMEYP-jFBz3c/exec';
            
            console.log('Enviando dados para a API:', JSON.stringify(userResponses, null, 2));
            fetch(webAppUrl, {
                method: 'POST',
                mode: 'no-cors', // Importante para evitar erros de CORS com o Apps Script
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userResponses)
            })
            .then(() => {
                // O fetch no-cors não nos dá uma resposta detalhada, mas se não deu erro, assumimos sucesso.
                console.log('Dados enviados com sucesso (aparente).');
                const successModal = document.querySelector('#footer-placeholder #success-modal');
                if (progressOverlay) progressOverlay.style.display = 'none';
                if (successModal) successModal.style.display = 'flex';
                const successOkBtn = document.querySelector('#footer-placeholder #success-ok-btn');
                if (successOkBtn) {
                    successOkBtn.onclick = () => location.reload();
                }
            })
            .catch(error => {
                console.error('Erro ao enviar os dados:', error);
                if (progressOverlay) progressOverlay.style.display = 'none';
                alert('Ocorreu um erro ao enviar seu relatório. Por favor, tente novamente.');
                sendReportBtn.disabled = false;
            });

        });
    }

    // =================================================================
    // === NAVEGAÇÃO ENTRE ETAPAS ======================================
    // =================================================================
    function navigateToStep(stepNumber) {
        document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
        document.getElementById(`step${stepNumber}`).classList.add('active');
        window.scrollTo(0, 0);
    }

    if (gotoStep2Btn) {
        gotoStep2Btn.addEventListener('click', () => {
            userResponses.valoresSelecionados = Array.from(selectedValues);
            navigateToStep(2);
            populateStep2();
        });
    }
    if (gotoStep3Btn) {
        gotoStep3Btn.addEventListener('click', () => {
            const top5Values = [];
            document.querySelectorAll('#top-5-list .drop-zone').forEach(zone => {
                if (zone.firstElementChild) {
                    top5Values.push(zone.firstElementChild.dataset.value);
                }
            });
            userResponses.top5Essenciais = top5Values;
            navigateToStep(3);
            populateStep3();
        });
    }
    if (gotoStep4Btn) {
        gotoStep4Btn.addEventListener('click', () => {
            userResponses.definicoes = {};
            document.querySelectorAll('#definitions-container textarea').forEach(textarea => {
                userResponses.definicoes[textarea.dataset.value] = textarea.value;
            });
            navigateToStep(4);
            populateStep4();
        });
    }
    if (gotoStep5Btn) {
        gotoStep5Btn.addEventListener('click', () => {
            userResponses.dualidade = {};
            let allFilled = true;
            document.querySelectorAll('#duality-container textarea').forEach(textarea => {
                if (textarea.value.trim() === '') allFilled = false;
                const value = textarea.dataset.value;
                const type = textarea.dataset.type;
                if (!userResponses.dualidade[value]) userResponses.dualidade[value] = {};
                userResponses.dualidade[value][type] = textarea.value;
            });
            if (!allFilled) {
                alert('Por favor, preencha todos os campos de Motivador e Sabotador para continuar.');
                return;
            }
            navigateToStep(5);
            startConfrontation();
        });
    }
    if (gotoStep6Btn) {
        gotoStep6Btn.addEventListener('click', () => {
            calculateFinalResult();
            navigateToStep(6);
        });
    }

    // --- CHAMADA INICIAL ---
    renderAllValues();
});
