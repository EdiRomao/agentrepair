import styles from "@/styles/header.module.css"
import Link from "next/link"

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>⚙️</div>
          <span className={styles.logoText}>BookService</span>
        </div>
        <div className={styles.headerActions}>
          <Link href="/client/login">
            <button className={styles.btnLogin}>Fazer Login</button>
          </Link>
        </div>
      </div>
    </header>
  )
}
