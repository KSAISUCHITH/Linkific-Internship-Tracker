import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getApiErrorMessage } from '../api'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(form.email, form.password)
      navigate('/library')
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          'Unable to login. Please check your credentials.'
        )
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-[#ded8cc] bg-[#ebe6dc] p-8 shadow-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#222] text-white">
              <BookOpen size={24} />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#222]">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-[#666]">
              Sign in to continue to your BookNest library.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#333]">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-[#cfc8bb] bg-[#f5f1e8] px-4 py-3 text-sm text-[#222] outline-none transition focus:border-[#222]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#333]">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full rounded-lg border border-[#cfc8bb] bg-[#f5f1e8] px-4 py-3 text-sm text-[#222] outline-none transition focus:border-[#222]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#222] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogIn size={17} />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#666]">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-[#222] underline underline-offset-4"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}