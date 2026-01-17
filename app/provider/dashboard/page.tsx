"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import styles from "@/styles/provider-dashboard.module.css"
import { LogOut, Menu, X, CheckCircle, Clock } from "lucide-react"

interface BookingRequest {
  id: string
  serviceName: string
  clientName: string
  clientEmail: string
  clientPhone: string
  equipmentType: string
  equipmentModel: string
  issueDescription: string
  serviceLocation: string
  preferredDate: string
  preferredTime: string
  status: "Pendente de Confirmação" | "Confirmada" | "Cancelada" | "Concluída"
  createdAt: string
}

export default function ProviderDashboard() {
  const router = useRouter()
  const [provider, setProvider] = useState<any>(null)
  const [bookings, setBookings] = useState<BookingRequest[]>([])
  const [filteredBookings, setFilteredBookings] = useState<BookingRequest[]>([])
  const [statusFilter, setStatusFilter] = useState("Pendente de Confirmação")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const providerAuth = localStorage.getItem("providerAuth")
    if (!providerAuth) {
      router.push("/provider/login")
      return
    }

    const providerData = JSON.parse(providerAuth)
    setProvider(providerData)

    const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]")
    setBookings(allBookings)
    setFilteredBookings(allBookings.filter((b: any) => b.status === "Pendente de Confirmação"))
    setLoading(false)
  }, [router])

  useEffect(() => {
    let filtered = bookings.filter((booking) => booking.status === statusFilter)

    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.equipmentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredBookings(filtered)
  }, [statusFilter, searchTerm, bookings])

  const handleLogout = () => {
    localStorage.removeItem("providerAuth")
    router.push("/")
  }

  const handleConfirmBooking = async (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId)
    if (booking) {
      console.log("[v0] Sending confirmation email to:", booking.clientEmail)

      try {
        const response = await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: booking.clientEmail,
            bookingId: booking.id,
            clientName: booking.clientName,
            status: "confirmada",
            serviceDetails: {
              serviceName: booking.serviceName,
              equipmentType: booking.equipmentType,
              preferredDate: booking.preferredDate,
            },
          }),
        })

        if (response.ok) {
          alert(`Marcação confirmada! Email enviado para ${booking.clientEmail}`)
        } else {
          alert("Marcação confirmada, mas houve erro ao enviar email")
        }
      } catch (error) {
        console.error("[v0] Email sending error:", error)
        alert("Marcação confirmada, mas houve erro ao enviar email")
      }
    }

    const updatedBookings = bookings.map((b) => (b.id === bookingId ? { ...b, status: "Confirmada" } : b))
    setBookings(updatedBookings)
    localStorage.setItem("bookings", JSON.stringify(updatedBookings))
  }

  const handleRejectBooking = async (bookingId: string) => {
    if (confirm("Rejeitar esta marcação?")) {
      const booking = bookings.find((b) => b.id === bookingId)

      if (booking) {
        try {
          await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: booking.clientEmail,
              bookingId: booking.id,
              clientName: booking.clientName,
              status: "rejeitada",
            }),
          })
        } catch (error) {
          console.error("[v0] Email sending error:", error)
        }
      }

      const updatedBookings = bookings.map((b) => (b.id === bookingId ? { ...b, status: "Cancelada" } : b))
      setBookings(updatedBookings)
      localStorage.setItem("bookings", JSON.stringify(updatedBookings))
    }
  }

  const handleCompleteBooking = async (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId)

    if (booking) {
      try {
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: booking.clientEmail,
            bookingId: booking.id,
            clientName: booking.clientName,
            status: "concluida",
          }),
        })
      } catch (error) {
        console.error("[v0] Email sending error:", error)
      }
    }

    const updatedBookings = bookings.map((b) => (b.id === bookingId ? { ...b, status: "Concluída" } : b))
    setBookings(updatedBookings)
    localStorage.setItem("bookings", JSON.stringify(updatedBookings))
    alert("Marcação marcada como concluída!")
  }

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>
  }

  if (!provider) {
    return null
  }

  const stats = {
    pending: bookings.filter((b) => b.status === "Pendente de Confirmação").length,
    confirmed: bookings.filter((b) => b.status === "Confirmada").length,
    completed: bookings.filter((b) => b.status === "Concluída").length,
  }

  return (
    <div className={styles.container}>
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>{provider.shopName}</h2>
          <button className={styles.closeSidebarBtn} onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          <a href="/provider/dashboard" className={styles.navItem}>
            Dashboard
          </a>
          <a href="/provider/services" className={styles.navItem}>
            Meus Serviços
          </a>
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <div className={styles.mainContent}>
        <button className={styles.toggleSidebarBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={styles.dashboard}>
          <div className={styles.headerSection}>
            <h1>Painel de Gerenciamento</h1>
            <p>Gerencie suas marcações e respostas dos clientes</p>
          </div>

          <section className={styles.statsSection}>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: "#fef3c7" }}>
                <Clock size={24} color="#92400e" />
              </div>
              <div className={styles.statInfo}>
                <div className={styles.statNumber}>{stats.pending}</div>
                <div className={styles.statLabel}>Pendentes</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: "#dbeafe" }}>
                <CheckCircle size={24} color="#0c4a6e" />
              </div>
              <div className={styles.statInfo}>
                <div className={styles.statNumber}>{stats.confirmed}</div>
                <div className={styles.statLabel}>Confirmadas</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: "#dcfce7" }}>
                <CheckCircle size={24} color="#166534" />
              </div>
              <div className={styles.statInfo}>
                <div className={styles.statNumber}>{stats.completed}</div>
                <div className={styles.statLabel}>Concluídas</div>
              </div>
            </div>
          </section>

          <section className={styles.filtersSection}>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Pesquisar por cliente, equipamento ou ID..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className={styles.filterButtons}>
              {["Pendente de Confirmação", "Confirmada", "Concluída", "Cancelada"].map((status) => (
                <button
                  key={status}
                  className={`${styles.filterButton} ${statusFilter === status ? styles.active : ""}`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.bookingsSection}>
            {filteredBookings.length === 0 ? (
              <div className={styles.emptyState}>
                <p>Nenhuma marcação encontrada</p>
              </div>
            ) : (
              <div className={styles.bookingsList}>
                {filteredBookings.map((booking) => (
                  <div key={booking.id} className={styles.bookingItem}>
                    <div className={styles.bookingHeader}>
                      <div className={styles.bookingTitle}>
                        <h3>{booking.serviceName}</h3>
                        <span className={styles.bookingId}>{booking.id}</span>
                      </div>
                      <span className={styles.statusBadge}>{booking.status}</span>
                    </div>

                    <div className={styles.bookingDetails}>
                      <div className={styles.detailsColumn}>
                        <h4>Cliente</h4>
                        <p>{booking.clientName}</p>
                        <p className={styles.contact}>{booking.clientEmail}</p>
                        <p className={styles.contact}>{booking.clientPhone}</p>
                      </div>

                      <div className={styles.detailsColumn}>
                        <h4>Equipamento</h4>
                        <p>
                          <strong>Tipo:</strong> {booking.equipmentType}
                        </p>
                        <p>
                          <strong>Modelo:</strong> {booking.equipmentModel || "Não especificado"}
                        </p>
                        <p>
                          <strong>Avaria:</strong> {booking.issueDescription}
                        </p>
                      </div>

                      <div className={styles.detailsColumn}>
                        <h4>Agendamento</h4>
                        <p>
                          <strong>Data:</strong> {booking.preferredDate}
                        </p>
                        <p>
                          <strong>Hora:</strong> {booking.preferredTime || "A definir"}
                        </p>
                        <p>
                          <strong>Local:</strong> {booking.serviceLocation === "loja" ? "Na Loja" : "Domicílio"}
                        </p>
                      </div>
                    </div>

                    <div className={styles.bookingActions}>
                      {booking.status === "Pendente de Confirmação" && (
                        <>
                          <button className={styles.confirmButton} onClick={() => handleConfirmBooking(booking.id)}>
                            Confirmar
                          </button>
                          <button className={styles.rejectButton} onClick={() => handleRejectBooking(booking.id)}>
                            Rejeitar
                          </button>
                        </>
                      )}
                      {booking.status === "Confirmada" && (
                        <button className={styles.completeButton} onClick={() => handleCompleteBooking(booking.id)}>
                          Marcar como Concluída
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
