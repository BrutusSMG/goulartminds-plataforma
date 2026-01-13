// /pages/artigos/[slug].js

import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react'; 
import PageLayout from '../../components/PageLayout';
import client from '../../lib/db';
import Image from 'next/image';
import styles from '../../styles/articlePage.module.css';
import Head from 'next/head';
import SocialIcon from '../../components/SocialIcon';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Comments from '../../components/Comments';

function HeartIcon({ filled }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={filled ? 'red' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  );
}

// Componente principal da página (sem alterações na lógica interna)
export default function ArticlePage({ article }) {
  if (!article) {
    return <PageLayout title="Artigo não encontrado"><p>Desculpe, este artigo não foi encontrado.</p></PageLayout>;
  }

  const [likes, setLikes] = useState(article.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [articleUrl, setArticleUrl] = useState('');
  const createdAtDate = new Date(article.createdAt);
  const updatedAtDate = new Date(article.updatedAt);
  const hasBeenUpdated = updatedAtDate.getTime() - createdAtDate.getTime() > 60000;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setArticleUrl(window.location.href);
    }
    const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '[]');
    if (likedArticles.includes(article.slug)) {
      setHasLiked(true);
    }
  }, [article.slug]);

  const handleLike = async () => {
    if (hasLiked) return;
    setLikes(likes + 1);
    setHasLiked(true);
    const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '[]');
    localStorage.setItem('likedArticles', JSON.stringify([...likedArticles, article.slug]));
    try {
      await fetch('/api/articles/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: article.slug }),
      });
    } catch (error) {
      console.error('Erro ao registrar a curtida:', error);
    }
  };

  const handleModernShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: articleUrl,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Erro ao compartilhar:', error);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(articleUrl);
        alert('Link copiado para a área de transferência!');
      } catch (err) {
        console.error('Falha ao copiar o link:', err);
        alert('Não foi possível copiar o link.');
      }
    }
  };

  return (
    <PageLayout title={article.title}>
      <Head>
        <title>{article.title}</title>
        <meta name="description" content={article.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={articleUrl} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.description} />
        <meta property="og:image" content={article.imageUrl} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={articleUrl} />
        <meta property="twitter:title" content={article.title} />
        <meta property="twitter:description" content={article.description} />
        <meta property="twitter:image" content={article.imageUrl} />
      </Head>

      <article className={styles.articleContainer}>
        <header className={styles.articleHeader}>
          <h1 className={styles.articleTitle}>{article.title}</h1>
          {article.subtitle && <h2 className={styles.articleSubtitle}>{article.subtitle}</h2>}
          <div className={styles.imageContainer}>
            <Image 
              src={article.imageUrl} 
              alt={article.title} 
              fill={true}
              sizes="100vw"
              style={{ objectFit: 'cover' }}
              priority={true}
            />
          </div>
        </header>

        <div className={styles.interactionBar}>
          <button onClick={handleLike} className={styles.likeButton} disabled={hasLiked}>
            <HeartIcon filled={hasLiked} />
            <span>{likes}</span>
          </button>
          <div className={styles.shareButtons}>
            <span>Compartilhe: &nbsp;</span>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${articleUrl}`} target="_blank" rel="noopener noreferrer" className={`${styles.shareButton} ${styles.desktopOnly}`} aria-label="Compartilhar no Facebook">
              <SocialIcon name="facebook" />
            </a>
            <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${articleUrl}`} target="_blank" rel="noopener noreferrer" className={`${styles.shareButton} ${styles.desktopOnly}`} aria-label="Compartilhar no LinkedIn">
              <SocialIcon name="linkedin" />
            </a>
            <a href={`https://api.whatsapp.com/send?text=${article.title} - ${articleUrl}`} target="_blank" rel="noopener noreferrer" className={`${styles.shareButton} ${styles.desktopOnly}`} aria-label="Compartilhar no WhatsApp">
              <SocialIcon name="whatsapp" />
            </a>
            <a href={`https://twitter.com/intent/tweet?url=${articleUrl}&text=${encodeURIComponent(article.title  )}`} target="_blank" rel="noopener noreferrer" className={`${styles.shareButton} ${styles.desktopOnly}`} aria-label="Compartilhar no Twitter/X">
              <SocialIcon name="twitter" />
            </a>
            <button onClick={handleModernShare} className={`${styles.shareButton} ${styles.mobileOnly}`} aria-label="Compartilhar">
              <SocialIcon name="share" />
            </button>
          </div>          
        </div>

        <div className={styles.dateInfo}>
            <span>
              Publicado em {format(new Date(article.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </span>  

            {hasBeenUpdated && (
              <span className={styles.updatedDate}>
                (Atualizado em {format(new Date(article.updatedAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })})
              </span>
            )}
        </div>
        
        <div className={styles.authorSection}>
          <span className={styles.authorLabel}>Elaborado por:</span>
          <p className={styles.authorName}>{article.author.name}</p>
        </div>
        
        <div 
          className={styles.articleContent}
          dangerouslySetInnerHTML={{ __html: article.content }} 
        />
        
        <Comments articleId={article.id} />
      </article>
    </PageLayout>
  );
}


// =================================================================================
//  A ÚNICA FUNÇÃO DE BUSCA DE DADOS PARA ESTA PÁGINA
//  As funções getStaticPaths e getStaticProps foram removidas para evitar conflito.
// =================================================================================
export async function getServerSideProps(context) {
  try {
    const { slug } = context.params;
    const session = await getSession(context);

    const whereClause = {
      slug: slug,
      published: true,
    };

    if (session?.user?.role === 'ADMIN') {
      delete whereClause.published;
    }

    const article = await client.article.findFirst({
      where: whereClause,
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    if (!article) {
      return { notFound: true };
    }

    return {
      props: {
        article: JSON.parse(JSON.stringify(article)),
      },
    };
  } catch (error) {
    console.error(`Erro em getServerSideProps para o slug: ${context.params?.slug || 'desconhecido'}`, error);
    return { notFound: true };
  }
}