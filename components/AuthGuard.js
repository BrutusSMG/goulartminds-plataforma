// components/AuthGuard.js

import { signIn } from 'next-auth/react'; // signIn não é mais usado aqui
import { useRouter } from 'next/router';   // 1. Importe o useRouter
import React from 'react';

// Este hook não está mais em uso, mas podemos deixá-lo por enquanto.
// export function useAuthProtection() { ... }

// Este é o componente que mostra a tela de bloqueio.
export function AccessDenied() {
  const router = useRouter(); // 2. Use o hook do router
  const currentPage = router.asPath; // 3. Pegue o caminho da página atual

  const handleSignIn = () => {
    // 4. Salva a página que o usuário queria acessar no localStorage
    localStorage.setItem('redirectAfterLogin', currentPage);
    
    // 5. Redireciona para a nossa página de login
    router.push('/auth/signin');
  };

  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '50px 20px', 
      border: '1px solid #eee', 
      borderRadius: '8px', 
      backgroundColor: '#fafafa' 
    }}>
      <h2 style={{ marginBottom: '10px' }}>🔒 Acesso Restrito</h2>
      <p style={{ marginBottom: '25px', fontSize: '1.1rem' }}>
        Esta ferramenta é exclusiva para membros.
      </p>
      <button 
        onClick={handleSignIn} // 6. Usa a nova função de clique
        className="btn-next" 
        style={{ padding: '12px 25px', fontSize: '1.1rem' }}
      >
        Entrar ou Criar Conta
      </button>
      <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
        O acesso é gratuito, basta confirmar seu e-mail.
      </p>
    </div>
  );
}
