// components/PageLayout.js

import Head from 'next/head';
import Header from './Header';
import Copyright from './Copyright';
import FeedbackModal from './FeedbackModal';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function PageLayout({ children, title, hideLoginButton = false }) {
  const { status } = useSession();
  const router = useRouter();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && status === 'authenticated') {
      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
        router.push(redirectUrl);
      }
    }
  }, [status, router]); 

  return (
    <>
      <Head>
        <title>{title ? `${title} - Goulart Minds` : 'Goulart Minds'}</title>
        <link rel="icon" href="/image/logo-icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/image/logo-icon.png" />
      </Head>

      <div className="container"> 
        <Header hideLoginButton={hideLoginButton} />        
        <main>
          {children}
        </main>

        <Copyright onFeedbackClick={() => setIsFeedbackModalOpen(true)} />
      </div>
      <FeedbackModal 
        isOpen={isFeedbackModalOpen} 
        onClose={() => setIsFeedbackModalOpen(false)} 
      />
    </>
  );
}
