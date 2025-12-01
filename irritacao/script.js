// irritacao/script.js - Versão Final que se comunica com o main.js

// Ouve o evento 'componentsLoaded' que o seu main.js dispara.
// Todo o nosso código só roda DEPOIS que o header e o footer (com os modais) estão prontos.
document.addEventListener('componentsLoaded', () => {
    
    // Definições e Renderização das Perguntas
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
    const questionsContainer = document.getElementById('questions-list');
    if (questionsContainer) {
        questions.forEach((q, index) => {
            const card = document.createElement('div');
            card.className = 'question-card';

            card.innerHTML = `
                <p class="question-text"><b>${index + 1}.</b> ${q.text}</p>
                
                <div class="slider-container" data-question-id="${q.id}">
                    <input type="range" min="0" max="4" value="0" class="irritation-slider">
                    <div class="slider-feedback">
                        Nível de Incômodo: <span class="slider-value">0</span> </br><span class="slider-legend">${sliderLegends[0]}</span>
                    </div>
                </div>
            `;
            questionsContainer.appendChild(card);
        });
    }

    // Delegação de Eventos para todos os cliques na página
    document.body.addEventListener('click', (e) => {
        const target = e.target;

        // Navegação da Etapa 1 para a 2
        if (target.id === 'goto-step2-btn') {
            userResponses.respostas = {};
            questions.forEach(q => {
                const slider = document.querySelector(`.slider-container[data-question-id="${q.id}"] .irritation-slider`);
                userResponses.respostas[q.id] = parseInt(slider.value, 10);
            });
            document.getElementById('step1').classList.remove('active');
            document.getElementById('step2').classList.add('active');
            window.scrollTo(0, 0);
        }

        // Navegação da Etapa 2 para a 3
        if (target.id === 'goto-step3-btn') {
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
            if(diagnosisReport) {
                diagnosisReport.innerHTML = `<p>Seu gatilho dominante parece ser o de <strong>${topGatilho}</strong>, com uma pontuação de <strong>${topScore}</strong> (Nível ${scoreClass(topScore)}).</p><p>Sua reatividade geral está em <strong>${total}</strong> de 48.</p>`;
            }
            document.getElementById('step2').classList.remove('active');
            document.getElementById('step3').classList.add('active');
            window.scrollTo(0, 0);
        }

        // Envio Final na Etapa 3
        if (target.id === 'send-report-btn') {
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
            
            // =================================================================
            // === A MUDANÇA FINAL: PEDINDO AO main.js PARA MOSTRAR O MODAL ===
            // =================================================================
            document.dispatchEvent(new CustomEvent('showProgress'));

            // ATENÇÃO: Confirme que esta URL é a sua URL de implantação mais recente!
            const webAppUrl = 'https://script.google.com/macros/s/AKfycbyZ3-z22JopJar4BWi7iSzAruNBVX-sZTJSaihfK2OGyCuorHgF-3SjdVU40fPitdRU/exec';

            // =================================================================
            // === BLOCO DE ENVIO SIMPLES E ROBUSTO ('no-cors') ==============
            // =================================================================
            // Pede para o main.js mostrar o modal de progresso
            document.dispatchEvent(new CustomEvent('showProgress'));

            fetch(webAppUrl, {
                method: 'POST',
                mode: 'no-cors', // A única forma que o Google não bloqueia
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userResponses)
            })
            .then(() => {
                // Com 'no-cors', SEMPRE caímos aqui. Assumimos sucesso.
                // Pede para o main.js mostrar o modal de sucesso.
                document.dispatchEvent(new CustomEvent('showSuccess'));
            })
            .catch(error => {
                // Este bloco só será acionado se houver um erro de rede (ex: sem internet)
                console.error('Falha de rede na requisição:', error);
                
                // Esconde o progresso e mostra um alerta de erro genérico
                const progressOverlay = document.querySelector('#footer-placeholder #progress-overlay');
                if (progressOverlay) progressOverlay.style.display = 'none';
                alert('Ocorreu um erro de conexão. Verifique sua internet e tente novamente.');
            });
        }
    });

    // Outros listeners que não dependem de clique
    const wantsGiftCheckbox = document.getElementById('wants-gift');
    if (wantsGiftCheckbox) {
        wantsGiftCheckbox.addEventListener('change', () => {
            const sendReportBtn = document.getElementById('send-report-btn');
            if (sendReportBtn) {
                sendReportBtn.textContent = wantsGiftCheckbox.checked ? 'Quero Receber Meu Relatório + Presente' : 'Quero Receber Meu Relatório';
            }
        });
    }
    document.body.addEventListener('input', (e) => {
        if (e.target.classList.contains('irritation-slider')) {
            const slider = e.target;
            const value = slider.value;
            
            // =======================================================
            // === A CORREÇÃO ESTÁ AQUI ===============================
            // =======================================================
            // Encontra o contêiner de feedback que está DENTRO do mesmo slider-container
            const feedbackContainer = slider.closest('.slider-container').querySelector('.slider-feedback');
            
            if (feedbackContainer) {
                // Encontra os spans específicos dentro do contêiner de feedback
                const valueSpan = feedbackContainer.querySelector('.slider-value');
                const legendSpan = feedbackContainer.querySelector('.slider-legend');

                // Atualiza o conteúdo de cada um
                if (valueSpan) valueSpan.textContent = value;
                if (legendSpan) legendSpan.innerHTML = sliderLegends[value]; // Usamos innerHTML para renderizar o emoji
            }
            // =======================================================
            // === FIM DA CORREÇÃO ===================================
            // =======================================================
        }
        if (e.target.classList.contains('reflection-slider')) {
            e.target.nextElementSibling.textContent = e.target.value;
        }
    });
});
