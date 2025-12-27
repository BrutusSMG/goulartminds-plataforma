// src/components/AdminGuard.js

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function AdminGuard({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoading = status === 'loading';

  useEffect(() => {
    // Se não estiver carregando e o usuário não for um admin, redireciona
    if (!isLoading && session?.user?.role !== 'ADMIN') {
      console.log("AdminGuard: Acesso negado. Redirecionando para a página inicial.");
      router.push('/'); // Redireciona para a página inicial
    }
  }, [isLoading, session, router]);

  // 1. Se estiver carregando a sessão, mostra uma mensagem de "carregando"
  if (isLoading) {
    return <p>Verificando permissões...</p>;
  }

  // 2. Se for um admin, mostra o conteúdo protegido (a página)
  if (session?.user?.role === 'ADMIN') {
    return <>{children}</>;
  }

  // 3. Se não for admin (e estiver sendo redirecionado), não mostra nada para evitar um "flash" de conteúdo
  return null;
}
