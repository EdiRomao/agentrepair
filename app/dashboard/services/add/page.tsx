"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import styles from "@/styles/service-form.module.css"

interface Service {
  id: number
  name: string
  description: string
  duration: string
  price: string
  category: string
  available: boolean
}

export default function AddServicePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "30",
    price: "",
    category: "Outros",
    available: true,
  })

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/auth/login")
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const finalValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!formData.name || !formData.description || !formData.price || !formData.category) {
        setError("Por favor, preencha todos os campos obrigatórios")
        return
      }

      if (Number.parseFloat(formData.price) <= 0) {
        setError("O preço deve ser maior que zero")
        return
      }

      // Get existing services
      const savedServices = localStorage.getItem("services") || "[]"
      const services: Service[] = JSON.parse(savedServices)

      // Create new service
      const newService: Service = {
        id: Math.max(...services.map((s) => s.id), 0) + 1,
        name: formData.name,
        description: formData.description,
        duration: `${formData.duration} min`,
        price: formData.price,
        category: formData.category,
        available: formData.available,
      }

      // Add to list
      services.push(newService)
      localStorage.setItem("services", JSON.stringify(services))

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      setError("Erro ao adicionar serviço. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.formContainer}>
      {/* Header */}
      <div className={styles.formHeader}>
        <Link href="/dashboard" className={styles.backLink}>
          ← Voltar
        </Link>
        <h1 className={styles.formTitle}>Adicionar Novo Serviço</h1>
        <p className={styles.formSubtitle}>Preencha os detalhes do serviço que deseja oferecer</p>
      </div>

      {/* Form */}
      <div className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorAlert}>{error}</div>}

          {/* Form Section: Basic Info */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Informações Básicas</h2>

            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Nome do Serviço *
              </label>
              <input
                id="name"
                type="text"
                name="name"
                className={styles.input}
                placeholder="Ex: Corte de Cabelo"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>
                Descrição *
              </label>
              <textarea
                id="description"
                name="description"
                className={styles.textarea}
                placeholder="Descreva o serviço em detalhes"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="category" className={styles.label}>
                  Categoria *
                </label>
                <select
                  id="category"
                  name="category"
                  className={styles.select}
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option>Cabeleireiro</option>
                  <option>Wellness</option>
                  <option>Beleza</option>
                  <option>Saúde</option>
                  <option>Educação</option>
                  <option>Outros</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="duration" className={styles.label}>
                  Duração (minutos) *
                </label>
                <select
                  id="duration"
                  name="duration"
                  className={styles.select}
                  value={formData.duration}
                  onChange={handleChange}
                >
                  <option>15</option>
                  <option>30</option>
                  <option>45</option>
                  <option>60</option>
                  <option>90</option>
                  <option>120</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Section: Pricing & Status */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Preço e Disponibilidade</h2>

            <div className={styles.formGroup}>
              <label htmlFor="price" className={styles.label}>
                Preço (€) *
              </label>
              <div className={styles.priceInputWrapper}>
                <span className={styles.currencySymbol}>€</span>
                <input
                  id="price"
                  type="number"
                  name="price"
                  className={styles.priceInput}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="available" className={styles.checkboxLabel}>
                <input
                  id="available"
                  type="checkbox"
                  name="available"
                  className={styles.checkbox}
                  checked={formData.available}
                  onChange={handleChange}
                />
                <span>Este serviço está disponível para agendamento</span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className={styles.formActions}>
            <Link href="/dashboard" className={styles.cancelButton}>
              Cancelar
            </Link>
            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? "Adicionando..." : "Adicionar Serviço"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
