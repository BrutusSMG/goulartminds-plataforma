// src/pages/artigos/[slug].js

import PageLayout from '../../components/PageLayout';
import client from '../../lib/db';
import Image from 'next/image';
import styles from '../../styles/articlePage.module.css'; // Reutilizamos o estilo que já criamos

export default function ArticlePage({ article }) {
  // Se getStaticProps não encontrar o artigo, o fallback já terá retornado 404.
  // Esta verificação é uma segurança extra.
  if (!article) {
    return <PageLayout title="Artigo não encontrado"><p>Desculpe, este artigo não foi encontrado.</p></PageLayout>;
  }

  return (
    <PageLayout title={article.title}>
      <article className={styles.articleContainer}>
        <header className={styles.articleHeader}>
          <h1 className={styles.articleTitle}>{article.title}</h1>
          {article.subtitle && <h2 className={styles.articleSubtitle}>{article.subtitle}</h2>}
          
          {/* A imagem de destaque do artigo */}
          <div className={styles.imageContainer}>
            {/* 👇 COMPONENTE IMAGE ATUALIZADO 👇 */}
            <Image 
              src={article.imageUrl} 
              alt={article.title} 
              fill={true} // Nova sintaxe
              sizes="100vw" // Nova propriedade obrigatória com 'fill'
              style={{ objectFit: 'cover' }} // Nova sintaxe para objectFit
              priority={true} // Carrega esta imagem primeiro, pois é a mais importante (LCP)
            />
          </div>
        </header>
        
        {/* O conteúdo principal do artigo */}
        <div 
          className={styles.articleContent}
          dangerouslySetInnerHTML={{ __html: article.content }} 
        />
      </article>
    </PageLayout>
  );
}

// 1. getStaticPaths: Informa ao Next.js quais artigos existem
export async function getStaticPaths() {
  try {
    const articles = await client.article.findMany({
      select: { slug: true },
    });
    const paths = articles.map((article) => ({
      params: { slug: article.slug },
    }));
    return { paths, fallback: 'blocking' };
  } catch (error) {
    console.error("Erro em getStaticPaths:", error);
    return { paths: [], fallback: 'blocking' };
  }
}

// 2. getStaticProps: Busca os dados para um artigo específico
export async function getStaticProps({ params }) {
  try {
    const article = await client.article.findUnique({
      where: { slug: params.slug },
    });

    if (!article) {
      return { notFound: true };
    }

    return {
      props: {
        article: JSON.parse(JSON.stringify(article)),
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error(`Erro em getStaticProps para o slug ${params.slug}:`, error);
    return { notFound: true };
  }
}
