// /pages/blog/index.js

import { getSession } from 'next-auth/react';
import PageLayout from '../../components/PageLayout';
import client from '../../lib/db';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../../styles/blogIndexPage.module.css'; // Estilo para esta página
import { useSession } from 'next-auth/react';

// COMPONENTE QUE RENDERIZA A PÁGINA
export default function BlogIndexPage({ articles }) {
  const { data: session } = useSession(); // Pega a sessão do usuário

  return (
    <PageLayout title="Blog">
      <div className={styles.blogContainer}>
        <header className={styles.blogHeader}>
          <h1>Blog IE</h1>
          <p>Reflexões, ferramentas e insights para sua jornada de autoconhecimento.</p>
        </header>

        <div className={styles.articlesGrid}>
          {articles.map((article) => (
            // O 'div' pai do card agora tem a 'key' e a classe.
            // Ele precisa ter 'position: relative' no CSS.
            <div key={article.id} className={styles.articleCard}>

              {/* 👇 TAG DE RASCUNHO PARA ADMINS 👇 */}
              {!article.published && session?.user?.role === 'ADMIN' && (
                <span className={styles.draftBadge}>RASCUNHO</span>
              )}
              
              {/* Este Link envolve apenas a parte clicável para o usuário comum */}
              <Link href={`/artigos/${article.slug.replace(/^\//, '')}`} className={styles.cardLinkWrapper}>
                <div className={styles.cardImageContainer}>
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className={styles.cardContent}>
                  <h2 className={styles.cardTitle}>{article.title}</h2>
                  <p className={styles.cardDescription}>{article.description}</p>
                  <span className={styles.cardReadMore}>Ler mais &rarr;</span>
                </div>
              </Link>

              {/* 👇 BOTÃO DE EDIÇÃO CONDICIONAL 👇 */}
              {/* Ele fica dentro do .map() e tem acesso à variável 'article' */}
              {session?.user?.role === 'ADMIN' && (
                <div className={styles.editButtonContainer}>
                  <Link href={`/admin/artigos/editar/${article.slug.replace(/^\//, '')}`} className={styles.editButton}>
                    Editar
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        {articles.length === 0 && (
          <p className={styles.noArticlesMessage}>
            Nenhum artigo publicado ainda. Volte em breve!
          </p>
        )}
      </div>
    </PageLayout>
  );
}
// FUNÇÃO DE BUSCA DE DADOS (EXECUTADA NO SERVIDOR)
export async function getServerSideProps(context) {
  try {
    // 1. Pega a sessão do usuário NO LADO DO SERVIDOR
    const session = await getSession(context);

    // 2. Define o filtro padrão: apenas artigos publicados
    const whereClause = {
      published: true,
    };

    // 3. Se o usuário da sessão for um ADMIN, remove o filtro para buscar TUDO
    if (session?.user?.role === 'ADMIN') {
      delete whereClause.published; // Remove a propriedade 'published' do filtro
    }

    // 4. Executa a busca no banco de dados com a cláusula 'where' correta
    const articles = await client.article.findMany({
      // Ordena os artigos do mais novo para o mais antigo
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      props: {
        // Garante que os dados sejam serializáveis (convertíveis para JSON)
        articles: JSON.parse(JSON.stringify(articles)),
      },
    };
  } catch (error) {
    console.error("Erro ao buscar artigos para a página do blog:", error);
    return {
      props: {
        articles: [], // Retorna um array vazio em caso de erro
      },
    };
  }
}
