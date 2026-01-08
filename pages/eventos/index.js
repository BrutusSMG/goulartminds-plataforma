// /pages/eventos/index.js

import { useState, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import PageLayout from "../../components/PageLayout";
import client from "../../lib/db";
import styles from "../../styles/EventosHub.module.css";

export default function EventosHubPage({ events }) {
  const [selectedCity, setSelectedCity] = useState(null);

  const uniqueCities = useMemo(() => {
    const cities = new Set(events.map((event) => event.city));
    return Array.from(cities);
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (!selectedCity) {
      return events;
    }
    return events.filter((event) => event.city === selectedCity);
  }, [events, selectedCity]);

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

        {uniqueCities.length > 0 ? (
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
        ) : null}

        <main className={styles.eventsGrid}>
          {events.length > 0 ? (
            <>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => {
                  const isCMC = event.type === "CMC";
                  const eventDate = new Date(event.date);
                  const linkHref = isCMC
                    ? `/em-construcao`
                    : event.registrationLink;
                  const LinkComponent = isCMC ? Link : "a";
                  const cardClass = isCMC ? styles.cmcCard : styles.imeCard;

                  return (
                    <LinkComponent
                      key={event.id}
                      href={linkHref}
                      target={!isCMC ? "_blank" : undefined}
                      rel={!isCMC ? "noopener noreferrer" : undefined}
                      className={`${styles.eventCard} ${cardClass}`}
                    >
                      <div className={styles.cardContent}>
                        <div className={styles.cardTop}>                          
                          <h3 className={styles.eventDate}>
                            {format(eventDate, "dd 'de' MMMM", { locale: ptBR })}
                          </h3>                          
                        </div>

                        {/* --- 👇 NOVO CONTAINER PARA A BASE (AÇÃO) 👇 --- */}
                        <div className={styles.cardBottom}>
                          <p className={styles.eventCityState}>
                            {event.city}, {event.state}
                          </p>
                          <span className={styles.eventAction}>
                            {isCMC ? 'Ver Detalhes' : 'Inscreva-se Agora'} &rarr;
                          </span>
                        </div>
                      </div>
                    </LinkComponent>
                  );
                })
              ) : (

                <div className={styles.noEventsMessage}>
                  <p>Nenhum evento encontrado para a cidade selecionada.</p>
                  <p>Selecione "Todas" para ver as opções disponíveis.</p>
                </div>
              )}
            </>
          ) : (

            <div className={styles.noEventsMessage}>
              <h2>Em Breve</h2>
              <p>
                Estamos planejando os próximos eventos. Volte em breve para
                novidades!
              </p>
            </div>
          )}
        </main>
      </div>
    </PageLayout>
  );
}

export async function getServerSideProps() {
  const events = await client.event.findMany({
    where: {
      status: "ATIVO", // Busca apenas eventos com o status 'ATIVO'
    },
    orderBy: {
      date: "asc",
    },
  });

  return {
    props: {
      events: JSON.parse(JSON.stringify(events)),
    },
  };
}
