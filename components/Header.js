// components/Header.js

import React, { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import styles from '../styles/Header.module.css';

export default function Header() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => {
    setTimeout(() => {
      setIsMenuOpen(false);
    }, 150);
  };

  return (
    <header className={styles.header}>
      {/* Seção Superior: Título e Subtítulo */}
      <div className={styles.headerTop}>
        <Link href="/" onClick={closeMenu}>
          <h1>Goulart Minds</h1>
          <p>Clareza. Planejamento. Ação.</p>
        </Link>
      </div>      

      {/* Seção Inferior: Barra de Navegação Principal */}
      <div className={styles.mainNavBar}>

        {/* Botão Hambúrguer (só visível no mobile via CSS) */}
        <button className={styles.hamburger} onClick={toggleMenu}>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>

        {/* Menu de Navegação à Esquerda */}
        <nav className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
          <ul className={styles.navList}>
            <li key="inicio"><Link href="/" className={styles.navLink} onClick={closeMenu}>Início</Link></li>
            <li key="ferramentas"><Link href="/ferramentas" className={styles.navLink} onClick={closeMenu}>Ferramentas</Link></li>
            <li key="artigos"><Link href="/artigos" className={styles.navLink} onClick={closeMenu}>Blog</Link></li>
            
            {session?.user?.role === 'ADMIN' && (
              <li key="novo-artigo">
                <Link href="/admin/artigos/novo" className={styles.adminLink} onClick={closeMenu}>+ Novo Artigo</Link>
              </li>
            )}

            {/* Ações do usuário para o menu mobile */}
            <li key="user-actions-mobile" className={styles.userActionsMobile}>
              {!loading && !session && (
                <button onClick={() => { closeMenu(); signIn('email', { callbackUrl: '/' }); }} className="header-login-btn">Entrar com E-mail</button>
              )}
              {!loading && session && (
                <div className={styles.mobileUserLoggedIn}>
                  <Link href="/perfil" className={styles.welcomeMessage} onClick={closeMenu}>
                    Olá, {session.user.name?.split(' ')[0] || session.user.email}
                  </Link>
                  <button onClick={() => { closeMenu(); signOut(); }} className="header-login-btn">Sair</button>
                </div>
              )}
            </li>
          </ul>
        </nav>

        {/* Controles de Usuário à Direita (versão desktop) */}
        <div className={styles.userActions}>
          {loading && <p className={styles.loadingText}>Carregando...</p>}
          {!loading && session && (
            <>
              <Link href="/perfil" className={styles.welcomeMessage}>
                Olá, {session.user.name?.split(' ')[0] || session.user.email}
              </Link>
              <button onClick={() => signOut()} className="header-login-btn">Sair</button>
            </>
          )}
          {!loading && !session && (
            <button onClick={() => signIn('email', { callbackUrl: '/' })} className="header-login-btn">Entrar com E-mail</button>
          )}
        </div>
      </div>
    </header>
  );
}