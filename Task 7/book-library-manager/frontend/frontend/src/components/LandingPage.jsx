import {
  BookOpen,
  Search,
  Pencil,
  ArrowRight
} from 'lucide-react'

export default function LandingPage({ onEnter }) {
  return (
    <div className="landing-page">

      <nav className="navbar">
        <div className="logo">BookNest</div>

        <button className="nav-button" onClick={onEnter}>
          Explore Library
          <ArrowRight size={16} />
        </button>
      </nav>

      <main>

        <section className="hero">

          <div className="hero-content">

            <p className="tagline">
              YOUR PERSONAL LIBRARY
            </p>

            <h1>
              Every book.
              <br />
              <span>One place.</span>
            </h1>

            <p className="description">
              Organize, manage, and keep track of your
              favorite books with a simple and intuitive
              library manager.
            </p>

            <button className="hero-button">
              Explore Library
              <ArrowRight size={18} />
            </button>

          </div>

          <div className="book-illustration">

            <div className="book">

              <div className="book-spine"></div>

              <div className="book-cover">

                <p>THE</p>

                <h2>BOOK</h2>
                <h2>NEST</h2>

                <span>
                  PERSONAL LIBRARY
                </span>

              </div>

            </div>

          </div>

        </section>


        <section className="features">

          <div className="section-heading">

            <p className="tagline">
              WHAT YOU CAN DO
            </p>

            <h2>
              Your library,
              <br />
              <span>your way.</span>
            </h2>

          </div>


          <div className="feature-grid">

            <div className="feature-card">

              <div className="feature-icon">
                <BookOpen size={24} strokeWidth={1.8} />
              </div>

              <h3>
                Organize Your Books
              </h3>

              <p>
                Keep all your favorite books in one
                organized collection instead of
                scattered lists.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-icon">
                <Search size={24} strokeWidth={1.8} />
              </div>

              <h3>
                Find Books Easily
              </h3>

              <p>
                Quickly search through your collection
                by book title or author whenever you
                need to find something.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-icon">
                <Pencil size={24} strokeWidth={1.8} />
              </div>

              <h3>
                Manage Your Collection
              </h3>

              <p>
                Add new books, update existing details,
                or remove books that are no longer
                part of your collection.
              </p>

            </div>

          </div>

        </section>


        <section className="about-section">

          <div className="about-content">

            <p className="tagline">
              WELCOME TO BOOKNEST
            </p>

            <h2>
              A simple home
              <br />
              <span>for every story.</span>
            </h2>

            <p>
              BookNest is a simple digital library built
              to make managing your personal book
              collection effortless. Whether you are
              building a collection of classics, exploring
              new genres, or simply keeping track of what
              you own, BookNest keeps everything together.
            </p>

            <button className="hero-button" onClick={onEnter}>
              Start Exploring
              <ArrowRight size={18} />
            </button>

          </div>

        </section>

      </main>


      <footer className="footer">

        <div className="footer-content">

          <div className="footer-brand">

            <div className="logo">
              BookNest
            </div>

            <p>
              Your personal space for
              every story worth keeping.
            </p>

          </div>


          <div className="footer-message">

            <h3>
              Happy reading.
            </h3>

            <p>
              Build your collection,
              discover your next favorite,
              and keep your stories close.
            </p>

          </div>

        </div>


        <div className="footer-bottom">

          <span>
            © 2026 BookNest
          </span>

         

        </div>

      </footer>

    </div>
  )
}