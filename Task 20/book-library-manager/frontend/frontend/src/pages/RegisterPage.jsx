import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getApiErrorMessage } from '../api'
import { validateRegisterForm, validatePassword } from '../validation'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  })

  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const passwordChecks = validatePassword(form.password)

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm({
      ...form,
      [name]: value
    })

    if (fieldErrors[name]) {
      setFieldErrors((current) => ({
        ...current,
        [name]: ''
      }))
    }

    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const validationErrors = validateRegisterForm(form)
    setFieldErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setLoading(true)

    try {
      await register(
        form.username,
        form.email,
        form.password
      )

      navigate('/login')
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          'Unable to create your account.'
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
              Join BookNest
            </h1>

            <p className="mt-2 text-sm text-[#666]">
              Create an account and start building your personal library.
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
                Username
              </label>

              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Choose a username"
                minLength={3}
                maxLength={50}
                required
                aria-invalid={Boolean(fieldErrors.username)}
                aria-describedby={
                  fieldErrors.username
                    ? 'register-username-error'
                    : undefined
                }
                className="w-full rounded-lg border border-[#cfc8bb] bg-[#f5f1e8] px-4 py-3 text-sm text-[#222] outline-none transition focus:border-[#222]"
              />

              {fieldErrors.username && (
                <p
                  id="register-username-error"
                  className="mt-1.5 text-xs text-red-600"
                >
                  {fieldErrors.username}
                </p>
              )}
            </div>

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
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={
                  fieldErrors.email
                    ? 'register-email-error'
                    : undefined
                }
                className="w-full rounded-lg border border-[#cfc8bb] bg-[#f5f1e8] px-4 py-3 text-sm text-[#222] outline-none transition focus:border-[#222]"
              />

              {fieldErrors.email && (
                <p
                  id="register-email-error"
                  className="mt-1.5 text-xs text-red-600"
                >
                  {fieldErrors.email}
                </p>
              )}
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
                placeholder="Minimum 8 characters"
                minLength={8}
                maxLength={128}
                required
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={
                  fieldErrors.password
                    ? 'register-password-error'
                    : undefined
                }
                className="w-full rounded-lg border border-[#cfc8bb] bg-[#f5f1e8] px-4 py-3 text-sm text-[#222] outline-none transition focus:border-[#222]"
              />

              {form.password.length > 0 && (
                <div className="mt-3 rounded-lg border border-[#d8d1c5] bg-[#f5f1e8] p-3">
                  <p className="mb-2 text-xs font-semibold text-[#333]">
                    Password requirements
                  </p>

                  <div className="space-y-1">
                    <p
                      className={`text-xs ${
                        passwordChecks.minLength
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {passwordChecks.minLength ? '✓' : '✗'} At least 8 characters
                    </p>

                    <p
                      className={`text-xs ${
                        passwordChecks.uppercase
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {passwordChecks.uppercase ? '✓' : '✗'} At least one uppercase letter
                    </p>

                    <p
                      className={`text-xs ${
                        passwordChecks.lowercase
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {passwordChecks.lowercase ? '✓' : '✗'} At least one lowercase letter
                    </p>

                    <p
                      className={`text-xs ${
                        passwordChecks.number
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {passwordChecks.number ? '✓' : '✗'} At least one number
                    </p>

                    <p
                      className={`text-xs ${
                        passwordChecks.special
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {passwordChecks.special ? '✓' : '✗'} At least one special character
                    </p>
                  </div>
                </div>
              )}

              {fieldErrors.password && (
                <p
                  id="register-password-error"
                  className="mt-1.5 text-xs text-red-600"
                >
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#222] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <UserPlus size={17} />
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#666]">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-[#222] underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}