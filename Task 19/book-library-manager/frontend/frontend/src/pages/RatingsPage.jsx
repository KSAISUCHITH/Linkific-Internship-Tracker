import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Award, BookOpen, Filter, Loader2, Search, Star, X } from 'lucide-react'
import BookCard from '../components/BookCard'
import BookForm from '../components/BookForm'

const API_URL = import.meta.env.VITE_API_URL

export default function RatingsPage() {
  const [books, setBooks] = useState([])
  const [search, setSearch] = useState('')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [editingBook, setEditingBook] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const fetchRatedBooks = async () => {
    try {
      const res = await fetch(`${API_URL}/ratings`)
      if (!res.ok) throw new Error('Failed to fetch ratings')
      const data = await res.json()
      setBooks(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error fetching ratings:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRatedBooks()
  }, [])

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const query = search.toLowerCase().trim()
      const matchesSearch =
        !query ||
        book.title?.toLowerCase().includes(query) ||
        book.author?.toLowerCase().includes(query) ||
        book.genre?.toLowerCase().includes(query)

      const bookRating = Number(book.rating || book.user_rating || 0)

      let matchesRating = true
      if (ratingFilter === '5') {
        matchesRating = bookRating >= 4.8
      } else if (ratingFilter === '4+') {
        matchesRating = bookRating >= 4.0
      } else if (ratingFilter === '3+') {
        matchesRating = bookRating >= 3.0
      } else if (ratingFilter === 'unrated') {
        matchesRating = bookRating === 0
      }

      return matchesSearch && matchesRating
    })
  }, [books, search, ratingFilter])

  const handleRate = async (bookId, newRating) => {
    setBooks((prev) => {
      const updated = prev.map((b) =>
        b.id === bookId
          ? {
            ...b,
            rating: newRating,
            user_rating: newRating,
            rating_count: (b.rating_count || 0) + (b.rating ? 0 : 1)
          }
          : b
      )
      return updated.sort(
        (a, b) =>
          Number(b.rating || b.user_rating || 0) -
          Number(a.rating || a.user_rating || 0)
      )
    })

    try {
      const res = await fetch(`${API_URL}/books/${bookId}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: newRating })
      })
      if (res.ok) {
        const data = await res.json()
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
      }
    } catch (err) {
      console.error('Error saving rating:', err)
    }
  }

  const handleToggleFavorite = async (bookId, newFavStatus) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId ? { ...b, is_favorite: newFavStatus } : b
      )
    )

    try {
      const endpoint = `${API_URL}/favorites/${bookId}`
      await fetch(endpoint, {
        method: newFavStatus ? 'POST' : 'DELETE'
      })
    } catch (err) {
      console.error('Error toggling favorite:', err)
      fetchRatedBooks()
    }
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this book?')
    if (!confirmed) return

    try {
      const response = await fetch(`${API_URL}/books/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete book')
      setBooks((prev) => prev.filter((b) => b.id !== id))
    } catch (err) {
      console.error('Error deleting book:', err)
    }
  }

  const handleSaveBook = async (bookData) => {
    try {
      const response = await fetch(`${API_URL}/books/${bookData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: bookData.title,
          author: bookData.author,
          genre: bookData.genre,
          year: bookData.year,
          image: bookData.image,
          description: bookData.description
        })
      })
      if (!response.ok) throw new Error('Failed to update book')
      const updated = await response.json()
      setBooks((prev) =>
        prev.map((b) => (b.id === updated.id ? { ...b, ...updated } : b))
      )
      setShowForm(false)
      setEditingBook(null)
    } catch (err) {
      console.error('Error saving book:', err)
    }
  }

  const averageRating = useMemo(() => {
    const rated = books.filter((b) => (b.rating || b.user_rating || 0) > 0)
    if (!rated.length) return 0
    const sum = rated.reduce(
      (acc, b) => acc + (b.rating || b.user_rating || 0),
      0
    )
    return (sum / rated.length).toFixed(1)
  }, [books])

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:px-12">
      <div className="flex flex-col gap-6 pb-8 md:flex-row md:items-end md:justify-between border-b border-[#ded8cc]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50/70 px-3 py-1 text-xs font-semibold text-amber-800 mb-2">
            <Award size={13} className="text-amber-600" />
            <span>Top Rated Books</span>
          </div>
          <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-[#222] sm:text-5xl">
            Book Ratings
          </h1>
          <p className="mt-2 text-sm text-[#777] sm:text-base">
            Discover community and reader favourites, ranked from highest to lowest.
          </p>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-[#ded8cc] bg-white p-3.5 shadow-2xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
            <Star size={20} className="fill-amber-500 text-amber-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#888]">Avg. Rating</p>
            <p className="text-base font-bold text-[#222]">
              {averageRating > 0 ? `${averageRating} / 5.0` : 'No ratings yet'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-xl">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#888]">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rated books by title or author..."
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

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All' },
            { id: '5', label: '★ 5.0' },
            { id: '4+', label: '★ 4.0+' },
            { id: '3+', label: '★ 3.0+' },
            { id: 'unrated', label: 'Unrated' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setRatingFilter(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${ratingFilter === tab.id
                  ? 'bg-[#222] text-white shadow-xs'
                  : 'bg-white border border-[#ded8cc] text-[#555] hover:bg-[#ebe6dc]'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#ddd7cb] bg-[#f8f5ee] p-10 text-center">
            <Loader2 size={36} className="animate-spin text-[#666]" />
            <p className="mt-4 text-sm font-semibold text-[#555]">
              Calculating top ratings...
            </p>
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map((book, index) => (
              <div key={book.id} className="relative">
                {index < 3 && !search && ratingFilter === 'all' && (
                  <span
                    className={`absolute -top-3 -left-3 z-20 flex h-7 w-7 items-center justify-center rounded-full text-xs font-black shadow-md ${index === 0
                        ? 'bg-amber-400 text-amber-950 ring-2 ring-white'
                        : index === 1
                          ? 'bg-slate-300 text-slate-900 ring-2 ring-white'
                          : 'bg-amber-700 text-white ring-2 ring-white'
                      }`}
                  >
                    #{index + 1}
                  </span>
                )}

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
              <Star size={28} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#222]">
              No books match this rating filter
            </h2>

            <p className="mt-2 max-w-sm text-sm text-[#777]">
              {search || ratingFilter !== 'all'
                ? 'Try clearing your search query or selecting "All" to view all rated books.'
                : 'No books have been rated yet. Rate any book from the library to populate this list.'}
            </p>

            <div className="mt-6 flex gap-3">
              {(search || ratingFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearch('')
                    setRatingFilter('all')
                  }}
                  className="rounded-lg border border-[#222] bg-white px-4 py-2 text-xs font-semibold text-[#222] transition-colors hover:bg-[#222] hover:text-white cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
              <Link
                to="/library"
                className="inline-flex items-center gap-2 rounded-lg bg-[#222] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#333] cursor-pointer"
              >
                <BookOpen size={15} />
                <span>Explore Library</span>
              </Link>
            </div>
          </div>
        )}
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
