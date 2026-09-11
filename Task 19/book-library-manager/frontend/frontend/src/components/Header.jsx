import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react'

export default function Header({ currentPage = 'landing', onNavigate }) {
  const isLibrary = currentPage === 'library'

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#ded8cc] bg-[#f5f1e8]/95 backdrop-blur-sm transition-colors duration-200">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-12">
        <button
          onClick={() => onNavigate?.('landing')}
          className="group flex items-center gap-2.5 text-left text-2xl font-bold tracking-tighter text-[#222] transition-transform hover:opacity-90 cursor-pointer"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#222] text-white shadow-sm transition-transform group-hover:scale-105">
            <BookOpen size={20} strokeWidth={2} />
          </span>
          <span className="text-[26px]">BookNest</span>
        </button>

        <nav className="flex items-center gap-3">
          {isLibrary ? (
            <button
              onClick={() => onNavigate?.('landing')}
              className="inline-flex items-center gap-2 rounded-md border border-[#222] bg-transparent px-4 py-2.5 text-sm font-medium text-[#222] transition-all duration-200 hover:bg-[#222] hover:text-white active:scale-95 cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate?.('library')}
              className="inline-flex items-center gap-2 rounded-md border border-[#222] bg-transparent px-5 py-2.5 text-sm font-medium text-[#222] transition-all duration-200 hover:bg-[#222] hover:text-white active:scale-95 shadow-sm cursor-pointer"
            >
              <span>Explore Library</span>
              <ArrowRight size={16} />
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
