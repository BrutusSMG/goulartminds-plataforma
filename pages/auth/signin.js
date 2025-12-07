// pages/auth/signin.js

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Head from 'next/head';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Usa a função signIn do NextAuth para iniciar o fluxo de login por e-mail.
    // O NextAuth cuidará do resto, incluindo o redirecionamento para a página
    // 'verifyRequest' que configuramos.
    const result = await signIn('email', {
      email: email,
      redirect: true, // Queremos que o NextAuth nos redirecione para a página de verificação.
      callbackUrl: '/', // Para onde o usuário irá DEPOIS de clicar no link do e-mail.
    });

    // Se o signIn falhar por algum motivo (ex: erro de rede), mostramos um erro.
    if (result?.error) {
      setError('Não foi possível iniciar o processo de login. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Entrar - Goulart Minds</title>
      </Head>

      <main className="container">
        <div className="tool-wrapper" style={{ maxWidth: '450px', margin: '40px auto' }}>
          <div className="step-header" style={{ textAlign: 'center' }}>
            <h1>Acesse sua Conta</h1>
            <p>Enviaremos um link mágico para o seu e-mail. Sem senhas!</p>
          </div>
          
          <div className="step-content">
            <form onSubmit={handleSignIn}>
              <div className="question-block">
                <label htmlFor="email">Seu melhor e-mail</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  autoFocus
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
