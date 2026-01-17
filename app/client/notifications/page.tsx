"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import styles from "@/styles/notifications.module.css"

interface Notification {
  id: number
  title: string
  message: string
  type: "success" | "info" | "warning" | "error"
  read: boolean
  timestamp: string
}

export default function NotificationsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const clientAuth = localStorage.getItem("clientAuth")
    if (!clientAuth) {
      router.push("/client/login")
      return
    }

    setUser(JSON.parse(clientAuth))

    // Load mock notifications
    const mockNotifications: Notification[] = [
      {
        id: 1,
        title: "Marcação Confirmada",
        message: "Sua marcação para reparação de iPhone foi confirmada pela TechFix Pro",
        type: "success",
        read: false,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 2,
        title: "Prestador Respondeu",
        message: "Você recebeu uma resposta do prestador sobre sua marcação",
        type: "info",
        read: false,
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: 3,
        title: "Lembrete de Agendamento",
        message: "Sua reparação está marcada para amanhã às 14:30",
        type: "warning",
        read: true,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
    ]

    setNotifications(mockNotifications)
    setLoading(false)
  }, [router])

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleDeleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1>Notificações</h1>
            <p>{unreadCount} não lidas</p>
          </div>
          <Link href="/client/dashboard" className={styles.backLink}>
            Voltar ao Dashboard
          </Link>
        </div>
      </header>

      <div className={styles.content}>
        {notifications.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Você não tem notificações</p>
          </div>
        ) : (
          <div className={styles.notificationsList}>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`${styles.notificationItem} ${!notification.read ? styles.unread : ""}`}
              >
                <div className={styles.notificationContent}>
                  <div className={`${styles.notificationIcon} ${styles[notification.type]}`}>●</div>
                  <div className={styles.notificationBody}>
                    <h3>{notification.title}</h3>
                    <p>{notification.message}</p>
                    <span className={styles.timestamp}>
                      {new Date(notification.timestamp).toLocaleDateString("pt-PT", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
                <div className={styles.actions}>
                  {!notification.read && (
                    <button
                      className={styles.markReadButton}
                      onClick={() => handleMarkAsRead(notification.id)}
                      title="Marcar como lido"
                    >
                      ✓
                    </button>
                  )}
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteNotification(notification.id)}
                    title="Deletar notificação"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
