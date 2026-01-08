// /pages/admin/eventos/novo.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PageLayout from '../../../components/PageLayout';
import AdminGuard from '../../../components/AdminGuard';
import styles from '../../../styles/adminForm.module.css';

const cidadesDisponiveis = {
  Petrolina: 'PE',
  Jaú: 'SP',
  Mafra: 'SC',
  Sertãozinho: 'SP',
  Avaré: 'SP',
};

export default function NovoEventoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    type: 'CMC',
    date: '',
    city: 'Petrolina',
    state: 'PE',
    venueName: '',
    venueAddress: '',
    registrationLink: '',
    status: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const novoEstado = cidadesDisponiveis[formData.city];
    if (novoEstado) {
      setFormData(prev => ({ ...prev, state: novoEstado }));
    }
  }, [formData.city]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/eventos/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao criar o evento.');
      }

      router.push('/admin/eventos');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminGuard>
      <PageLayout title="Criar Novo Evento">
        <div className={styles.adminContainer}>
          <h1>Criar Novo Evento (Turma)</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="type">Tipo de Evento</label>
                <select name="type" value={formData.type} onChange={handleChange} className={styles.formInput}>
                  <option value="CMC">CMC</option>
                  <option value="IME">Imersão IME</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="date">Data e Hora do Evento</label>
                <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} required />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="city">Cidade</label>
                <select name="city" value={formData.city} onChange={handleChange} required className={styles.formInput}>
                  {Object.keys(cidadesDisponiveis).map(cidade => (
                    <option key={cidade} value={cidade}>{cidade}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="state">Estado (UF)</label>
                <input type="text" name="state" value={formData.state} readOnly disabled className={styles.disabledInput} />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="venueName">Nome do Local (Opcional)</label>
              <input type="text" name="venueName" value={formData.venueName} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="venueAddress">Endereço do Local (Opcional)</label>
              <input type="text" name="venueAddress" value={formData.venueAddress} onChange={handleChange} />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="registrationLink">Link de Inscrição (Sympla, etc.)</label>
              <input type="url" name="registrationLink" value={formData.registrationLink} onChange={handleChange} required />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="status">Status do Evento</label>
              <select name="status" value={formData.status} onChange={handleChange} className={styles.formInput}>
                <option value="EM_BREVE">Em Breve</option>
                <option value="ATIVO">Ativo</option>
                <option value="ESGOTADO">Esgotado</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className="primary-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Evento'}
            </button>
          </form>
        </div>
      </PageLayout>
    </AdminGuard>
  );
}
