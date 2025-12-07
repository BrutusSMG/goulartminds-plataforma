// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script'; // Componente especial para scripts

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        {/* Fontes do Google */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700&display=swap" rel="stylesheet" />
        
        <link rel="stylesheet" href="/irritacao/style.css" />
        <link rel="stylesheet" href="/resultado-esperado/style.css" />

      </Head>
      <body className="loading">
        <Main />
        <NextScript />
        
        {/* Carrega o seu script global principal. 
            O caminho é relativo à pasta 'public'. */}
        <Script src="/assets/main.js" strategy="beforeInteractive" />
      </body>
    </Html>
   );
}
