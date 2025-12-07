// components/Header.js

import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Header({ hideLoginButton }) {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  return (
    <header>
      <div className="logo-placeholder"></div>
      <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1>Goulart Minds</h1>
        <p>Descubra o que realmente aciona sua reatividade</p>
      </Link>
      <div className="login-controls" style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
        
        {loading && <p>Carregando...</p>}

        {!loading && !session && !hideLoginButton && (
          <button onClick={() => signIn('email', { callbackUrl: '/' })}>Entrar com E-mail</button>
        )}

        {/* -> MUDANÇA APLICADA AQUI <- */}
        {!loading && session && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* O nome do usuário agora é um link para a página de perfil */}
            <Link href="/perfil" legacyBehavior>
              <a className="profile-link" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
                Olá, {session.user.name || session.user.email}
              </a>
            </Link>
            
            <button onClick={() => signOut()} style={{ padding: '10px 15px', cursor: 'pointer' }}>
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
