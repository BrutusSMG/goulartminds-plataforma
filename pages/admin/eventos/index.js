// /pages/admin/eventos/index.js

import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import AdminGuard from "../../../components/AdminGuard";
import PageLayout from "../../../components/PageLayout";
import client from "../../../lib/db"; 
import styles from "../../../styles/adminList.module.css"; 

export async function getServerSideProps() {
  const events = await client.event.findMany({
    orderBy: { date: "desc" },
  });
  return {
    props: {
      events: JSON.parse(JSON.stringify(events)),
    },
  };
}

export default function AdminEventosPage({ events: initialEvents }) {
  const router = useRouter();
  const [events, setEvents] = useState(initialEvents);
  const [error, setError] = useState("");

  const handleDelete = async (eventId) => {
    if (
      !confirm(
        "Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/api/eventos/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: eventId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao excluir o evento.");
      }
      setEvents((currentEvents) =>
        currentEvents.filter((event) => event.id !== eventId)
      );
    } catch (err) {
      setError(err.message);
      alert(`Erro: ${err.message}`);
    }
  };

  return (
    <AdminGuard>
      <PageLayout title="Gerenciar Eventos">
        <div className={styles.adminContainer}>
          <div className={styles.header}>
            <h1>Gerenciar Eventos</h1>
            <button onClick={() => router.push('/admin/eventos/novo')} className={styles.actionButton}>
              + Novo Evento
            </button>
          </div>          

          {events.length > 0 ? (
            <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Evento</th>
                  <th>Data</th>
                  <th>Cidade</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>
                      <div className={styles.eventTitle}>
                        <strong>{event.type}</strong>
                        {event.edition && <span> - {event.edition}</span>}
                      </div>
                    </td>
                    <td>
                      {format(new Date(event.date), "dd/MM/yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </td>
                    <td>
                      {event.city} - {event.state}
                    </td>
                    <td>
                      <span className={styles.status} data-status={event.status}>
                        {event.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className={styles.actions}>
                      <Link
                        href={`/admin/eventos/editar/${event.id}`}
                        className={styles.actionButton}
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className={`${styles.actionButton} ${styles.deleteBtn}`}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          ) : (
            <p>Nenhum evento cadastrado ainda.</p>
          )}
        </div>
      </PageLayout>
    </AdminGuard>
  );
}
