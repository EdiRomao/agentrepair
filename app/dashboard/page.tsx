"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import styles from "@/styles/dashboard.module.css"

interface Service {
  id: number
  name: string
  description: string
  duration: string
  price: string
  category: string
  available: boolean
}

export default function DashboardPage() {
  const [services, setServices] = useState<Service[]>([])
  const [user, setUser] = useState<{ email: string; role: string } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("todos")

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      window.location.href = "/auth/login"
      return
    }
    setUser(JSON.parse(userData))

    // Load services from localStorage
    const savedServices = localStorage.getItem("services")
    if (savedServices) {
      setServices(JSON.parse(savedServices))
    } else {
      // Default services
      const defaultServices: Service[] = [
        {
          id: 1,
          name: "Corte de Cabelo",
          description: "Corte profissional e estilizado",
          duration: "45 min",
          price: "35",
          category: "Cabeleireiro",
          available: true,
        },
        {
          id: 2,
          name: "Massagem Terapêutica",
          description: "Relaxamento e alívio de tensão",
          duration: "60 min",
          price: "50",
          category: "Wellness",
          available: true,
        },
      ]
      setServices(defaultServices)
      localStorage.setItem("services", JSON.stringify(defaultServices))
    }
  }, [])

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "todos" || service.category === filterCategory

    return matchesSearch && matchesCategory
  })

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/auth/login"
  }

  const categories = ["todos", ...new Set(services.map((s) => s.category))]

  return (
    <div className={styles.dashboardContainer}>
      {/* Header */}
      <header className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.dashboardTitle}>Painel de Controle</h1>
            <p className={styles.userInfo}>{user?.email}</p>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Sair
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Top Actions */}
        <div className={styles.topActions}>
          <Link href="/dashboard/services/add" className={styles.addServiceButton}>
            + Novo Serviço
          </Link>
        </div>

        {/* Filters */}
        <div className={styles.filtersSection}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Procurar serviços..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.categoryFilter}>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={styles.filterSelect}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "todos" ? "Todas as Categorias" : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Services List */}
        {filteredServices.length > 0 ? (
          <div className={styles.servicesTable}>
            <div className={styles.tableHeader}>
              <div className={styles.tableCell}>Nome</div>
              <div className={styles.tableCell}>Categoria</div>
              <div className={styles.tableCell}>Duração</div>
              <div className={styles.tableCell}>Preço</div>
              <div className={styles.tableCell}>Status</div>
              <div className={styles.tableCell}>Ações</div>
            </div>

            {filteredServices.map((service) => (
              <div key={service.id} className={styles.tableRow}>
                <div className={styles.tableCell}>
                  <div className={styles.serviceName}>{service.name}</div>
                  <p className={styles.serviceDescription}>{service.description}</p>
                </div>
                <div className={styles.tableCell}>{service.category}</div>
                <div className={styles.tableCell}>{service.duration}</div>
                <div className={styles.tableCell}>€{service.price}</div>
                <div className={styles.tableCell}>
                  <span
                    className={`${styles.status} ${service.available ? styles.statusActive : styles.statusInactive}`}
                  >
                    {service.available ? "Ativo" : "Inativo"}
                  </span>
                </div>
                <div className={styles.tableCell}>
                  <div className={styles.actions}>
                    <Link href={`/dashboard/services/edit/${service.id}`} className={styles.editButton}>
                      Editar
                    </Link>
                    <Link href={`/dashboard/services/delete/${service.id}`} className={styles.deleteButton}>
                      Eliminar
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📋</div>
            <h3 className={styles.emptyTitle}>Nenhum serviço encontrado</h3>
            <p className={styles.emptyDescription}>Comece adicionando seu primeiro serviço para gerenciar</p>
            <Link href="/dashboard/services/add" className={styles.emptyActionButton}>
              Adicionar Serviço
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
