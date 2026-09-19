import { Link } from 'react-router-dom'
import {
  BookOpen,
  Calendar,
  Heart,
  Library,
  Pencil,
  Trash2
} from 'lucide-react'
import StarRating from './StarRating'

export default function BookCard({
  id,
  title,
  author,
  genre,
  year,
  image,
  book,
  isFavorite: propIsFavorite,
  rating: propRating,
  userRating: propUserRating,
  isAdmin,
  isAuthenticated,
  onToggleFavorite,
  onRate,
  onEdit,
  onDelete,
  onAddToLibrary
}) {
  const bookId = id ?? book?.id
  const bookTitle = title ?? book?.title ?? 'Untitled Book'
  const bookAuthor = author ?? book?.author ?? 'Unknown Author'
  const bookGenre = genre ?? book?.genre ?? 'General'
  const bookYear = year ?? book?.year
  const bookImage = image ?? book?.image
  const isFavorite = propIsFavorite ?? book?.is_favorite ?? false
  const bookRating = propRating ?? book?.rating ?? book?.user_rating ?? 0

  const currentBook = book || {
    id: bookId,
    title: bookTitle,
    author: bookAuthor,
    genre: bookGenre,
    year: bookYear,
    image: bookImage,
    is_favorite: isFavorite,
    rating: bookRating
  }

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      return
    }

    onToggleFavorite?.(bookId, !isFavorite)
  }

  const handleRate = (newRating) => {
    if (!isAuthenticated) {
      return
    }

    onRate?.(bookId, newRating)
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#ddd7cb] bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
      <div className="relative h-56 w-full overflow-hidden bg-[#ebe6dc]">
        {bookImage ? (
          <img
            src={bookImage}
            alt={`Cover of ${bookTitle}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#999]">
            <BookOpen size={48} strokeWidth={1.2} />
          </div>
        )}

        <button
          type="button"
          onClick={handleFavoriteClick}
          disabled={!isAuthenticated}
          className={`absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm transition-all duration-200 backdrop-blur-md ${
            !isAuthenticated
              ? 'cursor-not-allowed bg-white/80 text-[#999]'
              : isFavorite
                ? 'cursor-pointer bg-white text-red-600 ring-1 ring-red-200'
                : 'cursor-pointer bg-white/90 text-[#444] hover:bg-white hover:text-red-500'
          }`}
          aria-label={
            !isAuthenticated
              ? 'Login to use favorites'
              : isFavorite
                ? 'Remove from favorites'
                : 'Add to favorites'
          }
        >
          <Heart
            size={13}
            className={`transition-colors ${
              isFavorite
                ? 'fill-red-500 text-red-500'
                : 'text-[#666]'
            }`}
          />

          <span>
            {isFavorite ? 'Favorited' : 'Add to Favorites'}
          </span>
        </button>

        {bookYear && (
          <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-xs">
            <Calendar size={12} />
            {bookYear}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between">
            <span className="inline-block rounded-md border border-[#e4decb] bg-[#f8f5ee] px-2.5 py-0.5 text-xs font-semibold text-[#666]">
              {bookGenre}
            </span>
          </div>

          <h3 className="text-lg font-bold leading-snug tracking-tight text-[#222] line-clamp-2">
            {bookTitle}
          </h3>

          <p className="mt-1 text-sm text-[#777] line-clamp-1">
            by {bookAuthor}
          </p>

          <div className="mt-3.5 flex items-center justify-between border-t border-[#f5f1e8] pt-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#888]">
              Rating:
            </span>

            <StarRating
              rating={bookRating}
              onRate={handleRate}
              size={16}
              showValue={true}
            />
          </div>
        </div>

        <div className="mt-5 space-y-2 border-t border-[#f0ebe0] pt-4">
          <Link
            to={`/books/${bookId}`}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#222] py-2 text-xs font-semibold text-white shadow-2xs transition-all duration-200 hover:bg-[#333] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <BookOpen size={14} />
            <span>Book Details</span>
          </Link>

          {isAuthenticated && !isAdmin && (
            <button
              type="button"
              onClick={() => onAddToLibrary?.(bookId)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#222] bg-[#f5f1e8] py-2 text-xs font-semibold text-[#222] transition-all duration-200 hover:bg-[#222] hover:text-white cursor-pointer"
            >
              <Library size={14} />
              <span>Add to My Library</span>
            </button>
          )}

          {isAdmin && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEdit?.(currentBook)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#ddd7cb] bg-white py-1.5 text-xs font-semibold text-[#444] transition-colors hover:border-[#222] hover:bg-[#f5f1e8] hover:text-[#222] cursor-pointer"
                aria-label={`Edit ${bookTitle}`}
              >
                <Pencil size={13} />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={() => onDelete?.(bookId)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#ddd7cb] bg-white py-1.5 text-xs font-semibold text-[#888] transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                aria-label={`Delete ${bookTitle}`}
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}