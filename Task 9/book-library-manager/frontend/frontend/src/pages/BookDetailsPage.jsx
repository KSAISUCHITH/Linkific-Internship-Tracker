import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Calendar, CheckCircle2, Heart, Loader2, Pencil, Trash2, Tag, Star } from 'lucide-react'
import StarRating from '../components/StarRating'
import BookForm from '../components/BookForm'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function BookDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showEditForm, setShowEditForm] = useState(false)
  const [ratingMessage, setRatingMessage] = useState('')

  useEffect(() => {
    let ignore = false

    async function fetchBook() {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(`${API_URL}/books/${id}`)
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Book not found')
          }
          throw new Error('Failed to load book details')
        }
        const data = await res.json()
        if (!ignore) {
          setBook(data)
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Error loading book')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    if (id) {
      fetchBook()
    }

    return () => {
      ignore = true
    }
  }, [id])

  const handleToggleFavorite = async () => {
    if (!book) return
    const willBeFavorite = !book.is_favorite

    setBook((prev) => ({ ...prev, is_favorite: willBeFavorite }))

    try {
      const endpoint = `${API_URL}/favorites/${book.id}`
      const res = await fetch(endpoint, {
        method: willBeFavorite ? 'POST' : 'DELETE'
      })

      if (!res.ok) {
        throw new Error('Failed to update favorite status')
      }
      const data = await res.json()
      setBook((prev) => ({ ...prev, is_favorite: data.is_favorite }))
    } catch (err) {
      console.error('Error toggling favorite:', err)
      setBook((prev) => ({ ...prev, is_favorite: !willBeFavorite }))
    }
  }

  const handleRate = async (newRating) => {
    if (!book) return

    setBook((prev) => ({
      ...prev,
      user_rating: newRating,
      rating: newRating
    }))
    setRatingMessage(`You rated this ${newRating} of 5 stars!`)
    setTimeout(() => setRatingMessage(''), 3500)

    try {
      const res = await fetch(`${API_URL}/books/${book.id}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: newRating })
      })

      if (!res.ok) {
        throw new Error('Failed to save rating')
      }
      const data = await res.json()
      setBook((prev) => ({
        ...prev,
        rating: data.average_rating,
        user_rating: data.rating,
        rating_count: data.rating_count
      }))
    } catch (err) {
      console.error('Error rating book:', err)
    }
  }

  const handleDelete = async () => {
    if (!book) return
    const confirmed = window.confirm(`Are you sure you want to delete "${book.title}"?`)
    if (!confirmed) return

    try {
      const res = await fetch(`${API_URL}/books/${book.id}`, {
        method: 'DELETE'
      })
      if (!res.ok) {
        throw new Error('Failed to delete book')
      }
      navigate('/library')
    } catch (err) {
      console.error('Error deleting book:', err)
      alert('Failed to delete book: ' + err.message)
    }
  }

  const handleSaveEdit = async (bookData) => {
    try {
      const res = await fetch(`${API_URL}/books/${bookData.id}`, {
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

      if (!res.ok) {
        throw new Error('Failed to save changes')
      }

      const updated = await res.json()
      setBook((prev) => ({
        ...prev,
        ...updated
      }))
      setShowEditForm(false)
    } catch (err) {
      console.error('Error saving edited book:', err)
      alert('Failed to update book: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-6 py-12">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#ddd7cb] bg-[#f8f5ee] p-12 text-center">
          <Loader2 size={38} className="animate-spin text-[#666]" />
          <p className="mt-4 text-sm font-semibold text-[#555]">Loading book details...</p>
        </div>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#222] text-white shadow-sm mb-4">
          <BookOpen size={28} />
        </div>
        <h1 className="text-3xl font-extrabold text-[#222]">Book Not Found</h1>
        <p className="mt-2 text-sm text-[#777] max-w-md">
          {error || "We couldn't locate the requested book in your collection. It may have been removed."}
        </p>
        <Link
          to="/library"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#222] px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#333]"
        >
          <ArrowLeft size={16} />
          <span>Return to Library</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:px-12">
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#777] transition-colors hover:text-[#222] cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowEditForm(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#ddd7cb] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#444] transition-colors hover:border-[#222] hover:bg-[#f5f1e8] hover:text-[#222] cursor-pointer"
          >
            <Pencil size={13} />
            <span>Edit Book</span>
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#ddd7cb] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#888] transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 cursor-pointer"
          >
            <Trash2 size={13} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <article className="overflow-hidden rounded-3xl border border-[#ded8cc] bg-white shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="relative flex min-h-[380px] items-center justify-center bg-[#ebe6dc] p-8 sm:p-12 lg:col-span-5 lg:min-h-[520px]">
            {book.image ? (
              <img
                src={book.image}
                alt={`Cover of ${book.title}`}
                className="max-h-[460px] w-auto max-w-full rounded-xl object-contain shadow-2xl transition-transform duration-300 hover:scale-102"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-[#999]">
                <BookOpen size={72} strokeWidth={1} />
                <span className="mt-3 text-xs font-medium text-[#888]">No Cover Image</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleToggleFavorite}
              className={`absolute top-5 left-5 z-10 flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold shadow-md transition-all duration-200 cursor-pointer backdrop-blur-md ${
                book.is_favorite
                  ? 'bg-white text-red-600 ring-1 ring-red-200'
                  : 'bg-white/90 text-[#444] hover:bg-white hover:text-red-500'
              }`}
            >
              <Heart
                size={14}
                className={`transition-colors ${
                  book.is_favorite ? 'fill-red-500 text-red-500' : 'text-[#666]'
                }`}
              />
              <span>{book.is_favorite ? 'Favorited' : 'Add to Favorites'}</span>
            </button>
          </div>

          <div className="flex flex-col justify-between p-8 sm:p-10 lg:col-span-7 lg:p-12">
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <span className="inline-flex items-center gap-1 rounded-md border border-[#e4decb] bg-[#f8f5ee] px-3 py-1 text-xs font-semibold text-[#555]">
                  <Tag size={12} />
                  {book.genre}
                </span>

                {book.year && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-[#e4decb] bg-[#f8f5ee] px-3 py-1 text-xs font-semibold text-[#555]">
                    <Calendar size={12} />
                    Published {book.year}
                  </span>
                )}

                {book.is_favorite && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-red-50 border border-red-200 px-3 py-1 text-xs font-semibold text-red-600">
                    <Heart size={12} className="fill-red-500 text-red-500" />
                    In Favorites
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-black tracking-tight text-[#222] sm:text-4xl lg:text-5xl">
                {book.title}
              </h1>
              <p className="mt-2 font-serif text-lg italic text-[#666] sm:text-xl">
                by {book.author}
              </p>

              <div className="mt-6 rounded-2xl border border-[#ded8cc] bg-[#fcfbf9] p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#777]">
                      Community &amp; User Rating
                    </span>
                    <div className="mt-1 flex items-center gap-3">
                      <StarRating
                        rating={book.rating || 0}
                        onRate={handleRate}
                        size={22}
                        showValue={false}
                      />
                      <span className="text-sm font-bold text-[#222]">
                        {book.rating ? `${Number(book.rating).toFixed(1)} / 5` : 'Not rated yet'}
                      </span>
                      {book.rating_count > 0 && (
                        <span className="text-xs text-[#888]">
                          ({book.rating_count} {book.rating_count === 1 ? 'rating' : 'ratings'})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[11px] font-semibold text-[#888] block">
                      Click stars above to rate
                    </span>
                    {book.user_rating && (
                      <span className="text-xs font-medium text-amber-700">
                        Your rating: <strong>{book.user_rating}★</strong>
                      </span>
                    )}
                  </div>
                </div>

                {ratingMessage && (
                  <div className="mt-3 flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-lg p-2 border border-emerald-200 animate-in fade-in duration-200">
                    <CheckCircle2 size={14} />
                    <span>{ratingMessage}</span>
                  </div>
                )}
              </div>

              <div className="mt-8 space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-[2px] text-[#777]">
                  Synopsis &amp; Overview
                </h2>
                <div className="prose text-sm sm:text-base leading-relaxed text-[#555]">
                  {book.description ? (
                    <p className="whitespace-pre-line">{book.description}</p>
                  ) : (
                    <p className="italic text-[#888]">
                      No detailed description is currently recorded for this edition. You can edit this book to add reading notes, chapter summaries, or a synopsis.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-[#f0ebe0] flex flex-wrap items-center justify-between gap-4 text-xs text-[#888]">
              <div>
                <span>Catalogue ID: </span>
                <strong className="text-[#333]">#{book.id}</strong>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  className="inline-flex items-center gap-1.5 font-semibold text-[#444] hover:text-red-500 cursor-pointer transition-colors"
                >
                  <Heart
                    size={14}
                    className={book.is_favorite ? 'fill-red-500 text-red-500' : ''}
                  />
                  <span>{book.is_favorite ? 'Remove Favorite' : 'Mark as Favorite'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {showEditForm && (
        <BookForm
          key={book.id}
          book={book}
          onClose={() => setShowEditForm(false)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  )
}
