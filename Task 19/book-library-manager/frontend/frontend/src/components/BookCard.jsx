import { BookOpen, Calendar, Pencil, Trash2 } from 'lucide-react'

export default function BookCard({
  id,
  title,
  author,
  genre,
  year,
  image,
  book,
  onEdit,
  onDelete
}) {
  const bookId = id ?? book?.id
  const bookTitle = title ?? book?.title ?? 'Untitled Book'
  const bookAuthor = author ?? book?.author ?? 'Unknown Author'
  const bookGenre = genre ?? book?.genre ?? 'General'
  const bookYear = year ?? book?.year
  const bookImage = image ?? book?.image

  const currentBook = book || {
    id: bookId,
    title: bookTitle,
    author: bookAuthor,
    genre: bookGenre,
    year: bookYear,
    image: bookImage
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

        {bookYear && (
          <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-xs">
            <Calendar size={12} />
            {bookYear}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
          <div className="mb-2">
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
        </div>

        <div className="mt-5 flex items-center gap-2.5 border-t border-[#f0ebe0] pt-4">
          <button
            type="button"
            onClick={() => onEdit?.(currentBook)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#ddd7cb] bg-white py-2 text-xs font-semibold text-[#444] transition-colors hover:border-[#222] hover:bg-[#f5f1e8] hover:text-[#222] cursor-pointer"
            aria-label={`Edit ${bookTitle}`}
          >
            <Pencil size={14} />
            <span>Edit</span>
          </button>

          <button
            type="button"
            onClick={() => onDelete?.(bookId)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#ddd7cb] bg-white py-2 text-xs font-semibold text-[#888] transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 cursor-pointer"
            aria-label={`Delete ${bookTitle}`}
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </article>
  )
}