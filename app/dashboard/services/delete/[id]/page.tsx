"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import styles from "@/styles/delete-service.module.css"

interface Service {
  id: number
  name: string
  description: string
  duration: string
  price: string
  category: string
  available: boolean
}

export default function DeleteServicePage() {
  const router = useRouter()
  const params = useParams()
  const serviceId = Number(params.id)
  const [service, setService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/auth/login")
      return
    }

    // Load service data
    const savedServices = localStorage.getItem("services")
    if (savedServices) {
      const services: Service[] = JSON.parse(savedServices)
      const foundService = services.find((s) => s.id === serviceId)
      if (foundService) {
        setService(foundService)
      } else {
        setError("Serviço não encontrado")
      }
    }
    setIsLoading(false)
  }, [serviceId, router])

  const handleDelete = async () => {
    setIsDeleting(true)
    setError("")

    try {
      // Get existing services
      const savedServices = localStorage.getItem("services") || "[]"
      let services: Service[] = JSON.parse(savedServices)

      // Remove service
      services = services.filter((s) => s.id !== serviceId)

      localStorage.setItem("services", JSON.stringify(services))

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      setError("Erro ao eliminar serviço. Tente novamente.")
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    router.push("/dashboard")
  }

  if (isLoading) {
    return (
      <div className={styles.deleteContainer}>
        <div className={styles.loadingMessage}>Carregando...</div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className={styles.deleteContainer}>
        <div className={styles.deleteCard}>
          <div className={styles.errorAlert}>{error || "Serviço não encontrado"}</div>
          <Link href="/dashboard" className={styles.backButton}>
            Voltar ao Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.deleteContainer}>
      <div className={styles.deleteCard}>
        {/* Header */}
        <div className={styles.deleteHeader}>
          <div className={styles.warningIcon}>⚠️</div>
          <h1 className={styles.deleteTitle}>Eliminar Serviço</h1>
          <p className={styles.deleteSubtitle}>Esta ação é permanente e não pode ser desfeita</p>
        </div>

        {/* Service Info */}
        {error && <div className={styles.errorAlert}>{error}</div>}

        <div className={styles.serviceInfo}>
          <div className={styles.infoSection}>
            <h2 className={styles.infoTitle}>Você está prestes a eliminar:</h2>

            <div className={styles.serviceDetails}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Nome:</span>
                <span className={styles.detailValue}>{service.name}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Categoria:</span>
                <span className={styles.detailValue}>{service.category}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Duração:</span>
                <span className={styles.detailValue}>{service.duration}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Preço:</span>
                <span className={styles.detailValue}>€{service.price}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Status:</span>
                <span
                  className={`${styles.detailValue} ${service.available ? styles.statusAvailable : styles.statusUnavailable}`}
                >
                  {service.available ? "Ativo" : "Inativo"}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.infoSection}>
            <p className={styles.warningText}>
              Se eliminar este serviço, ele será removido permanentemente da sua conta. Todos os agendamentos associados
              a este serviço serão cancelados.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.deleteActions}>
          <button type="button" onClick={handleCancel} disabled={isDeleting} className={styles.cancelButton}>
            Manter Serviço
          </button>
          <button type="button" onClick={handleDelete} disabled={isDeleting} className={styles.confirmDeleteButton}>
            {isDeleting ? "Eliminando..." : "Eliminar Permanentemente"}
          </button>
        </div>
      </div>
    </div>
  )
}
