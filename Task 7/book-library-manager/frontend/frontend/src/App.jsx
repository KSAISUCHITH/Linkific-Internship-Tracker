import { useState } from 'react'
import LandingPage from './components/LandingPage.jsx'
import LibraryPage from './components/LibraryPage.jsx'
import './App.css'

function App() {
  const [page, setPage] = useState('landing')

  return (
    <>
      {page === 'landing' ? (
        <LandingPage onEnter={() => setPage('library')} />
      ) : (
        <LibraryPage onBack={() => setPage('landing')} />
      )}
    </>
  )
}

export default App