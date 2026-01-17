"use client"

import { useState } from "react"
import styles from "@/styles/service-card.module.css"

interface Service {
  id: number
  name: string
  description: string
  image: string
  duration: string
  price: string
  provider: string
}

export default function ServiceCard({ service }: { service: Service }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className={styles.card} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className={styles.imageContainer}>
        <img src={service.image || "/placeholder.svg"} alt={service.name} className={styles.image} />
        <div className={styles.overlay}>
          <button className={styles.bookBtn}>Marcar Serviço</button>
        </div>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.header}>
          <h3 className={styles.title}>{service.name}</h3>
          <span className={styles.price}>{service.price}</span>
        </div>
        <p className={styles.description}>{service.description}</p>
        <div className={styles.footer}>
          <div className={styles.info}>
            <span className={styles.infoItem}>⏱️ {service.duration}</span>
            <span className={styles.infoItem}>👤 {service.provider}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
