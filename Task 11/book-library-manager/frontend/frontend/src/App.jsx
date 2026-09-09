import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import LibraryPage from './pages/LibraryPage'
import BookDetailsPage from './pages/BookDetailsPage'
import FavoritesPage from './pages/FavoritesPage'
import RatingsPage from './pages/RatingsPage'
import NewReleasesPage from './pages/NewReleasesPage'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-[#f5f1e8] text-[#222]">
        <Header />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/books/:id" element={<BookDetailsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/ratings" element={<RatingsPage />} />
            <Route path="/new-releases" element={<NewReleasesPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}