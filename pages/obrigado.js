import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Obrigado() {
  const router = useRouter();
  // Captura o nome que veio da URL
  const { nome } = router.query;

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f9fafb', 
      padding: '20px', 
      textAlign: 'center',
      fontFamily: 'sans-serif'
    }}>
      <Head>
        <title>Briefing Recebido | Goulart Minds</title>
      </Head>

      <div style={{ 
        maxWidth: '600px', 
        backgroundColor: '#ffffff', 
        padding: '50px 30px', 
        borderRadius: '12px', 
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            style={{ width: '80px', height: '80px', color: '#10B981' }} // #10B981 é um verde esmeralda muito elegante
          >
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
          </svg>
        </div>
        
        {/* Aqui usamos o nome se ele existir, senão usamos um texto padrão */}
        <h1 style={{ color: '#111827', fontSize: '2rem', marginBottom: '16px', fontWeight: 'bold' }}>
          {nome ? `Tudo certo, ${nome}!` : 'Briefing Recebido com Sucesso!'}
        </h1>
        
        <p style={{ fontSize: '1.1rem', color: '#4b5563', marginBottom: '30px', lineHeight: '1.6' }}>
          Muito obrigado por compartilhar essas informações. Já recebemos os dados do seu negócio e vamos analisá-los com cuidado. Entraremos em contato muito em breve para darmos os próximos passos rumo aos seus resultados.
        </p>

        <a 
          href="https://wa.me/5541999999999?text=Olá! Acabei de preencher o briefing de tráfego." 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            display: 'inline-block', 
            backgroundColor: '#10B981', 
            color: '#ffffff', 
            padding: '14px 28px', 
            borderRadius: '8px', 
            textDecoration: 'none', 
            fontWeight: 'bold', 
            fontSize: '1.1rem',
            transition: 'background-color 0.3s'
          }}
        >
          Falar no WhatsApp Agora
        </a>
      </div>
    </div>
   );
}
