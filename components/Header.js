// src/components/Header.js

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

        {/* --- LADO ESQUERDO DA BARRA DE NAVEGAÇÃO --- */}
        <div className={styles.navLeft}>
          {/* Botão Hambúrguer (só visível no mobile) */}
          <button className={styles.hamburger} onClick={toggleMenu} aria-label="Abrir menu">
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
          </button>

          {/* Menu de Navegação (contém APENAS os links) */}
          <nav className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
            <ul className={styles.navList}>
              <li key="inicio"><Link href="/" className={styles.navLink} onClick={closeMenu}>Início</Link></li>
              <li key="ferramentas"><Link href="../ferramentas" className={styles.navLink} onClick={closeMenu}>Ferramentas</Link></li>
              <li key="artigos"><Link href="/artigos" className={styles.navLink} onClick={closeMenu}>Blog</Link></li>
              <li key="eventos"><Link href="/em-construcao" className={styles.navLink} onClick={closeMenu}>Eventos</Link></li>
              
              {session?.user?.role === 'ADMIN' && (
                <li key="novo-artigo">
                  <Link href="/admin/artigos/novo" className={styles.adminLink} onClick={closeMenu}>+ Novo Artigo</Link>
                </li>
              )}
              {/* O <li> com as ações do usuário foi REMOVIDO daqui */}
            </ul>
          </nav>
        </div>

        {/* --- LADO DIREITO DA BARRA DE NAVEGAÇÃO --- */}
        <div className={styles.navRight}>
          {loading && <p className={styles.loadingText}>Carregando...</p>}
          
          {/* Se NÃO estiver logado, mostra o botão "Entrar" */}
          {!loading && !session && (
            <button onClick={() => signIn('email', { callbackUrl: '/' })} className="header-login-btn">
              Entrar com E-mail
            </button>
          )}

          {/* Se ESTIVER logado, mostra Olá/Sair */}
          {!loading && session && (
            <div className={styles.userActions}>
              <Link href="/perfil" className={styles.welcomeMessage}>
                Olá, {session.user.name?.split(' ')[0] || session.user.email}
              </Link>
              <button onClick={() => signOut()} className="header-login-btn">Sair</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
