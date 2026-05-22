import { createContext, useContext, useState, useEffect } from 'react'
import { clearAdminAuth } from '../services/adminApi'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    function loadUser() {
      const token = localStorage.getItem('access_token')
      const userData = localStorage.getItem('user')
      if (token && userData) {
        setUser(JSON.parse(userData))
      } else {
        setUser(null)
      }
      setLoading(false)
    }

    loadUser()

    window.addEventListener('auth-logout', loadUser)
    return () => window.removeEventListener('auth-logout', loadUser)
  }, [])

  const login = (userData, accessToken) => {
    clearAdminAuth()
    setUser(userData)
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
