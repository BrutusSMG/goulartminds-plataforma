// /pages/index.js
import PageLayout from "../components/PageLayout";
import styles from "../styles/homepage.module.css";
import Link from "next/link";
import Image from "next/image";
import client from "../lib/db";

const QuoteIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 14.725C13 11.585 15.585 9 18.725 9C21.865 9 24 11.585 24 14.725C24 17.865 21.865 21 18.725 21H18.5C15.46 21 13 18.54 13 15.5V14.725ZM0 14.725C0 11.585 2.585 9 5.725 9C8.865 9 11 11.585 11 14.725C11 17.865 8.865 21 5.725 21H5.5C2.46 21 0 18.54 0 15.5V14.725Z" fillOpacity="0.1"/>
  </svg>
);

export default function HomePage(props) {
  const article =
    props.article?.article !== undefined
      ? props.article.article
      : props.article;
  
  return (
    <PageLayout title="Goulart Minds | Autoconhecimento e Transformação">

      <div className={styles.container}>
        {/* =============================================== */}
        {/* SEÇÃO DE ABERTURA (HERO SECTION)                */}
        {/* =============================================== */}
        <section className={styles.heroSection}>
          <div className={styles.heroOverlay}></div>{" "}
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Autoconhecimento não é um destino.<br />
              É uma direção.
            </h1>            
          </div>
        </section>        
        
        <section className={styles.introSection}>
        {/* 1. O contêiner externo que terá o fundo com gradiente */}
        <div className={styles.gradientBorderContainer}>
          {/* 2. O card interno com o conteúdo e fundo branco */}
          <div className={styles.introCard}>
            <div className={styles.introIcon}>
              <QuoteIcon />
            </div>
            <p className={styles.introSubtitle}>
              Acreditamos que a verdadeira transformação não vem de respostas 
              prontas, mas da coragem de fazer as perguntas certas. Este é um
              espaço para você explorar as camadas da sua própria mente e
              construir uma vida mais consciente.
            </p>
          </div>
        </div>
      </section>

        <section className={styles.explorationSection}>
          <div className={styles.sectionContainer}>
            <h2 className={styles.sectionTitle}>Sua Jornada Começa Aqui</h2>
            <div className={styles.cardsGrid}>
              {/* Card 1: Ferramentas */}
              <Link href="/ferramentas" className={styles.card}>
                <div className={styles.cardIcon}>
                  {/* Ícone de Bússola (SVG) */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Mapeie seu Mundo Interior</h3>
                <p className={styles.cardText}>
                  Use nossas ferramentas interativas para descobrir seus gatilhos
                  emocionais, sua hierarquia de valores e seu perfil
                  comportamental.
                </p>
                <span className={styles.cardLink}>
                  Explorar Ferramentas &rarr;
                </span>
              </Link>

              {/* Card 2: Conteúdo (Blog ) */}
              <Link href="/artigos" className={styles.card}>
                <div className={styles.cardIcon}>
                  {/* Ícone de Livro (SVG) */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Reflexões para o Caminho</h3>
                <p className={styles.cardText}>
                  Leia nossos artigos e insights sobre inteligência emocional,
                  produtividade e a arte de viver uma vida mais alinhada.
                </p>
                <span className={styles.cardLink}>Ler Artigos &rarr;</span>
              </Link>

              {/* Card 3: Sobre Nós */}
              <Link href="/em-construcao" className={styles.card}>
                <div className={styles.cardIcon}>
                  {/* Ícone de Conexão (SVG ) */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Quem Guia a Jornada</h3>
                <p className={styles.cardText}>
                  Conheça a filosofia e as pessoas por trás da Goulart Minds, e
                  entenda nossa missão de unir tecnologia e desenvolvimento
                  humano.
                </p>
                <span className={styles.cardLink}>Conhecer a Missão &rarr;</span>
              </Link>
            </div>
          </div>
        </section>

        {/* SEÇÃO DE DESTAQUE - AGORA DINÂMICA              */}
        <section className={styles.featuredSection}>
          <div className={styles.sectionContainer}>
              
              {/* 1. O CABEÇALHO DA SEÇÃO AGORA FICA FORA DAS CONDIÇÕES */}
              <div className={styles.sectionHeader}>
              <span className={styles.featuredTag}>
                  {/* A tag sempre aparece, mas com texto diferente */}
                  {!article ? 'CONTEÚDO EM DESTAQUE' : 'ARTIGO EM DESTAQUE'}
              </span>
              
              {/* O título e subtítulo só aparecem se houver artigo */}
              {article && (
                  <>
                  <h2 className={styles.featuredTitle}>{article.title}</h2>
                  {article.subtitle && <h3 className={styles.featuredSubtitle}>{article.subtitle}</h3>}
                  </>
              )}
              </div>

              {/* 2. O CONTEÚDO MUDA DE ACORDO COM A EXISTÊNCIA DO ARTIGO */}
              {article ? (
              // SE HOUVER ARTIGO, MOSTRA IMAGEM E TEXTO
              <div className={styles.featuredContent}>
                  <div className={styles.featuredImageContainer}>
                    <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill={true}
                        sizes="(max-width: 900px) 100vw, 50vw"
                        style={{ objectFit: 'cover', borderRadius: '8px'}}
                        className={styles.featuredImage}
                        priority={true}
                    />
                  </div>
                  <div className={styles.featuredText}>
                    <p className={styles.featuredDescription}>{article.description}</p>
                    <Link href={`/artigos/${article.slug}`} className={styles.featuredLink}>
                        Ler o artigo completo &rarr;
                    </Link>
                  </div>
              </div>
              ) : (
              // SE NÃO HOUVER ARTIGO, MOSTRA A MENSAGEM DE "EM BREVE"
              <div className={styles.noArticleContent}>
                  <p>Estamos preparando o melhor conteúdo para sua jornada de autoconhecimento.<br />
                      Novos artigos e reflexões em breve. Volte sempre!
                  </p>
              </div>
              )}

            </div>
          </section>

        {/* =============================================== */}
        {/* PRÓXIMAS SEÇÕES VIRÃO AQUI ABAIXO               */}
        {/* =============================================== */}

      </div>
    </PageLayout>
  );
}

export async function getStaticProps() {
  let articleData = null; // 1. Comece com null

  try {
    const featuredArticle = await client.article.findFirst({
      where: {
        published: true, // Garante que apenas artigos publicados sejam considerados
      },
      orderBy: { likes: "desc" },
    });

    // 2. Só atribua um valor se o artigo for encontrado
    if (featuredArticle) {
      articleData = JSON.parse(JSON.stringify(featuredArticle));
    }
  } catch (error) {
    // 3. Se houver QUALQUER erro, 'articleData' permanecerá null
    console.error(
      "Falha ao buscar artigo em destaque em getStaticProps:",
      error
    );
  }

  // 4. Retorne o resultado. 'articleData' será o objeto do artigo ou null.
  return {
    props: {
      article: articleData,
    },
    revalidate: 60,
  };
}
