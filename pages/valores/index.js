import React, { useEffect, useRef } from "react";
import PageLayout from "../../components/PageLayout";
import { useSmartAuth } from "../../hooks/useSmartAuth";
import { AccessDenied } from "../../components/AuthGuard";
import styles from "../../styles/valores.module.css";
import Modals from "@/componentes/Modals";

const initialValues = [
  {
    name: "Autonomia",
    description:
      "Ser independente e ter controle sobre suas próprias ações e decisões.",
    scenario:
      "Ter a liberdade de definir seus próprios horários e métodos de trabalho.",
  },
  {
    name: "Aventura",
    description: "Buscar novas experiências, riscos e desafios.",
    scenario:
      "Aceitar um projeto desafiador em uma área que você não domina completamente.",
  },
  {
    name: "Amor",
    description: "Dar e receber afeto, carinho e conexão profunda.",
    scenario:
      "Dedicar uma noite por semana exclusivamente para estar com pessoas que você ama, sem distrações.",
  },
  {
    name: "Aprendizado",
    description:
      "Adquirir conhecimento, habilidades e sabedoria continuamente.",
    scenario:
      "Investir tempo e dinheiro em um curso para desenvolver uma nova habilidade.",
  },
  {
    name: "Compromisso",
    description: "Ser leal e dedicado às suas promessas e responsabilidades.",
    scenario:
      "Manter sua palavra em um projeto, mesmo que isso exija um esforço extra inesperado.",
  },
  {
    name: "Compaixão",
    description: "Sentir e agir para aliviar o sofrimento dos outros.",
    scenario:
      "Oferecer ajuda a um colega que está visivelmente sobrecarregado, mesmo que atrase seu próprio trabalho.",
  },
  {
    name: "Conexão",
    description: "Sentir-se parte de algo maior, conectado a outras pessoas.",
    scenario:
      "Participar ativamente de uma comunidade ou grupo que compartilha seus interesses.",
  },
  {
    name: "Coragem",
    description: "Agir apesar do medo, defender o que é certo.",
    scenario:
      "Apresentar uma ideia inovadora em uma reunião, sabendo que ela pode ser recebida com ceticismo.",
  },
  {
    name: "Criatividade",
    description: "Expressar-se de formas novas e originais, inovar.",
    scenario:
      "Propor uma solução completamente nova para um problema antigo, em vez de usar o método tradicional.",
  },
  {
    name: "Crescimento",
    description:
      "Desenvolver-se pessoal e profissionalmente de forma constante.",
    scenario:
      "Buscar feedback honesto sobre seus pontos fracos para poder melhorá-los.",
  },
  {
    name: "Curiosidade",
    description: "Ter um forte desejo de explorar, descobrir e aprender.",
    scenario:
      "Dedicar tempo para pesquisar um tópico aleatório que despertou seu interesse, sem um objetivo prático.",
  },
  {
    name: "Dever",
    description: "Cumprir com suas obrigações e responsabilidades morais.",
    scenario:
      "Finalizar uma tarefa importante e prometida, mesmo quando se sente cansado e desmotivado.",
  },
  {
    name: "Disciplina",
    description: "Ter autocontrole e a capacidade de seguir regras e rotinas.",
    scenario:
      "Manter uma rotina de exercícios ou estudos, mesmo nos dias em que a vontade é de desistir.",
  },
  {
    name: "Diversão",
    description: "Procurar alegria, prazer e entretenimento na vida.",
    scenario:
      "Reservar um tempo na sua agenda para um hobby ou atividade que te dá puro prazer.",
  },
  {
    name: "Equilíbrio",
    description:
      "Manter a harmonia entre diferentes áreas da vida (trabalho, lazer, saúde).",
    scenario:
      "Desconectar-se completamente do trabalho no final do dia para focar na vida pessoal.",
  },
  {
    name: "Espiritualidade",
    description:
      "Conectar-se com um propósito maior, o transcendente ou o sagrado.",
    scenario:
      "Praticar meditação ou passar um tempo na natureza para se reconectar consigo mesmo.",
  },
  {
    name: "Excelência",
    description: "Esforçar-se para ser o melhor possível em tudo o que faz.",
    scenario:
      'Revisar um trabalho várias vezes para garantir a máxima qualidade, mesmo que já esteja "bom o suficiente".',
  },
  {
    name: "Família",
    description: "Priorizar o bem-estar e a conexão com os entes queridos.",
    scenario:
      "Recusar um compromisso social para estar presente em um evento familiar importante.",
  },
  {
    name: "Fé",
    description: "Ter crença e confiança em algo ou alguém, mesmo sem provas.",
    scenario:
      "Confiar que as coisas darão certo no final, mesmo durante um período de incerteza.",
  },
  {
    name: "Flexibilidade",
    description: "Adaptar-se facilmente a novas situações e mudanças.",
    scenario:
      "Mudar seus planos de última hora sem estresse para acomodar uma nova oportunidade ou imprevisto.",
  },
  {
    name: "Generosidade",
    description: "Dar e compartilhar com os outros sem esperar algo em troca.",
    scenario:
      "Compartilhar seu conhecimento com um colega para ajudá-lo a crescer, sem esperar nada em troca.",
  },
  {
    name: "Gratidão",
    description: "Ser grato e apreciar o que você tem na vida.",
    scenario:
      "Terminar o dia listando três coisas pelas quais você é grato, por menores que sejam.",
  },
  {
    name: "Honestidade",
    description:
      "Ser verdadeiro, sincero e transparente em suas ações e palavras.",
    scenario:
      "Admitir um erro que você cometeu, em vez de tentar escondê-lo ou culpar outros.",
  },
  {
    name: "Humildade",
    description:
      "Reconhecer suas limitações e não se considerar superior aos outros.",
    scenario:
      "Ouvir atentamente a opinião de alguém com menos experiência, reconhecendo que pode aprender com ela.",
  },
  {
    name: "Independência",
    description: "Ser autossuficiente e não depender dos outros.",
    scenario:
      "Tomar uma decisão importante por conta própria, confiando em seu próprio julgamento.",
  },
  {
    name: "Inovação",
    description: "Criar e implementar novas ideias, métodos ou soluções.",
    scenario:
      "Automatizar uma tarefa repetitiva para liberar tempo para atividades mais estratégicas.",
  },
  {
    name: "Justiça",
    description: "Lutar pela igualdade, imparcialidade e direitos para todos.",
    scenario:
      "Defender um colega que está sendo tratado de forma injusta, mesmo que isso te coloque em uma posição desconfortável.",
  },
  {
    name: "Lealdade",
    description: "Ser fiel e apoiar seus amigos, família ou causas.",
    scenario:
      "Apoiar a decisão de um amigo, mesmo que você não concorde totalmente com ela.",
  },
  {
    name: "Liberdade",
    description: "Ter o poder de agir, falar e pensar sem restrições.",
    scenario:
      "Escolher um caminho profissional menos convencional, mas que está alinhado com sua paixão.",
  },
  {
    name: "Liderança",
    description:
      "Inspirar e guiar outras pessoas para alcançar um objetivo comum.",
    scenario:
      "Tomar a iniciativa de organizar uma equipe para resolver um problema que todos estão ignorando.",
  },
  {
    name: "Ordem",
    description: "Manter a organização, a estrutura e a previsibilidade.",
    scenario:
      "Organizar seu ambiente de trabalho e planejar sua semana antes de começar as tarefas.",
  },
  {
    name: "Originalidade",
    description: "Ser único e autêntico, não apenas seguir os outros.",
    scenario:
      "Expressar uma opinião impopular, mas autêntica, em vez de concordar com a maioria.",
  },
  {
    name: "Otimismo",
    description: "Manter uma atitude positiva e esperar o melhor resultado.",
    scenario:
      "Encarar um feedback negativo como uma oportunidade de crescimento, e não como uma crítica pessoal.",
  },
  {
    name: "Paciência",
    description: "Manter a calma e a tolerância em situações difíceis.",
    scenario:
      "Explicar algo pela terceira vez a alguém, com a mesma calma da primeira vez.",
  },
  {
    name: "Paz",
    description: "Buscar a tranquilidade interior e a ausência de conflitos.",
    scenario:
      "Escolher não entrar em uma discussão desnecessária, mesmo que você tenha razão.",
  },
  {
    name: "Performance",
    description: "Alcançar resultados mensuráveis e de alto nível.",
    scenario:
      "Focar em atingir uma meta específica e mensurável, acompanhando seu progresso de perto.",
  },
  {
    name: "Poder",
    description:
      "Ter influência, controle ou autoridade sobre os outros ou sobre si mesmo.",
    scenario:
      "Assumir a liderança de um projeto importante que pode impulsionar sua carreira.",
  },
  {
    name: "Praticidade",
    description: "Focar em soluções realistas, eficientes e úteis.",
    scenario:
      'Escolher a solução mais simples e rápida para um problema, em vez da mais "elegante" ou complexa.',
  },
  {
    name: "Prestígio",
    description: "Ter respeito e admiração por suas realizações e status.",
    scenario: "Receber um prêmio ou reconhecimento público pelo seu trabalho.",
  },
  {
    name: "Reconhecimento",
    description: "Receber crédito e apreciação pelo seu trabalho e esforço.",
    scenario:
      "Ter seu chefe elogiando seu esforço e dedicação na frente da equipe.",
  },
  {
    name: "Resiliência",
    description: "Recuperar-se rapidamente de dificuldades e adversidades.",
    scenario:
      "Após uma falha, analisar o que deu errado e tentar novamente com uma nova abordagem.",
  },
  {
    name: "Respeito",
    description: "Tratar os outros com dignidade e consideração.",
    scenario:
      "Ouvir a perspectiva de outra pessoa até o fim, sem interromper, mesmo que você discorde.",
  },
  {
    name: "Risco",
    description:
      "Estar disposto a correr riscos para alcançar recompensas maiores.",
    scenario:
      "Investir em uma ideia com alto potencial de retorno, mas também com chance de perda.",
  },
  {
    name: "Sabedoria",
    description:
      "Usar o conhecimento e a experiência para fazer bons julgamentos.",
    scenario:
      "Dar um conselho ponderado a um amigo, baseado em suas próprias experiências de vida.",
  },
  {
    name: "Saúde",
    description: "Priorizar o bem-estar físico e mental.",
    scenario:
      "Fazer uma pausa para se alongar e descansar, mesmo em um dia de trabalho agitado.",
  },
  {
    name: "Segurança",
    description: "Sentir-se protegido de perigos e ameaças.",
    scenario:
      "Optar por um emprego estável e com benefícios, em vez de um trabalho mais arriscado e com maior potencial de ganho.",
  },
  {
    name: "Serviço",
    description: "Ajudar e contribuir para o bem-estar dos outros.",
    scenario:
      "Ser voluntário em uma causa ou ajudar alguém sem esperar reconhecimento.",
  },
  {
    name: "Silêncio",
    description: "Valorizar momentos de quietude e introspecção.",
    scenario:
      "Reservar 15 minutos do seu dia para ficar em silêncio, sem celular ou outras distrações.",
  },
  {
    name: "Tradição",
    description:
      "Respeitar e seguir costumes e crenças passados de geração em geração.",
    scenario:
      "Manter uma tradição familiar, como um almoço de domingo, por seu valor simbólico.",
  },
];
const MIN_SELECTION = 10;
const TOP_VALUES_COUNT = 5;

const FerramentaValores = () => {
  const { status, hasAccess } = useSmartAuth("valores");

  // ==================================================================
  // ETAPA 1: GERENCIAMENTO DE ESTADO COM useRef
  // ==================================================================
  const allValuesRef = useRef([...initialValues]);
  const selectedValuesRef = useRef(new Set());
  const userResponsesRef = useRef({});
  const confrontationStateRef = useRef({
    pairs: [],
    currentIndex: 0,
    scores: {},
  });
  // ==================================================================
  // ETAPA 2: useEffect PARA GERENCIAR A LÓGICA DO CLIENTE
  // ==================================================================
  useEffect(() => {
    if (typeof window !== "undefined" && hasAccess && status !== "loading") {
      // --- Funções Auxiliares ---
      const isMobile = () => window.innerWidth < 768;

      function navigateToStep(stepNumber) {
        document
          .querySelectorAll(".step")
          .forEach((step) => step.classList.remove("active"));
        const nextStep = document.getElementById(`step${stepNumber}`);
        if (nextStep) {
          nextStep.classList.add("active");
          window.scrollTo(0, 0);
        }
      }

      function createValueCard(valueObj) {
        const card = document.createElement("div");
        card.className = styles.valueCard;
        card.textContent = valueObj.name;
        card.dataset.value = valueObj.name;
        card.title = valueObj.description;
        return card;
      }

      function renderAllValues() {
        const valuesContainer = document.getElementById(
          "values-list-container"
        );
        if (!valuesContainer) return;
        valuesContainer.innerHTML = "";
        allValuesRef.current.forEach((valueObj) => {
          const card = createValueCard(valueObj);
          if (selectedValuesRef.current.has(valueObj.name)) {
            card.classList.add(styles.selected);
          }
          valuesContainer.appendChild(card);
        });
      }

      function updateSelectionCount() {
        const count = selectedValuesRef.current.size;
        const selectionCountEl = document.getElementById("selection-count");
        const gotoStep2Btn = document.getElementById("goto-step2-btn");
        if (selectionCountEl) selectionCountEl.textContent = count;
        if (gotoStep2Btn) {
          gotoStep2Btn.disabled = count < MIN_SELECTION;
          gotoStep2Btn.textContent =
            count >= MIN_SELECTION
              ? `Continuar com ${count} valores`
              : "Continuar para o Próximo Passo";
        }
      }

      function populateStep2() {
        const valueCardsPool = document.getElementById("value-cards-pool");
        if (!valueCardsPool) return;
        valueCardsPool.innerHTML = "";
        selectedValuesRef.current.forEach((valueName) => {
          const valueObj = allValuesRef.current.find(
            (v) => v.name === valueName
          );
          if (valueObj) {
            const card = createValueCard(valueObj);
            if (!isMobile()) {
              card.classList.add(styles.draggableValue);
              card.draggable = true;
            }
            valueCardsPool.appendChild(card);
          }
        });
      }

      function checkTop5Completion() {
        const dropZones = document.querySelectorAll(
          `#top-5-list .${styles.dropZone}`
        );
        const count = Array.from(dropZones).filter(
          (zone) => zone.firstElementChild
        ).length;
        const gotoStep3Btn = document.getElementById("goto-step3-btn");
        if (gotoStep3Btn) gotoStep3Btn.disabled = count !== TOP_VALUES_COUNT;
      }

      function populateStep3() {
        const definitionsContainer = document.getElementById(
          "definitions-container"
        );
        if (!definitionsContainer) return;
        definitionsContainer.innerHTML = "";
        userResponsesRef.current.top5Essenciais.forEach((valueName) => {
          const group = document.createElement("div");
          group.className = styles.definitionGroup;
          group.innerHTML = `<label for="def-${valueName}">${valueName}</label><textarea id="def-${valueName}" data-value="${valueName}" rows="2" placeholder="Para mim, ${valueName.toLowerCase()} significa..."></textarea>`;
          definitionsContainer.appendChild(group);
        });
      }

      function populateStep4() {
        const dualityContainer = document.getElementById("duality-container");
        if (!dualityContainer) return;
        dualityContainer.innerHTML = "";
        userResponsesRef.current.top5Essenciais.forEach((valueName, index) => {
          const group = document.createElement("div");
          group.className = styles.dualityGroup;
          group.innerHTML = `
            <h4>${index + 1}. ${valueName}</h4>
            <div class="${styles.formGroup}">
              <label for="motivator-${valueName}">Motivador: Como ter o valor '${valueName}' te ajuda a avançar rumo à realização do seu objetivo?</label>
              <textarea id="motivator-${valueName}" data-value="${valueName}" data-type="motivator" rows="3" placeholder="Ex: Minha 'Honestidade' me ajuda a construir confiança..."></textarea>
            </div>
            <div class="${styles.formGroup}">
              <label for="sabotador-${valueName}">Sabotador: Como ter o valor '${valueName}' te atrapalha a realizar seu objetivo?</label>
              <textarea id="sabotador-${valueName}" data-value="${valueName}" data-type="sabotador" rows="3" placeholder="Ex: Às vezes, minha 'Honestidade' excessiva me faz criar conflitos..."></textarea>
            </div>
          `;
          dualityContainer.appendChild(group);
        });
      }

      function startConfrontation() {
        const values = userResponsesRef.current.top5Essenciais;
        const state = confrontationStateRef.current;
        state.pairs = [];
        state.scores = {};
        for (let i = 0; i < values.length; i++) {
          state.scores[values[i]] = 0;
          for (let j = i + 1; j < values.length; j++) {
            state.pairs.push([values[i], values[j]]);
          }
        }
        state.currentIndex = 0;
        displayNextPair();
      }

      function displayNextPair() {
        const counter = document.getElementById("confrontation-counter");
        const btnA = document.getElementById("optionA");
        const btnB = document.getElementById("optionB");
        const confrontationContainer = document.getElementById(
          "confrontation-container"
        );
        const state = confrontationStateRef.current;

        if (!counter || !btnA || !btnB || !confrontationContainer) return;

        if (state.currentIndex >= state.pairs.length) {
          counter.textContent = "Confronto finalizado!";
          confrontationContainer.style.display = "none";
          const gotoStep6Btn = document.getElementById("goto-step6-btn");
          if (gotoStep6Btn) gotoStep6Btn.disabled = false;
          return;
        }

        confrontationContainer.style.display = "block";
        counter.textContent = `Escolha ${state.currentIndex + 1} de ${
          state.pairs.length
        }`;

        const [valueNameA, valueNameB] = state.pairs[state.currentIndex];
        const valueA = allValuesRef.current.find((v) => v.name === valueNameA);
        const valueB = allValuesRef.current.find((v) => v.name === valueNameB);

        if (!valueA || !valueB) return;

        btnA.innerHTML = `${valueA.name}<span class="${styles.scenario}">"${valueA.scenario}"</span>`;
        btnB.innerHTML = `${valueB.name}<span class="${styles.scenario}">"${valueB.scenario}"</span>`;
        btnA.dataset.value = valueA.name;
        btnB.dataset.value = valueB.name;
      }

      function calculateFinalResult() {
        const sortedValues = Object.entries(
          confrontationStateRef.current.scores
        ).sort(([, a], [, b]) => b - a);
        userResponsesRef.current.resultadoFinal = sortedValues.map(
          (item) => item[0]
        );
        const diagnosisReport = document.getElementById("diagnosis-report");
        if (diagnosisReport) {
          diagnosisReport.innerHTML = `
            <p>Seu valor fundamental, com base nas suas escolhas, é <strong>${
              userResponsesRef.current.resultadoFinal[0]
            }</strong>.</p>
            <p>Sua hierarquia de valores neste momento é:</p>
            <ol>
              ${userResponsesRef.current.resultadoFinal
                .map((v) => `<li><strong>${v}</strong></li>`)
                .join("")}
            </ol>
            <p>Lembrando que esta é uma fotografia do seu momento atual. Viver alinhado a essa hierarquia pode trazer mais clareza e propósito para suas decisões.</p>
          `;
        }
      }

      function sendDataToApi() {
        const nameInput = document.getElementById('user-name');
        const emailInput = document.getElementById('user-email');
        const sendReportBtn = document.getElementById('send-report-btn');

        const name = nameInput ? nameInput.value : '';
        const email = emailInput ? emailInput.value : '';
        if (!name || !email) {
          alert("Por favor, preencha seu nome e e-mail para continuar.");
          return;
        }

        if (sendReportBtn) {
          sendReportBtn.disabled = true;
          sendReportBtn.textContent = "Enviando...";
        }

        document.dispatchEvent(new CustomEvent('showProgressModal'));

        // Atualiza o objeto de respostas com os dados finais do formulário
        userResponsesRef.current.nome = name;
        userResponsesRef.current.email = email;
        userResponsesRef.current.whatsapp = document.getElementById('user-whatsapp')?.value || '';

        const webAppUrl = "https://script.google.com/macros/s/AKfycbysIFVX-92bgdD8XyWwoWxU0xzGrmTfdmkzfLdTr_OZEuOI33kDaJvxMEYP-jFBz3c/exec";

        fetch(webAppUrl, {
          method: "POST",
          mode: "no-cors",
          cache: "no-cache",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userResponsesRef.current),
        })
        .then(() => {
        // --- SUCESSO (IMEDIATO) ---
            console.log("Requisição enviada para a API. Assumindo sucesso e mostrando modal.");

            // Esconde o modal de progresso e mostra o de sucesso
            document.dispatchEvent(new CustomEvent('hideProgressModal'));
            document.dispatchEvent(new CustomEvent('showSuccessModal'));

            // O botão "Ok" do seu modal de sucesso já cuida de recarregar a página,
            // então não precisamos mais alterar o formulário ou o botão aqui.
        })
        .catch(error => {
            // --- FALHA DE REDE ---
            console.error('Erro de rede ao enviar os dados:', error);

            // Esconde o modal de progresso
            document.dispatchEvent(new CustomEvent('hideProgressModal'));
            
            // Mostra um alerta de erro
            alert('Ocorreu um erro de conexão ao enviar seu relatório. Por favor, verifique sua internet e tente novamente.');
            
            // Reabilita o botão para que o usuário possa tentar de novo
            if (sendReportBtn) {
                sendReportBtn.disabled = false;
                sendReportBtn.textContent = 'Quero Receber Meu Relatório'; // Volta ao texto original
            }
        });
      }

      // ==================================================================
      // 2. MÓDULO DE DRAG AND DROP
      // ==================================================================

      let draggedItem = null;

      function inicializarDragAndDrop() {
        const draggables = document.querySelectorAll(
          `.${styles.draggableValue}`
        );
        const dropZones = document.querySelectorAll(`.${styles.dropZone}`);
        const valueCardsPool = document.getElementById("value-cards-pool");

        draggables.forEach((draggable) => {
          draggable.draggable = true; // Garante que o atributo seja setado
          draggable.addEventListener("dragstart", (e) => {
            draggedItem = e.target;
            setTimeout(() => e.target.classList.add(styles.dragging), 0);
          });
          draggable.addEventListener("dragend", (e) => {
            e.target.classList.remove(styles.dragging);
            draggedItem = null;
          });
        });

        dropZones.forEach((zone) => {
          zone.addEventListener("dragover", (e) => {
            e.preventDefault();
            zone.classList.add(styles.dragOver);
          });
          zone.addEventListener("dragleave", () => {
            zone.classList.remove(styles.dragOver);
          });
          zone.addEventListener("drop", (e) => {
            e.preventDefault();
            zone.classList.remove(styles.dragOver);
            if (draggedItem && !zone.firstElementChild) {
              zone.appendChild(draggedItem);
              checkTop5Completion();
            }
          });
        });

        if (valueCardsPool) {
          valueCardsPool.addEventListener("dragover", (e) => {
            e.preventDefault();
          });
          valueCardsPool.addEventListener("drop", (e) => {
            e.preventDefault();
            if (draggedItem) {
              valueCardsPool.appendChild(draggedItem);
              checkTop5Completion();
            }
          });
        }
      }

      // ==================================================================
        // 3. GERENCIADOR DE CLIQUES CENTRALIZADO
        // ==================================================================
        const handleBodyClick = (e) => {
            const target = e.target;
            const step2IsActive = document.getElementById('step2')?.classList.contains('active');

            // --- Lógica para o Passo 1: Seleção de Valores ---
            if (target.classList.contains(styles.valueCard) && target.closest('#values-list-container')) {
                const value = target.dataset.value;
                if (selectedValuesRef.current.has(value)) {
                    selectedValuesRef.current.delete(value);
                    target.classList.remove(styles.selected);
                } else {
                    selectedValuesRef.current.add(value);
                    target.classList.add(styles.selected);
                }
                updateSelectionCount();
            }

            // --- Lógica para o Passo 2: Drag and Drop Mobile ---
            if (isMobile() && step2IsActive && target.classList.contains(styles.valueCard)) {
                const valueCardsPool = document.getElementById('value-cards-pool');
                const dropZones = document.querySelectorAll(`#top-5-list .${styles.dropZone}`);
                if (target.parentElement.id === 'value-cards-pool') {
                    const firstEmptyZone = Array.from(dropZones).find(zone => !zone.firstElementChild);
                    if (firstEmptyZone) {
                        firstEmptyZone.appendChild(target);
                    } else {
                        alert("Os 5 slots já estão preenchidos. Remova um para adicionar outro.");
                    }
                } else if (target.parentElement.classList.contains(styles.dropZone)) {
                    valueCardsPool.appendChild(target);
                }
                checkTop5Completion();
            }

            // --- Lógica para Adicionar um Novo Valor ---
            if (target.id === 'add-value-btn') {
                const newValueInput = document.getElementById('new-value-input');
                const valuesContainer = document.getElementById('values-list-container');
                if (newValueInput && valuesContainer) {
                    const newName = newValueInput.value.trim();
                    if (newName && !allValuesRef.current.some(v => v.name.toLowerCase() === newName.toLowerCase())) {
                        const newValueObj = { name: newName, description: 'Valor adicionado por você.', scenario: 'Viver este valor que é unicamente seu.' };
                        allValuesRef.current.push(newValueObj);
                        const card = createValueCard(newValueObj);
                        valuesContainer.appendChild(card);
                        newValueInput.value = '';
                    }
                }
            }

            // --- Lógica de Navegação Entre Etapas ---
            if (target.id === 'start-values-btn') {
                navigateToStep(1);
            }
            if (target.id === 'goto-step2-btn') {
                userResponsesRef.current.valoresSelecionados = Array.from(selectedValuesRef.current);
                navigateToStep(2);
                populateStep2();
                // A inicialização do Drag and Drop é chamada aqui!
                setTimeout(inicializarDragAndDrop, 100);
            }
            if (target.id === 'goto-step3-btn') {
                const top5Values = [];
                document.querySelectorAll(`#top-5-list .${styles.dropZone}`).forEach(zone => {
                    if (zone.firstElementChild) top5Values.push(zone.firstElementChild.dataset.value);
                });
                userResponsesRef.current.top5Essenciais = top5Values;
                navigateToStep(3);
                populateStep3();
            }
            if (target.id === 'goto-step4-btn') {
                userResponsesRef.current.definicoes = {};
                document.querySelectorAll('#definitions-container textarea').forEach(t => { userResponsesRef.current.definicoes[t.dataset.value] = t.value; });
                navigateToStep(4);
                populateStep4();
            }
            if (target.id === 'goto-step5-btn') {
                userResponsesRef.current.dualidade = {};
                document.querySelectorAll('#duality-container textarea').forEach(t => {
                    const value = t.dataset.value;
                    const type = t.dataset.type;
                    if (!userResponsesRef.current.dualidade[value]) userResponsesRef.current.dualidade[value] = {};
                    userResponsesRef.current.dualidade[value][type] = t.value;
                });
                navigateToStep(5);
                startConfrontation();
            }
            if (target.id === 'goto-step6-btn') {
                calculateFinalResult();
                navigateToStep(6);
            }

            // --- Lógica do Confronto (Passo 5) ---
            if (target.closest(`.${styles.confrontationBox}`) && target.tagName === 'BUTTON') {
                const chosenValue = target.dataset.value;
                const state = confrontationStateRef.current;
                if (state.scores[chosenValue] !== undefined) {
                    state.scores[chosenValue]++;
                }
                state.currentIndex++;
                displayNextPair();
            }

            // --- Lógica de Envio Final (Passo 6) ---
            if (target.id === 'send-report-btn') {
                sendDataToApi();
            }
        };

        // ==================================================================
        // 4. INICIALIZAÇÃO E LIMPEZA
        // ==================================================================

        // Roda a renderização inicial dos valores
        renderAllValues();
        updateSelectionCount();

        // Adiciona o listener de clique centralizado
        document.body.addEventListener('click', handleBodyClick);

        // Retorna a função de limpeza para remover o listener de clique
        return () => {
            document.body.removeEventListener('click', handleBodyClick);
        };
    }
}, [status, hasAccess]);

  // Renderização condicional durante o carregamento ou se o acesso for negado
  if (status === "loading") {
    return (
      <PageLayout title="Carregando Ferramenta...">
        <p style={{ textAlign: "center", padding: "50px" }}>
          Verificando acesso...
        </p>
      </PageLayout>
    );
  }
  if (!hasAccess) {
    return (
      <PageLayout title="Acesso Restrito">
        <AccessDenied toolName="Hierarquia de Valores" />
      </PageLayout>
    );
  }

  // Renderização condicional durante o carregamento ou se o acesso for negado
  if (status === "loading") {
    return (
      <PageLayout title="Carregando Ferramenta...">
        <p style={{ textAlign: "center", padding: "50px" }}>
          Verificando acesso...
        </p>
      </PageLayout>
    );
  }
  if (!hasAccess) {
    return (
      <PageLayout title="Acesso Restrito">
        <AccessDenied toolName="Hierarquia de Valores" />
      </PageLayout>
    );
  }

  // --- RENDERIZAÇÃO DO JSX ---
  return (
    <PageLayout title="Mapa dos Seus Valores">
      <Modals />
      {/* ETAPA 0: INTRODUÇÃO CONCEITUAL */}
      <section id="step0" className="step active">
        <div className={styles.introBox}>
          
          {/* Mapeado do <h1> e parágrafos iniciais */}
          <h2>Sua raiva não nasce do nada.</h2>
          <p><strong>Ela aparece quando algo importante para você é desrespeitado.</strong></p>
          <p>Se você chegou até aqui, já descobriu qual gatilho mais acende sua irritação. Mas existe uma camada ainda mais profunda — e quase ninguém olha para ela: <strong>os seus valores pessoais.</strong></p>

          {/* Mapeado da seção "Não é falta de controle" */}
          <div className={styles.painPoints}>
            <p>Você não explode porque é fraco. Você explode quando um valor é violado:</p>
            <ul>
              <li>Se irrita com injustiça → <strong>valor ferido: justiça</strong></li>
              <li>Perde a paciência quando não te escutam → <strong>valor ferido: respeito</strong></li>
              <li>Fica reativo com cobranças excessivas → <strong>valor ferido: autonomia</strong></li>
              <li>Se fecha diante da ingratidão → <strong>valor ferido: reconhecimento</strong></li>
            </ul>
          </div>

          {/* Mapeado da frase de impacto "A raiva é o sintoma..." */}
          <p className={styles.coreMessage}>
            A raiva é o sintoma. <br /><strong>O valor violado pode ser a causa.</strong>
          </p>

          {/* Mapeado da seção "O problema é que quase ninguém sabe..." */}
          <div className={styles.seedPlanted}>
            <p>Quando você não conhece seus valores, você:</p>
            <ul style={{ textAlign: 'left', display: 'inline-block', marginTop: '10px' }}>
              <li>Reage sem entender por quê.</li>
              <li>Discute sem saber o que defender.</li>
              <li>Se sente desrespeitado, mas não consegue explicar.</li>
              <li>Se cobra autocontrole quando o que falta é clareza.</li>
            </ul>
          </div>
        </div>

        <button id="start-values-btn" className="primary-btn">
          Quero Descobrir Meus Valores
        </button>
      </section>

      {/* ETAPA 1: SELEÇÃO DE VALORES */}
      <section id="step1" className="step">
        <h2>Passo 1 de 5: Seus Valores Fundamentais</h2>
        <div className={styles.instructionsBox}>
          <p>
            Abaixo está uma lista de valores. Clique em todos aqueles que você
            considera importantes. <br /> <strong>Selecione pelo menos {MIN_SELECTION} valores para continuar.</strong>
          </p>
          <p>
            Valores selecionados: <strong id="selection-count">0</strong>
          </p>
        </div>
        <div
          id="values-list-container"
          className={styles.valuesListContainer}
        ></div>
        <div className={styles.addValueForm}>
          <input
            type="text"
            id="new-value-input"
            placeholder="Não encontrou um valor? Adicione o seu aqui..."
          />
          <button id="add-value-btn" className="secondary-btn">
            Adicionar
          </button>
        </div>
        <button id="goto-step2-btn" className="primary-btn" disabled>
          Continuar para o Próximo Passo
        </button>
      </section>

      {/* ETAPA 2: FILTRAR PARA O TOP 5 */}
      <section id="step2" className="step">
        <h2>Passo 2 de 5: Filtre seus 5 Valores Essenciais</h2>
        <div className={styles.instructionsBox}>
          <p>
            Excelente! Agora, da sua lista, arraste os{" "}
            <strong>{TOP_VALUES_COUNT} valores mais essenciais</strong> para a
            coluna da direita. A ordem ainda não importa.
          </p>
        </div>
        <div className={styles.prioritizationContainer}>
          <div className={styles.column} id="selected-values-pool">
            <h3>Sua Lista de Valores</h3>
            <div id="value-cards-pool" className={styles.gridTwoCols}>
              {/* Este div será preenchido pelo JavaScript */}
            </div>
          </div>
          <div className={styles.column} id="top-5-list">
            <h3>Seus 5 Essenciais</h3>
            <div className={styles.gridTwoCols}>
              <div
                className={styles.dropZone}
                data-placeholder="Arraste um valor essencial aqui"
              ></div>
              <div
                className={styles.dropZone}
                data-placeholder="Arraste um valor essencial aqui"
              ></div>
              <div
                className={styles.dropZone}
                data-placeholder="Arraste um valor essencial aqui"
              ></div>
              <div
                className={styles.dropZone}
                data-placeholder="Arraste um valor essencial aqui"
              ></div>
              <div
                className={styles.dropZone}
                data-placeholder="Arraste um valor essencial aqui"
              ></div>
            </div>
          </div>
        </div>
        <button id="goto-step3-btn" className="primary-btn" disabled>
          Definir Meus Valores
        </button>
      </section>

      {/* ETAPA 3: DEFINIÇÃO PESSOAL */}
      <section id="step3" className="step">
        <h2>Passo 3 de 5: O que esses valores significam para VOCÊ?</h2>
        <div className={styles.instructionsBox}>
          <p>
            Um mesmo valor pode ter significados diferentes para cada pessoa.
            Descreva em uma frase o que cada um dos seus 5 valores essenciais
            representa na sua vida hoje.
          </p>
        </div>
        <div id="definitions-container"></div>
        <button id="goto-step4-btn" className="primary-btn">
          Continuar para a Priorização
        </button>
      </section>

      {/* ETAPA 4: LUZ E SOMBRA */}
      <section id="step4" className="step">
        <h2>Passo 4 de 5: A Luz e a Sombra dos Seus Valores</h2>
        <div className={styles.instructionsBox}>
          <p>
            Todo valor tem duas faces: a "luz" que te impulsiona (seu{" "}
            <strong>Motivador</strong>) e a "sombra" que te limita (seu{" "}
            <strong>Sabotador</strong>). Descreva brevemente como cada valor
            atua na sua vida.
          </p>
        </div>
        <div className={styles.exampleBox}>
          <p>
            <strong>Exemplo prático para o valor "Honestidade":</strong>
          </p>
          <ul>
            <li>
              <strong>Ajuda (Motivador):</strong> "Minha 'Honestidade' me ajuda
              a construir confiança com meus clientes..."
            </li>
            <li>
              <strong>Atrapalha (Sabotador):</strong> "Às vezes, minha
              'Honestidade' excessiva me faz criar conflitos..."
            </li>
          </ul>
        </div>
        <div id="duality-container"></div>
        <button id="goto-step5-btn" className="primary-btn">
          Continuar para a Priorização
        </button>
      </section>

      {/* ETAPA 5: CONFRONTO */}
      <section id="step5" className="step">
        <h2>Passo 5 de 5: A Escolha Difícil - Priorização Final</h2>
        <div className={styles.instructionsBox}>
          <p>
            Para cada par de cenários abaixo, clique naquele que é{" "}
            <strong>mais importante para você neste momento da sua vida</strong>
            . Seja honesto, não há resposta errada.
          </p>
        </div>
        <div
          id="confrontation-container"
          className={styles.confrontationContainer}
        >
          <p
            id="confrontation-counter"
            className={styles.confrontationCounter}
          ></p>
          <div className={styles.confrontationBox}>
            <button id="optionA"></button>
            <span className={styles.vsSeparator}>vs</span>
            <button id="optionB"></button>
          </div>
        </div>
        <button id="goto-step6-btn" className="primary-btn" disabled>
          Ver Meu Resultado Final
        </button>
      </section>

      {/* ETAPA 6: RESULTADO */}
      <section id="step6" className="step">
        <h2>Seu Diagnóstico de Valores</h2>
        <div id="diagnosis-report" className={styles.instructionsBox}></div>
        <hr />
        <div className={styles.emailForm}>
          <h3>Receba seu relatório completo de valores.</h3>
          <p>
            Para receber a análise detalhada dos seus valores no seu e-mail,
            preencha os campos abaixo.
          </p>
          <label htmlFor="user-name" className="sr-only">
            Seu nome
          </label>
          <input type="text" id="user-name" placeholder="Seu nome*" />

          <label htmlFor="user-email" className="sr-only">
            Seu melhor e-mail
          </label>
          <input
            type="email"
            id="user-email"
            placeholder="Seu melhor e-mail*"
          />

          <label htmlFor="user-whatsapp" className="sr-only">
            Seu WhatsApp (Opcional)
          </label>
          <input
            type="tel"
            id="user-whatsapp"
            placeholder="Seu WhatsApp (Opcional)"
          />

          <button id="send-report-btn" className="primary-btn">
            Quero Receber Meu Relatório
          </button>
        </div>
      </section>
    </PageLayout>
  );
};

export default FerramentaValores;
