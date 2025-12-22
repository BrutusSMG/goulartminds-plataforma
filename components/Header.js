// components/Header.js

import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Header({ hideLoginButton }) {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  return (
    // 1. O <header> agora é um contêiner flex
    <header style={{ paddingTop: '20px' }}>
    
      {/* Seção Superior: Título e Subtítulo (Centralizados) */}
      <div className="header-top" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1>Goulart Minds</h1>
          <p>Clareza. Planejamento. Ação.</p>
        </Link>
      </div>

      {/* Seção Inferior: Controles de Login */}
      <div 
        className="user-actions-bar" 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '15px',
          borderTop: '1px solid var(--border-color)'
        }}
      >
        {loading && (
            // Ocupa todo o espaço e alinha o texto à direita
            <div style={{ width: '100%', textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--secondary-color)' }}>Carregando...</p>
            </div>
          )}

        {/* Botão de Login (Não logado) */}
        {!loading && !session && !hideLoginButton && (
            <>
              {/* Elemento "fantasma" para empurrar o botão para a direita */}
              <span></span> 
              <button onClick={() => signIn('email', { callbackUrl: '/' })} className="header-login-btn">
                Entrar com E-mail
              </button>
            </>
          )}

        {/* Controles de Usuário (Logado) */}
        {!loading && session && (
            <>
              <Link href="/perfil" legacyBehavior>
                <a className="profile-link">
                  Olá, {session.user.name || session.user.email}
                </a>
              </Link>
              
              <button onClick={() => signOut()} className="header-login-btn">
                Sair
              </button>
            </>
        )}
      </div>
    </header>
  );
}
