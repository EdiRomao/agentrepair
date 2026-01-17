"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import styles from "@/styles/booking.module.css"

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const serviceId = params.serviceId as string

  const [service, setService] = useState<any>(null)
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    equipmentType: "",
    equipmentModel: "",
    issueDescription: "",
    serviceLocation: "loja",
    preferredDate: "",
    preferredTime: "",
  })
  const [loading, setLoading] = useState(false)
  const [bookingConfirmation, setBookingConfirmation] = useState<any>(null)

  useEffect(() => {
    // Mock service data
    const services: Record<string, any> = {
      "1": {
        name: "Reparação de iPhone",
        provider: "TechFix Pro",
        price: "€45 - €120",
      },
      "2": {
        name: "Reparação de Laptop",
        provider: "ComputerCare",
        price: "€60 - €180",
      },
      "3": {
        name: "Reparação de Tablet",
        provider: "DeviceRepair",
        price: "€50 - €150",
      },
    }
    setService(services[serviceId] || services["1"])
  }, [serviceId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const generateBookingId = () => {
    return "REPAIR" + Math.random().toString(36).substr(2, 9).toUpperCase()
  }

  const generatePassword = () => {
    return Math.random().toString(36).substr(2, 8)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.clientName ||
      !formData.clientEmail ||
      !formData.clientPhone ||
      !formData.equipmentType ||
      !formData.issueDescription ||
      !formData.preferredDate
    ) {
      alert("Por favor, preencha todos os campos obrigatórios")
      return
    }

    setLoading(true)

    setTimeout(() => {
      const bookingId = generateBookingId()
      const accessPassword = generatePassword()

      const booking = {
        id: bookingId,
        password: accessPassword,
        serviceId,
        serviceName: service.name,
        provider: service.provider,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        equipmentType: formData.equipmentType,
        equipmentModel: formData.equipmentModel,
        issueDescription: formData.issueDescription,
        serviceLocation: formData.serviceLocation,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        status: "Pendente de Confirmação",
        createdAt: new Date().toISOString(),
      }

      // Store booking in localStorage
      const bookings = JSON.parse(localStorage.getItem("bookings") || "[]")
      bookings.push(booking)
      localStorage.setItem("bookings", JSON.stringify(bookings))

      // Simulate sending email
      console.log("[v0] Sending booking confirmation email to:", formData.clientEmail)

      setBookingConfirmation(booking)
      setLoading(false)
    }, 1000)
  }

  if (!service) {
    return <div>Carregando...</div>
  }

  if (bookingConfirmation) {
    return (
      <div className={styles.container}>
        <div className={styles.successWrapper}>
          <div className={styles.successIcon}>✓</div>
          <h1>Marcação Confirmada!</h1>
          <p>Sua marcação foi registada com sucesso</p>

          <div className={styles.confirmationBox}>
            <div className={styles.confirmItem}>
              <span className={styles.label}>ID da Marcação</span>
              <span className={styles.value}>{bookingConfirmation.id}</span>
              <p className={styles.small}>Guarde este ID para consultar sua marcação</p>
            </div>

            <div className={styles.confirmItem}>
              <span className={styles.label}>Senha de Acesso</span>
              <span className={styles.value}>{bookingConfirmation.password}</span>
              <p className={styles.small}>Use esta senha junto com o ID para rastrear</p>
            </div>

            <div className={styles.confirmItem}>
              <span className={styles.label}>Serviço</span>
              <span className={styles.value}>{bookingConfirmation.serviceName}</span>
            </div>

            <div className={styles.confirmItem}>
              <span className={styles.label}>Prestador</span>
              <span className={styles.value}>{bookingConfirmation.provider}</span>
            </div>

            <div className={styles.confirmItem}>
              <span className={styles.label}>Data Preferida</span>
              <span className={styles.value}>{bookingConfirmation.preferredDate}</span>
            </div>

            <div className={styles.confirmItem}>
              <span className={styles.label}>Local</span>
              <span className={styles.value}>
                {bookingConfirmation.serviceLocation === "loja" ? "Na Loja" : "Domicílio"}
              </span>
            </div>
          </div>

          <div className={styles.notification}>
            <p>
              📧 Um email de confirmação foi enviado para <strong>{bookingConfirmation.clientEmail}</strong>
            </p>
          </div>

          <div className={styles.actions}>
            <Link href="/" className={styles.primaryButton}>
              Voltar ao Início
            </Link>
            <Link href="/client/track" className={styles.secondaryButton}>
              Consultar Marcação
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.bookingWrapper}>
        <div className={styles.header}>
          <Link href="/" className={styles.backButton}>
            ← Voltar
          </Link>
          <h1>Agendar Serviço</h1>
        </div>

        <div className={styles.serviceInfo}>
          <div className={styles.serviceBadge}>
            <span className={styles.serviceName}>{service.name}</span>
            <span className={styles.servicePrice}>{service.price}</span>
          </div>
          <p className={styles.providerName}>Prestador: {service.provider}</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <fieldset className={styles.fieldset}>
            <legend>Dados Pessoais</legend>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="clientName">Nome Completo *</label>
                <input
                  id="clientName"
                  name="clientName"
                  type="text"
                  value={formData.clientName}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="clientEmail">Email *</label>
                <input
                  id="clientEmail"
                  name="clientEmail"
                  type="email"
                  value={formData.clientEmail}
                  onChange={handleChange}
                  placeholder="seu.email@exemplo.com"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="clientPhone">Telefone *</label>
                <input
                  id="clientPhone"
                  name="clientPhone"
                  type="tel"
                  value={formData.clientPhone}
                  onChange={handleChange}
                  placeholder="+351 XXX XXX XXX"
                  required
                />
              </div>
            </div>
          </fieldset>

          <fieldset className={styles.fieldset}>
            <legend>Detalhes do Equipamento</legend>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="equipmentType">Tipo de Equipamento *</label>
                <select
                  id="equipmentType"
                  name="equipmentType"
                  value={formData.equipmentType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="iphone">iPhone</option>
                  <option value="samsung">Samsung</option>
                  <option value="laptop">Laptop</option>
                  <option value="desktop">Desktop</option>
                  <option value="tablet">Tablet</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="equipmentModel">Modelo/Série do Equipamento</label>
                <input
                  id="equipmentModel"
                  name="equipmentModel"
                  type="text"
                  value={formData.equipmentModel}
                  onChange={handleChange}
                  placeholder="Ex: iPhone 13 Pro"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="issueDescription">Descrição da Avaria *</label>
              <textarea
                id="issueDescription"
                name="issueDescription"
                value={formData.issueDescription}
                onChange={handleChange}
                placeholder="Descreva o problema detalhadamente..."
                rows={4}
                required
              />
            </div>
          </fieldset>

          <fieldset className={styles.fieldset}>
            <legend>Detalhes do Agendamento</legend>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="serviceLocation">Local do Serviço *</label>
                <select
                  id="serviceLocation"
                  name="serviceLocation"
                  value={formData.serviceLocation}
                  onChange={handleChange}
                  required
                >
                  <option value="loja">Na Loja</option>
                  <option value="domicilio">Ao Domicílio</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="preferredDate">Data Preferida *</label>
                <input
                  id="preferredDate"
                  name="preferredDate"
                  type="date"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="preferredTime">Hora Preferida</label>
                <input
                  id="preferredTime"
                  name="preferredTime"
                  type="time"
                  value={formData.preferredTime}
                  onChange={handleChange}
                />
              </div>
            </div>
          </fieldset>

          <div className={styles.notice}>
            <p>
              <strong>Atenção:</strong> Você poderá cancelar esta marcação dentro de 24 horas sem custos adicionais.
              Após este período, será cobrado o valor total do serviço.
            </p>
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? "Processando..." : "Confirmar Marcação"}
          </button>
        </form>
      </div>
    </div>
  )
}
