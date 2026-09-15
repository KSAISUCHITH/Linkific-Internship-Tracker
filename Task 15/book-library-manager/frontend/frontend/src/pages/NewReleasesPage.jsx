import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Filter, Flame, Loader2, Search, Sparkles, X } from 'lucide-react'
import BookCard from '../components/BookCard'
import BookForm from '../components/BookForm'
import Sidebar from '../components/Sidebar'
import api, { getApiErrorMessage } from '../api'

export default function NewReleasesPage() {
  const [books, setBooks] = useState([])
  const [search, setSearch] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingBook, setEditingBook] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const fetchNewReleases = async () => {
    setLoading(true)
    setError('')

    try {
      const { data } = await api.get('/new-releases')
      setBooks(Array.isArray(data) ? data : [])
    } catch (err) {
      setBooks([])
      setError(getApiErrorMessage(err, 'Unable to load new releases.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNewReleases()
  }, [])

  const genres = useMemo(() => {
    const list = Array.from(new Set(books.map((b) => b.genre).filter(Boolean)))
    return list.sort()
  }, [books])

  const genreCounts = useMemo(() => {
    return books.reduce((acc, book) => {
      if (book.genre) {
        acc[book.genre] = (acc[book.genre] || 0) + 1
      }
      return acc
    }, {})
  }, [books])

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const query = search.toLowerCase().trim()
      const matchesSearch =
        !query ||
        book.title?.toLowerCase().includes(query) ||
        book.author?.toLowerCase().includes(query)

      const matchesGenre =
        selectedGenre === 'All' || book.genre === selectedGenre

      return matchesSearch && matchesGenre
    })
  }, [books, search, selectedGenre])

  const handleToggleFavorite = async (bookId, newFavStatus) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId ? { ...b, is_favorite: newFavStatus } : b
      )
    )

    try {
      if (newFavStatus) {
        await api.post(`/favorites/${bookId}`)
      } else {
        await api.delete(`/favorites/${bookId}`)
      }
    } catch (err) {
      console.error('Error toggling favorite:', err)
      setError(getApiErrorMessage(err, 'Unable to update favorites.'))
      fetchNewReleases()
    }
  }

  const handleRate = async (bookId, newRating) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId
          ? { ...b, rating: newRating, user_rating: newRating }
          : b
      )
    )

    try {
      const { data } = await api.post(`/books/${bookId}/rating`, {
        rating: newRating
      })

      setBooks((prev) =>
        prev.map((b) =>
          b.id === bookId
            ? {
                ...b,
                rating: data.average_rating,
                user_rating: data.rating,
                rating_count: data.rating_count
              }
            : b
        )
      )
    } catch (err) {
      console.error('Error updating rating:', err)
      setError(getApiErrorMessage(err, 'Unable to save rating.'))
    }
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this book?')
    if (!confirmed) return

    try {
      await api.delete(`/books/${id}`)
      setBooks((prev) => prev.filter((b) => b.id !== id))
    } catch (err) {
      console.error('Error deleting book:', err)
      setError(getApiErrorMessage(err, 'Unable to delete book.'))
    }
  }

  const handleSaveBook = async (bookData) => {
    try {
      const { data } = await api.put(`/books/${bookData.id}`, {
        title: bookData.title,
        author: bookData.author,
        genre: bookData.genre,
        year: bookData.year,
        image: bookData.image,
        description: bookData.description
      })

      setBooks((prev) =>
        prev.map((b) => (b.id === data.id ? { ...b, ...data } : b))
      )
      setShowForm(false)
      setEditingBook(null)
    } catch (err) {
      console.error('Error saving book:', err)
      setError(getApiErrorMessage(err, 'Unable to save book.'))
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:px-12">
      <div className="flex flex-col gap-6 pb-8 md:flex-row md:items-end md:justify-between border-b border-[#ded8cc]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50/80 px-3 py-1 text-xs font-semibold text-orange-700 mb-2">
            <Flame size={13} className="text-orange-600" />
            <span>Latest Additions &amp; Editions</span>
          </div>
          <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-[#222] sm:text-5xl">
            New Releases
          </h1>
          <p className="mt-2 text-sm text-[#777] sm:text-base">
            Browse the newest releases and latest titles added to your library, ordered by publication date.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {books.length > 0 && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-[#ded8cc] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#333] shadow-2xs transition-colors hover:bg-[#f5f1e8] lg:hidden cursor-pointer"
            >
              <Filter size={16} />
              <span>Filters</span>
              {selectedGenre !== 'All' && (
                <span className="h-2 w-2 rounded-full bg-[#222]" />
              )}
            </button>
          )}

          <Link
            to="/library"
            className="inline-flex items-center gap-2 rounded-lg bg-[#222] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#333] cursor-pointer"
          >
            <span>All Books</span>
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-start gap-8 lg:flex-row">
        {books.length > 0 && (
          <Sidebar
            genres={genres}
            selectedGenre={selectedGenre}
            onSelectGenre={setSelectedGenre}
            totalBooks={books.length}
            genreCounts={genreCounts}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}

        <section className="flex-1 w-full space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-xl">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#888]">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search new releases..."
                className="w-full rounded-xl border border-[#ded8cc] bg-white py-2.5 pr-10 pl-10 text-sm text-[#222] placeholder-[#888] shadow-2xs outline-none transition-all focus:border-[#222] focus:ring-1 focus:ring-[#222]"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#888] hover:text-[#222] cursor-pointer"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-[#777] sm:justify-end gap-2">
              <span>
                Sorted by: <strong>Newest Year First</strong>
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#ddd7cb] bg-[#f8f5ee] p-10 text-center">
              <Loader2 size={36} className="animate-spin text-[#666]" />
              <p className="mt-4 text-sm font-semibold text-[#555]">
                Loading newest releases...
              </p>
            </div>
          ) : filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredBooks.map((book) => (
                <div key={book.id} className="relative">
                  <BookCard
                    book={book}
                    isFavorite={book.is_favorite}
                    rating={book.rating}
                    userRating={book.user_rating}
                    onToggleFavorite={handleToggleFavorite}
                    onRate={handleRate}
                    onEdit={(b) => {
                      setEditingBook(b)
                      setShowForm(true)
                    }}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#cfc7b8] bg-[#ebe6dc] p-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#222] text-white shadow-sm">
                <Calendar size={28} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-[#222]">
                No releases found
              </h2>

              <p className="mt-2 max-w-sm text-sm text-[#777]">
                {search || selectedGenre !== 'All'
                  ? 'No releases match your current filters. Reset your filters to browse all.'
                  : 'Your library has no books listed yet.'}
              </p>

              {(search || selectedGenre !== 'All') && (
                <button
                  onClick={() => {
                    setSearch('')
                    setSelectedGenre('All')
                  }}
                  className="mt-6 rounded-lg border border-[#222] bg-white px-4 py-2 text-xs font-semibold text-[#222] transition-colors hover:bg-[#222] hover:text-white cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>
          )}
        </section>
      </div>

      {showForm && editingBook && (
        <BookForm
          book={editingBook}
          onClose={() => {
            setShowForm(false)
            setEditingBook(null)
          }}
          onSave={handleSaveBook}
        />
      )}
    </div>
  )
}
