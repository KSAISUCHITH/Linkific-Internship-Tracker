import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  LogIn,
  LogOut,
  Menu,
  User,
  UserPlus,
  X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()

  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/library', label: 'Library' },
    { to: '/new-releases', label: 'New Releases' },
    { to: '/ratings', label: 'Ratings' },
    { to: '/favorites', label: 'My Favorites' }
  ]

  const isLanding = location.pathname === '/'

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#ded8cc] bg-[#f5f1e8]/95 backdrop-blur-sm transition-colors duration-200">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-12">
        <Link
          to="/"
          className="group flex items-center gap-2.5 text-left text-2xl font-bold tracking-tighter text-[#222] transition-transform hover:opacity-90 cursor-pointer"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#222] text-white shadow-sm transition-transform group-hover:scale-105">
            <BookOpen size={20} strokeWidth={2} />
          </span>

          <span className="text-[26px]">BookNest</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `px-3.5 py-2 text-sm rounded-lg transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#222] text-white font-semibold shadow-xs'
                    : 'text-[#555] font-medium hover:text-[#222] hover:bg-[#ebe6dc]'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {isAuthenticated && (
            <NavLink
              to="/my-library"
              className={({ isActive }) =>
                `px-3.5 py-2 text-sm rounded-lg transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#222] text-white font-semibold shadow-xs'
                    : 'text-[#555] font-medium hover:text-[#222] hover:bg-[#ebe6dc]'
                }`
              }
            >
              My Library
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isLanding && (
            <Link
              to="/library"
              className="hidden lg:inline-flex items-center gap-2 rounded-md border border-[#222] bg-transparent px-4 py-2 text-sm font-medium text-[#222] transition-all duration-200 hover:bg-[#222] hover:text-white active:scale-95 shadow-2xs cursor-pointer"
            >
              <span>Explore Library</span>
              <ArrowRight size={15} />
            </Link>
          )}

          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/my-library"
                className="flex items-center gap-2 rounded-lg border border-[#ded8cc] bg-[#ebe6dc] px-3 py-2 text-sm font-medium text-[#333] hover:bg-[#ded8cc]"
              >
                <User size={16} />
                <span>{user?.username}</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg border border-[#222] px-3 py-2 text-sm font-medium text-[#222] transition hover:bg-[#222] hover:text-white"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#444] hover:bg-[#ebe6dc]"
              >
                <LogIn size={16} />
                Login
              </Link>

              <Link
                to="/register"
                className="flex items-center gap-2 rounded-lg bg-[#222] px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#333]"
              >
                <UserPlus size={16} />
                Register
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden rounded-lg p-2 text-[#555] hover:bg-[#ebe6dc] hover:text-[#222] transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#ded8cc] bg-[#f5f1e8] px-6 py-4 shadow-lg">
          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2.5 text-sm rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#222] text-white font-semibold shadow-xs'
                      : 'text-[#444] font-medium hover:bg-[#ebe6dc] hover:text-[#222]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {isAuthenticated && (
              <NavLink
                to="/my-library"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2.5 text-sm rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#222] text-white font-semibold'
                      : 'text-[#444] font-medium hover:bg-[#ebe6dc]'
                  }`
                }
              >
                My Library
              </NavLink>
            )}

            <div className="mt-3 border-t border-[#ded8cc] pt-3">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-sm text-[#666]">
                    Signed in as <span className="font-semibold text-[#222]">{user?.username}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-[#444] hover:bg-[#ebe6dc]"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-[#444] hover:bg-[#ebe6dc]"
                  >
                    <LogIn size={16} />
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg bg-[#222] px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    <UserPlus size={16} />
                    Register
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}