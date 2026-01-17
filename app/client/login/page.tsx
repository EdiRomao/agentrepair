"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import styles from "@/styles/auth.module.css"

export default function ClientLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (email && password) {
        // Store client session
        localStorage.setItem(
          "clientAuth",
          JSON.stringify({
            email,
            id: Math.random().toString(36).substr(2, 9),
            type: "client",
          }),
        )
        router.push("/client/dashboard")
      } else {
        setError("Email e password obrigatórios")
      }
      setLoading(false)
    }, 500)
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.formHeader}>
          <h1>Cliente - Login</h1>
          <p>Aceda à sua conta para gerir marcações</p>
        </div>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha segura"
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className={styles.divider}>ou</div>

        <div className={styles.footer}>
          <p>
            Não tem conta?{" "}
            <Link href="/client/signup" className={styles.link}>
              Cadastre-se
            </Link>
          </p>
          <p>
            <Link href="/client/track" className={styles.link}>
              Consultar marcação
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
