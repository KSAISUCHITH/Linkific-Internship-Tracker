import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ArrowLeft, Filter, Loader2, Plus, Search, X } from 'lucide-react'
import BookCard from '../components/BookCard'
import BookForm from '../components/BookForm'
import Sidebar from '../components/Sidebar'
import api, { getApiErrorMessage } from '../api'

export default function LibraryPage({ onBack }) {
  const { user, isAuthenticated } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [books, setBooks] = useState([])
  const [search, setSearch] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const fetchBooks = async () => {
    setLoading(true)
    setError('')

    try {
      const { data } = await api.get('/books')
      setBooks(Array.isArray(data) ? data : [])
    } catch (err) {
      setBooks([])
      setError(getApiErrorMessage(err, 'Unable to load books.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const genres = useMemo(() => {
    const list = Array.from(
      new Set(books.map((b) => b.genre).filter(Boolean))
    )

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

  const handleAddBook = () => {
    if (!isAdmin) return

    setEditingBook(null)
    setShowForm(true)
  }

  const handleEdit = (book) => {
    if (!isAdmin) return

    setEditingBook(book)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingBook(null)
  }

  const handleToggleFavorite = async (bookId, newStatus) => {
    if (!isAuthenticated) return

    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId ? { ...b, is_favorite: newStatus } : b
      )
    )

    try {
      if (newStatus) {
        await api.post(`/favorites/${bookId}`)
      } else {
        await api.delete(`/favorites/${bookId}`)
      }
    } catch (err) {
      console.error('Error toggling favorite:', err)

      setBooks((prev) =>
        prev.map((b) =>
          b.id === bookId ? { ...b, is_favorite: !newStatus } : b
        )
      )

      setError(getApiErrorMessage(err, 'Unable to update favorites.'))
    }
  }

  const handleRate = async (bookId, newRating) => {
    if (!isAuthenticated) return

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
      console.error('Error submitting rating:', err)
      setError(getApiErrorMessage(err, 'Unable to save rating.'))
    }
  }

  const handleDelete = async (id) => {
    if (!isAdmin) return

    const confirmed = window.confirm(
      'Are you sure you want to delete this book?'
    )

    if (!confirmed) return

    try {
      await api.delete(`/books/${id}`)

      setBooks((currentBooks) =>
        currentBooks.filter((book) => book.id !== id)
      )
    } catch (err) {
      console.error('Error deleting book:', err)
      setError(getApiErrorMessage(err, 'Unable to delete book.'))
    }
  }

  const handleAddToLibrary = async (bookId) => {
    if (!isAuthenticated || isAdmin) return

    try {
      await api.post(`/my-library/${bookId}`)

      setError('')
      window.alert('Book added to your personal library.')
    } catch (err) {
      console.error('Error adding book to personal library:', err)

      setError(
        getApiErrorMessage(
          err,
          'Unable to add book to your personal library.'
        )
      )
    }
  }

  const handleSave = async (bookData) => {
    if (!isAdmin) return

    try {
      const isEditing = Boolean(editingBook)

      const payload = {
        title: bookData.title,
        author: bookData.author,
        genre: bookData.genre,
        year: bookData.year,
        image: bookData.image,
        description: bookData.description
      }

      if (isEditing) {
        const { data } = await api.put(
          `/books/${bookData.id}`,
          payload
        )

        setBooks((currentBooks) =>
          currentBooks.map((item) =>
            item.id === data.id ? data : item
          )
        )
      } else {
        const { data } = await api.post('/books', payload)

        setBooks((currentBooks) => [
          ...currentBooks,
          data
        ])
      }

      handleCloseForm()
    } catch (err) {
      console.error('Error saving book:', err)
      setError(getApiErrorMessage(err, 'Unable to save book.'))
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:px-12">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#777] transition-colors hover:text-[#222] cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </button>
      ) : (
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#777] transition-colors hover:text-[#222] cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>
      )}

      <div className="flex flex-col gap-6 pb-8 md:flex-row md:items-end md:justify-between border-b border-[#ded8cc]">
        <div>
          <p className="text-xs font-bold tracking-[3px] text-[#777] uppercase">
            MAIN LIBRARY
          </p>

          <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-[#222] sm:text-5xl">
            Book Library
          </h1>

          <p className="mt-2 text-sm text-[#777] sm:text-base">
            Discover books available in the BookNest main library.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-[#ded8cc] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#333] shadow-2xs transition-colors hover:bg-[#f5f1e8] lg:hidden cursor-pointer"
          >
            <Filter size={16} />
            <span>Filters</span>

            {selectedGenre !== 'All' && (
              <span className="h-2 w-2 rounded-full bg-[#222]" />
            )}
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={handleAddBook}
              className="inline-flex items-center gap-2 rounded-lg bg-[#222] px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:bg-[#333] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Plus size={18} />
              <span>Add Book</span>
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col items-start gap-8 lg:flex-row">
        <Sidebar
          genres={genres}
          selectedGenre={selectedGenre}
          onSelectGenre={setSelectedGenre}
          totalBooks={books.length}
          genreCounts={genreCounts}
          onAddNew={isAdmin ? handleAddBook : undefined}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

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
                placeholder="Search books by title or author..."
                className="w-full rounded-xl border border-[#ded8cc] bg-white py-2.5 pr-10 pl-10 text-sm text-[#222] placeholder-[#888] shadow-2xs outline-none transition-all focus:border-[#222] focus:ring-1 focus:ring-[#222]"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#888] hover:text-[#222] cursor-pointer"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-[#777] sm:justify-end gap-2">
              {selectedGenre !== 'All' && (
                <span className="rounded-md bg-[#f1eee8] px-2.5 py-1 font-medium text-[#444] border border-[#e2dccf]">
                  Genre: {selectedGenre}
                </span>
              )}

              <span>
                Showing{' '}
                <strong className="text-[#222]">
                  {filteredBooks.length}
                </strong>{' '}
                {filteredBooks.length === 1 ? 'book' : 'books'}
              </span>
            </div>
          </div>

          {error ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#ddd7cb] bg-[#f8f5ee] p-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#222] text-white shadow-sm">
                <Search size={28} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-[#222]">
                Unable to load books
              </h2>

              <p className="mt-2 max-w-md text-sm text-[#666]">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchBooks}
                className="mt-6 rounded-lg bg-[#222] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#333] cursor-pointer"
              >
                Try Again
              </button>
            </div>
          ) : loading ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#ddd7cb] bg-[#f8f5ee] p-10 text-center">
              <Loader2 size={36} className="animate-spin text-[#666]" />

              <p className="mt-4 text-sm font-semibold text-[#555]">
                Loading the main library...
              </p>
            </div>
          ) : filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  isFavorite={book.is_favorite}
                  rating={book.rating}
                  userRating={book.user_rating}
                  isAdmin={isAdmin}
                  isAuthenticated={isAuthenticated}
                  onToggleFavorite={handleToggleFavorite}
                  onRate={handleRate}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAddToLibrary={handleAddToLibrary}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#cfc7b8] bg-[#ebe6dc] p-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#222] text-white shadow-sm">
                <Search size={28} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-[#222]">
                No books found
              </h2>

              <p className="mt-2 max-w-sm text-sm text-[#777]">
                {search || selectedGenre !== 'All'
                  ? 'We couldn’t find any books matching your current filters. Try resetting your search or choosing another category.'
                  : isAdmin
                    ? 'The main library is currently empty. Add your first book to get started.'
                    : 'The main library is currently empty. Please check back later for new books.'}
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {(search || selectedGenre !== 'All') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('')
                      setSelectedGenre('All')
                    }}
                    className="rounded-lg border border-[#222] bg-white px-4 py-2 text-xs font-semibold text-[#222] transition-colors hover:bg-[#222] hover:text-white cursor-pointer"
                  >
                    Reset Filters
                  </button>
                )}

                {isAdmin && (
                  <button
                    type="button"
                    onClick={handleAddBook}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#222] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Plus size={16} />
                    <span>Add a Book</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </section>
      </div>

      {showForm && isAdmin && (
        <BookForm
          key={editingBook?.id || 'new-book'}
          book={editingBook}
          onClose={handleCloseForm}
          onSave={handleSave}
        />
      )}
    </div>
  )
}