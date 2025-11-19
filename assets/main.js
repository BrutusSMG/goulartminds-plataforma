// assets/main.js (Versão 3.1 - Gerenciador de Modais Corrigido)

// Trava para impedir a execução múltipla.
if (!window.goulartMindsPlatform) {
    window.goulartMindsPlatform = { hasInitialized: false };
}

document.addEventListener('DOMContentLoaded', () => {

    // Se o script principal já foi inicializado, não faz nada.
    if (window.goulartMindsPlatform.hasInitialized) {
        return;
    }
    // Marca que a inicialização começou.
    window.goulartMindsPlatform.hasInitialized = true;

    // Função para carregar um componente HTML em um placeholder
    const loadComponent = async (url, placeholderId) => {
        const placeholder = document.getElementById(placeholderId);
        if (!placeholder) {
            // Não loga erro se o placeholder for opcional (ex: não está em todas as páginas)
            // console.error(`Erro: Placeholder com id '${placeholderId}' não foi encontrado.`);
            return;
        }
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Falha ao carregar ${url}: ${response.statusText}`);
            }
            const html = await response.text();
            placeholder.innerHTML = html;
        } catch (error) {
            console.error(`Erro ao carregar o componente '${url}':`, error);
            placeholder.innerHTML = `<p style="color: red;">Erro ao carregar componente.</p>`;
        }
    };

    // Lista de todos os componentes a serem carregados na página
    const componentsToLoad = [
        loadComponent('/componentes/_header.html', 'header-placeholder'),
        loadComponent('/componentes/_footer.html', 'footer-placeholder'),
        loadComponent('/componentes/_copyright.html', 'copyright-placeholder')
    ];

    // Carrega todos os componentes em paralelo e depois inicializa a aplicação
    Promise.all(componentsToLoad)
        .then(() => {
            console.log('Todos os componentes foram carregados com sucesso.');
            
            // --- Lógica de Inicialização Pós-Carregamento ---

            // 1. Atualiza o título do header
            const pageTitle = document.title;
            const headerTitleElement = document.querySelector('#header-placeholder h1');
            if (headerTitleElement) {
                headerTitleElement.textContent = pageTitle;
            }
            
            // 2. Dispara evento de página pronta
            document.dispatchEvent(new CustomEvent('componentsLoaded'));

            // 3. Remove a classe 'loading' para exibir a página
            document.body.classList.remove('loading');

            // =================================================================
            // === GERENCIADOR GLOBAL DE MODAIS (CORRIGIDO) ====================
            // =================================================================
            
            // **CORREÇÃO:** Declara as variáveis dos modais AQUI
            const progressOverlay = document.querySelector('#footer-placeholder #progress-overlay');
            const successModal = document.querySelector('#footer-placeholder #success-modal');
            const successOkBtn = document.querySelector('#footer-placeholder #success-ok-btn');

            // Ouve o pedido para MOSTRAR o modal de progresso
            document.addEventListener('showProgress', () => {
                if (progressOverlay) progressOverlay.style.display = 'flex';
            });

            // Ouve o pedido para MOSTRAR o modal de sucesso
            document.addEventListener('showSuccess', () => {
                if (progressOverlay) progressOverlay.style.display = 'none';
                if (successModal) successModal.style.display = 'flex';
            });

            // Adiciona o evento de clique no botão OK do modal de sucesso
            if (successOkBtn) {
                successOkBtn.onclick = () => {
                    location.reload(); // Ação de resetar a página
                };
            } else {
                // Adiciona um log caso o botão não seja encontrado, para facilitar futuras depurações
                console.warn('Aviso: O botão do modal de sucesso (#success-ok-btn) não foi encontrado no DOM.');
            }
        })
        .catch(error => {
            console.error('Um ou mais componentes falharam ao carregar:', error);
            document.body.classList.remove('loading');
        });
});
