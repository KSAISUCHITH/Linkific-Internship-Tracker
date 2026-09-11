import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const getApiErrorMessage = (error, fallback = 'Something went wrong.') => {
  if (error?.response) {
    const status = error.response.status
    const responseData = error.response?.data
    const serverMessage = typeof responseData === 'string'
      ? responseData
      : responseData?.detail || responseData?.message || responseData?.error

    if (status === 404) return 'Requested book was not found.'
    if (status === 400 || status === 422) {
      if (typeof serverMessage === 'string' && serverMessage.trim()) {
        return serverMessage
      }
      return 'Please check the form values and try again.'
    }
    if (status === 500) return 'Server error. Please try again later.'
    if (status === 503 || status === 502) {
      return 'Database connection failed. Please make sure PostgreSQL is running.'
    }
    if (typeof serverMessage === 'string' && serverMessage.trim()) {
      return serverMessage
    }
  }

  if (error?.request) {
    return 'Unable to connect to the backend server.'
  }

  if (error?.message) {
    if (error.message.toLowerCase().includes('network')) {
      return 'Unable to connect to the backend server.'
    }
    if (error.message.toLowerCase().includes('database')) {
      return 'Database connection failed. Please make sure PostgreSQL is running.'
    }
  }

  return fallback
}

export default api
