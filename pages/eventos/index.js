// /pages/eventos/index.js

import { useState, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import PageLayout from "../../components/PageLayout";
import client from "../../lib/db";
import styles from "../../styles/EventosHub.module.css";

// COMPONENTE AUXILIAR REUTILIZÁVEL PARA O CARD DO EVENTO
const EventCard = ({ event }) => {  
  const eventDate = new Date(event.date);
  const hasUrl = event.registrationLink && event.registrationLink.trim() !== '';
  const LinkComponent = hasUrl ? 'a' : Link;
  const linkProps = {
    href: hasUrl ? event.registrationLink : '/em-construcao',
    // Adiciona target="_blank" apenas se for um link externo (tag 'a')
    ...(hasUrl && { target: '_blank', rel: 'noopener noreferrer' }),
  };
  const isCMC = event.type === "CMC";
  const cardClass = isCMC ? styles.cmcCard : styles.imeCard;

  return (
    <LinkComponent {...linkProps} className={`${styles.eventCard} ${cardClass}`}>
      <div className={styles.cardContent}>
        <div className={styles.cardTop}>
          <h3 className={styles.eventDate}>
            {format(eventDate, "dd 'de' MMMM", { locale: ptBR })}
          </h3>
        </div>
        <div className={styles.cardBottom}>
          <p className={styles.eventCityState}>
            {event.city}, {event.state}
          </p>
          <span className={styles.eventAction}>
            {/* O texto do botão também pode ser condicional */}
            {hasUrl ? (isCMC ? 'Ver Detalhes' : 'Inscreva-se Agora') : 'Em Breve'} &rarr;
          </span>
        </div>
      </div>
    </LinkComponent>
  );
};

export default function EventosHubPage({ allEvents }) {
  const [selectedCity, setSelectedCity] = useState(null);

  // 1. SEPARA OS EVENTOS EM LISTAS DE 'ATIVOS' E 'EM BREVE'
  const { activeEvents, upcomingEvents } = useMemo(() => {
    const active = [];
    const upcoming = [];
    allEvents.forEach(event => {
      if (event.status === 'ATIVO') {
        active.push(event);
      } else if (event.status === 'EM_BREVE') {
        upcoming.push(event);
      }
    });
    return { activeEvents: active, upcomingEvents: upcoming };
  }, [allEvents]);

  // 2. APLICA O FILTRO DE CIDADE À LISTA DE EVENTOS ATIVOS
  const filteredActiveEvents = useMemo(() => {
    if (!selectedCity) return activeEvents;
    return activeEvents.filter((event) => event.city === selectedCity);
  }, [activeEvents, selectedCity]);
  
  // 3. APLICA O FILTRO DE CIDADE À LISTA DE EVENTOS EM BREVE
  const filteredUpcomingEvents = useMemo(() => {
    if (!selectedCity) return upcomingEvents;
    return upcomingEvents.filter((event) => event.city === selectedCity);
  }, [upcomingEvents, selectedCity]);

  // 4. CRIA A LISTA DE CIDADES ÚNICAS PARA OS BOTÕES DE FILTRO
  const uniqueCities = useMemo(() => {
    const cities = new Set(allEvents.map((event) => event.city));
    return Array.from(cities);
  }, [allEvents]);

  return (
    <PageLayout title="Próximos Eventos">
      <Head>
        <title>Próximos Eventos - Goulart Minds</title>
        <meta
          name="description"
          content="Descubra os próximos eventos CMC e IME em sua cidade."
        />
      </Head>

      <div className={styles.hubContainer}>
        <header className={styles.hubHeader}>
          <h1>Próximos Eventos {new Date().getFullYear()}</h1>
          <p>Selecione sua cidade para ver os eventos disponíveis.</p>
        </header>

        {uniqueCities.length > 0 && (
          <div className={styles.cityFilter}>
            <button
              onClick={() => setSelectedCity(null)}
              className={!selectedCity ? styles.active : ""}
            >
              Todas
            </button>
            {uniqueCities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={selectedCity === city ? styles.active : ""}
              >
                {city}
              </button>
            ))}
          </div>
        )}

        <main>
          {/* SEÇÃO DE EVENTOS CONFIRMADOS (ATIVOS) */}
          {filteredActiveEvents.length > 0 && (
            <section className={styles.eventsSection}>
              <h2 className={styles.sectionTitle}>Eventos Confirmados</h2>
              <div className={styles.eventsGrid}>
                {filteredActiveEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}

          {/* SEÇÃO DE PRÓXIMAS DATAS (EM BREVE) */}
          {filteredUpcomingEvents.length > 0 && (
            <section className={styles.eventsSection}>
              <h2 className={styles.sectionTitle}>Próximas Datas (Sujeito a Alteração)</h2>
              <div className={styles.eventsGrid}>
                {filteredUpcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}

          {/* MENSAGEM DE "NENHUM EVENTO ENCONTRADO" */}
          {filteredActiveEvents.length === 0 && filteredUpcomingEvents.length === 0 && (
            <div className={styles.noEventsMessage}>
              {selectedCity ? (
                <>
                  <p>Nenhum evento encontrado para a cidade selecionada.</p>
                  <p>Selecione "Todas" para ver as opções disponíveis.</p>
                </>
              ) : (
                <>
                  <h2>Em Breve</h2>
                  <p>Estamos planejando os próximos eventos. Volte em breve para novidades!</p>
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </PageLayout>
  );
}

export async function getServerSideProps() {
  const allEvents = await client.event.findMany({
    where: {
      status: {
        in: ["ATIVO", "EM_BREVE"],
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  return {
    props: {
      allEvents: JSON.parse(JSON.stringify(allEvents)),
    },
  };
}
