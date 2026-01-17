"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import styles from "@/styles/home.module.css"

interface Service {
  id: string
  name: string
  description: string
  category: string
  price: string
  providerName: string
  providerLogo: string
  duration?: string
  rating?: number
  reviews?: number
}

export default function Home() {
  const [services, setServices] = useState<Service[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredServices, setFilteredServices] = useState<Service[]>([])

  useEffect(() => {
    const storedServices = JSON.parse(localStorage.getItem("services") || "[]")

    // Mock services as fallback if no provider services exist
    const mockServices: Service[] = [
      {
        id: "1",
        name: "Reparação de iPhone",
        description: "Troca de ecrã, bateria e reparações gerais",
        category: "Smartphones",
        price: "kz5.450 - kz10.020",
        providerName: "TechFix Pro",
        providerLogo: "T",
        rating: 4.8,
        reviews: 245,
      },
      {
        id: "2",
        name: "Reparação de Laptop",
        description: "Reparação de ecrã, teclado, bateria e motherboard",
        category: "Computadores",
        price: "kz12.600 - kz18.000",
        providerName: "ComputerCare",
        providerLogo: "C",
        rating: 4.7,
        reviews: 189,
      },
      {
        id: "3",
        name: "Reparação de Tablet",
        description: "Ecrã rachado, bateria fraca e reparações",
        category: "Tablets",
        price: "kz12.050 - kz15.000",
        providerName: "DeviceRepair",
        providerLogo: "D",
        rating: 4.6,
        reviews: 156,
      },
      {
        id: "4",
        name: "Recuperação de Dados",
        description: "Recuperação de dados em HD, SSD e memory cards",
        category: "Dados",
        price: "kz10.080 - kz13.000",
        providerName: "DataSafe",
        providerLogo: "D",
        rating: 4.9,
        reviews: 312,
      },
      {
        id: "5",
        name: "Reparação de Gaming PC",
        description: "Reparação de componentes e upgrade de hardware",
        category: "Gaming",
        price: "kz20.000 - kz25.000",
        providerName: "GamerTech",
        providerLogo: "G",
        rating: 4.8,
        reviews: 203,
      },
      {
        id: "6",
        name: "Reparação de Impressora",
        description: "Reparação, manutenção e refill de tinta",
        category: "Periféricos",
        price: "kz30.999 - kz200.000",
        providerName: "PrintPro",
        providerLogo: "P",
        rating: 4.5,
        reviews: 98,
      },
    ]

    // Combine stored services with mock services
    const allServices = [...storedServices, ...mockServices]
    setServices(allServices)
    setFilteredServices(allServices)
  }, [])

  useEffect(() => {
    const filtered = services.filter(
      (service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.providerName.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredServices(filtered)
  }, [searchTerm, services])

  const categories = Array.from(new Set(services.map((s) => s.category)))

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>⚙️</span>
            <h1>RepairHub</h1>
          </div>
          <nav className={styles.headerNav}>
            <Link href="/client/login" className={styles.navLink}>
              Cliente
            </Link>
            <Link href="/provider/login" className={styles.navLink}>
              Prestador
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h2>Reparação de Equipamentos Eletrónicos</h2>
          <p>Encontre prestadores qualificados para reparar seus dispositivos</p>

          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Procure por serviço, categoria ou prestador..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className={styles.searchButton}>Pesquisar</button>
          </div>

          {/* Categories */}
          <div className={styles.categoriesFilter}>
            <button
              className={`${styles.categoryTag} ${!searchTerm ? styles.active : ""}`}
              onClick={() => setSearchTerm("")}
            >
              Todos
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={`${styles.categoryTag} ${searchTerm === category ? styles.active : ""}`}
                onClick={() => setSearchTerm(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className={styles.servicesSection}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>Serviços Disponíveis</h2>
          <p className={styles.sectionSubtitle}>{filteredServices.length} serviços encontrados</p>

          <div className={styles.servicesGrid}>
            {filteredServices.map((service) => (
              <div key={service.id} className={styles.serviceCard}>
                {/* Provider Logo */}
                <div className={styles.providerHeader}>
                  <div className={styles.providerLogo}>{service.providerLogo}</div>
                  <div className={styles.providerInfo}>
                    <p className={styles.providerName}>{service.providerName}</p>
                    {service.rating && (
                      <div className={styles.rating}>
                        <span className={styles.stars}>★</span>
                        <span>{service.rating}</span>
                        <span className={styles.reviews}>({service.reviews})</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Service Details */}
                <h3 className={styles.serviceName}>{service.name}</h3>
                <p className={styles.serviceDescription}>{service.description}</p>

                <div className={styles.serviceFooter}>
                  <div className={styles.priceCategory}>
                    <span className={styles.category}>{service.category}</span>
                    <span className={styles.price}>{service.price}</span>
                  </div>
                  <Link href={`/booking/${service.id}`} className={styles.bookButton}>
                    Agendar
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className={styles.noResults}>
              <p>Nenhum serviço encontrado. Tente outra pesquisa.</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>Por que escolher o RepairHub?</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔒</div>
              <h3>Seguro e Confiável</h3>
              <p>Prestadores verificados e avaliados pela comunidade</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⚡</div>
              <h3>Agendamento Rápido</h3>
              <p>Reserve em minutos e receba confirmação por email</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💬</div>
              <h3>Suporte 24/7</h3>
              <p>Notificações por email em tempo real</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎯</div>
              <h3>Sem Compromisso</h3>
              <p>Cancele dentro de 24 horas sem custos adicionais</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>&copy; 2025 RepairHub. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
