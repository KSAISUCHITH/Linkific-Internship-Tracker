import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await api.post('/login', form)
      localStorage.setItem('token', response.data.access_token)
      localStorage.setItem('username', response.data.username)
      navigate('/home')
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        setError('Unable to connect to the backend server. Please make sure FastAPI is running.')
        return
      }

      const detail = err.response?.data?.detail

      if (detail === 'Invalid username or password') {
        setError('Invalid username or password.')
        return
      }

      if (detail === 'Database connection failed. Please make sure PostgreSQL is running.') {
        setError('Database connection failed. Please make sure PostgreSQL is running.')
        return
      }

      setError(detail || 'Unable to connect to the backend server. Please make sure FastAPI is running.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page-shell">
      <div className="auth-card">
        <div className="brand-block">
          <span className="eyebrow">Secure access</span>
          <h1>Welcome back</h1>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            <span>Username</span>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </label>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="primary-button" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="form-link">
          Don&apos;t have an account?{' '}
          <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
