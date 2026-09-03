import { useState } from 'react'
import {
  X,
  Upload,
  Image
} from 'lucide-react'

export default function BookForm({
  book,
  onClose,
  onSave
}) {

  const [title, setTitle] = useState(book?.title || '')
  const [author, setAuthor] = useState(book?.author || '')
  const [genre, setGenre] = useState(book?.genre || '')
  const [year, setYear] = useState(book?.year || '')
  const [image, setImage] = useState(book?.image || '')

  const handleImageChange = (e) => {

    const file = e.target.files[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      setImage(reader.result)
    }

    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {

    e.preventDefault()

    if (!title || !author || !genre || !year) {
      return
    }

    const newBook = {
      id: book?.id || Date.now(),
      title,
      author,
      genre,
      year: Number(year),
      image
    }

    onSave(newBook)
  }

  return (
    <div className="modal-overlay">

      <div className="book-form">

        <div className="form-header">

          <div>
            <p className="tagline">
              LIBRARY
            </p>

            <h2>
              {book ? 'Edit Book' : 'Add New Book'}
            </h2>
          </div>

          <button
            className="close-button"
            onClick={onClose}
          >
            <X size={22} />
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="image-upload-section">

            <div className="image-preview">

              {image ? (
                <img
                  src={image}
                  alt="Book cover preview"
                />
              ) : (
                <Image size={30} />
              )}

            </div>

            <div className="image-upload-content">

              <label className="upload-button">

                <Upload size={16} />

                Choose Book Cover

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />

              </label>

              <p>
                JPG, PNG or other image formats
              </p>

            </div>

          </div>

          <label>
            Book Title

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter book title"
            />
          </label>

          <label>
            Author

            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author name"
            />
          </label>

          <label>
            Genre

            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Enter genre"
            />
          </label>

          <label>
            Publication Year

            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Enter publication year"
            />
          </label>

          <div className="form-actions">

            <button
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit">
              {book ? 'Save Changes' : 'Add Book'}
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}