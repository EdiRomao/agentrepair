"use client"

import Link from "next/link"
import styles from "@/styles/policies.module.css"

export default function PoliciesPage() {
  const calculateCancellationDeadline = (dateString: string, timeString: string) => {
    const [year, month, day] = dateString.split("-")
    const [hours, minutes] = timeString ? timeString.split(":") : ["00", "00"]

    const bookingDate = new Date(
      Number.parseInt(year),
      Number.parseInt(month) - 1,
      Number.parseInt(day),
      Number.parseInt(hours),
      Number.parseInt(minutes),
    )

    return new Date(bookingDate.getTime() + 24 * 60 * 60 * 1000)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Políticas de Cancelamento</h1>
          <Link href="/client/dashboard" className={styles.backLink}>
            Voltar ao Dashboard
          </Link>
        </div>
      </header>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>Política de Cancelamento 24h</h2>
          <div className={styles.policyCard}>
            <div className={styles.policyIcon}>⏰</div>
            <div className={styles.policyContent}>
              <h3>Cancelamento Grátis</h3>
              <p>
                Você pode cancelar sua marcação sem custos adicionais se o fizer dentro de 24 horas após a confirmação.
              </p>
              <ul>
                <li>Cancelamento 100% grátis nos primeiros 24 horas</li>
                <li>Reembolso total é processado dentro de 3-5 dias úteis</li>
                <li>Nenhuma penalidade ou taxa de cancelamento</li>
              </ul>
            </div>
          </div>

          <div className={styles.policyCard}>
            <div className={styles.policyIcon}>💰</div>
            <div className={styles.policyContent}>
              <h3>Cancelamento Após 24h</h3>
              <p>Após 24 horas da confirmação, será cobrado o valor total do serviço.</p>
              <ul>
                <li>Taxa de cancelamento: 100% do valor da marcação</li>
                <li>Reserva de tempo e recursos</li>
                <li>Compensação ao prestador de serviço</li>
              </ul>
            </div>
          </div>

          <div className={styles.policyCard}>
            <div className={styles.policyIcon}>🔄</div>
            <div className={styles.policyContent}>
              <h3>Reagendamento</h3>
              <p>Pode reagendar sua marcação para outra data sem custos adicionais.</p>
              <ul>
                <li>Reagendamento grátis em qualquer momento</li>
                <li>Mesmos serviços e prestador se disponível</li>
                <li>Sujeito à disponibilidade do prestador</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Como Calcular Seu Prazo</h2>
          <div className={styles.calculatorCard}>
            <p>
              <strong>Exemplo:</strong> Se você confirmou sua marcação em 15 de janeiro de 2025 às 10:30, terá até 16 de
              janeiro de 2025 às 10:30 para cancelar sem custos.
            </p>

            <div className={styles.timeline}>
              <div className={styles.timelineItem}>
                <div className={styles.timelineTime}>10:30 - 15 de janeiro</div>
                <div className={styles.timelineEvent}>Marcação Confirmada</div>
              </div>
              <div className={styles.timelineArrow}>↓ +24 horas</div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineTime}>10:30 - 16 de janeiro</div>
                <div className={styles.timelineEvent}>Prazo para Cancelamento Grátis</div>
              </div>
              <div className={styles.timelineArrow}>↓ +1 minuto</div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineTime}>10:31 - 16 de janeiro</div>
                <div className={styles.timelineEvent}>Taxa de Cancelamento Aplicada</div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Cancelamento do Prestador</h2>
          <div className={styles.infoBox}>
            <h3>Se o Prestador Cancelar</h3>
            <p>
              Caso o prestador cancele a marcação, receberá um email notificação e poderá reagendar com outro prestador
              sem custos adicionais.
            </p>
            <ul>
              <li>Notificação imediata via email</li>
              <li>Opção de reagendar com outro prestador</li>
              <li>Sem penalidades para o cliente</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Perguntas Frequentes</h2>

          <div className={styles.faqItem}>
            <h4>Como faço para cancelar?</h4>
            <p>
              Aceda ao seu dashboard, localize a marcação e clique no botão "Cancelar Marcação". Se estiver dentro do
              prazo de 24 horas, será cancelada sem custos.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h4>Quanto tempo demora o reembolso?</h4>
            <p>
              Os reembolsos são processados dentro de 3 a 5 dias úteis após a confirmação do cancelamento. O tempo pode
              variar consoante o banco.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h4>Posso cancelar no dia da marcação?</h4>
            <p>
              Se cancelar no mesmo dia da marcação (após as 24 horas de confirmação), será cobrado o valor total.
              Contacte o prestador para discutir alternativas.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h4>E se eu não aparecer (no-show)?</h4>
            <p>
              Se não aparecer sem cancelamento ou aviso prévio, será cobrado o valor total. Sempre cancele ou contacte o
              prestador se não puder comparecer.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h4>Posso reagendar após cancelar?</h4>
            <p>Sim, pode reagendar sua marcação para qualquer data disponível do mesmo prestador ou de outro.</p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.contactBox}>
            <h2>Precisa de Ajuda?</h2>
            <p>Se tiver dúvidas sobre as políticas de cancelamento, contacte-nos:</p>
            <p>
              <strong>Email:</strong> suporte@repairhub.com
            </p>
            <p>
              <strong>Telefone:</strong> +351 XXX XXX XXX
            </p>
            <p>
              <strong>Horário:</strong> Segunda a Sexta, 9h-18h
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
