import styles from "@/styles/hero.module.css"

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Marque seus serviços com facilidade</h1>
        <p className={styles.heroSubtitle}>
          A plataforma profissional para gerenciar e agendar serviços de forma simples e intuitiva
        </p>
        <div className={styles.heroCTA}>
          <button className={styles.btnPrimary}>Comece Agora</button>
          <button className={styles.btnSecondary}>Saiba Mais</button>
        </div>
      </div>
      <div className={styles.heroImage}>
        <img src="/scheduling-calendar-booking.jpg" alt="Agendamento de serviços" />
      </div>
    </section>
  )
}
