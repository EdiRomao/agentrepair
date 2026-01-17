import styles from "@/styles/footer.module.css"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h4 className={styles.footerTitle}>BookService</h4>
          <p className={styles.footerDesc}>A plataforma de agendamento mais simples e profissional</p>
        </div>
        <div className={styles.footerSection}>
          <h5 className={styles.sectionTitle}>Produto</h5>
          <ul className={styles.footerLinks}>
            <li>
              <a href="#">Recursos</a>
            </li>
            <li>
              <a href="#">Preços</a>
            </li>
            <li>
              <a href="#">Segurança</a>
            </li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h5 className={styles.sectionTitle}>Empresa</h5>
          <ul className={styles.footerLinks}>
            <li>
              <a href="#">Sobre</a>
            </li>
            <li>
              <a href="#">Blog</a>
            </li>
            <li>
              <a href="#">Contato</a>
            </li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h5 className={styles.sectionTitle}>Legal</h5>
          <ul className={styles.footerLinks}>
            <li>
              <a href="#">Privacidade</a>
            </li>
            <li>
              <a href="#">Termos</a>
            </li>
            <li>
              <a href="#">Cookies</a>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p className={styles.copyright}>© 2026 BookService. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}
