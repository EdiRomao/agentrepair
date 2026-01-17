"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import styles from "@/styles/auth.module.css"

export default function ClientTrack() {
  const [bookingId, setBookingId] = useState("")
  const [password, setPassword] = useState("")
  const [booking, setBooking] = useState<any>(null)
  const [error, setError] = useState("")

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!bookingId || !password) {
      setError("ID da marcação e senha são obrigatórios")
      return
    }

    // Simulate booking lookup
    if (bookingId === "REPAIR001" && password === "pass123") {
      setBooking({
        id: "REPAIR001",
        service: "Reparação de iPhone",
        provider: "TechFix Pro",
        status: "Confirmada",
        date: "2025-01-25",
        time: "14:30",
        price: "€85",
        canCancel: true,
      })
    } else {
      setError("ID da marcação ou senha incorretos")
    }
  }

  const handleCancel = () => {
    setError("")
    if (booking) {
      setBooking(null)
      setBookingId("")
      setPassword("")
      alert("Marcação cancelada com sucesso!")
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper} style={{ maxWidth: "500px" }}>
        <div className={styles.formHeader}>
          <h1>Consultar Marcação</h1>
          <p>Use o ID e senha gerados ao fazer a marcação</p>
        </div>

        {!booking ? (
          <form onSubmit={handleTrack} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="bookingId">ID da Marcação</label>
              <input
                id="bookingId"
                type="text"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value.toUpperCase())}
                placeholder="Ex: REPAIR001"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Senha de Acesso</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                required
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button type="submit" className={styles.submitButton}>
              Consultar
            </button>
          </form>
        ) : (
          <div className={styles.bookingDetails}>
            <div className={styles.statusBadge}>{booking.status}</div>
            <h2>{booking.service}</h2>
            <p className={styles.provider}>{booking.provider}</p>

            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.label}>Data</span>
                <span className={styles.value}>{booking.date}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Hora</span>
                <span className={styles.value}>{booking.time}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Preço</span>
                <span className={styles.value}>{booking.price}</span>
              </div>
            </div>

            {booking.canCancel && (
              <button className={styles.cancelButton} onClick={handleCancel}>
                Cancelar Marcação (24h permitidas)
              </button>
            )}

            <button
              type="button"
              className={styles.submitButton}
              onClick={() => {
                setBooking(null)
                setBookingId("")
                setPassword("")
              }}
            >
              Nova Consulta
            </button>
          </div>
        )}

        <div className={styles.footer}>
          <Link href="/" className={styles.link}>
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  )
}
