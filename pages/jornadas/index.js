// /pages/jornadas/index.js

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]';
import client from '../../lib/db';
import Link from 'next/link';
import PageLayout from '../../components/PageLayout';
import Head from 'next/head';
import styles from '../../styles/jornadas/jornadasHub.module.css';
import { useRouter } from 'next/router';

// --- COMPONENTE: JourneyCard ---
// Responsável por exibir um card de jornada (selecionável, ativo ou bloqueado)
function JourneyCard({ journey, status, onStart }) {
  const cardClass = `${styles.journeyCard} ${styles[status]}`;

  const getActionText = () => {
    switch (status) {
      case 'active':
        return 'Jornada Ativa';
      case 'locked':
        return 'Conclua a jornada ativa primeiro';
      case 'selectable':
        return 'Quero iniciar esta jornada →';
      default:
        return '';
    }
  };

  return (
    <div className={cardClass} onClick={status === 'selectable' ? () => onStart(journey.id) : null}>
      <div>
        <h3>{journey.title}</h3>
        <p>{journey.description}</p>
      </div>
      <div className={styles.cardFooter}>
        <span className={styles.cardCta}>{getActionText()}</span>
      </div>
    </div>
  );
}

// --- COMPONENTE: StepCard ---
// Responsável por exibir um card de etapa da jornada ativa
function StepCard({ step, journeyProgress }) {
  const currentStep = journeyProgress.currentStep;
  const stepOrder = step.order;

  let status = 'locked';
  if (stepOrder < currentStep) status = 'completed';
  if (stepOrder === currentStep) status = 'next';
  if (stepOrder > currentStep) status = 'locked';

  const isClickable = status === 'next' || status === 'completed';
  const stepUrl = '/jornadas/etapas/emocoes'; //valor de teste

  const CardContent = () => (
    <div className={`${styles.stepCard} ${styles[status]}`}>
      <span className={styles.stepOrder}>ETAPA {step.order}</span>
      <h3>{step.title}</h3>
      <div className={styles.cardFooter}>
        <span className={`${styles.statusBadge} ${styles[status]}`}>
          {status === 'next' && 'Próxima Etapa'}
          {status === 'completed' && 'Revisar'}
          {status === 'locked' && 'Bloqueada'}
        </span>
      </div>
    </div>
  );

  if (isClickable) {
    return <Link href={stepUrl} passHref legacyBehavior><a><CardContent /></a></Link>;
  }
  
  return <CardContent />;
}


// --- COMPONENTE PRINCIPAL DA PÁGINA ---
export default function JornadasHub({ session, journeys, activeUserJourney }) {
  const router = useRouter();

  const handleStartJourney = async (journeyId) => {
    console.log('Tentando iniciar jornada. A sessão no momento do clique é:', session);
    // CORREÇÃO: Adicionada a verificação de sessão
    if (!session) {
      router.push(`/api/auth/signin?callbackUrl=/jornadas`);
      return;
    }

    try {
      const response = await fetch('/api/jornadas/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ journeyId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao iniciar a jornada.');
      }
      router.reload();
    } catch (error) {
      console.error('Erro ao iniciar jornada:', error);
      alert(error.message);
    }
  };

  const activeJourneyId = activeUserJourney?.journeyId || null;

  return (
    <PageLayout>
      <Head>
        <title>Hub de Jornadas - Goulart Minds</title>
        <meta name="description" content="Escolha e foque em uma jornada de desenvolvimento por vez." />
      </Head>

      <div className={styles.hubContainer}>
        <header className={styles.hubHeader}>
          <h1>Hub de Jornadas</h1>
          {activeJourneyId ? (
            <p>Você está focado na jornada abaixo. Conclua as etapas para desbloquear as próximas.</p>
          ) : (
            <p>Escolha uma jornada para iniciar. As outras ficarão em espera até você concluir a atual.</p>
          )}
        </header>

        <main className={styles.journeysGrid}>
          {journeys.map((journey) => {
            let status = 'selectable';
            if (activeJourneyId) {
              status = journey.id === activeJourneyId ? 'active' : 'locked';
            }
            return (
              <JourneyCard
                key={journey.id}
                journey={journey}
                status={status}
                onStart={handleStartJourney}
              />
            );
          })}
        </main>

        {activeUserJourney && (
          <section className={styles.activeJourneySteps}>
            <h2>Etapas da sua Jornada: {journeys.find(j => j.id === activeJourneyId)?.title}</h2>
            <div className={styles.stepsGrid}>
              {journeys.find(j => j.id === activeJourneyId)?.steps.map((step) => (
                <StepCard key={step.id} step={step} journeyProgress={activeUserJourney} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PageLayout>
  );
}

// --- FUNÇÃO DE BUSCA DE DADOS NO SERVIDOR ---
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  const allJourneys = await client.journey.findMany({
    include: {
      steps: { orderBy: { order: 'asc' } },
    },
  });

  let userProgress = null;
  if (session) {
    userProgress = await client.userJourneyProgress.findFirst({
      where: {
        userId: session.user.id,
        status: 'IN_PROGRESS',
      },
    });
  }

  return {
    props: {
      session: session ? JSON.parse(JSON.stringify(session)) : null,
      journeys: JSON.parse(JSON.stringify(allJourneys)),
      activeUserJourney: userProgress ? JSON.parse(JSON.stringify(userProgress)) : null,
    },
  };
}
