// src/pages/em-construcao.js

import Head from 'next/head';
import Link from 'next/link';
import PageLayout from '../components/PageLayout'; // Reutiliza seu layout padrão
import styles from '../styles/EmConstrucao.module.css';

// Um ícone SVG simples de ferramentas para ilustrar
const ConstructionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
  </svg>
 );

export default function EmConstrucaoPage() {
  return (
    <PageLayout>
      <Head>
        <title>Página em Construção | Goulart Minds</title>
        {/* Impede que os buscadores indexem esta página */}
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className={styles.container}>
        <div className={styles.iconWrapper}>
          <ConstructionIcon />
        </div>
        <h1 className={styles.title}>Página em Construção</h1>
        <p className={styles.subtitle}>
          Estamos trabalhando duro para trazer um conteúdo incrível para esta seção.
            

          Volte em breve para conferir as novidades!
        </p>
        <Link href="/" className={styles.homeButton}>
          Voltar para a Página Inicial
        </Link>
      </div>
    </PageLayout>
  );
}
