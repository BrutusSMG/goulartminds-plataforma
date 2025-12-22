// components/PageLayout.js

import Head from 'next/head';
import Header from './Header';
import Copyright from './Copyright';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function PageLayout({ children, title, hideLoginButton = false }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && status === 'authenticated') {
      // 1. Pega a URL que salvamos antes do login
      const redirectUrl = localStorage.getItem('redirectAfterLogin');

      // 2. Se encontrarmos uma URL...
      if (redirectUrl) {
        // 3. Remove o item do localStorage para não redirecionar novamente
        localStorage.removeItem('redirectAfterLogin');
        
        // 4. Redireciona o usuário para a página que ele queria originalmente
        router.push(redirectUrl);
      }
    }
  }, [status, router]); // Roda sempre que o status da sessão ou o router mudar

  return (
    <>
      <Head>
        <title>{title ? `${title} - Goulart Minds` : 'Goulart Minds'}</title>
      </Head>

      <div className="container">               
        
        <Header hideLoginButton={hideLoginButton} />
        
        <main>
          {children}
        </main>
        
        <Copyright />
      </div>
    </>
  );
}
