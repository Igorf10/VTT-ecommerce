import { createContext, useContext, useEffect, useState } from 'react'
import { loginUser, registerUser } from '../api/api.js'

const AuthContext = createContext(null)
const STORAGE_KEY = 'vtt_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  async function register({ name, email, password }) {
    const newUser = await registerUser({ name, email, password })
    setUser(newUser)
    return newUser
  }

  async function login({ email, password }) {
    const loggedUser = await loginUser({ email, password })
    setUser(loggedUser)
    return loggedUser
  }

  function logout() {
    setUser(null)
  }

  const value = {
    user,
    isAuthenticated: Boolean(user),
    register,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>')
  return ctx
}
