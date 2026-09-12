import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('booknest_token')

    if (!token) {
      setLoading(false)
      return
    }

    api.get('/auth/me')
      .then((response) => {
        setUser(response.data)
      })
      .catch(() => {
        localStorage.removeItem('booknest_token')
        setUser(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const login = async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password
    })

    localStorage.setItem(
      'booknest_token',
      response.data.access_token
    )

    setUser(response.data.user)

    return response.data
  }

  const register = async (username, email, password) => {
    const response = await api.post('/auth/register', {
      username,
      email,
      password
    })

    return response.data
  }

  const logout = () => {
    localStorage.removeItem('booknest_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}