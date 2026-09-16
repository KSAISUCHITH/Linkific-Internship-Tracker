import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('booknest_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const getApiErrorMessage = (error, fallback = 'Something went wrong.') => {
  if (error?.response) {
    const status = error.response.status
    const responseData = error.response?.data
    const detail = responseData?.detail
    const serverMessage = typeof responseData === 'string'
      ? responseData
      : typeof detail === 'string'
        ? detail
        : responseData?.message || responseData?.error

    if (status === 401) {
      return 'Invalid email or password.'
    }

    if (status === 403) {
      return 'You do not have permission to perform this action.'
    }

    if (status === 404) {
      return 'The requested resource was not found.'
    }

    if (status === 400) {
      return typeof serverMessage === 'string' && serverMessage.trim()
        ? serverMessage
        : 'Please check the submitted values and try again.'
    }

    if (status === 422) {
      const validationErrors = responseData?.errors

      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        const firstError = validationErrors[0]
        if (firstError?.message) {
          return firstError.message.replace(/^Value error, /i, '')
        }
      }

      if (Array.isArray(detail) && detail.length > 0) {
        return detail[0]?.msg || 'Please check the submitted fields.'
      }

      return typeof serverMessage === 'string' && serverMessage.trim()
        ? serverMessage
        : 'Please check the submitted fields and try again.'
    }

    if (status === 500) {
      return 'Server error. Please try again later.'
    }

    if (status === 503 || status === 502) {
      return 'Database connection failed. Please make sure PostgreSQL is running.'
    }

    if (typeof serverMessage === 'string' && serverMessage.trim()) {
      return serverMessage
    }
  }

  if (error?.code === 'ECONNABORTED') {
    return 'The request took too long. Please try again.'
  }

  if (error?.request) {
    return 'Unable to connect to the backend server. Please make sure the server is running.'
  }

  if (error?.message?.toLowerCase().includes('network')) {
    return 'Unable to connect to the backend server. Please check your connection.'
  }

  return fallback
}

export default api