import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'

import LandingPage from './pages/LandingPage'
import LibraryPage from './pages/LibraryPage'
import BookDetailsPage from './pages/BookDetailsPage'
import FavoritesPage from './pages/FavoritesPage'
import RatingsPage from './pages/RatingsPage'
import NewReleasesPage from './pages/NewReleasesPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PersonalLibraryPage from './pages/PersonalLibraryPage'

import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex min-h-screen flex-col bg-[#f5f1e8] text-[#222]">
          <Header />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />

              <Route path="/login" element={<LoginPage />} />

              <Route path="/register" element={<RegisterPage />} />

              <Route path="/library" element={<LibraryPage />} />

              <Route
                path="/books/:id"
                element={
                  <ProtectedRoute>
                    <BookDetailsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <FavoritesPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/ratings"
                element={
                  <ProtectedRoute>
                    <RatingsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/new-releases"
                element={<NewReleasesPage />}
              />

              <Route
                path="/my-library"
                element={
                  <ProtectedRoute>
                    <PersonalLibraryPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}