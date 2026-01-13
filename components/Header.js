// /components/Header.js

import React, { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import styles from '../styles/Header.module.css';

export default function Header() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <header className={styles.header}>
      <div 
        className={`${styles.overlay} ${isMenuOpen ? styles.active : ''}`}
        onClick={toggleMenu} 
      />
      <div className={styles.headerTop}>
        <Link href="/">
          <h1>Goulart Minds</h1>
          <p>Clareza. Planejamento. Ação.</p>
        </Link>
      </div>

      <div className={styles.mainNavBar}>
        <div className={styles.navLeft}>
          <button className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`} onClick={toggleMenu} aria-label="Abrir ou fechar menu" aria-expanded={isMenuOpen}>
            <div className={styles.hamburgerBox}>
              <div className={styles.hamburgerInner}></div>
            </div>
          </button>

          <nav className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
            <ul className={styles.navList}>
              <li key="inicio"><Link href="/" className={styles.navLink} onClick={toggleMenu}>Início</Link></li>
              <li key="ferramentas"><Link href="/ferramentas" className={styles.navLink} onClick={toggleMenu}>Ferramentas</Link></li>
              <li key="blog"><Link href="/blog" className={styles.navLink} onClick={toggleMenu}>Blog</Link></li>
              <li key="eventos"><Link href="/eventos" className={styles.navLink} onClick={toggleMenu}>Eventos</Link></li>
              
              {session?.user?.role === 'ADMIN' && (
                <>
                  <li key="novo-artigo">
                    <Link href="/admin/blog/novo" className={styles.adminLink} onClick={toggleMenu}>+ Novo Artigo</Link>
                  </li>
                  <li key="gerenciar-eventos">
                    <Link href="/admin/eventos" className={styles.adminLink} onClick={toggleMenu}>+ Gerenciar Eventos</Link>
                  </li>
                </>                
              )}
            </ul>
          </nav>
        </div>

        <div className={styles.navRight}>
          {loading && <p className={styles.loadingText}>Carregando...</p>}
          
          {!loading && !session && (
            <button onClick={() => signIn('email', { callbackUrl: '/' })} className="header-login-btn">
              Entrar com E-mail
            </button>
          )}

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
