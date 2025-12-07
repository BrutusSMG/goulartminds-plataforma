// pages/perfil.js

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import Header from '../components/Header';
import Copyright from '../components/Copyright';
import { AccessDenied } from '../components/AuthGuard'; 

export default function PerfilPage() {
  // Usamos o useSession para obter os dados do usuário e o status da sessão.
  const { data: session, status, update } = useSession();
  
  // Estado local para gerenciar o nome no formulário e o feedback para o usuário.
  const [name, setName] = useState('');
  const [message, setMessage] = useState(''); // Para mensagens de sucesso ou erro.
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quando a sessão for carregada, atualize o estado do nome com o nome do usuário.
  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  // Função para lidar com o envio do formulário.
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    // Envia uma requisição para uma API que vamos criar.
    const response = await fetch('/api/user/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    const result = await response.json();

    if (response.ok) {
      setMessage('Seu nome foi atualizado com sucesso!');
      await update({ ...session, user: { ...session.user, name: name } });

    } else {
      setMessage(result.message || 'Ocorreu um erro ao atualizar seu perfil.');
    }
    
    setIsSubmitting(false);
  };

  // 1. Proteção de Acesso: Estado de Carregamento
  if (status === 'loading') {
    return (
      <>
        <Head><title>Carregando Perfil...</title></Head>
        <Header />
        <main className="container" style={{ textAlign: 'center', padding: '50px' }}><p>Carregando...</p></main>
        <Copyright />
      </>
    );
  }

  // 2. Proteção de Acesso: Usuário não autenticado
  if (status === 'unauthenticated') {
    return (
      <>
        <Head><title>Acesso Negado</title></Head>
        <Header />
        <main className="container"><AccessDenied /></main>
        <Copyright />
      </>
    );
  }

  // 3. -> CORREÇÃO APLICADA AQUI <-
  // Só renderiza o conteúdo principal se o status for 'authenticated'
  if (status === 'authenticated') {
    return (
      <>
        <Head>
          <title>Meu Perfil - Goulart Minds</title>
        </Head>
        <Header />
        <main className="container">
          <div className="tool-wrapper" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="step-header">
              <h1>Meu Perfil</h1>
              <p>Gerencie suas informações e preferências.</p>
            </div>
            
            <div className="step-content">
              <form onSubmit={handleUpdateProfile}>
                {/* ... (o resto do seu formulário continua aqui dentro, sem alterações) ... */}
                <div className="question-block">
                  <label htmlFor="email">E-mail</label>
                  <input
                    type="email"
                    id="email"
                    value={session.user.email}
                    disabled
                    style={{ backgroundColor: '#f2f2f2', cursor: 'not-allowed' }}
                  />
                </div>

                <div className="question-block">
                  <label htmlFor="name">Nome</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Como você gostaria de ser chamado?"
                  />
                </div>

                <div className="question-block">
                  <label>Seu Plano Atual</label>
                  <div 
                    style={{ 
                      padding: '10px 15px', 
                      border: '1px solid #ccc', 
                      borderRadius: '5px', 
                      backgroundColor: '#f2f2f2',
                      textTransform: 'capitalize'
                    }}
                  >
                    {session.user.plan || 'Gratuito'}
                  </div>
                </div>

                <div className="step-navigation" style={{ borderTop: 'none', padding: '20px 0 0 0' }}>
                  <button type="submit" className="btn-next" disabled={isSubmitting}>
                    {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
              
              {message && <p style={{ textAlign: 'center', marginTop: '20px' }}>{message}</p>}
            </div>
          </div>
        </main>
        <Copyright />
      </>
    );
  }

  // 4. Fallback: Se não for nenhum dos status acima, não renderiza nada.
  return null;
}