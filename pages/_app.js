// pages/_app.js

import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import '../styles/global-style.css';

// Altere a assinatura da função para receber a 'session'
function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  useEffect(() => {
    document.body.classList.remove('loading');
  }, []);

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
