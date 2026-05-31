import { useState } from 'react';
import PageLayout from '../../components/PageLayout';
import styles from '../../styles/Briefing.module.css';
import { useRouter } from 'next/router';

const formSections = [
  {
    title: '1º - Informações de Contato',
    fields: [
      { name: 'empresa', label: 'Nome da Empresa', type: 'text', help: 'Como sua empresa é conhecida no mercado ou o nome do seu projeto atual.' },
      { name: 'nome', label: 'Seu Nome', type: 'text', help: 'O nome da pessoa que será o ponto de contato principal para as estratégias.' },
      { name: 'email', label: 'Seu Email', type: 'email', help: 'Onde você receberá os relatórios e comunicações oficiais.' },
      { name: 'whatsapp', label: 'Seu WhatsApp (com DDD)', type: 'tel', help: 'Para comunicações rápidas e alinhamentos urgentes sobre as campanhas.' },
      { name: 'redes', label: 'Website e/ou Redes Sociais', type: 'text', help: 'Isso nos ajuda a analisar sua presença digital atual antes de começarmos.' },
    ],
  },
  {
    title: '2º - Sobre o Negócio e o Mercado',
    fields: [
      { name: 'descricao', label: 'O que vocês vendem ou oferecem?', type: 'textarea', help: 'Explique de forma simples o que você faz. Imagine que está explicando para alguém que nunca ouviu falar da sua empresa.' },
      { name: 'diferencial', label: 'Qual é o seu principal diferencial?', type: 'textarea', help: 'O que faz um cliente escolher você e não o seu concorrente? (Ex: Preço, qualidade, atendimento).' },
      { name: 'concorrentes', label: 'Liste seus 3 principais concorrentes', type: 'textarea', help: 'Saber quem são seus concorrentes nos ajuda a entender o que eles estão fazendo de certo.' },
      { name: 'puv', label: 'Sua Proposta Única de Valor (PUV)', type: 'text', help: 'Uma frase curta que resume o benefício principal que você entrega.' },
    ],
  },
  {
    title: '3º - Público-Alvo (Persona)',
    fields: [
      { name: 'persona_detalhes', label: 'Descreva seu cliente ideal', type: 'textarea', help: 'Quanto mais soubermos sobre quem compra de você, mais barato fica o anúncio.' },
      { 
        name: 'canais', label: 'Onde seu público passa mais tempo?', type: 'checkbox',
        options: ['Instagram', 'Facebook', 'Google', 'TikTok', 'LinkedIn', 'YouTube', 'Outro'],
        help: 'Onde você acredita que seu cliente passa mais tempo navegando?'
      },
      { 
        name: 'consciencia', label: 'Seu público já conhece sua marca?', type: 'radio',
        options: ['Não me conhece', 'Conhece, mas não o que ofereço', 'Já conhece e quer comprar'],
        help: 'Isso define se precisamos primeiro "educar" o mercado ou se já podemos ir direto para a venda.'
      },
    ],
  },
  {
    title: '4º - Objetivos e Metas',
    fields: [
      { 
        name: 'objetivo_principal', label: 'Qual o objetivo principal agora?', type: 'radio',
        options: ['Vendas', 'Leads', 'Tráfego', 'Branding', 'Mensagens', 'Outro'],
        help: 'Escolha o que é prioridade agora. Queremos vendas imediatas ou construir uma base de contatos?'
      },
      { name: 'meta_numerica', label: 'Existe alguma meta numérica?', type: 'text', help: 'Ter um número nos ajuda a calcular se a campanha está sendo lucrativa.' },
      { 
        name: 'kpi', 
        label: 'Métrica de sucesso mais importante', 
        type: 'radio',
        options: [
          { 
            value: 'ROAS', 
            label: 'ROAS', 
            tooltip: 'Retorno sobre o Investimento em Anúncios. Ex: Se investiu R$ 100 e voltou R$ 500, o ROAS é 5.' 
          },
          { 
            value: 'CPA', 
            label: 'CPA', 
            tooltip: 'Custo por Aquisição. Quanto você paga em anúncios para realizar uma venda.' 
          },
          { 
            value: 'CPL', 
            label: 'CPL', 
            tooltip: 'Custo por Lead. Quanto custa para conseguir o contato (nome/email/whatsapp) de um potencial cliente.' 
          },
          { 
            value: 'CPC', 
            label: 'CPC', 
            tooltip: 'Custo por Clique. O valor médio pago cada vez que alguém clica no seu anúncio.' 
          },
          { 
            value: 'Alcance', 
            label: 'Alcance', 
            tooltip: 'Quantidade de pessoas únicas que visualizaram seus anúncios pelo menos uma vez.' 
          }
        ],
        help: 'Qual número você vai olhar para dizer "esse trabalho está funcionando"?'
      },
    ],
  },
  {
    title: '5º - Orçamento e Estrutura Técnica',
    fields: [
      { 
        name: 'investimento', label: 'Investimento mensal pretendido', type: 'radio',
        options: ['Até R$500', 'R$501 - R$1.000', 'R$1.001 - R$5.000', 'Mais de R$5.001'],
        help: 'O valor que você pagará diretamente para as plataformas (Facebook/Google) para exibir seus anúncios.'
      },
      { 
        name: 'destino', label: 'Para onde o tráfego será direcionado?', type: 'radio',
        options: ['Página de Vendas', 'Site', 'Instagram', 'WhatsApp', 'Captura', 'Outros'],
        help: 'Para onde as pessoas vão ao clicar no anúncio? Ter uma boa página é 50% do sucesso.'
      },
      { 
        name: 'conta_anuncios', label: 'Já possui Conta de Anúncios?', type: 'radio',
        options: ['Sim, já anunciei', 'Sim, nunca usei', 'Não tenho'],
        help: 'Não se preocupe se não tiver, nós podemos te orientar na criação do zero.'
      },
    ],
  },
  {
    title: '6º - Conteúdo e Criativos',
    fields: [
      { 
        name: 'responsavel_criativos', label: 'Quem criará os anúncios?', type: 'radio',
        options: ['Eu (cliente)', 'Gestor de Tráfego', 'Equipe interna'],
        help: 'Anúncios precisam de imagens e vídeos. Precisamos saber se você já tem isso ou se produziremos.'
      },
      { name: 'materiais_antigos', label: 'Possui materiais de campanhas antigas?', type: 'radio', options: ['Sim', 'Não'], help: 'Dados do que deu certo ou errado no passado valem ouro para nós.' },
      { 
        name: 'tom_voz', label: 'Tom de voz da marca', type: 'checkbox',
        options: ['Formal', 'Amigável', 'Técnico', 'Divertido', 'Inspirador'],
        help: 'Como sua marca fala com as pessoas? Isso deve ser refletido nos textos dos anúncios.'
      },
    ],
  },
];

const WelcomeScreen = ({ onStart }) => (
  <section className={styles.welcomeScreen}>
    <div className={styles.welcomeContent}>
      <h1 className={styles.welcomeTitle}>O ponto de partida para o seu sucesso online.</h1>
      <p className={styles.welcomeSubtitle}>
        Este é o nosso briefing para gestão de tráfego. Com ele, vamos transformar as informações do seu negócio em campanhas de alta performance. Entenda como no vídeo abaixo.
      </p>
      <div className={styles.videoPlaceholder}>
        <span>[VÍDEO EXPLICATIVO AQUI]</span>
      </div>
      <button onClick={onStart} className={`${styles.button} ${styles.buttonPrimary} ${styles.buttonLarge}`}>
        Iniciar Briefing
      </button>
    </div>
  </section>
);

const FormScreen = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = formSections.length;

  const handleInputChange = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));

  const handleCheckboxChange = (name, option, checked) => {
    const current = formData[name] || [];
    handleInputChange(name, checked ? [...current, option] : current.filter(v => v !== option));
  };

  const handleNext = async () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {

      setIsSubmitting(true);

      try {        
        const response = await fetch('/api/briefing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const primeiroNome = formData.nome ? formData.nome.split(' ')[0] : '';
          router.push({
            pathname: '/obrigado',
            query: { nome: primeiroNome }
          });          
        } else {
          alert('Houve um erro ao enviar o briefing. Por favor, tente novamente mais tarde.');
        }
      } catch (error) {
        console.error('Erro ao enviar briefing:', error);
        alert('Erro de rede ao enviar o briefing. Verifique sua conexão e tente novamente.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className={styles.formContainerCentered}>
      <main className={styles.formColumnFull}>
        <div className={styles.formCard}>
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBar} style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}></div>
          </div>
          
          <h3 className={styles.formStepTitle}>{formSections[currentStep].title}</h3>
          <p className={styles.stepIndicator}>Etapa {currentStep + 1} de {totalSteps}</p>
          
          <div className={styles.fieldsContainer}>
            {formSections[currentStep].fields.map(field => (
              <div key={field.name} className={styles.fieldGroup}>
                <div className={styles.labelWrapper}>
                  <label className={styles.label}>{field.label}</label>
                  {field.help && (
                    <div className={styles.helpIconWrapper}>
                      <span className={styles.helpIcon}>?</span>
                      <div className={styles.tooltip}>{field.help}</div>
                    </div>
                  )}
                </div>
                
                {field.type === 'textarea' && (
                  <textarea className={styles.textarea} rows={4} onChange={(e) => handleInputChange(field.name, e.target.value)} value={formData[field.name] || ''} />
                )}

                {(field.type === 'text' || field.type === 'email' || field.type === 'tel') && (
                  <input type={field.type} className={styles.input} onChange={(e) => handleInputChange(field.name, e.target.value)} value={formData[field.name] || ''} />
                )}

                {(field.type === 'radio' || field.type === 'checkbox') && (
                  <div className={styles.optionsGrid}>
                    {field.options.map((opt, index) => {
                      const isObj = typeof opt === 'object' && opt !== null;
                      const optValue = isObj ? opt.value : opt;
                      const optLabel = isObj ? opt.label : opt;
                      const optTooltip = isObj ? opt.tooltip : null;
                      
                      return (
                        <label key={optValue || index} className={styles.optionLabel}>
                          <input 
                            type={field.type} 
                            name={field.name} 
                            checked={field.type === 'radio' ? formData[field.name] === optValue : (formData[field.name] || []).includes(optValue)}
                            onChange={(e) => field.type === 'radio' ? handleInputChange(field.name, optValue) : handleCheckboxChange(field.name, optValue, e.target.checked)}
                          /> 
                          {optLabel}
                          
                          {/* Renderiza o tooltip apenas se existir, com um pequeno ajuste de margem para não colar no texto */}
                          {optTooltip && (
                            <div className={styles.helpIconWrapper} style={{ display: 'inline-block', marginLeft: '6px', verticalAlign: 'middle' }}>
                              <span className={styles.helpIcon}>?</span>
                              <div className={styles.tooltip}>{optTooltip}</div>
                            </div>
                          )}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={styles.navigation}>
            <button onClick={() => { setCurrentStep(s => s - 1); window.scrollTo(0,0); }} disabled={currentStep === 0} className={styles.button}>Anterior</button>
            <button onClick={handleNext} disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }} className={`${styles.button} ${styles.buttonPrimary}`}>
              {currentStep === totalSteps - 1 ? (isSubmitting ? 'Enviando...' : 'Finalizar e Enviar') : 'Próximo'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default function BriefingPage() {
  const [showForm, setShowForm] = useState(false);
  return (
    <PageLayout title="Briefing | Goulart Minds">
      <div className={styles.journeyContainer}>
        {showForm ? <FormScreen /> : <WelcomeScreen onStart={() => setShowForm(true)} />}
      </div>
    </PageLayout>
  );
}
