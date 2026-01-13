// /pages/admin/blog/novo.js

import { useState } from "react";
import { useRouter } from "next/router";
import PageLayout from "../../../components/PageLayout";
import AdminGuard from "../../../components/AdminGuard"; // Importante para proteger a página
import styles from "../../../styles/adminForm.module.css";

export default function NovoArtigoPage() {
  const router = useRouter();

  // Estados do formulário
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [slug, setSlug] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // Este estado agora será preenchido pelo upload
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);

  // Estados de controle
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // Estado para o feedback de upload
  const [error, setError] = useState("");

  // Função para lidar com o upload da imagem para a nossa API
  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(""); // Limpa erros anteriores

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha no upload da imagem.");
      }

      const data = await response.json();
      setImageUrl(data.imageUrl); // Salva a URL segura do Cloudinary no estado
    } catch (err) {
      console.error(err);
      setError(err.message);
      alert("Erro ao enviar a imagem: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Função para submeter o formulário completo
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageUrl) {
      setError("Por favor, faça o upload de uma imagem antes de publicar.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/articles/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subtitle,
          slug,
          imageUrl,
          description,
          content,
          published,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Falha ao criar o artigo.");
      }

      // Sucesso! Redireciona para a página do novo artigo
      router.push(`/blog/${slug}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminGuard>
      {" "}
      {/* Envolvemos a página com o AdminGuard */}
      <PageLayout title="Novo Artigo">
        <div className={styles.formContainer}>
          <h1>Criar Novo Artigo</h1>
          <form onSubmit={handleSubmit}>
            {/* Campos de texto permanecem os mesmos */}
            <div className={styles.formGroup}>
              <label htmlFor="title">Título</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="subtitle">Subtítulo (Opcional)</label>
              <input
                type="text"
                id="subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
              />
            </div>
            <div className={styles.formRow}>
              {/* Coluna 1: Slug */}
              <div className={styles.formGroup}>
                <label htmlFor="slug">Slug (URL amigável). Ex.:titulo-de-exibicao</label>
                <input
                  type="text"
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
              </div>

              {/* Coluna 2: Upload de Imagem */}
              <div className={styles.formGroup}>
                <label htmlFor="imageUpload">Imagem de Destaque</label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/png, image/jpeg, image/webp, image/jpg"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className={styles.fileInput}
                />
                <label htmlFor="imageUpload" className={styles.fileInputLabel}>
                  {isUploading ? "Enviando..." : "Escolher arquivo"}
                </label>
                {isUploading && (
                  <p className={styles.uploadingMessage}>Enviando imagem...</p>
                )}
                {imageUrl && (
                  <div className={styles.imagePreviewContainer}>
                    <p>Imagem carregada!</p>
                    <img
                      src={imageUrl}
                      alt="Prévia da imagem"
                      className={styles.imagePreview}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">
                Descrição Curta (para a página inicial)
              </label>
              <textarea
                id="description"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="content">
                Conteúdo do Artigo (pode usar HTML)
              </label>
              <textarea
                id="content"
                rows="15"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
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
                <label htmlFor="published">Publicar este artigo?</label>
                <p>Se marcado, o artigo ficará visível para todos no blog.</p>
              </div>
            </div>

            {error && <p className={styles.errorMessage}>{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className={styles.submitButton}
            >
              {isSubmitting
                ? published
                  ? "Publicando..."
                  : "Salvando..."
                : published
                ? "Publicar Artigo"
                : "Salvar como Rascunho"}
            </button>
          </form>
        </div>
      </PageLayout>
    </AdminGuard>
  );
}
