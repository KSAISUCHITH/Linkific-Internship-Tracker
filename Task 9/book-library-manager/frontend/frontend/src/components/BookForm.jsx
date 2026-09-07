import { useState } from 'react'
import { Image, Upload, X } from 'lucide-react'

export default function BookForm({
  book = null,
  onClose,
  onSave
}) {
  const [title, setTitle] = useState(book?.title || '')
  const [author, setAuthor] = useState(book?.author || '')
  const [genre, setGenre] = useState(book?.genre || '')
  const [year, setYear] = useState(book?.year || '')
  const [image, setImage] = useState(book?.image || '')
  const [description, setDescription] = useState(book?.description || '')
  const [error, setError] = useState('')

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      return
    }

    setError('')
    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!title.trim() || !author.trim() || !genre.trim() || !year) {
      setError('Please fill out all required fields.')
      return
    }

    const bookPayload = {
      id: book?.id || Date.now(),
      title: title.trim(),
      author: author.trim(),
      genre: genre.trim(),
      year: Number(year),
      image,
      description: description.trim() || null
    }

    onSave?.(bookPayload)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[#ded8cc] bg-white p-6 sm:p-8 shadow-2xl">
        <div className="flex items-start justify-between pb-4 border-b border-[#f0ebe0]">
          <div>
            <p className="text-xs font-bold tracking-widest text-[#777] uppercase">
              BookNest Library
            </p>
            <h2 id="modal-title" className="text-2xl font-bold tracking-tight text-[#222]">
              {book ? 'Edit Book Details' : 'Add a New Book'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#777] transition-colors hover:bg-[#f5f1e8] hover:text-[#222] cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <span className="block text-xs font-semibold text-[#444] uppercase tracking-wider mb-2">
              Book Cover Image
            </span>

            <div className="flex items-center gap-4 rounded-xl border border-[#ded8cc] bg-[#fcfbf9] p-3.5">
              <div className="relative flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[#ddd7cb] bg-[#ebe6dc] text-[#888]">
                {image ? (
                  <img
                    src={image}
                    alt="Book cover preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image size={24} />
                )}
              </div>

              <div className="space-y-1.5 flex-1">
                <label className="inline-flex items-center gap-2 rounded-lg border border-[#222] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#222] shadow-2xs transition-colors hover:bg-[#222] hover:text-white cursor-pointer">
                  <Upload size={14} />
                  <span>Choose Cover Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-[#888]">
                  Supports PNG, JPG, WebP. Recommended ratio 2:3.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="book-title" className="block text-xs font-semibold text-[#444] uppercase tracking-wider">
              Book Title <span className="text-red-500">*</span>
            </label>
            <input
              id="book-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., The Great Gatsby"
              className="w-full rounded-lg border border-[#ded8cc] bg-white px-3.5 py-2.5 text-sm text-[#222] outline-none transition-all focus:border-[#222] focus:ring-1 focus:ring-[#222]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="book-author" className="block text-xs font-semibold text-[#444] uppercase tracking-wider">
              Author <span className="text-red-500">*</span>
            </label>
            <input
              id="book-author"
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g., F. Scott Fitzgerald"
              className="w-full rounded-lg border border-[#ded8cc] bg-white px-3.5 py-2.5 text-sm text-[#222] outline-none transition-all focus:border-[#222] focus:ring-1 focus:ring-[#222]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="book-genre" className="block text-xs font-semibold text-[#444] uppercase tracking-wider">
                Genre <span className="text-red-500">*</span>
              </label>
              <input
                id="book-genre"
                type="text"
                required
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="e.g., Fiction, Classic"
                className="w-full rounded-lg border border-[#ded8cc] bg-white px-3.5 py-2.5 text-sm text-[#222] outline-none transition-all focus:border-[#222] focus:ring-1 focus:ring-[#222]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="book-year" className="block text-xs font-semibold text-[#444] uppercase tracking-wider">
                Publication Year <span className="text-red-500">*</span>
              </label>
              <input
                id="book-year"
                type="number"
                required
                min="1000"
                max="2100"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g., 1925"
                className="w-full rounded-lg border border-[#ded8cc] bg-white px-3.5 py-2.5 text-sm text-[#222] outline-none transition-all focus:border-[#222] focus:ring-1 focus:ring-[#222]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="book-description" className="block text-xs font-semibold text-[#444] uppercase tracking-wider">
              Description (Optional)
            </label>
            <textarea
              id="book-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a synopsis or personal reading notes..."
              className="w-full rounded-lg border border-[#ded8cc] bg-white px-3.5 py-2.5 text-sm text-[#222] outline-none transition-all focus:border-[#222] focus:ring-1 focus:ring-[#222] resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0ebe0]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#ded8cc] bg-white px-4 py-2.5 text-xs font-semibold text-[#555] transition-colors hover:bg-[#f5f1e8] hover:text-[#222] cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-[#222] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#333] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              {book ? 'Save Changes' : 'Add to Collection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}