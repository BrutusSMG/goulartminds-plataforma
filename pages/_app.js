// pages/_app.js

import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';

import '../public/assets/global-style.css';
import '../public/home-style.css';

// Altere a assinatura da função para receber a 'session'
function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  useEffect(() => {
    document.body.classList.remove('loading');
  }, []);

  return (
    // 2. ENVOLVA O COMPONENTE COM O PROVIDER
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
