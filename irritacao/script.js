document.addEventListener('DOMContentLoaded', () => {
    // =================================================================
    // === 1. DEFINIÇÕES E RENDERIZAÇÃO INICIAL                      ===
    // =================================================================
    const sliderLegends = { 0: "🧘 Nunca ou quase nunca", 1: "🤔 Raramente", 2: "😠 Às vezes", 3: "🗣️ Frequentemente", 4: "🔥 Sempre ou quase sempre" };
    
    // CORREÇÃO: A LISTA DE PERGUNTAS ESTAVA VAZIA. AGORA ESTÁ PREENCHIDA.
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
    
    let userResponses = {}; // Objeto global para armazenar todas as respostas

    const questionsContainer = document.getElementById('questions-list');
    if (questionsContainer) {
        questions.forEach((q, index) => {
            const card = document.createElement('div');
            card.className = 'question-card';
            card.innerHTML = `
                <p><b>${index + 1}.</b> ${q.text}</p>
                <div class="slider-group" data-question-id="${q.id}"><label>Nível de Incomodo</label><input type="range" min="0" max="4" value="0" class="irritation-slider"><span class="slider-value">0</span></div>
                <div class="legend-container"><span class="slider-legend">${sliderLegends[0]}</span></div>
            `;
            questionsContainer.appendChild(card);
        });
    }

    // Listeners para os sliders
    document.body.addEventListener('input', (e) => {
        if (e.target.classList.contains('irritation-slider')) {
            const slider = e.target;
            slider.nextElementSibling.textContent = slider.value;
            slider.closest('.question-card').querySelector('.slider-legend').textContent = sliderLegends[slider.value];
        }
        if (e.target.classList.contains('reflection-slider')) {
            e.target.nextElementSibling.textContent = e.target.value;
        }
    });

    // =================================================================
    // === 2. LÓGICA DE NAVEGAÇÃO E COLETA DE DADOS                 ===
    // =================================================================

    // --- Botão da Etapa 1 para a Etapa 2 ---
    const gotoStep2Btn = document.getElementById('goto-step2-btn');
    if (gotoStep2Btn) {
        gotoStep2Btn.addEventListener('click', () => {
            userResponses.respostas = {};
            questions.forEach(q => {
                const slider = document.querySelector(`.slider-group[data-question-id="${q.id}"] .irritation-slider`);
                userResponses.respostas[q.id] = parseInt(slider.value, 10);
            });
            
            document.getElementById('step1').classList.remove('active');
            document.getElementById('step2').classList.add('active');
            window.scrollTo(0, 0);
        });
    }

    // --- Botão da Etapa 2 para a Etapa 3 ---
    const gotoStep3Btn = document.getElementById('goto-step3-btn');
    if (gotoStep3Btn) {
        gotoStep3Btn.addEventListener('click', () => {
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

            const scores = {
                injustica: userResponses.respostas.q1 + userResponses.respostas.q5 + userResponses.respostas.q11,
                frustracao: userResponses.respostas.q2 + userResponses.respostas.q6 + userResponses.respostas.q9,
                cansaco: userResponses.respostas.q3 + userResponses.respostas.q7 + userResponses.respostas.q12,
                medo: userResponses.respostas.q4 + userResponses.respostas.q8 + userResponses.respostas.q10
            };
            scores.total = scores.injustica + scores.frustracao + scores.cansaco + scores.medo;
            const sortedScores = Object.entries(scores).filter(([key]) => key !== 'total').sort(([, a], [, b]) => b - a);
            const topGatilho = sortedScores[0][0];
            const topScore = sortedScores[0][1];
            const scoreClass = (score) => (score >= 9 ? 'Alto' : (score >= 5 ? 'Moderado' : 'Baixo'));

            const diagnosisReport = document.getElementById('diagnosis-report');
            if(diagnosisReport) {
                diagnosisReport.innerHTML = `
                    <p>Seu gatilho dominante parece ser o de <strong>${topGatilho.charAt(0).toUpperCase() + topGatilho.slice(1)}</strong>, com uma pontuação de <strong>${topScore}</strong> (Nível ${scoreClass(topScore)}).</p>
                    <p>Sua reatividade geral está em <strong>${scores.total}</strong> de 48.</p>
                `;
            }

            document.getElementById('step2').classList.remove('active');
            document.getElementById('step3').classList.add('active');
            window.scrollTo(0, 0);
        });
    }

    // --- Lógica da Etapa 3 (Checkbox e Botão de Envio) ---
    const wantsGiftCheckbox = document.getElementById('wants-gift');
    const sendReportBtn = document.getElementById('send-report-btn');

    if (wantsGiftCheckbox && sendReportBtn) {
        wantsGiftCheckbox.addEventListener('change', () => {
            if (wantsGiftCheckbox.checked) {
                sendReportBtn.textContent = 'Quero Receber Meu Relatório + Presente';
            } else {
                sendReportBtn.textContent = 'Quero Receber Meu Relatório';
            }
        });

        sendReportBtn.addEventListener('click', () => {
            const name = document.getElementById('user-name').value;
            const email = document.getElementById('user-email').value;
            if (!name || !email) {
                alert('Por favor, preencha seu nome e e-mail, que são campos obrigatórios.');
                return;
            }

            userResponses.nome = name;
            userResponses.email = email;
            userResponses.whatsapp = document.getElementById('user-whatsapp').value;
            userResponses.querBrinde = wantsGiftCheckbox.checked;

            // Dispara o evento para mostrar o modal de progresso.
            document.dispatchEvent(new CustomEvent('showProgress'));
            sendReportBtn.disabled = true;

            const webAppUrl = 'https://script.google.com/macros/s/AKfycby5iSP4Z9Q15vD9b-xGiKsUddWdaU4vvJlmfszpogzmijtW9aTpiB9j-_6GC7lQjeY0/exec'; // << NÃO ESQUEÇA DE COLOCAR A URL CORRETA AQUI

            fetch(webAppUrl, {
                method: 'POST',
                body: JSON.stringify(userResponses),
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8', // Necessário para o Apps Script
                },
            })
            .then(response => response.json()) // Converte a resposta do servidor para JSON
            .then(result => {
                // **NOVA LÓGICA PARA TRATAR A RESPOSTA**
                if (result.status === 'success') {
                    // Se deu tudo certo, mostra o modal de sucesso.
                    document.dispatchEvent(new CustomEvent('showSuccess'));
                } else if (result.status === 'duplicate') {
                    // Se o e-mail é duplicado, esconde o progresso e mostra um alerta.
                    document.getElementById('progress-overlay').style.display = 'none';
                    alert('Este e-mail já foi cadastrado. Por favor, verifique sua caixa de entrada ou utilize outro e-mail.');
                    sendReportBtn.disabled = false; // Reabilita o botão
                } else {
                    // Se ocorreu qualquer outro erro no servidor.
                    throw new Error(result.message || 'Erro desconhecido no servidor.');
                }
            })
            .catch(error => {
                console.error('Erro de rede ou de processamento:', error);
                document.getElementById('progress-overlay').style.display = 'none';
                alert('Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.');
                sendReportBtn.disabled = false;
                wantsGiftCheckbox.dispatchEvent(new Event('change'));
            });
        });
    }    
});
