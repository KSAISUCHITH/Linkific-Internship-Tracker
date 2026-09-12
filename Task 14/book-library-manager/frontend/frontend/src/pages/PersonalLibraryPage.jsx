import { useEffect, useMemo, useState } from 'react'
import {
  BookOpen,
  Calendar,
  Download,
  Library,
  Loader2,
  RotateCcw
} from 'lucide-react'
import api, { getApiErrorMessage } from '../api'

export default function PersonalLibraryPage() {
  const [library, setLibrary] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(null)

  const fetchLibrary = async () => {
    setLoading(true)
    setError('')

    try {
      const { data } = await api.get('/my-library')
      setLibrary(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error loading personal library:', err)

      setError(
        getApiErrorMessage(
          err,
          'Unable to load your personal library.'
        )
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLibrary()
  }, [])

  const stats = useMemo(() => {
    return {
      total: library.length,
      borrowed: library.filter(
        (item) => item.status === 'borrowed'
      ).length,
      downloaded: library.filter(
        (item) => item.status === 'downloaded'
      ).length,
      returned: library.filter(
        (item) => item.status === 'returned'
      ).length
    }
  }, [library])

  const handleDownload = async (bookId) => {
    setActionLoading(`download-${bookId}`)
    setError('')

    try {
      const { data } = await api.put(
        `/my-library/${bookId}/download`
      )

      setLibrary((current) =>
        current.map((item) =>
          item.book_id === bookId ? data : item
        )
      )
    } catch (err) {
      console.error('Error downloading book:', err)

      setError(
        getApiErrorMessage(
          err,
          'Unable to download this book.'
        )
      )
    } finally {
      setActionLoading(null)
    }
  }

  const handleReturn = async (bookId) => {
    setActionLoading(`return-${bookId}`)
    setError('')

    try {
      const { data } = await api.put(
        `/my-library/${bookId}/return`
      )

      setLibrary((current) =>
        current.map((item) =>
          item.book_id === bookId ? data : item
        )
      )
    } catch (err) {
      console.error('Error returning book:', err)

      setError(
        getApiErrorMessage(
          err,
          'Unable to return this book.'
        )
      )
    } finally {
      setActionLoading(null)
    }
  }

  const handleBorrow = async (bookId) => {
    setActionLoading(`borrow-${bookId}`)
    setError('')

    try {
      const { data } = await api.put(
        `/my-library/${bookId}/borrow`
      )

      setLibrary((current) =>
        current.map((item) =>
          item.book_id === bookId ? data : item
        )
      )
    } catch (err) {
      console.error('Error borrowing book:', err)

      setError(
        getApiErrorMessage(
          err,
          'Unable to borrow this book.'
        )
      )
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (date) => {
    if (!date) return '—'

    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    )
  }

  const getStatusLabel = (status) => {
    if (status === 'in_library') return 'In Library'
    if (status === 'borrowed') return 'Borrowed'
    if (status === 'downloaded') return 'Downloaded'
    if (status === 'returned') return 'Returned'

    return status
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:px-12">
      <div className="border-b border-[#ded8cc] pb-8">
        <p className="text-xs font-bold tracking-[3px] text-[#777] uppercase">
          PERSONAL SHELF
        </p>

        <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-[#222] sm:text-5xl">
          My Library
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-[#777] sm:text-base">
          Manage the books you've added to your personal library,
          track borrowing activity, and manage downloaded books.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Books"
          value={stats.total}
          icon={<Library size={20} />}
        />

        <StatCard
          label="Borrowed"
          value={stats.borrowed}
          icon={<BookOpen size={20} />}
        />

        <StatCard
          label="Downloaded"
          value={stats.downloaded}
          icon={<Download size={20} />}
        />

        <StatCard
          label="Returned"
          value={stats.returned}
          icon={<RotateCcw size={20} />}
        />
      </div>

      {error && (
        <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>

          <button
            type="button"
            onClick={fetchLibrary}
            className="shrink-0 rounded-lg bg-[#222] px-3 py-2 text-xs font-semibold text-white hover:bg-[#333] cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      <div className="mt-8">
        {loading ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#ddd7cb] bg-[#f8f5ee]">
            <Loader2
              size={36}
              className="animate-spin text-[#666]"
            />

            <p className="mt-4 text-sm font-semibold text-[#555]">
              Loading your library...
            </p>
          </div>
        ) : library.length === 0 ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#cfc7b8] bg-[#ebe6dc] p-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#222] text-white">
              <Library size={28} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#222]">
              Your personal library is empty
            </h2>

            <p className="mt-2 max-w-md text-sm text-[#777]">
              Browse the Main Library and add books to start
              building your personal collection.
            </p>

            <a
              href="/library"
              className="mt-6 rounded-lg bg-[#222] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#333]"
            >
              Browse Main Library
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {library.map((item) => {
              const book = item.book

              if (!book) return null

              const isBorrowed = item.status === 'borrowed'
              const isReturned = item.status === 'returned'
              const isDownloaded = item.status === 'downloaded'

              return (
                <article
                  key={item.id}
                  className="flex h-full flex-col overflow-hidden rounded-xl border border-[#ddd7cb] bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-56 overflow-hidden bg-[#ebe6dc]">
                    {book.image ? (
                      <img
                        src={book.image}
                        alt={`Cover of ${book.title}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#999]">
                        <BookOpen
                          size={48}
                          strokeWidth={1.2}
                        />
                      </div>
                    )}

                    <span className="absolute right-3 top-3 rounded-full bg-[#222] px-3 py-1 text-xs font-semibold text-white">
                      {getStatusLabel(item.status)}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex-1">
                      <span className="inline-block rounded-md border border-[#e4decb] bg-[#f8f5ee] px-2.5 py-0.5 text-xs font-semibold text-[#666]">
                        {book.genre}
                      </span>

                      <h2 className="mt-3 text-xl font-bold leading-snug text-[#222]">
                        {book.title}
                      </h2>

                      <p className="mt-1 text-sm text-[#777]">
                        by {book.author}
                      </p>

                      <div className="mt-5 space-y-2 border-t border-[#f0ebe0] pt-4">
                        <DateRow
                          label="Added"
                          value={formatDate(item.added_at)}
                        />

                        <DateRow
                          label="Borrowed"
                          value={formatDate(item.borrowed_at)}
                        />

                        <DateRow
                          label="Downloaded"
                          value={formatDate(item.downloaded_at)}
                        />

                        <DateRow
                          label="Returned"
                          value={formatDate(item.returned_at)}
                        />
                      </div>
                    </div>

                    <div className="mt-5 space-y-2 border-t border-[#f0ebe0] pt-4">
                      {!isBorrowed && !isReturned && (
                        <button
                          type="button"
                          onClick={() => handleBorrow(book.id)}
                          disabled={actionLoading === `borrow-${book.id}`}
                          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#222] py-2.5 text-xs font-semibold text-white transition hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {actionLoading === `borrow-${book.id}` ? (
                            <Loader2
                              size={15}
                              className="animate-spin"
                            />
                          ) : (
                            <BookOpen size={15} />
                          )}

                          Borrow Book
                        </button>
                      )}

                      {(isBorrowed || isDownloaded) && (
                        <button
                          type="button"
                          onClick={() => handleDownload(book.id)}
                          disabled={
                            actionLoading === `download-${book.id}`
                          }
                          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#222] bg-[#f5f1e8] py-2.5 text-xs font-semibold text-[#222] transition hover:bg-[#222] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {actionLoading === `download-${book.id}` ? (
                            <Loader2
                              size={15}
                              className="animate-spin"
                            />
                          ) : (
                            <Download size={15} />
                          )}

                          Download Book
                        </button>
                      )}

                      {isBorrowed && (
                        <button
                          type="button"
                          onClick={() => handleReturn(book.id)}
                          disabled={
                            actionLoading === `return-${book.id}`
                          }
                          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#ddd7cb] bg-white py-2.5 text-xs font-semibold text-[#555] transition hover:border-[#222] hover:text-[#222] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {actionLoading === `return-${book.id}` ? (
                            <Loader2
                              size={15}
                              className="animate-spin"
                            />
                          ) : (
                            <RotateCcw size={15} />
                          )}

                          Return Book
                        </button>
                      )}

                      {isReturned && (
                        <div className="flex items-center justify-center gap-2 rounded-lg bg-[#f5f1e8] py-2.5 text-xs font-semibold text-[#666]">
                          <Calendar size={15} />
                          Book returned
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-xl border border-[#ded8cc] bg-white p-5 shadow-2xs">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-[#888]">
          {label}
        </span>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ebe6dc] text-[#444]">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#222]">
        {value}
      </p>
    </div>
  )
}

function DateRow({ label, value }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="font-medium text-[#888]">
        {label}
      </span>

      <span className="font-semibold text-[#444]">
        {value}
      </span>
    </div>
  )
}