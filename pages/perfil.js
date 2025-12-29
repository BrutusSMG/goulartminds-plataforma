// pages/perfil.js

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import PageLayout from '../components/PageLayout'; // Usando PageLayout para consistência
import { AccessDenied } from '../components/AuthGuard';
import { getToolDisplayName } from '../lib/tool-mappings';

export default function PerfilPage() {
  // 1. Usamos APENAS o useSession. Ele já nos dá tudo que precisamos.
  const { data: session, status, update } = useSession();  

  // Estados existentes
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newImageFile, setNewImageFile] = useState(null); 
  const [previewUrl, setPreviewUrl] = useState(null); 
  const [discProfile, setDiscProfile] = useState('');

  const [celular, setCelular] = useState(''); 
  const [cidade, setCidade] = useState(''); 

  useEffect(() => {
    if (session) {
      setName(session.user?.name || '');
      setPreviewUrl(session.user?.image || null);
      setDiscProfile(session.user?.discProfile || '');
      setCelular(session.user?.celular || '');
      setCidade(session.user?.cidade || '');
    }
  }, [session]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validação simples de tamanho (ex: 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('A imagem é muito grande. O máximo é 5MB.');
        return;
      }
      
      setNewImageFile(file); // Armazena o arquivo para o upload
      setPreviewUrl(URL.createObjectURL(file)); // Cria uma URL local para a pré-visualização
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    // 1. Coleta todas as possíveis alterações em um único objeto
    const changes = {};
    if (name !== session.user.name) {
      changes.name = name;
    }
    if (discProfile !== (session.user.discProfile || '')) { 
      changes.discProfile = discProfile;
    }

    if (celular !== (session.user.celular || '')) {
      changes.celular = celular;
    }

    if (cidade !== (session.user.cidade || '')) {
      changes.cidade = cidade;
    }

    // 2. Verifica se há alguma alteração de texto para salvar
    if (Object.keys(changes).length > 0) {
      try {
        const profileResponse = await fetch('/api/user/update-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(changes),
        });

        if (!profileResponse.ok) {
          const result = await profileResponse.json();
          setMessage(result.message || 'Erro ao atualizar os dados do perfil.');
          setIsSubmitting(false);
          return;
        }
        
        // Atualiza a sessão localmente com os dados que foram alterados
        await update(changes);
        setMessage('Perfil atualizado com sucesso!');

      } catch (error) {
        setMessage(error.message || 'Ocorreu um erro inesperado.');
      }
    } else {
      setMessage('Nenhum dado de texto para atualizar.');
    }

    // 3. Verifica se há uma nova imagem para enviar (lógica separada)
    if (newImageFile) {
      const formData = new FormData();
      formData.append('profileImage', newImageFile);

      const imageResponse = await fetch('/api/user/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      if (!imageResponse.ok) {
        setMessage('Os dados do perfil foram salvos, mas houve um erro ao enviar a foto.');
        setIsSubmitting(false);
        return;
      }

      const imageData = await imageResponse.json();
      // Atualiza a sessão localmente com a nova URL da imagem
      await update({ image: imageData.newImageUrl });
    }

    // 4. Define a mensagem de sucesso final e finaliza
    // Verifica se houve alguma alteração (seja de texto ou de imagem)
    if (Object.keys(changes).length > 0 || newImageFile) {
      setMessage('Seu perfil foi atualizado com sucesso!');
    } else {
      setMessage('Nenhuma alteração para salvar.');
    }
    
    setNewImageFile(null); // Limpa o arquivo de imagem após o envio
    setIsSubmitting(false);
  };

  if (status === 'loading') {
    return (
      <PageLayout title="Carregando Perfil...">
        <p style={{ textAlign: 'center', padding: '50px' }}>Carregando...</p>
      </PageLayout>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <PageLayout title="Acesso Negado">
        <AccessDenied />
      </PageLayout>
    );
  }

  // 3. Proteção de Acesso: Usuário não autenticado
  if (status === 'unauthenticated') {
    return (
      <PageLayout title="Acesso Negado">
        <AccessDenied />
      </PageLayout>
    );
  }

  // 4. Conteúdo Principal: Renderizado apenas se o status for 'authenticated'
  return (
    <PageLayout title="Meu Perfil">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1>Meu Perfil</h1>
        <p>Gerencie suas informações e preferências.</p>
        
        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <img
            src={previewUrl || 'image/default-avatar.png'} // Caminho para uma imagem padrão na sua pasta /public
            alt="Foto de Perfil"
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #eee'
            }}
          />
          <input
            type="file"
            id="profileImage"
            style={{ display: 'none' }}
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
          />
          <label
            htmlFor="profileImage"
            style={{
              display: 'block',
              marginTop: '15px',
              cursor: 'pointer',
              color: '#0070f3',
              fontWeight: 'bold'
            }}
          >
            Alterar Foto
          </label>
        </div>
        {/* --- FIM DO NOVO BLOCO DE FOTO DE PERFIL --- */}

        <form onSubmit={handleUpdateProfile}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>E-mail</label>
            <input
              type="email"
              id="email"
              value={session.user.email}
              disabled
              style={{ width: '100%', padding: '10px', backgroundColor: '#f2f2f2', cursor: 'not-allowed', border: '1px solid #ccc', borderRadius: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Nome</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Como você gostaria de ser chamado?"
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            {/* Campo Celular (metade da largura) */}
            <div style={{ flex: 1 }}>
              <label htmlFor="celular" style={{ display: 'block', marginBottom: '5px' }}>Celular</label>
              <input
                type="tel" // Usar type="tel" é bom para semântica e mobile
                id="celular"
                value={celular} // Você precisará de um estado 'celular'
                onChange={(e) => setCelular(e.target.value)}
                placeholder="(XX) XXXXX-XXXX"
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
              />
            </div>

            {/* Campo Cidade (outra metade da largura) */}
            <div style={{ flex: 1 }}>
              <label htmlFor="cidade" style={{ display: 'block', marginBottom: '5px' }}>Cidade</label>
              <input
                type="text"
                id="cidade"
                value={cidade} // Você precisará de um estado 'cidade'
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Ex: São Paulo, SP"
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
              />
            </div>

          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="discProfile" style={{ display: 'block', marginBottom: '5px' }}>
              Perfil Comportamental DISC
            </label>
            <select
              id="discProfile"
              value={discProfile}
              onChange={(e) => setDiscProfile(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: 'white' }}
            >
              <option value="">Não sei / Não preenchido</option>
              <option value="Dominancia">D - Dominância (Executor)</option>
              <option value="Influencia">I - Influência (Comunicador)</option>
              <option value="Estabilidade">S - eStabilidade (Planejador)</option>
              <option value="Conformidade">C - Conformidade (Analista)</option>
            </select>
            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
              Não sabe seu perfil? Em breve teremos um teste para te ajudar!
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Ferramentas Realizadas
            </label>
            <div 
              style={{ 
                padding: '10px', 
                border: '1px solid #ccc', 
                borderRadius: '5px', 
                backgroundColor: '#f2f2f2',
                minHeight: '40px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}
            >
              {session.user.completedTools && session.user.completedTools.length > 0 ? (
                session.user.completedTools.map(toolInternalName => (
                  <span key={toolInternalName} style={{
                    backgroundColor: '#0070f3',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    {getToolDisplayName(toolInternalName)}
                  </span>
                ))
              ) : (
                <span style={{ color: '#666', fontStyle: 'italic' }}>
                  Nenhuma ferramenta realizada ainda.
                </span>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Seu Plano Atual</label>
            <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f2f2f2', textTransform: 'capitalize' }}>
              {session.user.plan || 'Gratuito'}
            </div>
          </div>

          <div style={{ marginTop: '30px' }}>
            <button type="submit" className="primary-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
        
        {message && <p style={{ textAlign: 'center', marginTop: '20px', fontWeight: 'bold' }}>{message}</p>}
      </div>
    </PageLayout>
  );
}