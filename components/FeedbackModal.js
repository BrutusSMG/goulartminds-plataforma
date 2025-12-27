// components/FeedbackModal.js
import { useState } from 'react';
import styles from '../styles/feedbackModal.module.css'; // Vamos criar este estilo

export default function FeedbackModal({ isOpen, onClose }) {
  const [fromEmail, setFromEmail] = useState('');
  const [subject, setSubject] = useState('Elogio'); // Valor padrão
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState({ sending: false, error: '', success: '' });

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ sending: true, error: '', success: '' });

    try {
      const response = await fetch('/api/feedback/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromEmail, subject, message }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Erro desconhecido.');
      }

      setStatus({ sending: false, error: '', success: 'Obrigado! Seu feedback foi enviado.' });
      // Limpa o formulário e fecha o modal após um tempo
      setTimeout(() => {
        setFromEmail('');
        setSubject('Elogio');
        setMessage('');
        onClose();
      }, 3000);

    } catch (error) {
      setStatus({ sending: false, error: error.message, success: '' });
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <h2>Fale Conosco</h2>
        <p>Sua opinião é muito importante para nós. Envie sua sugestão, elogio ou reclamação.</p>
        
        {status.success ? (
          <div className={styles.successMessage}>{status.success}</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="fromEmail">Seu E-mail</label>
              <input
                type="email"
                id="fromEmail"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="subject">Assunto</label>
              <select
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option>Elogio</option>
                <option>Sugestão</option>
                <option>Reclamação</option>
                <option>Dúvida</option>
                <option>Outro</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="message">Mensagem</label>
              <textarea
                id="message"
                rows="5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            {status.error && <p className={styles.errorMessage}>{status.error}</p>}
            <button type="submit" className={styles.submitButton} disabled={status.sending}>
              {status.sending ? 'Enviando...' : 'Enviar Feedback'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
