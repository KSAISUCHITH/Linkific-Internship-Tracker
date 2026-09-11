import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import LibraryPage from './pages/LibraryPage'
import './App.css'

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing')

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f1e8] text-[#222]">
      <Header
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
      />

      <main className="flex-1">
        {currentPage === 'landing' ? (
          <LandingPage onEnter={() => setCurrentPage('library')} />
        ) : (
          <LibraryPage onBack={() => setCurrentPage('landing')} />
        )}
      </main>

      <Footer />
    </div>
  )
}