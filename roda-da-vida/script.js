document.addEventListener('DOMContentLoaded', () => {

    // 1. ESTRUTURA DE DADOS (PERMANECE A MESMA)
    const estruturaRoda = [
    // Tons de Vermelho/Laranja (PESSOAL)
    { subArea: "Saúde e|Disposição", cor: "rgba(231, 76, 60, 0.65)" },
    { subArea: "Desenvolvimento| Intelectual", cor: "rgba(211, 84, 0, 0.65)" },
    { subArea: "Equilíbrio| Emocional", cor: "rgba(192, 57, 43, 0.65)" },

    // Tons de Azul (QUALIDADE DE VIDA)
    { subArea: "Plenitude e| Felicidade", cor: "rgba(52, 152, 219, 0.65)" },
    { subArea: "Espiritualidade", cor: "rgba(41, 128, 185, 0.65)" },
    { subArea: "Criatividade,| Hobbies e| Diversão", cor: "rgba(26, 188, 156, 0.65)" },

    // Tons de Amarelo/Laranja (RELACIONAMENTOS)
    { subArea: "Vida| Social", cor: "rgba(241, 196, 15, 0.65)" },
    { subArea: "Desenvolvimento| Amoroso", cor: "rgba(243, 156, 18, 0.65)" },
    { subArea: "Família", cor: "rgba(230, 126, 34, 0.65)" },

    // Tons de Verde (PROFISSIONAL)
    { subArea: "Contribuição| Social", cor: "rgba(46, 204, 113, 0.65)" },
    { subArea: "Recursos| Financeiros", cor: "rgba(39, 174, 96, 0.65)" },
    { subArea: "Realização e| Propósito", cor: "rgba(22, 160, 133, 0.65)" }
];

    const todasSubAreas = estruturaRoda.map(item => item.subArea);
    let userScores = {};
    todasSubAreas.forEach(subArea => userScores[subArea] = 0);

    const container = document.getElementById('roda-da-vida-container');

    // 2. FUNÇÃO DE RENDERIZAÇÃO (COM TEXTO ARQUEADO)
    function renderizarRoda() {
        if (!container) return;

        todasSubAreas.forEach((subArea, index) => {
            const angulo = (index * 30) +15;
            
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

    // 3. LÓGICA DE CLIQUE (PERMANECE A MESMA)
    container.addEventListener('click', (e) => {
        const anelClicado = e.target.closest('.anel:not(.anel-central)');
        if (!anelClicado) return;

        const fatiaContainer = anelClicado.closest('.fatia-container');
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
        
        // Verifica se todas as áreas foram preenchidas
        const todasPreenchidas = Object.values(userScores).every(score => score > 0);
        const questionsContainer = document.getElementById('reflection-questions-step1');

        // Se todas foram preenchidas e o contêiner de perguntas existe...
        if (todasPreenchidas && questionsContainer) {
            // ...remove a classe 'hidden' para mostrá-lo.
            questionsContainer.classList.remove('hidden');
        }

    });

    function renderizarSubtitulos() {
        const containerSubArea = document.getElementById('anel-sub-area');
        
        if (!containerSubArea) return;

        estruturaRoda.forEach((item, index) => {
            const angulo = (index * 30) + 15; // +15 para centralizar no meio da fatia
            const distanciaDoCentro = 299; // Distância do centro do contêiner
            const alturaLinha = 18;
            const linhas = item.subArea.split('|');
            

            const titulo = document.createElement('div');
            titulo.className = 'sub-area-titulo';
            titulo.innerHTML = item.subArea.replace(/\|/g, '<br>');

            // Posiciona e rotaciona o texto
            const x = 50 + (distanciaDoCentro / 6.5 * Math.cos((angulo - 90) * Math.PI / 180));
            const y = 50 + (distanciaDoCentro / 6.5 * Math.sin((angulo - 90) * Math.PI / 180));
            
            titulo.style.left = `${x}%`;
            titulo.style.top = `${y}%`;
            titulo.style.transform = `translate(-50%, -50%) rotate(${angulo}deg)`;

            containerSubArea.appendChild(titulo);
        });
    }

    function renderizarLinhasInternas() {
        const containerLinhas = document.getElementById('anel-sub-area');
        if (!containerLinhas) return;

        // Cria 12 linhas, uma a cada 30 graus
        for (let i = 0; i < 12; i++) {
            const angulo = i * 30;

            const linha = document.createElement('div');
            linha.className = 'linha-interna';
            linha.style.transform = `rotate(${angulo}deg)`;

            containerLinhas.appendChild(linha);
        }
    }

    // ... (O resto do código permanece o mesmo) ...
    const gotoStep2Btn = document.getElementById('goto-step2-btn');
    gotoStep2Btn.addEventListener('click', () => {
        const todasPreenchidas = Object.values(userScores).every(score => score > 0);
        if (!todasPreenchidas) {
            alert('Por favor, preencha todas as 12 áreas da Roda da Vida para continuar.');
            return;
        }
        renderizarResultado();
        document.getElementById('step1').classList.remove('active');
        document.getElementById('step2').classList.add('active');
        window.scrollTo(0, 0);
    });

    function renderizarResultado() {
        const ctx = document.getElementById('graficoRodaDaVida').getContext('2d');
        const data = todasSubAreas.map(area => userScores[area]);
        const cores = todasSubAreas.map(area => estruturaRoda.find(item => item.subArea === area).cor);

        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: todasSubAreas,
                datasets: [{
                    label: 'Nível de Satisfação',
                    data: data,
                    backgroundColor: cores.map(c => c.replace('1.0', '0.5')),
                    borderColor: cores,
                    borderWidth: 2
                }]
            },
            options: { scales: { r: { suggestedMin: 0, suggestedMax: 10, ticks: { stepSize: 1 } } } }
        });
    }

    renderizarRoda();
    renderizarSubtitulos();
    renderizarLinhasInternas();
});
