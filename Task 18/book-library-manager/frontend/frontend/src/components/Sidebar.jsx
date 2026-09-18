import { BookMarked, Filter, Layers, Plus, X } from 'lucide-react'

export default function Sidebar({
  genres = [],
  selectedGenre = 'All',
  onSelectGenre,
  totalBooks = 0,
  genreCounts = {},
  onAddNew,
  isOpen = false,
  onClose
}) {
  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-[#ded8cc] bg-[#f8f5ee] p-6 transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:w-64 lg:translate-x-0 lg:rounded-xl lg:border lg:p-5 lg:shadow-xs ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-[#222]" />
              <h2 className="text-base font-bold tracking-tight text-[#222]">
                Filters &amp; Genres
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-[#777] hover:bg-[#ebe6dc] hover:text-[#222] lg:hidden cursor-pointer"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {onAddNew && (
            <button
              onClick={onAddNew}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#222] px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:bg-[#333] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Plus size={16} />
              <span>Add New Book</span>
            </button>
          )}

          <div className="space-y-2">
            <p className="text-xs font-bold tracking-wider text-[#888] uppercase">
              By Category
            </p>

            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => {
                  onSelectGenre?.('All')
                  onClose?.()
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  selectedGenre === 'All'
                    ? 'bg-[#222] text-white shadow-xs'
                    : 'text-[#444] hover:bg-[#ebe6dc] hover:text-[#222]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Layers size={16} />
                  <span>All Books</span>
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    selectedGenre === 'All'
                      ? 'bg-white/20 text-white'
                      : 'bg-[#ded8cc] text-[#555]'
                  }`}
                >
                  {totalBooks}
                </span>
              </button>

              {genres.map((genre) => {
                const isSelected = selectedGenre === genre
                const count = genreCounts[genre] || 0

                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => {
                      onSelectGenre?.(genre)
                      onClose?.()
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#222] text-white shadow-xs'
                        : 'text-[#444] hover:bg-[#ebe6dc] hover:text-[#222]'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <BookMarked size={16} />
                      <span className="truncate">{genre}</span>
                    </span>
                    {count > 0 && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-[#ded8cc] text-[#555]'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-[#ded8cc] bg-[#f1eee8] p-3.5 text-xs text-[#666]">
          <div className="flex items-center justify-between font-semibold text-[#333]">
            <span>Collection Stats</span>
          </div>
          <div className="mt-2 flex justify-between">
            <span>Total Titles:</span>
            <strong className="text-[#222]">{totalBooks}</strong>
          </div>
          <div className="mt-1 flex justify-between">
            <span>Active Genres:</span>
            <strong className="text-[#222]">{genres.length}</strong>
          </div>
        </div>
      </aside>
    </>
  )
}
