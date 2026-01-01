// src/components/Comments.js

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import styles from '../styles/Comments.module.css';

// Componente para um único comentário
function Comment({ comment }) {
  const { author, content, createdAt, _count } = comment;
  const userImage = author.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name )}&background=random`;

  return (
    <div className={styles.comment}>
      <img src={userImage} alt={author.name} className={styles.authorImage} />
      <div className={styles.commentBody}>
        <div className={styles.commentHeader}>
          <span className={styles.authorName}>{author.name}</span>
          <span className={styles.commentDate}>
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: ptBR })}
          </span>
        </div>
        <p className={styles.commentContent}>{content}</p>
        <div className={styles.commentActions}>
          <button className={styles.likeButton}>
            ❤️ {_count.likes}
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente principal que gerencia a lista de comentários
export default function Comments({ articleId }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Efeito para buscar os comentários quando o componente é montado
  useEffect(() => {
    // Função assíncrona para buscar os dados
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments/list?articleId=${articleId}`);
        if (!response.ok) {
          throw new Error('Não foi possível carregar os comentários.');
        }
        const data = await response.json();
        setComments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [articleId]); // O array de dependências garante que a busca só ocorra se o articleId mudar

  // Renderiza o estado de carregamento
  if (isLoading) {
    return <div className={styles.loading}>Carregando comentários...</div>;
  }

  // Renderiza o estado de erro
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <section className={styles.commentsSection}>
      <h2 className={styles.sectionTitle}>Comentários ({comments.length})</h2>
      
      {/* Formulário para novos comentários (aparece se o usuário estiver logado) */}
      {session && (
        <div className={styles.commentForm}>
          {/* Lógica do formulário virá aqui em breve */}
          <textarea placeholder="Escreva seu comentário..." rows="3"></textarea>
          <button className="primary-btn">Publicar</button>
        </div>
      )}

      {/* Mensagem para usuários deslogados */}
      {!session && (
        <div className={styles.loginPrompt}>
          <p>Você precisa <a href="/auth/signin">entrar na sua conta</a> para comentar.</p>
        </div>
      )}

      {/* Lista de Comentários */}
      <div className={styles.commentsList}>
        {comments.length > 0 ? (
          comments.map(comment => <Comment key={comment.id} comment={comment} />)
        ) : (
          <p>Ainda não há comentários. Seja o primeiro a compartilhar sua opinião!</p>
        )}
      </div>
    </section>
  );
}
