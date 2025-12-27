// components/Header.js

import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

const navLinkStyle = {
  textDecoration: 'none',
  color: 'var(--text-color)',
  padding: '0 15px',
  fontWeight: '500',
};

// Estilo para o link de admin, para dar um destaque
const adminLinkStyle = {
  ...navLinkStyle,
  color: 'var(--primary-color, #0070f3)',
  fontWeight: 'bold',
};

export default function Header({ hideLoginButton }) {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  return (
    <header style={{ paddingTop: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>

      {/* Seção Superior: Título e Subtítulo */}
      <div className="header-top" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1>Goulart Minds</h1>
          <p>Clareza. Planejamento. Ação.</p>
        </Link>
      </div>      

      {/* Seção Inferior: Barra de Navegação Principal */}
      <div 
        className="main-nav-bar" 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {/* Menu de Navegação à Esquerda */}
        <nav>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', alignItems: 'center' }}>
            <li><Link href="/" style={navLinkStyle}>Início</Link></li>
            <li><Link href="/ferramentas" style={navLinkStyle}>Ferramentas</Link></li>
            <li><Link href="/artigos" style={navLinkStyle}>Blog</Link></li>
            
            {/* ======================================================= */}
            {/* LINK DE ADMIN CONDICIONAL                               */}
            {/* ======================================================= */}
            {/* Só renderiza este item da lista se o usuário for admin */}
            {session?.user?.role === 'ADMIN' && (
              <li>
                <Link href="/admin/artigos/novo" style={adminLinkStyle}>
                  + Novo Artigo
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Controles de Usuário à Direita */}
        <div className="user-actions">
          {loading && (
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--secondary-color)' }}>Carregando...</p>
          )}

          {!loading && session && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Link href="/perfil" style={{...navLinkStyle, paddingRight: 0}}>
                Olá, {session.user.name?.split(' ')[0] || session.user.email}
              </Link>
              <button onClick={() => signOut()} className="header-login-btn">
                Sair
              </button>
            </div>
          )}

          {!loading && !session && (
            <button onClick={() => signIn('email', { callbackUrl: '/' })} className="header-login-btn">
              Entrar com E-mail
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
