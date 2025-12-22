// components/Modal.js

import React, { useState, useEffect } from 'react';

export default function Modals() {
  // 1. Estados para controlar a visibilidade de cada modal individualmente.
  //    Eles começam como 'false' para garantir que estejam escondidos no carregamento da página.
  const [isProgressVisible, setIsProgressVisible] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  // 2. useEffect para configurar "ouvintes" de eventos globais.
  //    Isso permite que qualquer parte da sua aplicação (React ou scripts puros)
  //    possa controlar a exibição dos modais de forma desacoplada.
  useEffect(() => {
    // Funções para alterar o estado de visibilidade
    const showProgress = () => setIsProgressVisible(true);
    const hideProgress = () => setIsProgressVisible(false);
    const showSuccess = () => setIsSuccessVisible(true);
    const hideSuccess = () => setIsSuccessVisible(false);

    // Configura os "ouvintes" para os eventos que controlam os modais
    document.addEventListener('showProgressModal', showProgress);
    document.addEventListener('hideProgressModal', hideProgress);
    document.addEventListener('showSuccessModal', showSuccess);
    document.addEventListener('hideSuccessModal', hideSuccess);

    // Função de limpeza: é executada quando o componente é "desmontado".
    // Isso é crucial para evitar vazamentos de memória e bugs.
    return () => {
      document.removeEventListener('showProgressModal', showProgress);
      document.removeEventListener('hideProgressModal', hideProgress);
      document.removeEventListener('showSuccessModal', showSuccess);
      document.removeEventListener('hideSuccessModal', hideSuccess);
    };
  }, []); // O array vazio [] garante que este useEffect rode apenas uma vez.
  
  // =======================================================
  // === MUDANÇA CRÍTICA AQUI ===
  // Função que será chamada quando o botão "Ok" for clicado.
  // =======================================================
  const handleSuccessOkClick = () => {
    // 1. Fecha o modal de sucesso.
    setIsSuccessVisible(false);

    // 2. Dispara um evento global para que a ferramenta saiba que deve resetar.
    
    window.location.reload();
  };

  // 3. A renderização agora é condicional.
  //    O HTML do modal só é adicionado à página se o estado correspondente for 'true'.
  //    Isso é muito mais eficiente e seguro do que apenas esconder com CSS.
  return (
    <>
      {/* O Modal de Barra de Progresso */}
      {isProgressVisible && (
        <div id="progress-overlay" className="modal-overlay">
          {/* ... modal de progresso ... */}
        </div>
      )}

      {/* O Modal de Sucesso */}
      {isSuccessVisible && (
        <div id="success-modal" className="modal-overlay">
          <div className="modal-content">
            <h3>Relatório Enviado!</h3>
            <p>Seu diagnóstico completo e o plano de ação foram enviados para o seu e-mail. Verifique sua caixa de entrada (e a de spam).</p>
            {/* Este botão agora fecha o modal ao ser clicado */}
            <button 
              id="success-ok-btn" 
              className="primary-btn"
              onClick={handleSuccessOkClick}
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </>
  );
}
