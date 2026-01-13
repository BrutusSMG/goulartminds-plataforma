// /pages/admin/blog/editar/[slug].js

import { useState } from 'react';
import { useRouter } from 'next/router';
import PageLayout from '../../../../components/PageLayout';
import AdminGuard from '../../../../components/AdminGuard';
import styles from '../../../../styles/adminForm.module.css'; // Usando o mesmo estilo
import client from '../../../../lib/db';

// MODIFICAÇÃO 1: Buscar os dados do artigo no servidor (getServerSideProps)
export async function getServerSideProps({ params }) {
  const article = await client.article.findUnique({
    where: { slug: params.slug },
  });

  if (!article) {
    return { notFound: true };
  }

  return {
    props: {
      initialArticle: JSON.parse(JSON.stringify(article)),
    },
  };
}

export default function EditarArtigoPage({ initialArticle }) {
  const router = useRouter();

  // MODIFICAÇÃO 2: Inicializar o estado com os dados recebidos
  const [title, setTitle] = useState(initialArticle.title);
  const [subtitle, setSubtitle] = useState(initialArticle.subtitle || '');
  // O slug não é editável diretamente, mas precisamos dele para a API
  const [slug, setSlug] = useState(initialArticle.slug); 
  const [imageUrl, setImageUrl] = useState(initialArticle.imageUrl);
  const [description, setDescription] = useState(initialArticle.description);
  const [content, setContent] = useState(initialArticle.content);
  const [published, setPublished] = useState(initialArticle.published);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // MODIFICAÇÃO 3: A função handleSubmit agora chama a API de 'update'
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/articles/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalSlug: initialArticle.slug,
          title,
          subtitle,
          imageUrl,
          description,
          content,
          published,
        }),
      });

      // Se a resposta da API não for 'ok' (ex: erro 400, 500),
      // nós mesmos lançamos um erro para ser pego pelo 'catch'.
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao atualizar o artigo.');
      }

      // Se tudo deu certo, processamos a resposta
      const updatedArticle = await response.json();
      alert('Artigo atualizado com sucesso!');
      router.push(`/blog/${updatedArticle.slug}`);

    } catch (err) {
      // Captura tanto erros de rede (fetch falhou) quanto erros lançados por nós (response não ok)
      console.error("Falha ao submeter o formulário:", err);
      setError(err.message);

    } finally {
      // Este bloco é executado SEMPRE, seja em caso de sucesso ou de erro.
      // Garante que o botão de salvar seja reabilitado.
      setIsSubmitting(false);
    }
  };

  // MODIFICAÇÃO 4: O JSX é quase idêntico, mas o campo 'slug' é desabilitado
  return (
    <AdminGuard>
      <PageLayout title={`Editando: ${initialArticle.title}`}>
        <div className={styles.formContainer}>
          <h1>Editar Artigo</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Título</label>
              <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="subtitle">Subtítulo (Opcional)</label>
              <input type="text" id="subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="slug">Slug (URL) - Não pode ser alterado</label>
              <input type="text" id="slug" value={slug} disabled />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="imageUrl">URL da Imagem</label>
              <input type="text" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="description">Descrição Curta</label>
              <textarea id="description" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="content">Conteúdo do Artigo (em HTML)</label>
              <textarea id="content" rows="15" value={content} onChange={(e) => setContent(e.target.value)} required />
            </div>

            <div className={styles.formGroupCheckbox}>
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
              />
              <div className={styles.checkboxTextContainer}>
                <label htmlFor="published">
                  Publicar este artigo?
                </label>
                <p>Se marcado, o artigo ficará visível para todos no blog.</p>
              </div>
            </div>
            
            {error && <p className={styles.errorMessage}>{error}</p>}

            <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>
        </div>
      </PageLayout>
    </AdminGuard>
  );
}
