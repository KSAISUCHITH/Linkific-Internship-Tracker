import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowRight, BookOpen, Menu, Sparkles, X } from 'lucide-react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/library', label: 'Library' },
    { to: '/new-releases', label: 'New Releases' },
    { to: '/ratings', label: 'Ratings' },
    { to: '/favorites', label: 'My Favorites' }
  ]

  const isLanding = location.pathname === '/'

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
        </nav>

        <div className="flex items-center gap-3">
          {isLanding && (
            <Link
              to="/library"
              className="hidden sm:inline-flex items-center gap-2 rounded-md border border-[#222] bg-transparent px-4 py-2 text-sm font-medium text-[#222] transition-all duration-200 hover:bg-[#222] hover:text-white active:scale-95 shadow-2xs cursor-pointer"
            >
              <span>Explore Library</span>
              <ArrowRight size={15} />
            </Link>
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
        <div className="md:hidden border-t border-[#ded8cc] bg-[#f5f1e8] px-6 py-4 shadow-lg animate-in slide-in-from-top-2 duration-150">
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
          </nav>
        </div>
      )}
    </header>
  )
}
