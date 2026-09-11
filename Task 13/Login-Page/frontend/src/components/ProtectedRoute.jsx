import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import api from '../api/axios'

function ProtectedRoute({ children }) {
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      setIsChecking(false)
      setIsAuthenticated(false)
      return
    }

    let isMounted = true

    api
      .get('/me')
      .then(() => {
        if (isMounted) {
          setIsAuthenticated(true)
        }
      })
      .catch(() => {
        if (isMounted) {
          localStorage.removeItem('token')
          localStorage.removeItem('username')
          setIsAuthenticated(false)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsChecking(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  if (isChecking) {
    return (
      <div className="auth-state">
        <p>Checking authentication...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
