// pages/auth/signin.js

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Head from 'next/head';

// Adicionei um pouco de CSS para o botão do Google e o separador
const pageStyles = `
  .google-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 12px;
    margin-bottom: 20px;
    background-color: #4285F4;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
  }
  .google-btn:hover {
    background-color: #357ae8;
  }
  .separator {
    display: flex;
    align-items: center;
    text-align: center;
    color: #888;
    margin: 20px 0;
  }
  .separator::before, .separator::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #ddd;
  }
  .separator:not(:empty)::before {
    margin-right: .25em;
  }
  .separator:not(:empty)::after {
    margin-left: .25em;
  }
`;

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('email', {
      email: email,
      redirect: true,
      callbackUrl: '/perfil', // Mudei para /perfil, que é um destino mais comum após o login
    });

    if (result?.error) {
      setError('Não foi possível iniciar o processo de login. Tente novamente.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setLoading(true); // Mostra um feedback visual
    signIn('google', { callbackUrl: '/perfil' });
  };

  return (
    <>
      <Head>
        <title>Entrar - Goulart Minds</title>
        <style>{pageStyles}</style>
      </Head>

      <main className="container">
        <div className="tool-wrapper" style={{ maxWidth: '450px', margin: '40px auto' }}>
          <div className="step-header" style={{ textAlign: 'center' }}>
            <h1>Acesse sua Conta</h1>
            <p>Escolha seu método de acesso preferido.</p>
          </div>
          
          <div className="step-content">
            
            {/* --- BOTÃO DO GOOGLE ADICIONADO AQUI --- */}
            <button onClick={handleGoogleSignIn} className="google-btn" disabled={loading}>
              {/* Opcional: Adicionar um ícone do Google aqui */}
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path fill="#FFF" d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z"/><path fill="#FFF" d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957273V13.0418C2.43818 15.9832 5.48182 18 9 18Z"/><path fill="#FFF" d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29H0.957273C0.347727 8.51727 0 10.17 0 12C0 13.83 0.347727 15.4827 0.957273 16.71L3.96409 13.9582V10.71Z"/><path fill="#FFF" d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4673 0.891818 11.43 0 9 0C5.48182 0 2.43818 2.01682 0.957273 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z"/></svg>
              <span>Entrar com Google</span>
            </button>

            {/* --- SEPARADOR --- */}
            <div className="separator">ou</div>

            {/* --- SEU FORMULÁRIO DE E-MAIL ORIGINAL --- */}
            <form onSubmit={handleEmailSignIn}>
              <div className="question-block">
                <label htmlFor="email">Continue com seu e-mail</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e ) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>

              {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

              <div className="step-navigation" style={{ borderTop: 'none', padding: '20px 0 0 0' }}>
                <button type="submit" className="btn-next" disabled={loading} style={{ width: '100%' }}>
                  {loading ? 'Enviando...' : 'Enviar Link de Acesso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
