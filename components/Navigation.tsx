"use client"

import styles from "@/styles/navigation.module.css"

interface NavigationProps {
  userType: "client" | "provider" | null
  setUserType: (type: "client" | "provider" | null) => void
}

export default function Navigation({ userType, setUserType }: NavigationProps) {
  return (
    <section className={styles.navigation}>
      <div className={styles.navContainer}>
        <h2 className={styles.navTitle}>Escolha seu tipo de acesso</h2>
        <div className={styles.navButtons}>
          <button
            className={`${styles.navBtn} ${userType === "client" ? styles.active : ""}`}
            onClick={() => setUserType("client")}
          >
            <span className={styles.icon}>👤</span>
            <span className={styles.label}>Sou Cliente</span>
            <span className={styles.desc}>Marcar um serviço</span>
          </button>
          <button
            className={`${styles.navBtn} ${userType === "provider" ? styles.active : ""}`}
            onClick={() => setUserType("provider")}
          >
            <span className={styles.icon}>🏢</span>
            <span className={styles.label}>Sou Prestador</span>
            <span className={styles.desc}>Gerenciar agenda</span>
          </button>
        </div>
      </div>
    </section>
  )
}
