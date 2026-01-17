"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import styles from "@/styles/dashboard.module.css"

export default function ClientDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const clientAuth = localStorage.getItem("clientAuth")
    if (!clientAuth) {
      router.push("/client/login")
      return
    }

    const userData = JSON.parse(clientAuth)
    setUser(userData)

    // Load user's bookings
    const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]")
    const userBookings = allBookings.filter((b: any) => b.clientEmail === userData.email)
    setBookings(userBookings)
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("clientAuth")
    router.push("/")
  }

  const handleCancelBooking = (bookingId: string) => {
    if (confirm("Tem certeza que deseja cancelar esta marcação?")) {
      const updatedBookings = bookings.map((b) => (b.id === bookingId ? { ...b, status: "Cancelada" } : b))
      setBookings(updatedBookings)
      const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]")
      const updated = allBookings.map((b: any) => (b.id === bookingId ? { ...b, status: "Cancelada" } : b))
      localStorage.setItem("bookings", JSON.stringify(updated))
    }
  }

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
          <h1>Painel do Cliente</h1>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Sair
          </button>
        </div>
      </header>

      <div className={styles.dashboard}>
        <section className={styles.welcomeSection}>
          <div className={styles.welcomeCard}>
            <h2>Bem-vindo, {user.name || user.email}!</h2>
            <p>Gerencie suas marcações de reparação</p>
            <Link href="/" className={styles.newBookingButton}>
              + Nova Marcação
            </Link>
          </div>
        </section>

        <section className={styles.bookingsSection}>
          <h2>Minhas Marcações</h2>

          {bookings.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Você ainda não tem marcações</p>
              <Link href="/" className={styles.linkButton}>
                Fazer uma marcação
              </Link>
            </div>
          ) : (
            <div className={styles.bookingsGrid}>
              {bookings.map((booking) => (
                <div key={booking.id} className={styles.bookingCard}>
                  <div className={styles.cardHeader}>
                    <h3>{booking.serviceName}</h3>
                    <span className={`${styles.status} ${styles[booking.status.toLowerCase()]}`}>{booking.status}</span>
                  </div>

                  <div className={styles.bookingInfo}>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Prestador:</span>
                      <span>{booking.provider}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Data:</span>
                      <span>{booking.preferredDate}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Tipo de Equipamento:</span>
                      <span>{booking.equipmentType}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Local:</span>
                      <span>{booking.serviceLocation === "loja" ? "Na Loja" : "Domicílio"}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>ID da Marcação:</span>
                      <span className={styles.bookingId}>{booking.id}</span>
                    </div>
                  </div>

                  <div className={styles.cardActions}>
                    {booking.status !== "Cancelada" && (
                      <button className={styles.cancelButton} onClick={() => handleCancelBooking(booking.id)}>
                        Cancelar (24h permitidas)
                      </button>
                    )}
                    <Link href="/client/track" className={styles.viewButton}>
                      Ver Detalhes
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
