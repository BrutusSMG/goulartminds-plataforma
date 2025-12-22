/**
 * Ferramenta Roda da Vida - Goulart Minds
 * Versão Refatorada para ambiente Next.js/Vercel
 */

// Previne a reinicialização do script em ambientes de desenvolvimento com Hot Reload (HMR)
if (typeof window.inicializarRodaDaVida === 'undefined') {

    window.inicializarRodaDaVida = function() {
        console.log("Inicializando Ferramenta Roda da Vida...");

        // ===============================================================
        // SEÇÃO 1: DECLARAÇÃO DE VARIÁVEIS, CONSTANTES E DADOS
        // ===============================================================
        
        // --- MUDANÇA 1: Lendo os nomes das classes do CSS Modules ---
        const wrapper = document.getElementById('roda-container-wrapper');
        if (!wrapper) {
            console.error("Erro crítico: O elemento 'roda-container-wrapper' não foi encontrado no DOM.");
            return; // Aborta a execução se o container principal não existir.
        }
        const CLASSE_FATIA_CONTAINER = wrapper.dataset.styleFatiacontainer;
        const CLASSE_ANEL = wrapper.dataset.styleAnel;
        const CLASSE_SUB_AREA_TITULO = wrapper.dataset.styleSubareatitulo;
        const CLASSE_LINHA_INTERNA = wrapper.dataset.styleLinhainterna;

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

        const container = document.getElementById('roda-da-vida-container');
        const containerSubArea = document.getElementById('anel-sub-area');
        const questionsContainer = document.getElementById('reflection-questions-step1');

        // ===============================================================
        // SEÇÃO 2: DEFINIÇÃO DAS FUNÇÕES PRINCIPAIS
        // ===============================================================
        
        function renderizarRoda() {
            if (!container) return;
            container.innerHTML = '';

            todasSubAreas.forEach((subArea, index) => {
                const angulo = (index * 30) + 15;
                const fatiaContainer = document.createElement('div');
                // --- MUDANÇA 2: Usando a classe lida do data-attribute ---
                fatiaContainer.className = CLASSE_FATIA_CONTAINER;
                fatiaContainer.style.transform = `rotate(${angulo}deg)`;
                fatiaContainer.dataset.subArea = subArea;

                for (let i = 10; i >= 1; i--) {
                    const anel = document.createElement('div');
                    // --- MUDANÇA 2: Usando a classe lida do data-attribute ---
                    anel.className = CLASSE_ANEL;
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
                
                // O anel central agora é estático no JSX, não precisa ser criado aqui.
                
                container.appendChild(fatiaContainer);
            });
        }

        function renderizarSubtitulos() {
            if (!containerSubArea) return;
            containerSubArea.innerHTML = '';
            const fatorDistancia = 0.93;



            estruturaRoda.forEach((item, index) => {
                const angulo = (index * 30) + 15;
                
                const titulo = document.createElement('div');
                // --- MUDANÇA 2: Usando a classe lida do data-attribute ---
                titulo.className = CLASSE_SUB_AREA_TITULO;
                titulo.innerHTML = item.subArea.replace(/\|/g, '<br>');

                // 1. Calcula o deslocamento a partir do centro.
                //    '50 * fatorDistancia' resulta em um valor em 'vw' ou '%' relativo ao centro.
                const offsetX = 50 * fatorDistancia * Math.cos((angulo - 90) * Math.PI / 180);
                const offsetY = 50 * fatorDistancia * Math.sin((angulo - 90) * Math.PI / 180);

                // 2. Aplica o deslocamento ao posicionamento inicial de 50%
                //    A função 'calc()' do CSS faz a matemática no navegador.
                titulo.style.left = `calc(50% + ${offsetX}%)`;
                titulo.style.top = `calc(50% + ${offsetY}%)`;
                
                // 3. Aplica a rotação final para o texto ficar "de pé"
                titulo.style.transform = `translate(-50%, -50%) rotate(${angulo}deg)`;
                
                containerSubArea.appendChild(titulo);
            });
        }

        function renderizarLinhasInternas() {
            if (!containerSubArea) return;
            for (let i = 0; i < 12; i++) {
                const angulo = i * 30;
                const linha = document.createElement('div');
                // --- MUDANÇA 2: Usando a classe lida do data-attribute ---
                linha.className = CLASSE_LINHA_INTERNA;
                linha.style.transform = `rotate(${angulo}deg)`;
                containerSubArea.appendChild(linha);
            }
        }

        function renderizarGraficoResultado() {
            if (typeof Chart === 'undefined') return;
            const ctx = document.getElementById('graficoRodaDaVida').getContext('2d');
            const data = todasSubAreas.map(area => userScores[area]);
            const cores = todasSubAreas.map(area => estruturaRoda.find(item => item.subArea === area).cor);

            // Destrói gráfico anterior se existir, para evitar sobreposição
            if (window.myRadarChart instanceof Chart) {
                window.myRadarChart.destroy();
            }

            window.myRadarChart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: todasSubAreas.map(l => l.split('|')), // Chart.js 4 aceita arrays para multiline
                    datasets: [{
                        label: 'Nível de Satisfação',
                        data: data,
                        backgroundColor: cores.map(c => c.replace('0.65', '0.5')),
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
                        legend: { display: false } // Legenda pode ser redundante aqui
                    },
                    responsive: true,
                    maintainAspectRatio: true
                }
            });
        }

        function gerarImagemDaRoda() {
            if (typeof html2canvas === 'undefined') return;
            const imagemContainer = document.getElementById('imagem-roda-container');
            if (!wrapper || !imagemContainer) return;

            html2canvas(wrapper).then(canvas => {
                const imagem = new Image();
                imagem.src = canvas.toDataURL('image/png');
                imagemContainer.innerHTML = '';
                imagemContainer.appendChild(imagem);
            });
        }

        // ===============================================================
        // SEÇÃO 3: EVENT LISTENER GLOBAL
        // ===============================================================

        document.body.addEventListener('click', (e) => {
            const target = e.target;

            const anelClicado = target.closest(`.${CLASSE_ANEL}`);
            if (anelClicado && !anelClicado.classList.contains('anel-central')) {
                const fatiaContainer = anelClicado.closest(`.${CLASSE_FATIA_CONTAINER}`);
                if (fatiaContainer) {
                    const subArea = fatiaContainer.dataset.subArea;
                    const nota = parseInt(anelClicado.dataset.value, 10);
                    userScores[subArea] = nota;
                    console.log(`Área: ${subArea}, Nota: ${nota}`);

                    const cor = estruturaRoda.find(item => item.subArea === subArea).cor;
                    const todosOsAneisDaFatia = fatiaContainer.querySelectorAll(`.${CLASSE_ANEL}`);
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

            if (target.id === 'goto-step2-btn') {
                const todasPreenchidas = Object.values(userScores).every(score => score > 0);
                if (!todasPreenchidas) {
                    alert('Por favor, preencha todas as 12 áreas da Roda da Vida para continuar.');
                    return;
                }

                // --- MUDANÇA 4: Comunicação segura com React via CustomEvent ---
                console.log("[Script] Disparando evento 'tagUser' para o React.");
                const event = new CustomEvent('tagUser', { 
                  detail: { tag: 'roda-da-vida-concluida' } 
                });
                document.dispatchEvent(event);
                
                document.getElementById('step1').classList.remove('active');
                document.getElementById('step2').classList.add('active');
                window.scrollTo(0, 0);
                gerarImagemDaRoda();
                renderizarGraficoResultado();
            }
        });

        // ===============================================================
        // SEÇÃO 4: CHAMADA INICIAL
        // ===============================================================
        renderizarRoda();
        renderizarSubtitulos();
        renderizarLinhasInternas();

        // Recalcula os subtítulos ao redimensionar a janela para manter a responsividade
        window.addEventListener('resize', renderizarSubtitulos);
    };

    // Adiciona um listener para garantir que o DOM esteja pronto antes de executar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.inicializarRodaDaVida);
    } else {
        window.inicializarRodaDaVida();
    }
}
