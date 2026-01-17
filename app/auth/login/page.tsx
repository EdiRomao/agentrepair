"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import styles from "@/styles/auth.module.css"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Simulate login - in production, call your API
      if (!email || !password) {
        setError("Por favor, preencha todos os campos")
        return
      }
      // Mock successful login
      localStorage.setItem("user", JSON.stringify({ email, role: "provider" }))
      window.location.href = "/dashboard"
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>Bem-vindo de volta</h1>
          <p className={styles.authSubtitle}>Entre na sua conta para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Senha
            </label>
            <input
              id="password"
              type="password"
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className={styles.divider}></div>

        <p className={styles.switchText}>
          Não tem conta?{" "}
          <Link href="/auth/signup" className={styles.link}>
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}
