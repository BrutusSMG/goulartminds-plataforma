// pages/jornadas/etapas/[slug].js

import { useRouter } from 'next/router';
import PageLayout from '../../components/PageLayout';
import Head from 'next/head';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]';

// Componente para renderizar um único vídeo (placeholder)
const VideoPlayer = ({ url, index } ) => (
  <div style={{ marginBottom: '20px', border: '1px solid #eee', padding: '15px', borderRadius: '8px' }}>
    <h4>Vídeo {index + 1}</h4>
    <div style={{ position: 'relative', paddingBottom: '56.25%', height: '0', overflow: 'hidden', borderRadius: '8px' }}>
      <iframe
        src={url}
        style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%' }}
        title={`Vídeo da Etapa ${index + 1}`} // Importante para acessibilidade
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin" // Política de segurança recomendada
        allowFullScreen
      ></iframe>
    </div>
  </div>
);

export default function EtapaPage({ step }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando etapa...</div>;
  }

  if (!step) {
    return (
      <PageLayout>
        <Head><title>Etapa não encontrada</title></Head>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h1>404 - Etapa não encontrada</h1>
          <p>O conteúdo que você está procurando não existe.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Head>
        <title>{step.title} - Goulart Minds</title>
      </Head>
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
        
        <section>
          <h1>{step.title}</h1>
          <p style={{ fontSize: '1.2rem', color: '#555' }}>{step.description}</p>
          {step.videoUrls.map((url, index) => (
            <VideoPlayer key={index} url={url} index={index} />
          ))}
        </section>

        <hr style={{ margin: '60px 0' }} />

        <section>
          <h2>Ferramenta de Apoio</h2>
          <p>{step.toolDescription}</p>
          {step.toolDownloadUrl && (
            <a href={step.toolDownloadUrl} download target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-block', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px'
            }}>
              Baixar Material da Ferramenta (PDF)
            </a>
          )}
        </section>

        <hr style={{ margin: '60px 0' }} />

        <section>
            <h2>Sua Tarefa para a Semana</h2>
            <p>{step.taskDescription}</p>
        </section>

        <div style={{ marginTop: '60px', textAlign: 'center' }}>
            <button style={{ padding: '15px 30px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' }}>
                Marcar Etapa como Concluída e Avançar
            </button>
        </div>
      </div>
    </PageLayout>
  );
}

// --- FUNÇÃO DE BUSCA DE DADOS COM LÓGICA DE SEGURANÇA ---
export async function getServerSideProps(context) {
  const client = (await import('@/lib/db')).default;
  const session = await getServerSession(context.req, context.res, authOptions);
  const { slug } = context.params;

  // VERIFICAÇÃO 1: O usuário está logado?
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin?callbackUrl=/jornadas', // Redireciona para o login
        permanent: false,
      },
    };
  }

  // Busca a etapa que o usuário quer acessar
  const requestedStep = await client.journeyContentStep.findUnique({
    where: { slug: slug },
  });

  // Se a etapa não existe no banco, retorna página 404
  if (!requestedStep) {
    return { notFound: true };
  }

  // Busca o progresso da jornada ativa do usuário
  const userProgress = await client.userJourneyProgress.findFirst({
    where: {
      userId: session.user.id,
      status: 'IN_PROGRESS',
    },
  });

  // VERIFICAÇÃO 2: A jornada da etapa solicitada é a jornada ativa do usuário?
  // VERIFICAÇÃO 3: A ordem da etapa solicitada corresponde ao passo atual do usuário?
  if (!userProgress || userProgress.journeyId !== requestedStep.journeyId || userProgress.currentStep !== requestedStep.order) {
    // Se qualquer verificação falhar, redireciona para o hub de jornadas.
    return {
      redirect: {
        destination: '/jornadas',
        permanent: false,
      },
    };
  }

  // Se todas as verificações passaram, retorna os dados da etapa.
  return {
    props: {
      step: JSON.parse(JSON.stringify(requestedStep)),
    },
  };
}
