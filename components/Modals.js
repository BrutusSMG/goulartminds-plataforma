// components/Footer.js

export default function Modals() {
  return (
    <>      
      <div id="progress-overlay" className="modal-overlay">
          <div className="progress-bar-container">
              <div className="progress-bar"></div>
              <p>Processando seu resultado...</p>
          </div>
      </div>
      <div id="success-modal" className="modal-overlay">
          <div className="modal-content">
              <h3>Relatório Enviado!</h3>
              <p>Seu diagnóstico completo e o plano de ação foram enviados para o seu e-mail. Verifique sua caixa de entrada (e a de spam).</p>
              <button id="success-ok-btn" className="primary-btn">Ok</button>
          </div>
      </div>
    </>
  );
}