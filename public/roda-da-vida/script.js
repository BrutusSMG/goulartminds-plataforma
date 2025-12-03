/**
 * Ferramenta Roda da Vida - Goulart Minds
 * Versão Refatorada para ambiente Next.js/Vercel * 
 */

// Previne a reinicialização do script em ambientes de desenvolvimento com Hot Reload (HMR)
if (typeof inicializarRodaDaVida !== 'function') {

    function inicializarRodaDaVida() {
        console.log("Inicializando Ferramenta Roda da Vida...");

        // ===============================================================
        // SEÇÃO 1: DECLARAÇÃO DE VARIÁVEIS, CONSTANTES E DADOS
        // ===============================================================
        const estruturaRoda = [
            { subArea: "Saúde e|Disposição", cor: "rgba(231, 76, 60, 0.65)" },
            { subArea: "Desenvolvimento| Intelectual", cor: "rgba(211, 84, 0, 0.65)" },
            { subArea: "Equilíbrio| Emocional", cor: "rgba(192, 57, 43, 0.65)" },
            { subArea: "Plenitude e| Felicidade", cor: "rgba(52, 152, 219, 0.65)" },
            { subArea: "Espiritualidade", cor: "rgba(41, 128, 185, 0.65)" },
            { subArea: "Criatividade,| Hobbies e| Diversão", cor: "rgba(26, 188, 156, 0.65)" },
            { subArea: "Vida| Social", cor: "rgba(241, 196, 15, 0.65)" },
            { subArea: "Desenvolvimento| Amoroso", cor: "rgba(243, 156, 18, 0.65)" },
            { subArea: "Família", cor: "rgba(230, 126, 34, 0.65)" },
            { subArea: "Contribuição| Social", cor: "rgba(46, 204, 113, 0.65)" },
            { subArea: "Recursos| Financeiros", cor: "rgba(39, 174, 96, 0.65)" },
            { subArea: "Realização e| Propósito", cor: "rgba(22, 160, 133, 0.65)" }
        ];

        const todasSubAreas = estruturaRoda.map(item => item.subArea);
        let userScores = {};
        todasSubAreas.forEach(subArea => userScores[subArea] = 0);

        // --- Elementos do DOM ---
        const container = document.getElementById('roda-da-vida-container');
        const containerSubArea = document.getElementById('anel-sub-area');
        const questionsContainer = document.getElementById('reflection-questions-step1');

        // ===============================================================
        // SEÇÃO 2: DEFINIÇÃO DAS FUNÇÕES PRINCIPAIS
        // ===============================================================

        function renderizarRoda() {
            if (!container) return;
            container.innerHTML = ''; // Limpa antes de renderizar

            todasSubAreas.forEach((subArea, index) => {
                const angulo = (index * 30) + 15;
                const fatiaContainer = document.createElement('div');
                fatiaContainer.className = 'fatia-container';
                fatiaContainer.style.transform = `rotate(${angulo}deg)`;
                fatiaContainer.dataset.subArea = subArea;

                for (let i = 10; i >= 1; i--) {
                    const anel = document.createElement('div');
                    anel.className = 'anel';
                    anel.dataset.value = i;
                    const tamanho = (i + 1) * (100 / 11);
                    anel.style.width = `${tamanho}%`;
                    anel.style.height = `${tamanho}%`;
                    anel.style.top = `${(100 - tamanho) / 2}%`;
                    anel.style.left = `${(100 - tamanho) / 2}%`;
                    const numero = document.createElement('span');
                    numero.textContent = i;
                    anel.appendChild(numero);
                    fatiaContainer.appendChild(anel);
                }
                
                const anelCentral = document.createElement('div');
                anelCentral.className = 'anel anel-central';
                const tamanhoCentral = 1 * (100 / 11);
                anelCentral.style.width = `${tamanhoCentral}%`;
                anelCentral.style.height = `${tamanhoCentral}%`;
                anelCentral.style.top = `${(100 - tamanhoCentral) / 2}%`;
                anelCentral.style.left = `${(100 - tamanhoCentral) / 2}%`;
                fatiaContainer.appendChild(anelCentral);
                
                container.appendChild(fatiaContainer);
            });
        }

        function renderizarSubtitulos() {
            if (!containerSubArea) return;
            containerSubArea.innerHTML = ''; // Limpa antes de renderizar

            estruturaRoda.forEach((item, index) => {
                const angulo = (index * 30) + 15;
                const distanciaDoCentro = 299;
                const linhas = item.subArea.split('|');
                
                const titulo = document.createElement('div');
                titulo.className = 'sub-area-titulo';
                titulo.innerHTML = item.subArea.replace(/\|/g, '<br/>');

                const x = 50 + (distanciaDoCentro / 6.5 * Math.cos((angulo - 90) * Math.PI / 180));
                const y = 50 + (distanciaDoCentro / 6.5 * Math.sin((angulo - 90) * Math.PI / 180));
                
                titulo.style.left = `${x}%`;
                titulo.style.top = `${y}%`;
                titulo.style.transform = `translate(-50%, -50%) rotate(${angulo}deg)`;
                containerSubArea.appendChild(titulo);
            });
        }

        function renderizarLinhasInternas() {
            if (!containerSubArea) return;
            // Não precisa limpar, pois os subtítulos já limparam
            for (let i = 0; i < 12; i++) {
                const angulo = i * 30;
                const linha = document.createElement('div');
                linha.className = 'linha-interna';
                linha.style.transform = `rotate(${angulo}deg)`;
                containerSubArea.appendChild(linha);
            }
        }

        function renderizarGraficoResultado() {
            // A dependência do Chart.js deve ser carregada no HTML/JSX
            if (typeof Chart === 'undefined') {
                console.error('Chart.js não foi carregado. O gráfico não pode ser renderizado.');
                return;
            }
            const ctx = document.getElementById('graficoRodaDaVida').getContext('2d');
            const data = todasSubAreas.map(area => userScores[area]);
            const cores = todasSubAreas.map(area => estruturaRoda.find(item => item.subArea === area).cor);

            new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: todasSubAreas.map(l => l.replace(/\|/g, ' ')), // Remove quebras de linha para o gráfico
                    datasets: [{
                        label: 'Nível de Satisfação',
                        data: data,
                        backgroundColor: cores.map(c => c.replace('0.65', '0.5')), // Ajusta opacidade
                        borderColor: cores,
                        borderWidth: 2
                    }]
                },
                options: {
                    scales: {
                        r: {
                            angleLines: { color: 'rgba(0, 0, 0, 0.1)' },
                            grid: { color: 'rgba(0, 0, 0, 0.1)' },
                            pointLabels: { font: { size: 12 } },
                            suggestedMin: 0,
                            suggestedMax: 10,
                            ticks: { stepSize: 1, backdropColor: 'transparent' }
                        }
                    },
                    plugins: {
                        legend: { labels: { font: { size: 14 } } }
                    }
                }
            });
        }

        function gerarImagemDaRoda() {
        // Verifica se a biblioteca html2canvas foi carregada
        if (typeof html2canvas === 'undefined') {
            console.error('html2canvas não foi carregado. A imagem não pode ser gerada.');
            return;
        }

        const rodaWrapper = document.getElementById('roda-container-wrapper');
        const imagemContainer = document.getElementById('imagem-roda-container');

        if (!rodaWrapper || !imagemContainer) return;

        // Usa a biblioteca para criar um canvas a partir do div da roda
        html2canvas(rodaWrapper).then(canvas => {
            // Converte o canvas em uma imagem PNG
            const imagem = new Image();
            imagem.src = canvas.toDataURL('image/png');
            
            // Limpa o contêiner e adiciona a nova imagem
            imagemContainer.innerHTML = '';
            imagemContainer.appendChild(imagem);
        });
    }

        // ===============================================================
        // SEÇÃO 3: EVENT LISTENER GLOBAL
        // ===============================================================

        document.body.addEventListener('click', (e) => {
            const target = e.target;

            // --- Lógica de clique na Roda (Etapa 1) ---
            const anelClicado = target.closest('.anel:not(.anel-central)');
            if (anelClicado) {
                const fatiaContainer = anelClicado.closest('.fatia-container');
                if (fatiaContainer) {
                    const subArea = fatiaContainer.dataset.subArea;
                    const nota = parseInt(anelClicado.dataset.value, 10);
                    const cor = estruturaRoda.find(item => item.subArea === subArea).cor;

                    userScores[subArea] = nota;
                    console.log(`Área: ${subArea}, Nota: ${nota}`);

                    const todosOsAneisDaFatia = fatiaContainer.querySelectorAll('.anel:not(.anel-central)');
                    todosOsAneisDaFatia.forEach(anel => {
                        const valorAnel = parseInt(anel.dataset.value, 10);
                        if (valorAnel <= nota) {
                            anel.style.backgroundColor = cor;
                            anel.querySelector('span').style.color = 'white';
                        } else {
                            anel.style.backgroundColor = 'transparent';
                            anel.querySelector('span').style.color = '#555';
                        }
                    });
                    
                    const todasPreenchidas = Object.values(userScores).every(score => score > 0);
                    if (todasPreenchidas && questionsContainer) {
                        questionsContainer.classList.remove('hidden');
                    }
                }
            }

            // --- Lógica de clique no botão de navegação ---
            if (target.id === 'goto-step2-btn') {
                const todasPreenchidas = Object.values(userScores).every(score => score > 0);
                if (!todasPreenchidas) {
                    alert('Por favor, preencha todas as 12 áreas da Roda da Vida para continuar.');
                    return;
                }
                document.getElementById('step1').classList.remove('active');
                document.getElementById('step2').classList.add('active');
                window.scrollTo(0, 0);
                gerarImagemDaRoda()
                renderizarGraficoResultado();
            }
        });

        // ===============================================================
        // SEÇÃO 4: CHAMADA INICIAL
        // ===============================================================
        renderizarRoda();
        renderizarSubtitulos();
        renderizarLinhasInternas();
    }

    // Ponto de entrada que inicia a ferramenta
    inicializarRodaDaVida();
}
