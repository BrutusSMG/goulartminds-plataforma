// pages/_app.js

// Importa os arquivos de CSS que devem ser carregados em TODAS as páginas.
import { useEffect } from 'react';
import '../public/assets/global-style.css';
import '../public/home-style.css'; // CSS específico da Home

// Esta é uma função especial do Next.js que envolve toda a sua aplicação.
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Remove a classe 'loading' do body depois que o app carregar
    document.body.classList.remove('loading');
  }, []); // O array vazio [] garante que isso rode apenas uma vez
  return <Component {...pageProps} />;
}

export default MyApp;
