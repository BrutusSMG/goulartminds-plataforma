// pages/resultado-esperado/index.js

import { useEffect } from "react";
import Head from "next/head";
import Modals from "../../components/Modals";
import { useAuthProtection, AccessDenied } from "../../components/AuthGuard";
import { useSmartAuth } from "../../hooks/useSmartAuth";
import styles from "../../styles/resultado-esperado.module.css";
import { completeTool } from "../../lib/tools";
import PageLayout from "@/componentes/PageLayout";

export default function FerramentaResultadoEsperado() {
    // 1. Verifica o estado de autenticação do usuário
    const { status, hasAccess, user } = useSmartAuth("resultado-esperado");

    useEffect(() => {
        // Só executa o script se o usuário estiver autenticado e tiver acesso
        if (status === "authenticated" && hasAccess) {
            // Função principal que encapsula toda a lógica da ferramenta
            function inicializarFerramenta() {
                // --- BLOCO 1: VARIÁVEIS DE NAVEGAÇÃO E ESTADO ---
                const steps = document.querySelectorAll(`.${styles.step}`);
                if (steps.length === 0) {
                    console.error("Nenhuma etapa (.step) foi encontrada.");
                    return;
                }
                let currentStep = 0;
                const userAnswers = {};

                // --- BLOCO 2: VARIÁVEIS DA ETAPA 1 (ASSISTENTE SMART) ---
                const explorationContainer = document.getElementById(
                    "exploration-container"
                );
                const btnStartSmart = document.getElementById("btn-start-smart");
                const smartConversationContainer = document.getElementById(
                    "smart-conversation-container"
                );
                const reviewContainer = document.getElementById("review-container");
                const reviewSummaryText = document.getElementById(
                    "review-summary-text"
                );
                const btnEditSmart = document.getElementById("btn-edit-smart");
                const recapExplorationText = document.getElementById(
                    "recap-exploration-text"
                );
                const smartHistoryContainer = document.getElementById(
                    "smart-history-container"
                );
                const smartLabel = document.getElementById("smart-label");
                const smartInput = document.getElementById("smart-input");
                const dateInputsContainer = document.getElementById(
                    "date-inputs-container"
                );
                const smartDateInputStart = document.getElementById(
                    "smart-date-input-start"
                );
                const smartDateInputEnd = document.getElementById(
                    "smart-date-input-end"
                );
                const nextSmartButton = document.getElementById("btn-next-smart");
                const prevSmartButton = document.getElementById("btn-prev-smart");
                const smartSummaryBox = document.getElementById("smart-summary");
                const smartSummaryText = document.getElementById("smart-summary-text");
                const smartLabelWrapper = document.querySelector(
                    "#active-question-container .label-wrapper"
                );
                let smartState = 0;
                let isSmartObjectiveDefined = false;
                const smartQuestions = [
                    {
                        label: "Para começar, qual é o seu grande objetivo ou sonho?",
                        key: "initial",
                        title: "Seu Ponto de Partida",
                        help: "Seja o mais sincero(a) possível. Exemplo popular: 'Quero ganhar mais dinheiro'.",
                    },
                    {
                        label:
                            "Ótimo. Agora, vamos <strong>aprofundar</strong> seu objetivo para torná-lo concreto e claro. O que, exatamente, você pretende alcançar? Quem são as pessoas envolvidas? Onde isso acontecerá?",
                        key: "specific",
                        title: "Aprofundando o Objetivo",
                        help: "Um objetivo claro é fácil de explicar. Exemplo: Em vez de 'ganhar mais dinheiro', poderia ser 'ser promovido a gerente de projetos na minha empresa atual para aumentar meu salário'.",
                    },
                    {
                        label:
                            "Excelente. Para tornar seu objetivo <strong>palpável</strong>, o que precisa acontecer para você dizer 'Eu consegui!'? Qual número, métrica ou fato observável comprovará seu sucesso?",
                        key: "measurable",
                        title: "Tornando o Objetivo Palpável",
                        help: "O que pode ser medido, pode ser gerenciado. Exemplo: 'Receber um aumento salarial de 20% no meu holerite'.",
                    },
                    {
                        label:
                            "Perfeito. Para que seu objetivo seja <strong>acessível</strong>, olhe para a sua situação atual. O que você já tem em mãos (habilidades, contatos, recursos) que pode te ajudar a chegar mais perto dessa conquista?",
                        key: "achievable",
                        title: "Tornando o Objetivo Acessível",
                        help: "Isso conecta seu sonho à sua realidade. Exemplo: 'Eu já concluí dois cursos de gestão de projetos e tenho um bom relacionamento com meu chefe, o que torna a promoção uma possibilidade real'.",
                    },
                    {
                        label:
                            "Estamos quase lá. Para garantir que seu objetivo seja <strong>realista</strong> e motivador, quais são os benefícios diretos que você terá ao concretizá-lo? Por que isso é tão importante para você?",
                        key: "relevant",
                        title: "Tornando o Objetivo Realista",
                        help: "Essa é a sua verdadeira recompensa. Exemplo: 'Com o aumento de 20%, poderei finalmente quitar minhas dívidas e começar a investir no futuro da minha família'.",
                    },
                    {
                        label:
                            "Para tornar o início <strong>concreto</strong>, qual é a data para começar a agir e qual é a sua linha de chegada?",
                        key: "temporal",
                        title: "Tornando o Início Concreto",
                        type: "date",
                        help: "Um plano precisa de um ponto de partida e uma linha de chegada. Exemplo: 'Vou começar na próxima segunda-feira e meu objetivo é alcançar a promoção até o final deste semestre'.",
                    },
                    {
                        label:
                            "Excelente trabalho! Você transformou um desejo em um plano. Com base em todo o seu histórico, reformule seu objetivo em uma frase final poderosa e inspiradora.",
                        key: "final",
                        title: "Seu Objetivo Final",
                        type: "final",
                    },
                ];

                // --- BLOCO 3: VARIÁVEIS DA ETAPA 2 (FOTOGRAFIA DO SUCESSO) ---
                const photoAssistantContainer = document.getElementById(
                    "photo-assistant-container"
                );
                const photoLabel = document.getElementById("photo-label");
                const photoInput = document.getElementById("photo-input");
                const nextPhotoButton = document.getElementById("btn-next-photo");
                const prevPhotoButton = document.getElementById("btn-prev-photo");
                const photoSummaryBox = document.getElementById("photo-summary");
                const photoSummaryText = document.getElementById("photo-summary-text");
                const editPhotoButton = document.getElementById("btn-edit-photo");
                const recapObjetivoStep2 = document.getElementById(
                    "recap-objetivo-step2"
                );
                const photoDraftSummaryBox = document.getElementById(
                    "photo-draft-summary"
                );
                const photoDraftSummaryText = document.getElementById(
                    "photo-draft-summary-text"
                );
                const photoLabelWrapper = document.querySelector(
                    "#photo-assistant-container .label-wrapper"
                );
                let photoState = 0;
                let isPhotoDefined = false;
                const photoQuestions = [
                    {
                        label:
                            "Vamos planejar sua cena de sucesso. Qual <strong>seria</strong> o <strong>lugar</strong> ideal para você estar? Seria um local conhecido ou novo? Como ele <strong>seria</strong> (espaçoso, luxuoso, simples)?",
                        key: "lugar",
                        title: "O Lugar Ideal",
                        help: "Pense em um local que simbolize sua vitória. Exemplo: '<strong>Seria</strong> na minha nova sala de gerente, que <strong>seria</strong> maior e com uma janela grande com vista para a cidade.'",
                    },
                    {
                        label:
                            "Ótimo. E nesse cenário, quem você <strong>gostaria</strong> de ver? Como as pessoas <strong>estariam</strong> vestidas? Como <strong>seria</strong> a decoração e a iluminação do ambiente?",
                        key: "visao",
                        title: "As Pessoas e o Cenário",
                        help: "Pinte um quadro com palavras. Exemplo: 'Eu <strong>gostaria</strong> de ver meu parceiro(a) sorrindo para mim. A iluminação <strong>seria</strong> natural, vindo da janela.'",
                    },
                    {
                        label:
                            "Excelente. E o que você <strong>gostaria</strong> de ouvir? Seriam palavras específicas de reconhecimento? Alguma música estaria tocando?",
                        key: "audicao",
                        title: "Os Sons da Conquista",
                        help: "Os sons ancoram a memória. Exemplo: 'Eu <strong>gostaria</strong> de ouvir meu chefe dizendo: 'Nós confiamos em você'. E depois, o som da notificação do banco com o novo salário.'",
                    },
                    {
                        label:
                            "Perfeito. Diante de todo esse cenário planejado, como você <strong>gostaria de se sentir</strong>? Qual emoção você buscaria ao viver essa cena?",
                        key: "emocao",
                        title: "A Sensação Desejada",
                        help: "Conecte a conquista a um sentimento. Exemplo: 'Eu <strong>gostaria</strong> de sentir um profundo alívio e orgulho, e a segurança de poder proporcionar um futuro melhor para minha família.'",
                    },
                    {
                        label:
                            "Maravilha! Você planejou todos os elementos. Com base no rascunho da sua cena ideal, descreva agora, de forma organizada, como seria essa 'Fotografia do Sucesso'.",
                        key: "photo_final",
                        title: "Sua Fotografia do Sucesso",
                        type: "final",
                    },
                ];

                // =================================================================
                // === 2. DEFINIÇÃO DAS FUNÇÕES PRINCIPAIS =========================
                // =================================================================

                // --- Funções de Navegação Geral ---
                function showStep(stepIndex) {
                    // Primeiro, esconde TODAS as etapas
                    steps.forEach((step) => {
                        step.classList.remove(styles.active); // Usando a classe do CSS Module
                    });

                    // Depois, mostra APENAS a etapa desejada
                    if (steps[stepIndex]) {
                        steps[stepIndex].classList.add(styles.active); // Usando a classe do CSS Module
                    } else {
                        console.error(`A etapa com o índice ${stepIndex} não foi encontrada.`);
                        return; // Para a execução se a etapa não existir
                    }

                    // Executa as funções de configuração específicas para a etapa que está sendo mostrada
                    if (stepIndex === 1) setupStep1();
                    if (stepIndex === 2) setupStep2();
                    if (stepIndex === 4) setupStep4();

                    // Atualiza o estado e rola a tela para o topo
                    currentStep = stepIndex;
                    window.scrollTo(0, 0);
                }

                // --- Funções da Etapa 1: Assistente SMART ---
                function setupStep1() {
                    if (isSmartObjectiveDefined) {
                        explorationContainer.classList.add(`${styles.hidden}`);
                        smartConversationContainer.classList.add(`${styles.hidden}`);
                        reviewContainer.classList.remove(`${styles.hidden}`);
                        reviewSummaryText.textContent = userAnswers["final"];
                    } else {
                        explorationContainer.classList.remove(`${styles.hidden}`);
                        smartConversationContainer.classList.add(`${styles.hidden}`);
                        reviewContainer.classList.add(`${styles.hidden}`);
                    }
                }

                function startSmartAssistant() {
                    smartState = 0;
                    explorationContainer.classList.add(`${styles.hidden}`);
                    reviewContainer.classList.add(`${styles.hidden}`);
                    smartConversationContainer.classList.remove(`${styles.hidden}`);
                    updateSmartQuestion();
                }

                // Substitua a função updateSmartQuestion inteira por esta versão

function updateSmartQuestion() {
    console.log("Executando updateSmartQuestion para o estado:", smartState);

    // Reseta a UI para um estado limpo
    if (smartInput) smartInput.classList.add(styles.hidden);
    if (dateInputsContainer) dateInputsContainer.classList.add(styles.hidden);
    if (smartSummaryBox) smartSummaryBox.classList.add(styles.hidden);
    if (smartHistoryContainer) smartHistoryContainer.innerHTML = "";

    const currentQuestion = smartQuestions[smartState];
    if (!currentQuestion) {
        console.error("Estado do assistente SMART inválido:", smartState);
        return;
    }

    if (smartLabel) smartLabel.innerHTML = currentQuestion.label;
    if (prevSmartButton) prevSmartButton.classList.toggle(styles.hidden, smartState === 0);

    // Limpa e adiciona a dica de ajuda
    if (smartLabelWrapper) {
        const oldTip = smartLabelWrapper.querySelector('.help-tip');
        if (oldTip) oldTip.remove();
        if (currentQuestion.help) {
            const templateContainer = document.getElementById('help-tip-template');
            if (templateContainer && templateContainer.firstElementChild) {
                const template = templateContainer.firstElementChild.cloneNode(true);
                template.dataset.tooltip = currentQuestion.help;
                smartLabelWrapper.appendChild(template);
            }
        }
    }

    // =======================================================
    // ===            ✨ LÓGICA DE VISIBILIDADE CORRIGIDA ✨ ===
    // =======================================================
    // Garante que o container principal do assistente esteja visível
    if (smartConversationContainer) {
        smartConversationContainer.classList.remove(styles.hidden);
    }

    if (currentQuestion.type === "final") {
        console.log("Entrou no modo FINAL. Mostrando resumo e textarea.");
        
        // 1. Mostra o rascunho
        buildDraftSummary(); // Esta função já remove a classe 'hidden' do smartSummaryBox

        // 2. Mostra o campo de textarea
        if (smartInput) {
            smartInput.classList.remove(styles.hidden);
            smartInput.value = userAnswers[currentQuestion.key] || '';
            smartInput.placeholder = "Com base no rascunho acima, escreva seu objetivo final aqui...";
        } else {
            console.error("Elemento 'smartInput' não encontrado!");
        }

        // 3. Esconde o histórico para dar foco
        if (smartHistoryContainer) smartHistoryContainer.classList.add(styles.hidden);

        // 4. Atualiza o botão
        if (nextSmartButton) nextSmartButton.textContent = "Concluir Objetivo";

    } else { // Lógica para as perguntas normais
        console.log("Entrou no modo de pergunta normal.");

        // Mostra o histórico
        if (smartHistoryContainer) smartHistoryContainer.classList.remove(styles.hidden);
        // ... (seu loop 'for' para preencher o histórico) ...

        // Mostra o campo de input apropriado
        if (currentQuestion.type === "date") {
            if (dateInputsContainer) dateInputsContainer.classList.remove(styles.hidden);
            // ... (seu código para preencher os valores das datas) ...
        } else {
            if (smartInput) smartInput.classList.remove(styles.hidden);
            // ... (seu código para preencher o valor do textarea) ...
        }

        if (nextSmartButton) nextSmartButton.textContent = "Próximo";
    }
}


                function buildDraftSummary() {
                    const summaryTitle = document.getElementById("smart-summary-title");
                    summaryTitle.textContent = "Rascunho do seu Objetivo:";
                    const specific = userAnswers["specific"] || "...";
                    const measurable = userAnswers["measurable"] || "...";
                    const relevant = userAnswers["relevant"] || "...";
                    const startDate = userAnswers["temporal_start"]
                        ? new Date(
                            userAnswers["temporal_start"] + "T00:00:00"
                        ).toLocaleDateString("pt-BR")
                        : "...";
                    const endDate = userAnswers["temporal_end"]
                        ? new Date(
                            userAnswers["temporal_end"] + "T00:00:00"
                        ).toLocaleDateString("pt-BR")
                        : "...";
                    const draftSentence = `"A partir de <strong>${startDate}</strong>, eu vou <strong>${specific}</strong>, medido por <strong>${measurable}</strong>, com o objetivo de concluir até <strong>${endDate}</strong>. Isso é importante para mim porque <strong>${relevant}</strong>."`;
                    smartSummaryText.innerHTML = draftSentence;
                    smartSummaryBox.classList.remove(`${styles.hidden}`);
                }

                // --- Funções da Etapa 2: Fotografia do Sucesso ---
                function setupStep2() {
                    recapObjetivoStep2.textContent =
                        userAnswers["final"] ||
                        "Seu objetivo ainda não foi definido na Etapa 1.";
                    if (isPhotoDefined) {
                        showPhotoReviewMode();
                    } else {
                        startPhotoAssistant();
                    }
                }

                function startPhotoAssistant() {
                    photoState = 0;
                    isPhotoDefined = false;
                    photoAssistantContainer.classList.remove(`${styles.hidden}`);
                    photoSummaryBox.classList.add("hidden");
                    updatePhotoQuestion();
                }

                function buildPhotoDraftSummary() {
                    const lugar = userAnswers["lugar"] || "...";
                    const visao = userAnswers["visao"] || "...";
                    const audicao = userAnswers["audicao"] || "...";
                    const emocao = userAnswers["emocao"] || "...";
                    photoDraftSummaryText.innerHTML = `No ambiente que descrevi como "<strong>${lugar}</strong>", eu veria "<strong>${visao}</strong>". Ao mesmo tempo, eu ouviria "<strong>${audicao}</strong>" e a sensação principal seria de "<strong>${emocao}</strong>".`;
                    photoDraftSummaryBox.classList.remove(`${styles.hidden}`);
                }

                function updatePhotoQuestion() {
                    photoInput.value = "";
                    const currentQuestion = photoQuestions[photoState];
                    photoLabel.innerHTML = currentQuestion.label;
                    photoInput.defaultValue = userAnswers[currentQuestion.key] || "";
                    photoInput.placeholder = "Descreva em detalhes...";
                    prevPhotoButton.classList.toggle(
                        `${styles.hidden}`,
                        photoState === 0
                    );
                    photoDraftSummaryBox.classList.add(`${styles.hidden}`);

                    const oldTip = photoLabelWrapper.querySelector(
                        `.${styles["help-tip"]}`
                    );
                    if (oldTip) oldTip.remove();
                    if (currentQuestion.help) {
                        const template = document.getElementById("help-tip-template").firstElementChild.cloneNode(true);
                        template.dataset.tooltip = currentQuestion.help;
                        photoLabelWrapper.appendChild(template);
                    }

                    if (currentQuestion.type === "final") {
                        nextPhotoButton.textContent = "Concluir";
                        buildPhotoDraftSummary();
                    } else {
                        nextPhotoButton.textContent = "Próximo";
                    }
                }

                function showPhotoReviewMode() {
                    photoAssistantContainer.classList.add(`${styles.hidden}`);
                    photoSummaryText.textContent = userAnswers["photo_final"];
                    photoSummaryBox.classList.remove(`${styles.hidden}`);
                }

                // --- Funções da Etapa 4: Compromisso ---
                function setupStep4() {
                    const recapMotivacao = document.getElementById(
                        "recap-motivacao-step4"
                    );
                    const recapAcessivel = document.getElementById(
                        "recap-acessivel-step4"
                    );

                    if (recapMotivacao) {
                        recapMotivacao.textContent =
                            userAnswers["relevant"] ||
                            "Seu benefício principal ainda não foi definido na Etapa 1.";
                    }
                    if (recapAcessivel) {
                        recapAcessivel.textContent =
                            userAnswers["achievable"] ||
                            "Seus recursos iniciais ainda não foram definidos na Etapa 1.";
                    }
                }

                function generateFinalSummary() {
                    const summaryContent = document.getElementById("summary-content");

                    userAnswers["responsabilidade_quem"] = document.getElementById(
                        "q-responsabilidade-quem"
                    ).value;
                    userAnswers["responsabilidade_percent"] = document.getElementById(
                        "slider-responsabilidade"
                    ).value;
                    userAnswers["responsabilidade_extra"] = document.getElementById(
                        "q-responsabilidade-extra"
                    ).value;
                    userAnswers["motivacao_final"] =
                        document.getElementById("q-motivacao").value;
                    userAnswers["tarefa_inicial"] =
                        document.getElementById("q-tarefa").value;

                    summaryContent.innerHTML = `
                        <h3>🧭 Minha Exploração Inicial</h3>
                        <p><strong>O que me trouxe aqui:</strong> ${userAnswers["expl_problema"] || "Não definido."}</p>
                        <p><strong>O que fará valer a pena:</strong> ${userAnswers["expl_ganho"] || "Não definido."}</p>
                        <p><strong>Nível de satisfação para indicar:</strong> ${userAnswers["expl_indicacao"] || "Não definido."}</p>
                        <h3>🎯 Meu Objetivo SMART</h3>
                        <p>${userAnswers["final"] || "Não definido."}</p>
                        <h3>📸 A Fotografia do Meu Sucesso</h3>
                        <p>${userAnswers["photo_final"] || "Não definida."}</p>
                        <h3>💪 Minha Responsabilidade</h3>
                        <p><strong>De quem é a responsabilidade:</strong> ${userAnswers["responsabilidade_quem"] || "Não definido."}</p>
                        <p><strong>Quanto depende de mim:</strong> ${userAnswers["responsabilidade_percent"] || "0" }%</p>
                        ${userAnswers["responsabilidade_percent"] < 100 && userAnswers["responsabilidade_extra"]
                            ? `<p><strong>Como aumentar minha responsabilidade:</strong> ${userAnswers["responsabilidade_extra"]}</p>`
                            : ""
                        }
                        <h3>🔥 Minha Motivação Profunda</h3>
                        <p>${userAnswers["motivacao_final"] || "Não definida."}</p>
                        <h3>🚀 Minha Próxima Tarefa</h3>
                        <p>${userAnswers["tarefa_inicial"] || "Não definida."}</p>
                    `;
                }

                // ===================================================================
                // SEÇÃO 3: EVENT LISTENERS
                // ===================================================================

                const eventHandler = async (e) => {
                    console.log("Clique detectado! Alvo:", e.target);

                    // <<< ✨ 3. LÓGICA DE CLIQUE CENTRALIZADA E ASÍNCRONA
                    const target = e.target;

                    // Lógica para o botão "Definir meu Objetivo"
                    if (target.id === "btn-start-smart") {
                        console.log("ENTROU no if 'btn-start-smart'!"); // Log de confirmação

                        // 1. Coleta as respostas
                        const problema = document.getElementById("q-expl-problema").value.trim();
                        const ganho = document.getElementById("q-expl-ganho").value.trim();
                        const indicacao = document.getElementById("q-expl-indicacao").value.trim();
                        
                        if (problema === "" || ganho === "" || indicacao === "") {
                            alert('Por favor, responda as três perguntas iniciais para continuarmos.');
                            return;
                        }

                        // Salva as respostas
                        userAnswers["expl_problema"] = problema;
                        userAnswers["expl_ganho"] = ganho;
                        userAnswers["expl_indicacao"] = indicacao;

                        // 2. Constrói a frase de rascunho
                        const rascunhoDoObjetivo = `Meu objetivo é resolver a questão de '${problema}', buscando alcançar '${ganho}'. Meu sucesso será tão grande que eu indicaria a ferramenta se '${indicacao}'.`;

                        // 3. Esconde o container das perguntas iniciais
                        if (explorationContainer) explorationContainer.classList.add(styles.hidden);

                        // 4. Mostra o container principal do "assistente"
                        if (smartConversationContainer) smartConversationContainer.classList.remove(styles.hidden);

                        // 5. Modifica os elementos DENTRO do 'smart-conversation-container'
                        const recapBox = smartConversationContainer.querySelector(`.${styles['recap-box']}`);
                        const historyContainer = document.getElementById('smart-history-container');
                        if (recapBox) recapBox.style.display = 'none';
                        if (historyContainer) historyContainer.style.display = 'none';

                        
                        const label = document.getElementById('smart-label');
                        const textarea = document.getElementById('smart-input');
                        const summaryBox = document.getElementById('smart-summary');
                        const summaryText = document.getElementById('smart-summary-text');
                        const dateInputs = document.getElementById('date-inputs-container');
                    
                        if (dateInputs) dateInputs.style.display = 'none';

                        // Ajusta o título (label)
                        if (label) label.innerHTML = 'Ajuste e refine seu objetivo final:';

                        // Mostra e preenche o rascunho
                        if (summaryBox && summaryText) {
                            summaryText.innerHTML = rascunhoDoObjetivo;
                            summaryBox.classList.remove(styles.hidden);
                        }

                        // Mostra e preenche o textarea para edição
                        if (textarea) {
                            textarea.classList.remove(styles.hidden);
                            textarea.value = rascunhoDoObjetivo;
                            textarea.style.minHeight = '120px';
                        }
                        

                        // Ajusta os botões de navegação do sub-passo
                        const prevBtn = document.getElementById('btn-prev-smart');
                        const nextBtn = document.getElementById('btn-next-smart');
                        if (prevBtn) prevBtn.style.display = 'none'; // Esconde o botão "Voltar"
                        if (nextBtn) {
                            nextBtn.textContent = 'Salvar Objetivo';
                        }                        
                        return; // Finaliza a ação
                    }

                    // =======================================================
                    // ===     AJUSTE NO BOTÃO 'SALVAR OBJETIVO' (btn-next-smart) ===
                    // =======================================================
                    if (target.id === 'btn-next-smart') {
                        // Esta lógica agora é para salvar o objetivo editado
                        const objetivoFinalTextarea = document.getElementById('smart-input');
                        if (objetivoFinalTextarea) {
                            const objetivoFinal = objetivoFinalTextarea.value.trim();
                            if (objetivoFinal === '') {
                                alert('Por favor, defina seu objetivo final antes de salvar.');
                                return; // Impede o avanço
                            }
                            // Salva a resposta final e correta
                            userAnswers['final'] = objetivoFinal;
                            isSmartObjectiveDefined = true;

                            // Esconde o assistente e mostra o modo de revisão final
                            if (smartConversationContainer) smartConversationContainer.classList.add(styles.hidden);
                            if (reviewContainer) {
                                reviewContainer.classList.remove(styles.hidden);
                                const reviewText = document.getElementById('review-summary-text');
                                if (reviewText) reviewText.textContent = objetivoFinal;
                            }
                        }
                        return;
                    }
                    
                    // Lógica para o botão "Voltar" do assistente SMART (não será usado no novo fluxo, mas mantemos por segurança)
                    if (target.id === "btn-prev-smart") {
                        // No novo fluxo, este botão está escondido, então esta lógica não deve ser acionada.
                        // Se você decidir reativar o assistente completo no futuro, ela voltará a ser útil.
                        if (smartState > 0) {
                        smartState--;
                        updateSmartQuestion();
                        }
                        return;
                    }
                    // Lógica para o botão "Editar" do modo de revisão do Objetivo
                    if (target.id === "btn-edit-smart") {
                        // Esta lógica permite ao usuário voltar para a tela de edição do objetivo
                        if (reviewContainer) reviewContainer.classList.add(styles.hidden);
                        if (smartConversationContainer) smartConversationContainer.classList.remove(styles.hidden);
                        // Não precisamos resetar o estado, pois a tela de edição é única agora.
                        return;
                    }
                    // Lógica para o botão "Avançar" da Fotografia do Sucesso
                    if (target.id === "btn-next-photo") {
                        const currentAnswer = photoInput.value.trim();
                        if (currentAnswer === "") {
                        alert("Por favor, preencha sua resposta.");
                        return;
                        }
                        const currentKey = photoQuestions[photoState].key;
                        userAnswers[currentKey] = currentAnswer;
                        photoState++;
                        if (photoState < photoQuestions.length) {
                        updatePhotoQuestion();
                        } else {
                        isPhotoDefined = true;
                        showPhotoReviewMode();
                        }
                        return;
                    }
                    // Lógica para o botão "Voltar" da Fotografia do Sucesso
                    if (target.id === "btn-prev-photo") {
                        if (photoState > 0) {
                        photoState--;
                        updatePhotoQuestion();
                        }
                        return;
                    }
                    // Lógica para o botão "Editar" da Fotografia do Sucesso
                    if (target.id === "btn-edit-photo") {
                        photoState = photoQuestions.length - 1;
                        photoAssistantContainer.classList.remove(`${styles.hidden}`);
                        photoSummaryBox.classList.add(`${styles.hidden}`);
                        updatePhotoQuestion();
                        return;
                    }

                    // Lógica para o botão "Finalizar" (que leva ao resumo)
                    if (target.id === "btn-finalizar") {
                        target.disabled = true;
                        target.textContent = "Finalizando...";
                        try {
                        console.log("Finalizando ferramenta. Tentando salvar a conclusão no perfil...");
                        await completeTool("Resultado_esperado");
                        console.log("Conclusão da ferramenta salva com sucesso no perfil.");
                        } catch (error) {
                        console.error("Falha ao salvar a conclusão da ferramenta no perfil.", error);
                        }
                        generateFinalSummary();
                        showStep(steps.length - 1);
                        // Não reativamos o botão aqui, pois a ação já foi concluída.
                        // target.disabled = false;
                        // target.textContent = "Finalizar e Ver Resumo";
                        return;
                    }
                    // Lógica para o botão de impressão
                    if (target.id === "btn-print") {
                        const summaryStep = document.getElementById("step-5");
                        if (summaryStep) {
                        summaryStep.classList.add(`${styles.printable}`);
                        window.print();
                        summaryStep.classList.remove(`${styles.printable}`);
                        }
                        return;
                    }
                    // Lógica para o botão "Começar" da Etapa 0
                    if (target.matches("#step-0 .btn-next")) {
                        showStep(1);
                        return;
                    }

                    // Lógica para os botões "Avançar" genéricos
                    if (target.classList.contains("btn-next")) {
                        const nextStepIndex = currentStep + 1;
                        if (nextStepIndex < steps.length) {
                        showStep(nextStepIndex);
                        }
                        return;
                    }

                    // Lógica para os botões "Voltar" genéricos
                    if (target.classList.contains("btn-prev")) {
                        const prevStepIndex = currentStep - 1;
                        if (prevStepIndex >= 0) {
                        showStep(prevStepIndex);
                        }
                        return;
                    }
                };

                const inputHandler = (e) => {
                    if (e.target.id === "slider-responsabilidade") {
                        const responsabilidadeValue = document.getElementById(
                            "responsabilidade-value"
                        );
                        const responsabilidadeExtraContainer = document.getElementById(
                            "responsabilidade-extra-container"
                        );
                        const value = e.target.value;
                        if (responsabilidadeValue)
                            responsabilidadeValue.textContent = `${value}%`;
                        if (responsabilidadeExtraContainer)
                            responsabilidadeExtraContainer.classList.toggle(
                                `${styles.hidden}`,
                                value >= 100
                            );
                    }
                    if (e.target.id === "slider-comprometimento") {
                        const comprometimentoValue = document.getElementById(
                            "comprometimento-value"
                        );
                        if (comprometimentoValue)
                            comprometimentoValue.textContent = e.target.value;
                    }
                };

                let activeTooltip = null;
                const mouseoverHandler = (e) => {
                    if (!e.target.classList.contains(`${styles["help-tip"]}`)) return;
                    if (activeTooltip) return;
                    const icon = e.target;
                    const tooltipText = icon.dataset.tooltip;
                    activeTooltip = document.createElement("div");
                    activeTooltip.className = `${styles["dynamic-tooltip"]}`;
                    activeTooltip.innerHTML = tooltipText;
                    document.body.appendChild(activeTooltip);
                    const iconRect = icon.getBoundingClientRect();
                    const tooltipRect = activeTooltip.getBoundingClientRect();
                    let top = iconRect.top - tooltipRect.height - 10;
                    let left = iconRect.left + iconRect.width / 2 - tooltipRect.width / 2;
                    if (left < 10) left = 10;
                    if (left + tooltipRect.width > window.innerWidth - 10) {
                        left = window.innerWidth - tooltipRect.width - 10;
                    }
                    if (top < 10) {
                        top = iconRect.bottom + 10;
                    }
                    activeTooltip.style.top = `${top + window.scrollY}px`;
                    activeTooltip.style.left = `${left + window.scrollX}px`;
                    setTimeout(() => {
                        if (activeTooltip) activeTooltip.classList.add(`${styles.visible}`);
                    }, 10);
                };

                const mouseoutHandler = (e) => {
                    if (
                        !e.target.classList.contains(`${styles["help-tip"]}`) ||
                        !activeTooltip
                    )
                        return;
                    activeTooltip.classList.remove(`${styles.visible}`);
                    setTimeout(() => {
                        if (activeTooltip && activeTooltip.parentElement) {
                            document.body.removeChild(activeTooltip);
                        }
                        activeTooltip = null;
                    }, 300);
                };

                document.body.addEventListener("click", eventHandler);
                document.body.addEventListener("input", inputHandler);
                document.body.addEventListener("mouseover", mouseoverHandler);
                document.body.addEventListener("mouseout", mouseoutHandler);

                showStep(0);

                // Função de limpeza para remover os listeners quando o componente for desmontado
                return () => {
                    document.body.removeEventListener("click", eventHandler);
                    document.body.removeEventListener("input", inputHandler);
                    document.body.removeEventListener("mouseover", mouseoverHandler);
                    document.body.removeEventListener("mouseout", mouseoutHandler);
                };
            }
            const cleanup = inicializarFerramenta();
            return cleanup;
        }
    }, [status, hasAccess]);

    if (status === "loading") {
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

    return (
        
        <PageLayout title="Resultado Esperado">
            <Modals />
            {/* ===================================================================== */}
            {/*   ETAPA 0: INTRODUÇÃO                                                 */}
            {/* ===================================================================== */}
            
            <section id="step-0" className={`step ${styles.step}`}>
                <div className={`${styles["step-header"]}`}>
                    <h1>🌟 Ferramenta: Resultado Esperado</h1>
                    <p>
                        Esta ferramenta te guiará para transformar um desejo vago em um
                        objetivo claro e poderoso. Responda com calma e sinceridade.
                    </p>
                </div>
                <div className={`${styles["step-content"]}`}>
                    <div className={`${styles["info-box"]}`}>
                        <h4>O Segredo de um Objetivo Poderoso</h4>
                        <p>
                            Muitas vezes, nossos desejos são sentimentos (ex: "quero ser
                            feliz"). Para alcançá-los, precisamos transformá-los em algo
                            concreto e palpável. Ao longo desta jornada, vamos te ajudar a
                            fazer exatamente isso.
                        </p>
                    </div>
                </div>
                <div className={`${styles["step-navigation"]}`}>
                    {/* Adicionamos a classe pura 'btn-next' */}
                    <button className={`btn-next ${styles["btn-next"]}`}>
                        Começar
                    </button>
                </div>
            </section>
            {/* ===================================================================== */}
            {/*   ETAPA 1: RESULTADOS ESPERADOS (OBJETIVO SMART)                      */}
            {/* ===================================================================== */}
            
            <section id="step-1" className={`step ${styles.step}`}>
                <div className={`${styles['step-header']}`}>
                    <h2>Etapa 1: Definição do Objetivo</h2>
                    <p>Vamos começar entendendo o que te trouxe até aqui para, então, construir um objetivo claro e poderoso usando a metodologia SMART.</p>
                </div>
                <div className={`${styles['step-content']}`}>
                    <div id="exploration-container">
                        <div className={`${styles['question-block']}`}>
                            <label htmlFor="q-expl-problema">O que te trouxe até aqui? O que fez você parar e dedicar seu tempo a esta ferramenta neste exato momento?</label>
                            <textarea id="q-expl-problema" placeholder="Seja sincero(a). Ex: 'Sinto que estou estagnado(a) na carreira', 'Minha vida financeira está uma bagunça', 'Não tenho tempo para mim'..."></textarea>
                        </div>
                        <div className={`${styles['question-block']}`}>
                            <label htmlFor="q-expl-ganho">Imagine que você chegou ao final desta jornada. O que precisa ter acontecido para você dizer "Uau, valeu muito a pena!"?</label>
                            <textarea id="q-expl-ganho" placeholder="Descreva o resultado ideal. Ex: 'Ter um plano claro para os próximos 6 meses', 'Sentir que retomei o controle da minha vida'..."></textarea>
                        </div>
                        <div className={`${styles['question-block']}`}>
                            <label htmlFor="q-expl-indicacao">E o que te deixaria tão satisfeito(a) a ponto de querer indicar esta ferramenta para um amigo querido?</label>
                            <textarea id="q-expl-indicacao" placeholder="Qual nível de transformação você espera? Ex: 'Se eu conseguir destravar uma decisão importante', 'Se eu me sentir mais motivado(a) e com mais energia'..."></textarea>
                        </div>
                        <div className={`${styles['subtask-navigation']}`} style={{ justifyContent: 'flex-end' }}>
                            <button id="btn-start-smart" className={`${styles['btn-next-small']}`}>Definir meu Objetivo</button>
                        </div>
                    </div>
                    <div id="smart-conversation-container" className={`hidden ${styles.hidden}`}>
                        <div className={`${styles['recap-box']}`}>
                            <h4>Suas Reflexões Iniciais:</h4>
                            <p id="recap-exploration-text">Carregando...</p>
                        </div>
                        <div id="smart-history-container"></div>
                        <div id="active-question-container">
                            <div className={`label-wrapper ${styles['label-wrapper']}`}>
                                <label id="smart-label" htmlFor="smart-input">...</label>
                            </div>
                            <div id="smart-summary" className={`draft-box hidden ${styles['draft-box']} ${styles.hidden}`}>
                                <h4 id="smart-summary-title"></h4>
                                <p id="smart-summary-text"></p>
                            </div>
                            <div id="input-fields-wrapper">
                                <textarea id="smart-input" placeholder="Escreva sua resposta aqui..."></textarea>
                                <div id="date-inputs-container" className={`hidden ${styles.hidden}`}>
                                    <div className={`${styles['date-input-wrapper']}`}>
                                        <label htmlFor="smart-date-input-start">Data de Início</label>
                                        <input type="date" id="smart-date-input-start" />
                                    </div>
                                    <div className={`${styles['date-input-wrapper']}`}>
                                        <label htmlFor="smart-date-input-end">Data de Término</label>
                                        <input type="date" id="smart-date-input-end" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`${styles['subtask-navigation']}`}>
                            <button id="btn-prev-smart" className={`btn-prev-small hidden ${styles['btn-prev-small']} ${styles.hidden}`}>Voltar</button>
                            <button id="btn-next-smart" className={`${styles['btn-next-small']}`}>Próximo</button>
                        </div>
                    </div>
                    <div id="review-container" className={`hidden ${styles.hidden}`}>
                        <div id="review-summary" className={`${styles['draft-box']}`}>
                            <h4>Seu Objetivo definido é:</h4>
                            <p id="review-summary-text"></p>
                        </div>
                        <button id="btn-edit-smart" className={`${styles['btn-prev-small']}`} style={{ marginTop: '1rem' }}>Editar Objetivo</button>
                    </div>
                </div>
                <div className={`${styles['step-navigation']}`}>
                    <button className={`btn-prev ${styles['btn-prev']}`}>Voltar</button>
                    <button className={`btn-next ${styles['btn-next']}`}>Avançar</button>
                </div>
            </section>

            {/* ===================================================================== */}
            {/*   ETAPA 2: FOTOGRAFIA DO SUCESSO                                      */}
            {/* ===================================================================== */}
            <section id="step-2" className={`step ${styles.step}`}>
                <div className={`${styles['step-header']}`}>
                    <h2>Etapa 2: A Fotografia do Sucesso</h2>
                    <p>Imagine que viajou no tempo e seu objetivo já foi alcançado. Vamos descrever essa cena com o máximo de detalhes racionais, como um planejamento.</p>
                </div>
                <div className={`${styles['step-content']}`}>
                    <div className={`${styles['recap-box']}`}>
                        <h4>Seu objetivo definido é:</h4>
                        <p id="recap-objetivo-step2">Carregando...</p>
                    </div>
                    <div id="photo-assistant-container">
                        <div className={`label-wrapper ${styles['label-wrapper']}`}>
                            <label id="photo-label" htmlFor="photo-input">Pergunta inicial...</label>
                        </div>
                        <div id="photo-draft-summary" className={`draft-box hidden ${styles['draft-box']} ${styles.hidden}`}>
                            <h4>Rascunho da sua Cena:</h4>
                            <p id="photo-draft-summary-text"></p>
                        </div>
                        <textarea id="photo-input" placeholder="Descreva em detalhes..."></textarea>
                        <div className={`${styles['subtask-navigation']}`}>
                            <button id="btn-prev-photo" className={`btn-prev-small hidden ${styles['btn-prev-small']} ${styles.hidden}`}>Voltar</button>
                            <button id="btn-next-photo" className={`${styles['btn-next-small']}`}>Próximo</button>
                        </div>
                    </div>
                    <div id="photo-summary" className={`hidden ${styles.hidden}`}>
                        <h4>Sua Fotografia do Sucesso:</h4>
                        <p id="photo-summary-text"></p>
                        <button id="btn-edit-photo" className={`${styles['btn-prev-small']}`} style={{ marginTop: '1rem' }}>Editar Fotografia</button>
                    </div>
                </div>
                <div className={`${styles['step-navigation']}`}>
                    <button className={`btn-prev ${styles['btn-prev']}`}>Voltar</button>
                    <button className={`btn-next ${styles['btn-next']}`}>Avançar</button>
                </div>
            </section>

            {/* ===================================================================== */}
            {/*   ETAPA 3: O ENSAIO MENTAL (VÍDEO + ÁUDIO)                            */}
            {/* ===================================================================== */}
            <section id="step-3" className={`step ${styles.step}`}>
                <div className={`${styles['step-header']}`}>
                    <h2>Etapa 3: O Ensaio Mental Guiado</h2>
                    <p>Esta é a etapa mais importante. Vamos transformar seu planejamento em uma experiência real e emocional.</p>
                </div>
                <div className={`${styles['step-content']}`}>
                    <div className={`${styles['media-wrapper']}`}>
                        <h4>Uma mensagem para você:</h4>
                        <video controls controlsList="nodownload" style={{ width: '100%', borderRadius: '8px' }}>
                            <source src="../assets/video-intro.mp4" type="video/mp4" />
                            Seu navegador não suporta o elemento de vídeo.
                        </video>
                    </div>
                    <div className={`${styles['media-wrapper']}`}>
                        <h4>Seu Ensaio Mental:</h4>
                        <p style={{ textAlign: 'center', marginBottom: '1rem' }}><em>"Agora, encontre uma posição confortável, feche os olhos e pressione 'Play'."</em></p>
                        <audio controls controlsList="nodownload" style={{ width: '100%' }}>
                            <source src="../assets/audio-ensaio.mp3" type="audio/mpeg" />
                            Seu navegador não suporta o elemento de áudio.
                        </audio>
                    </div>
                </div>
                <div className={`${styles['step-navigation']}`}>
                    <button className={`btn-prev ${styles['btn-prev']}`}>Voltar</button>
                    <button className={`btn-next ${styles['btn-next']}`}>Avançar</button>
                </div>
            </section>

            {/* ===================================================================== */}
            {/*   ETAPA 4: COMPROMISSO E AÇÃO                                         */}
            {/* ===================================================================== */}
            <section id="step-4" className={`step ${styles.step}`}>
                <div className={`${styles['step-header']}`}>
                    <h2>Etapa 4: Compromisso e Ação</h2>
                    <p>Você sentiu a emoção da conquista. Agora, vamos transformar essa energia em um plano de ação concreto.</p>
                </div>
                <div className={`${styles['step-content']}`}>
                    <div className={`${styles['question-block']}`}>
                        <label htmlFor="q-motivacao">Para selar sua motivação, releia o benefício que você definiu na Etapa 1 e reforce: por que alcançar esse objetivo é inegociável para você?</label>
                        <div className={`${styles['recap-box']}`} style={{ marginBottom: '1rem' }}>
                            <h4>Lembre-se do seu "Porquê" (Benefício):</h4>
                            <p id="recap-motivacao-step4">Carregando...</p>
                        </div>
                        <textarea id="q-motivacao" placeholder="Reforce sua motivação com suas próprias palavras..."></textarea>
                    </div>
                    <div className={`${styles['question-block']}`}>
                        <label>Para construir sua confiança, lembre-se dos recursos que você já possui.</label>
                        <div className={`${styles['recap-box']}`}>
                            <h4>Você já tem o que é preciso para começar (Recursos):</h4>
                            <p id="recap-acessivel-step4">Carregando...</p>
                        </div>
                    </div>
                    <div className={`${styles['question-block']}`}>
                        <label htmlFor="q-responsabilidade-quem">De quem é a responsabilidade de conseguir isso?</label>
                        <textarea id="q-responsabilidade-quem" placeholder="Ex: Minha, minha e do meu chefe, etc."></textarea>

                        <label htmlFor="slider-responsabilidade" style={{ marginTop: '1rem' }}>De 0 a 100%, quanto o sucesso dessa jornada depende exclusivamente de você?</label>
                        <input type="range" id="slider-responsabilidade" min="0" max="100" defaultValue="80" className={`slider ${styles.slider}`} />
                        <span id="responsabilidade-value" className={`${styles['slider-value']}`}>80%</span>

                        <div id="responsabilidade-extra-container" className={`hidden ${styles.hidden}`} style={{ marginTop: '1rem' }}>
                            <label htmlFor="q-responsabilidade-extra">O que você poderia fazer para que esse número aumente, para que dependa um pouquinho mais só de você?</label>
                            <textarea id="q-responsabilidade-extra" placeholder="Ex: Em vez de esperar uma oportunidade, posso criar uma. Em vez de depender de alguém, posso aprender a fazer."></textarea>
                        </div>
                    </div>
                    <div className={`${styles['question-block']}`}>
                        <label htmlFor="slider-comprometimento">Com essa clareza e motivação, de 0 a 10, qual o seu nível de comprometimento em fazer o que for preciso para dar o próximo passo?</label>
                        <input type="range" id="slider-comprometimento" min="0" max="10" defaultValue="8" className={`slider ${styles.slider}`} />
                        <span id="comprometimento-value" className={`${styles['slider-value']}`}>8</span>
                    </div>
                    <div className={`${styles['question-block']}`}>
                        <label htmlFor="q-tarefa">Excelente! Agora, qual é o <strong>primeiro e menor passo</strong> (algo que você possa fazer em até 15 minutos) que você dará na próxima semana para iniciar sua jornada?</label>
                        <textarea id="q-tarefa" placeholder="Ex: Enviar um e-mail para marcar aquela conversa; pesquisar por 15 minutos sobre o tema X; arrumar a gaveta do escritório..."></textarea>
                    </div>
                </div>
                <div className={`${styles['step-navigation']}`}>
                    <button className={`btn-prev ${styles['btn-prev']}`}>Voltar</button>
                    <button id="btn-finalizar">Finalizar e Ver Resumo</button>
                </div>
            </section>

            {/* ===================================================================== */}
            {/*   ETAPA 5: RESUMO FINAL                                               */}
            {/* ===================================================================== */}

            <section id="step-5" className={`step ${styles.step}`}>
                <div className={`${styles['step-header']}`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <h2>Seu Plano de Ação</h2>
                        <button id="btn-print" className={`btn-icon ${styles['btn-icon']}`} title="Imprimir ou Salvar como PDF">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                        </button>
                    </div>
                    <p>Parabéns por concluir a jornada! Guarde este plano e consulte-o sempre que precisar de motivação.</p>
                </div>
                <div id="summary-content" className={`${styles['step-content']}`}>
                    {/* O resumo será gerado aqui pelo JavaScript */}
                </div>
                <div className={`${styles['step-navigation']}`}>
                    <button className={`btn-prev ${styles['btn-prev']}`}>Voltar</button>
                </div>
            </section>

        </PageLayout>    
    );
}
