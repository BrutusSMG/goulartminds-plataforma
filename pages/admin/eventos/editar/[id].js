// /pages/admin/eventos/editar/[id].js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminGuard from '../../../../components/AdminGuard';
import PageLayout from '../../../../components/PageLayout';
import styles from '../../../../styles/adminForm.module.css';
import client from '../../../../lib/db';

const cidadesDisponiveis = {
  Petrolina: 'PE',
  Jaú: 'SP',
  Mafra: 'SC',
  Sertãozinho: 'SP',
  Avaré:'SP',
};

export async function getServerSideProps(context) {
  const { id } = context.params;
  try {
    const event = await client.event.findUnique({
      where: { id },
    });

    if (!event) {
      return { notFound: true }; // Se não encontrar o evento, retorna 404
    }

    return {
      props: {
        initialEvent: JSON.parse(JSON.stringify(event)), // Serializa os dados
      },
    };
  } catch (error) {
    console.error("Erro ao buscar evento para edição:", error);
    return { notFound: true };
  }
}

export default function EditarEventoPage({ initialEvent }) {
  const router = useRouter();
  const { id } = router.query;

  const [date, setDate] = useState(initialEvent.date.split('T')[0]); 
  const [city, setCity] = useState(initialEvent.city);
  const [state, setState] = useState(initialEvent.state);
  const [venueName, setVenueName] = useState(initialEvent.venueName || '');
  const [venueAddress, setVenueAddress] = useState(initialEvent.venueAddress || '');
  const [registrationLink, setRegistrationLink] = useState(initialEvent.registrationLink);
  const [status, setStatus] = useState(initialEvent.status);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (city && cidadesDisponiveis[city]) {
      setState(cidadesDisponiveis[city]);
    }
  }, [city]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const eventData = { id, date, city, state, venueName, venueAddress, registrationLink, status };

    try {
      const response = await fetch('/api/eventos/update', {
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao atualizar o evento.');
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
      <PageLayout title="Editar Evento">
        <div className={styles.adminContainer}>
          <h1>Editar Evento (Turma)</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* O formulário é idêntico ao de criação */}
            <div className={styles.formGroup}>
              <label htmlFor="date">Data do Evento</label>
              <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="city">Cidade</label>
              <select id="city" value={city} onChange={(e) => setCity(e.target.value)} required className={styles.formInput}>
                <option value="">Selecione a cidade</option>
                {Object.keys(cidadesDisponiveis).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="state">Estado (UF)</label>
              <input type="text" id="state" value={state} readOnly className={styles.readOnlyInput} />
            </div>            

            <div className={styles.formGroup}>
              <label htmlFor="venueName">Nome do Local (Opcional)</label>
              <input type="text" id="venueName" value={venueName} onChange={(e) => setVenueName(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="venueAddress">Endereço do Local (Opcional)</label>
              <input type="text" id="venueAddress" value={venueAddress} onChange={(e) => setVenueAddress(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="registrationLink">Link de Inscrição</label>
              <input type="url" id="registrationLink" value={registrationLink} onChange={(e) => setRegistrationLink(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="status">Status do Evento</label>
              <select
                id="status"
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                className={styles.formInput}
              >
                <option value="EM_BREVE">Em Breve</option>
                <option value="ATIVO">Ativo</option>
                <option value="ESGOTADO">Esgotado</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
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
