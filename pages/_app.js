// pages/_app.js (VERSÃO CORRIGIDA E SEGURA)

import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import '../styles/global-style.css';

// Use a assinatura padrão e mais simples
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    document.body.classList.remove('loading');
  }, []);

  return (
    // 1. Passe a propriedade `session` de `pageProps` para o Provider.
    //    Isso garante que o hook `useSession` funcione em todo o app.
    <SessionProvider session={pageProps.session}>
      
      {/* 2. Passe TODAS as pageProps para o componente da página.
          Isso garante que `JornadasHub` receba `session`, `journeys`, etc. */}
      <Component {...pageProps} />

    </SessionProvider>
  );
}

export default MyApp;
