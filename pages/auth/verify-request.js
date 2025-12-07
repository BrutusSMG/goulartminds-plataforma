// pages/auth/verify-request.js

import PageLayout from '../../components/PageLayout'; // 1. Importe o PageLayout

export default function VerifyRequestPage() {
  return (
    // 2. Use o PageLayout e passe as propriedades
    <PageLayout title="Verifique seu E-mail" hideLoginButton={true}>
      
      {/* 3. O conteúdo da página vai aqui dentro */}
      <div className="tool-wrapper" style={{ maxWidth: '500px', margin: '40px auto', textAlign: 'center' }}>
        <div className="step-header">
          <h1>✔️ Quase lá!</h1>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>
            Enviamos um link de acesso para o seu e-mail.
          </p>
        </div>
        
        <div className="step-content">
          <p>
            Por favor, verifique sua caixa de entrada (e a pasta de spam, por via das dúvidas) e clique no link para completar o login.
          </p>
          <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
            Você já pode fechar esta aba.
          </p>
        </div>
      </div>

    </PageLayout>
  );
}
