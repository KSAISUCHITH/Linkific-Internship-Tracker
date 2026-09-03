import { useEffect, useState } from 'react'
import { ArrowLeft, Plus, Search } from 'lucide-react'
import BookCard from './BookCard'
import BookForm from './BookForm'

const API_URL = import.meta.env.VITE_API_URL

export default function LibraryPage({ onBack }) {
  const [books, setBooks] = useState([])
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_URL}/books`)

      if (!response.ok) {
        throw new Error('Failed to fetch books')
      }

      const data = await response.json()
      setBooks(data)
    } catch (error) {
      console.error('Error fetching books:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const filteredBooks = books.filter((book) => {
    const searchText = search.toLowerCase()

    return (
      book.title.toLowerCase().includes(searchText) ||
      book.author.toLowerCase().includes(searchText)
    )
  })

  const handleAddBook = () => {
    setEditingBook(null)
    setShowForm(true)
  }

  const handleEdit = (book) => {
    setEditingBook(book)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this book?'
    )

    if (!confirmed) return

    try {
      const response = await fetch(`${API_URL}/books/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete book')
      }

      setBooks((currentBooks) =>
        currentBooks.filter((book) => book.id !== id)
      )
    } catch (error) {
      console.error('Error deleting book:', error)
    }
  }

  const handleSave = async (book) => {
    try {
      const isEditing = Boolean(editingBook)

      const response = await fetch(
        isEditing
          ? `${API_URL}/books/${book.id}`
          : `${API_URL}/books`,
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: book.title,
            author: book.author,
            genre: book.genre,
            year: book.year,
            image: book.image
          })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to save book')
      }

      const savedBook = await response.json()

      if (isEditing) {
        setBooks((currentBooks) =>
          currentBooks.map((item) =>
            item.id === savedBook.id ? savedBook : item
          )
        )
      } else {
        setBooks((currentBooks) => [...currentBooks, savedBook])
      }

      setShowForm(false)
      setEditingBook(null)
    } catch (error) {
      console.error('Error saving book:', error)
    }
  }

  return (
    <div className="library-page">
      <nav className="library-navbar">
        <div className="logo">BookNest</div>

        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={17} />
          Back to Home
        </button>
      </nav>

      <main className="library-content">
        <div className="library-header">
          <div>
            <p className="tagline">MY COLLECTION</p>

            <h1>Book Library</h1>

            <p>
              Manage and organize your personal book collection.
            </p>
          </div>

          <button
            className="add-book-button"
            onClick={handleAddBook}
          >
            <Plus size={18} />
            Add Book
          </button>
        </div>

        <div className="library-toolbar">
          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search books by title or author..."
            />
          </div>

          <span className="book-count">
            {filteredBooks.length}{' '}
            {filteredBooks.length === 1 ? 'book' : 'books'}
          </span>
        </div>

        {loading ? (
          <div className="empty-library">
            <h2>Loading books...</h2>
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="book-grid">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="empty-library">
            <div className="empty-icon">
              <Search size={30} />
            </div>

            <h2>No books found</h2>

            <p>
              Try a different search or add a new book to your
              collection.
            </p>

            <button
              className="add-book-button"
              onClick={handleAddBook}
            >
              <Plus size={18} />
              Add Book
            </button>
          </div>
        )}
      </main>

      {showForm && (
        <BookForm
          book={editingBook}
          onClose={() => {
            setShowForm(false)
            setEditingBook(null)
          }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}