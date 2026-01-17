"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import styles from "@/styles/provider-services.module.css"
import { Plus, Edit2, Trash2, X, Menu } from "lucide-react"

interface Service {
  id: string
  name: string
  description: string
  category: string
  price: string
  duration: string
  providerId: string
  providerName: string
  providerLogo: string
  createdAt: string
}

export default function ProviderServices() {
  const router = useRouter()
  const [provider, setProvider] = useState<any>(null)
  const [services, setServices] = useState<Service[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    duration: "",
  })

  useEffect(() => {
    const providerAuth = localStorage.getItem("providerAuth")
    if (!providerAuth) {
      router.push("/provider/login")
      return
    }

    const providerData = JSON.parse(providerAuth)
    setProvider(providerData)

    // Load provider's services
    const allServices = JSON.parse(localStorage.getItem("services") || "[]")
    const providerServices = allServices.filter((s: any) => s.providerId === providerData.id)
    setServices(providerServices)
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.category || !formData.price || !formData.description) {
      alert("Por favor, preencha todos os campos obrigatórios")
      return
    }

    const allServices = JSON.parse(localStorage.getItem("services") || "[]")

    if (editingId) {
      const updated = allServices.map((s: any) =>
        s.id === editingId
          ? {
              ...s,
              ...formData,
            }
          : s,
      )
      localStorage.setItem("services", JSON.stringify(updated))
      setServices(updated.filter((s: any) => s.providerId === provider.id))
      setEditingId(null)
    } else {
      const newService: Service = {
        id: "SRV" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        ...formData,
        providerId: provider.id,
        providerName: provider.shopName,
        providerLogo: provider.shopName.charAt(0),
        createdAt: new Date().toISOString(),
      }
      allServices.push(newService)
      localStorage.setItem("services", JSON.stringify(allServices))
      setServices([...services, newService])
    }

    setFormData({
      name: "",
      description: "",
      category: "",
      price: "",
      duration: "",
    })
    setShowForm(false)
  }

  const handleEdit = (service: Service) => {
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      price: service.price,
      duration: service.duration,
    })
    setEditingId(service.id)
    setShowForm(true)
  }

  const handleDelete = (serviceId: string) => {
    if (confirm("Tem certeza que deseja eliminar este serviço?")) {
      const allServices = JSON.parse(localStorage.getItem("services") || "[]")
      const updated = allServices.filter((s: any) => s.id !== serviceId)
      localStorage.setItem("services", JSON.stringify(updated))
      setServices(services.filter((s) => s.id !== serviceId))
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      name: "",
      description: "",
      category: "",
      price: "",
      duration: "",
    })
  }

  if (!provider) {
    return null
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
          <a href="/provider/services" className={`${styles.navItem} ${styles.navItemActive}`}>
            Meus Serviços
          </a>
        </nav>
      </aside>

      <div className={styles.mainContent}>
        <button className={styles.toggleSidebarBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={styles.dashboard}>
          <div className={styles.headerSection}>
            <h1>Meus Serviços</h1>
            <p>Gerencie e adicione serviços oferecidos pela sua loja</p>
          </div>

          {showForm ? (
            <section className={styles.formSection}>
              <div className={styles.formHeader}>
                <h2>{editingId ? "Editar Serviço" : "Adicionar Novo Serviço"}</h2>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Nome do Serviço *</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ex: Reparação de iPhone"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="category">Categoria *</label>
                    <select id="category" name="category" value={formData.category} onChange={handleChange} required>
                      <option value="">Selecione uma categoria</option>
                      <option value="Smartphones">Smartphones</option>
                      <option value="Computadores">Computadores</option>
                      <option value="Tablets">Tablets</option>
                      <option value="Dados">Recuperação de Dados</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Periféricos">Periféricos</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="price">Preço *</label>
                    <input
                      id="price"
                      name="price"
                      type="text"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Ex: €45 - €120"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="duration">Duração Estimada</label>
                    <input
                      id="duration"
                      name="duration"
                      type="text"
                      value={formData.duration}
                      onChange={handleChange}
                      placeholder="Ex: 1-2 horas"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="description">Descrição do Serviço *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Descreva detalhadamente o serviço oferecido..."
                    rows={5}
                    required
                  />
                </div>

                <div className={styles.formActions}>
                  <button type="submit" className={styles.submitButton}>
                    {editingId ? "Atualizar Serviço" : "Adicionar Serviço"}
                  </button>
                  <button type="button" className={styles.cancelButton} onClick={handleCancel}>
                    Cancelar
                  </button>
                </div>
              </form>
            </section>
          ) : (
            <>
              <button className={styles.addButton} onClick={() => setShowForm(true)}>
                <Plus size={20} />
                Adicionar Serviço
              </button>

              <section className={styles.servicesSection}>
                {services.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>Você ainda não adicionou nenhum serviço</p>
                    <button className={styles.emptyStateButton} onClick={() => setShowForm(true)}>
                      Adicionar Primeiro Serviço
                    </button>
                  </div>
                ) : (
                  <div className={styles.servicesList}>
                    {services.map((service) => (
                      <div key={service.id} className={styles.serviceItem}>
                        <div className={styles.serviceHeader}>
                          <div>
                            <h3>{service.name}</h3>
                            <span className={styles.serviceId}>{service.id}</span>
                          </div>
                          <span className={styles.category}>{service.category}</span>
                        </div>

                        <p className={styles.serviceDescription}>{service.description}</p>

                        <div className={styles.serviceDetails}>
                          <div className={styles.detailItem}>
                            <span className={styles.label}>Preço:</span>
                            <span className={styles.value}>{service.price}</span>
                          </div>
                          {service.duration && (
                            <div className={styles.detailItem}>
                              <span className={styles.label}>Duração:</span>
                              <span className={styles.value}>{service.duration}</span>
                            </div>
                          )}
                        </div>

                        <div className={styles.serviceActions}>
                          <button className={styles.editButton} onClick={() => handleEdit(service)}>
                            <Edit2 size={18} />
                            Editar
                          </button>
                          <button className={styles.deleteButton} onClick={() => handleDelete(service.id)}>
                            <Trash2 size={18} />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
