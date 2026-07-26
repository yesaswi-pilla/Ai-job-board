import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../services/api'

interface User {
  id: number
  name: string
  email: string
  role: string
}

interface AuthContextValue {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role: string) => Promise<void>
  refreshProfile: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setToken(storedToken)
      api.defaults.headers.common.Authorization = `Bearer ${storedToken}`
      refreshProfile().catch(() => {})
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password })
    const accessToken = response.data.access_token
    localStorage.setItem('token', accessToken)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`
    setUser(response.data.user)
    setToken(accessToken)
  }

  const register = async (name: string, email: string, password: string, role: string) => {
    const response = await api.post('/api/auth/register', { name, email, password, role })
    const accessToken = response.data.access_token
    localStorage.setItem('token', accessToken)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`
    setUser(response.data.user)
    setToken(accessToken)
  }

  const refreshProfile = async () => {
    try {
      const response = await api.get('/api/users/profile')
      localStorage.setItem('user', JSON.stringify(response.data.user))
      setUser(response.data.user)
    } catch {
      logout()
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete api.defaults.headers.common.Authorization
    setUser(null)
    setToken(null)
  }

  const value = useMemo(() => ({ user, token, login, register, refreshProfile, logout }), [user, token])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
