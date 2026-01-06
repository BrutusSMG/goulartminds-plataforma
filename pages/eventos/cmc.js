// src/pages/eventos/cmc.js
import { useSession } from 'next-auth/react';
import PageLayout from '../../components/PageLayout';
import Image from 'next/image';
import client from '../../lib/db';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import styles from '../../styles/EventoTemplate.module.css'; // Criaremos este arquivo a seguir
import Head from 'next/head';

const WhatsAppIcon = () => (
  <svg height="24" width="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.75 13.96c.27.13.42.26.5.41.1.15.15.33.15.55 0 .22-.05.4-.15.55-.1.15-.27.26-.5.36-.22.1-.5.16-.84.16-.34 0-.7-.05-1.1-.15-.4-.1-.83-.27-1.3-.5-.47-.22-.9-.48-1.28-.78-.38-.3-.7-.65-1-1.03-.3-.38-.55-.78-.75-1.2s-.3-.87-.3-1.35c0-.5.14-.95.41-1.35.27-.4.64-.6 1.1-.6.1 0 .22.01.34.04.12.03.23.06.3.1.15.1.25.24.3.4.05.16.08.33.08.51 0 .15-.02.3-.05.45-.03.15-.08.28-.13.4-.05.12-.1.23-.15.33-.05.1-.08.15-.08.15s-.03.05-.03.08c0 .03.01.05.03.08.02.03.05.05.08.08.15.13.3.25.48.38.18.12.38.22.58.3.2.08.4.13.6.15.2.02.4.03.6.03.3 0 .58-.05.83-.15.25-.1.45-.25.6-.45.15-.2.23-.42.23-.66 0-.18-.04-.34-.1-.48-.07-.15-.18-.28-.34-.4-.16-.12-.33-.2-.5-.25-.18-.05-.35-.08-.5-.08-.15 0-.3.02-.43.05-.13.03-.25.08-.35.13-.05.03-.1.05-.15.08-.05.03-.1.05-.15.08-.05.03-.1.05-.15.08-.03.01-.05.03-.08.03-.02,0-.03,0-.03-.03s0-.05.03-.08a.87.87 0 0 1 .28-.28c.1-.08.2-.15.3-.2.1-.05.2-.1.3-.15.1-.05.2-.1.3-.15.25-.13.48-.2.68-.2.2 0 .4.03.58.08.18.05.35.12.5.2zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
  </svg>
);

const pilaresData = [
  {
    image: "/image/cmc-landing/blindar.webp",
    title: "CONHEÇA AS CHAVES PARA BLINDAR A MENTE",
    text: "Nossa mente é poderosa e influenciada pelo passado e pelo futuro. Quer saber como evitar que eventos injustos afetem suas decisões e escolhas?",
  },
  {
    image: "/image/cmc-landing/identificar.webp",
    title: "IDENTIFIQUE SUAS HABILIDADES E INABILIDADES",
    text: "Descubra a força poderosa que está esquecida dentro de você. Pare de se concentrar no que não dá certo e se preocupar mais com os problemas do que com as soluções. Descubra a verdade sobre seus sentimentos e emoções.",
  },
  {
    image: "/image/cmc-landing/desenvolver.webp",
    title: "DESENVOLVA UMA MENTALIDADE À PROVA DE INFLUÊNCIAS EXTERNAS",
    text: "Nosso medo vem das nossas experiências, especialmente das histórias contadas pelas pessoas que amamos. O cérebro acredita nessas histórias, principalmente quando são contadas por aqueles que amamos.",
  },
  {
    image: "/image/cmc-landing/mente.webp",
    title: "SAIBA COMO É O FUNCIONAMENTO DA MENTE",
    text: "O cérebro se fortalece com mensagens positivas. Ele acredita nas histórias que ouve e busca experiências passadas para tomar decisões. Para mudar isso, é preciso viver novas experiências, alimentar a mente com estímulos diferentes e dar um novo significado ao que fazemos.",
  },
];

const paraQuemData = [
  "Deseja realizar uma mudança na sua vida mas não sabe por onde começar;",
  "Trabalha Exaustivamente e não se sente realizado;",
  "Não tem certeza de como será o seu futuro;",
  "Se sente culpado por não conseguir realizar suas metas;",
  "Perdeu a vontade de sonhar;",
  "Deseja ter relacionamentos saudáveis;",
  "Quer encontrar a pessoa certa ou melhorar seu relacionamento amoroso;",
  "Quer encontrar seu propósito e viver uma vida leve e feliz.",
];

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
  </svg>
 );

export default function CmcPage() {
  const eventInfo = {
    date: '31/JAN/2026', // Formato da imagem
    city: 'ALTAMIRA',    // Formato da imagem
    state: 'PA',
    whatsappLink: 'https://chat.whatsapp.com/SEU_LINK_AQUI' // <-- IMPORTANTE: Troque pelo seu link
  };

  return (
    <>
      <Head>
        <title>Clube Mentalidade de Cura - {eventInfo.city}</title>
        <meta name="description" content="Garanta a melhor oferta para o treinamento presencial com Márcio Micheli." />
      </Head>

      <main>
        <section className={styles.heroSection}>
          <div className={styles.backgroundWrapper} />

          {/* Imagem do Márcio posicionada de forma absoluta pelo CSS */}
          <div className={styles.mentorImageWrapper}>
            <Image 
              src="/image/cmc-landing/hero1.webp" 
              alt="Márcio Micheli" 
              width={600} 
              height={720}
              className={styles.mentorImage}
            />
          </div>

          {/* Conteúdo principal, agora em uma única coluna central */}
          <div className={`${styles.container} ${styles.heroContent}`}>
            
            {/* Logo "Mentalidade de Cura" */}
            <div className={styles.logoWrapper}>
              <Image 
                src="/image/mentalidade-de-cura.png" 
                alt="Curso Mentalidade de Cura" 
                width={500} // Aumentado para ser o elemento principal
                height={250} 
                className={styles.logoImage}
              />
            </div>

            {/* Detalhes do Evento */}
            <div className={styles.eventDetails}>
              <span>{eventInfo.date} - {eventInfo.city} | {eventInfo.state}</span>
            </div>

            {/* Textos */}
            <p className={styles.heroText}>
              Eu vou te ajudar a dar os primeiros passos em direção à vida que você <strong>merece</strong>.
            </p>
            <p className={styles.heroText}>
              Entre no <strong>GRUPO VIP</strong> para <span className={styles.highlight}> garantir a melhor oferta</span> deste treinamento transmitido presencialmente:
            </p>

            {/* Botão WhatsApp */}
            <a href={eventInfo.whatsappLink} target="_blank" rel="noopener noreferrer" className={styles.whatsappButton}>
              <WhatsAppIcon />
              QUERO ENTRAR NO GRUPO
            </a>

            {/* Detalhes Finais */}
            <div className={styles.locationDetails}>
              <p><strong>Treinamento Presencialmente Transmitido:</strong></p>
              <p>das 14h às 20h30 (horário de Brasília )</p>
              <p><strong>Local:</strong> A definir</p>
            </div>
            
          </div>
        </section>

        <section className={styles.ctaSection}>
          
          {/* A imagem agora é um elemento de fundo decorativo */}
          <div className={styles.ctaDecorativeImageWrapper}>
            <Image
              src="/image/cmc-landing/hero_fundo2.webp"
              alt="" // Alt vazio, pois a imagem é puramente decorativa
              layout="fill" // Ocupa 100% do seu container pai
              objectFit="cover"
              className={styles.ctaDecorativeImage}
            />
          </div>

          {/* O container principal agora só precisa centralizar o card amarelo */}
          <div className={styles.container}>
            <div className={styles.ctaContainer}>
              <div className={styles.ctaContent}>
                <h2 className={styles.ctaTitle}>
                  O EVENTO QUE JÁ TRANSFORMOU A VIDA DE MILHARES DE PESSOAS EM DIVERSAS CIDADES DO BRASIL, AGORA ACONTECE EM {eventInfo.city} | {eventInfo.state}.
                </h2>
                <p className={styles.ctaSubtitle}>
                  Essa é uma oportunidade única para participar deste treinamento. Não deixe para depois, você não terá outra chance, entre agora mesmo no grupo VIP e receba a <span className={styles.highlight}>melhor oferta deste treinamento</span>:
                </p>
                
                <a href={eventInfo.whatsappLink} target="_blank" rel="noopener noreferrer" className={styles.whatsappButton}>
                  <WhatsAppIcon />
                  ENTRAR NO GRUPO VIP
                </a>
              </div>
            </div>
          </div>

        </section>

        <section className={styles.pilaresSection}>
          <div className={styles.container}>
            <h2 className={styles.pilaresMainTitle}>
              Os pilares do Curso Mentalidade de Cura:
            </h2>

            <div className={styles.pilaresGrid}>
              {/* Mapeando sobre os dados para criar os cards dinamicamente */}
              {pilaresData.map((pilar, index) => (
                <div key={index} className={styles.pilarCard}>
                  <div className={styles.pilarImageWrapper}>
                    <Image
                      src={pilar.image}
                      alt={pilar.title}
                      width={150}
                      height={150}
                      objectFit="contain"
                    />
                  </div>
                  <h3 className={styles.pilarTitle}>{pilar.title}</h3>
                  <p className={styles.pilarText}>{pilar.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.paraQuemSection}>
          <div className={`${styles.container} ${styles.paraQuemContainer}`}>
            
            {/* Coluna da Esquerda: Conteúdo */}
            <div className={styles.paraQuemContent}>
              <h2 className={styles.paraQuemTitle}>
                O Curso Mentalidade de Cura é para você que...
              </h2>
              <ul className={styles.paraQuemList}>
                {paraQuemData.map((item, index) => (
                  <li key={index} className={styles.paraQuemListItem}>
                    <span className={styles.checkIcon}><CheckIcon /></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Coluna da Direita: Imagem */}
            <div className={styles.paraQuemImageWrapper}>
              <Image
                src="/image/cmc-landing/marcio.png"
                alt="Márcio Micheli"
                width={500}
                height={700}
                objectFit="contain"
                className={styles.paraQuemImage}
              />
            </div>

          </div>
        </section>

      </main>
    </>
  );
}
