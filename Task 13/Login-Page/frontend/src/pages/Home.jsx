import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()
  const username = localStorage.getItem('username') || 'User'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    navigate('/login')
  }

  return (
    <div className="page-shell home-shell">
      <div className="home-card">
        <p className="eyebrow">Authentication status</p>
        <h1>Welcome, {username}!</h1>
        <p className="home-message">You are successfully authenticated.</p>

        <button type="button" className="primary-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default Home
