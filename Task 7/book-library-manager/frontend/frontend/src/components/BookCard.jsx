import {
  BookOpen,
  Pencil,
  Trash2
} from 'lucide-react'

export default function BookCard({ book, onEdit, onDelete }) {
  return (
    <div className="book-card">

      <div className="book-cover-container">
        {book.image ? (
          <img
            src={book.image}
            alt={book.title}
            className="book-cover-image"
          />
        ) : (
          <div className="book-cover-placeholder">
            <BookOpen size={42} strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="book-info">

        <div className="book-year">
          {book.year}
        </div>

        <h2>{book.title}</h2>

        <p className="book-author">
          {book.author}
        </p>

        <span className="book-genre">
          {book.genre}
        </span>

      </div>

      <div className="card-actions">

        <button onClick={() => onEdit(book)}>
          <Pencil size={15} />
          Edit
        </button>

        <button onClick={() => onDelete(book.id)}>
          <Trash2 size={15} />
          Delete
        </button>

      </div>

    </div>
  )
}