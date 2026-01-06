// /components/Comments.js

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import styles from "../styles/Comments.module.css";

// --- 1. COMPONENTE DE FORMULÁRIO REUTILIZÁVEL ---
// Este formulário será usado tanto para comentários principais quanto para respostas.
function CommentForm({
  articleId,
  parentId = null,
  onCommentPublished,
  placeholder = "Escreva seu comentário...",
  buttonText = "Publicar",
}) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (content.trim() === "") return;

    setIsSubmitting(true);
    setError("");

    try {
      // Chama a API que criamos para criar o comentário
      const response = await fetch("/api/comments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, articleId, parentId }), // Envia o parentId se for uma resposta
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao publicar.");
      }

      const createdComment = await response.json();
      onCommentPublished(createdComment); // Função de callback para atualizar a UI
      setContent(""); // Limpa o formulário
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.commentForm}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows="3"
        disabled={isSubmitting}
        className={styles.commentTextarea}
      />
      <div className={styles.formActions}>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <button type="submit" disabled={isSubmitting} className="primary-btn">
          {isSubmitting ? "Publicando..." : buttonText}
        </button>
      </div>
    </form>
  );
}

// --- 2. COMPONENTE DE COMENTÁRIO ATUALIZADO COM LÓGICA DE REAÇÃO ---
function Comment({ comment, articleId, onReplyPublished, onCommentUpdated }) {
  const { data: session } = useSession();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const [reactionCounts, setReactionCounts] = useState(
    comment.reactionCounts || {}
  );
  const [userReactions, setUserReactions] = useState(comment.reactions || []);

  const userImage =
    comment.author.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      comment.author.name
    )}&background=random`;
  const isAuthor = session?.user?.id === comment.authorId;

  const userReactionTypes = new Set(userReactions.map((r) => r.type));

  const hasLiked = userReactions.some((r) => r.type === "LIKE");
  const hasLoved = userReactions.some((r) => r.type === "LOVE");

  const handleReplySuccess = (newReply) => {
    onReplyPublished(newReply);
    setIsReplying(false);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/comments/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId: comment.id, content: editedContent }),
      });
      if (!response.ok) throw new Error("Falha ao atualizar o comentário.");
      const updatedCommentData = await response.json();
      onCommentUpdated(updatedCommentData);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReaction = async (reactionType) => {
    if (!session) {
      signIn();
      return;
    }

    const alreadyReacted = userReactions.some((r) => r.type === reactionType);

    setUserReactions((prev) =>
      alreadyReacted
        ? prev.filter((r) => r.type !== reactionType)
        : [...prev, { type: reactionType }]
    );
    setReactionCounts((prev) => {
      const newCounts = { ...prev };
      if (alreadyReacted) {
        newCounts[reactionType] = (newCounts[reactionType] || 1) - 1;
      } else {
        newCounts[reactionType] = (newCounts[reactionType] || 0) + 1;
      }
      return newCounts;
    });

    try {
      await fetch("/api/comments/react", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commentId: comment.id,
          reactionType: reactionType,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    // Adiciona uma confirmação para evitar exclusões acidentais
    if (
      !confirm(
        "Tem certeza de que deseja excluir este comentário? Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/comments/delete?commentId=${comment.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Falha ao excluir o comentário.");
      }

      // Notifica o componente pai para remover o comentário da lista
      onCommentDeleted(comment.id);
    } catch (error) {
      console.error(error);
      // Poderíamos mostrar uma mensagem de erro para o usuário aqui
    }
  };

  return (
    <div className={styles.comment}>
      <img
        src={userImage}
        alt={comment.author.name}
        className={styles.authorImage}
      />
      <div className={styles.commentBody}>
        <div className={styles.commentHeader}>
          <span className={styles.authorName}>{comment.author.name}</span>
          <span className={styles.commentDate}>
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
              locale: ptBR,
            })}
            {comment.updatedAt > comment.createdAt && <em> (editado)</em>}
          </span>
        </div>

        {!isEditing ? (
          <p className={styles.commentContent}>{comment.content}</p>
        ) : (
          <form onSubmit={handleUpdateSubmit} className={styles.editForm}>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className={styles.editTextarea}
              rows="3"
            />
            <div className={styles.editActions}>
              <button type="submit" className={styles.ghostButton}>
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className={styles.ghostButton}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <div className={styles.reactionSummary}>
          {reactionCounts.LIKE > 0 && (
            <span className={styles.reactionIcon}>
              👍 {reactionCounts.LIKE}
            </span>
          )}
          {reactionCounts.LOVE > 0 && (
            <span className={styles.reactionIcon}>
              ❤️ {reactionCounts.LOVE}
            </span>
          )}
          {reactionCounts.DISLIKE > 0 && (
            <span className={styles.reactionIcon}>
              👎 {reactionCounts.DISLIKE}
            </span>
          )}
          {reactionCounts.ANGRY > 0 && (
            <span className={styles.reactionIcon}>
              😠 {reactionCounts.ANGRY}
            </span>
          )}
          {reactionCounts.WOW > 0 && (
            <span className={styles.reactionIcon}>😮 {reactionCounts.WOW}</span>
          )}
        </div>

        <div className={styles.commentActions}>
          <button
            onClick={() => handleReaction("LIKE")}
            className={
              userReactionTypes.has("LIKE")
                ? styles.reacted
                : styles.reactionButton
            }
          >
            👍
          </button>
          <button
            onClick={() => handleReaction("LOVE")}
            className={
              userReactionTypes.has("LOVE")
                ? styles.reacted
                : styles.reactionButton
            }
          >
            ❤️
          </button>
          <button
            onClick={() => handleReaction("WOW")}
            className={
              userReactionTypes.has("WOW")
                ? styles.reacted
                : styles.reactionButton
            }
          >
            😮
          </button>
          <button
            onClick={() => handleReaction("ANGRY")}
            className={
              userReactionTypes.has("ANGRY")
                ? styles.reacted
                : styles.reactionButton
            }
          >
            😠
          </button>

          <button
            onClick={() => handleReaction("DISLIKE")}
            className={
              userReactionTypes.has("DISLIKE")
                ? styles.reacted
                : styles.reactionButton
            }
          >
            👎
          </button>

          <button
            onClick={() => setIsReplying(!isReplying)}
            className={styles.actionButton}
          >
            {isReplying ? "Cancelar" : "Responder"}
          </button>
          {isAuthor && !isEditing && (
            <>
              <button onClick={() => setIsEditing(true)} className={styles.actionButton}>
                Editar
              </button>
              <button onClick={handleDelete} className={styles.deleteButton}>
                Excluir
              </button>
            </>
          )}
        </div>

        {isReplying && (
          <div className={styles.replyFormContainer}>
            <CommentForm
              articleId={articleId}
              parentId={comment.id}
              onCommentPublished={handleReplySuccess}
              placeholder={`Respondendo a ${comment.author.name}...`}
              buttonText="Responder"
            />
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className={styles.repliesContainer}>
            {comment.replies.map((reply) => (
              <Comment
                key={reply.id}
                comment={reply}
                articleId={articleId}
                onReplyPublished={onReplyPublished}
                onCommentUpdated={onCommentUpdated}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- 3. COMPONENTE PRINCIPAL ATUALIZADO ---
export default function Comments({ articleId }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      if (!articleId) return;
      setIsLoading(true);
      try {
        // A API de listagem já busca os comentários de forma hierárquica
        const response = await fetch(
          `/api/comments/list?articleId=${articleId}`
        );
        if (!response.ok)
          throw new Error("Não foi possível carregar os comentários.");
        const data = await response.json();
        setComments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComments();
  }, [articleId]);

  // Função para adicionar um novo comentário (principal ou resposta) à lista sem recarregar a página
  const addCommentToList = (newComment) => {
    if (newComment.parentId) {
      // É uma resposta, precisamos encontrar o comentário pai e adicioná-la lá
      setComments((prevComments) => {
        const findAndAddReply = (commentList) => {
          return commentList.map((comment) => {
            if (comment.id === newComment.parentId) {
              // Encontrou o pai, adiciona a resposta
              return {
                ...comment,
                replies: [...(comment.replies || []), newComment],
              };
            }
            // Procura nos filhos recursivamente
            if (comment.replies && comment.replies.length > 0) {
              return { ...comment, replies: findAndAddReply(comment.replies) };
            }
            return comment;
          });
        };
        return findAndAddReply(prevComments);
      });
    } else {
      // É um comentário principal, adiciona no topo da lista
      setComments((prevComments) => [newComment, ...prevComments]);
    }
  };

  const handleCommentUpdated = (updatedComment) => {
    setComments((prevComments) => {
      const findAndUpdate = (commentList) => {
        return commentList.map((comment) => {
          if (comment.id === updatedComment.id) {
            // Encontrou o comentário, retorna a versão atualizada
            // Mantém as respostas existentes que não vêm da API de update
            return {
              ...updatedComment,
              replies: comment.replies,
              _count: comment._count,
            };
          }
          // Procura nos filhos recursivamente
          if (comment.replies && comment.replies.length > 0) {
            return { ...comment, replies: findAndUpdate(comment.replies) };
          }
          return comment;
        });
      };
      return findAndUpdate(prevComments);
    });
  };

  const handleCommentDeleted = (deletedCommentId) => {
    setComments(prevComments => {
      const filterOut = (commentList) => {
        return commentList
          .filter(comment => comment.id !== deletedCommentId) // Remove o comentário
          .map(comment => {
            // Se o comentário tiver respostas, roda o filtro nelas também
            if (comment.replies && comment.replies.length > 0) {
              return { ...comment, replies: filterOut(comment.replies) };
            }
            return comment;
          });
      };
      return filterOut(prevComments);
    });
  };

  if (isLoading)
    return <div className={styles.loading}>Carregando comentários...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <section className={styles.commentsSection}>
      <h2 className={styles.sectionTitle}>Comentários ({comments.length})</h2>

      {session ? (
        <CommentForm
          articleId={articleId}
          onCommentPublished={addCommentToList}
        />
      ) : (
        <div className={styles.loginPrompt}>
          <p>
            Você precisa estar logado para comentar.{" "}
            <button onClick={() => signIn()}>Entrar</button>
          </p>
        </div>
      )}

      <div className={styles.commentsList}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              articleId={articleId}
              onReplyPublished={addCommentToList}
              onCommentUpdated={handleCommentUpdated}
              onCommentDeleted={handleCommentDeleted}
            />
          ))
        ) : (
          <p>
            Ainda não há comentários. Seja o primeiro a compartilhar sua
            opinião!
          </p>
        )}
      </div>
    </section>
  );
}
