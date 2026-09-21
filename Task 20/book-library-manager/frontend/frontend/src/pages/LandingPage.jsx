import { Link } from 'react-router-dom'
import { ArrowRight, Bookmark, BookOpen, CheckCircle2, Pencil, Quote, Search, Sparkles } from 'lucide-react'

export default function LandingPage({ onEnter }) {
  return (
    <div className="w-full">
      <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl flex-col items-center justify-between gap-12 px-6 py-12 sm:px-10 md:flex-row lg:px-12 lg:py-24">
        <div className="max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ddd7cb] bg-[#ebe6dc]/80 px-3.5 py-1.5 text-xs font-semibold tracking-wider text-[#666] uppercase mb-6 shadow-2xs">
            <Sparkles size={14} className="text-[#222]" />
            <span>Curated Digital Library</span>
          </div>

          <h1 className="text-5xl font-black leading-[0.92] tracking-tight text-[#222] sm:text-7xl lg:text-[88px]">
            Every book.
            <br />
            <span className="font-serif font-normal italic text-[#333]">One quiet place.</span>
          </h1>

          <p className="mt-6 text-base leading-relaxed text-[#666] sm:text-lg">
            Organize, manage, and keep track of your favorite books with a simple,
            distraction-free library manager tailored for passionate readers and lifelong collectors.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <Link
              to="/library"
              onClick={onEnter}
              className="group inline-flex items-center gap-2.5 rounded-lg bg-[#222] px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#333] hover:shadow-xl active:translate-y-0 cursor-pointer"
            >
              <span>Explore Library</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-lg border border-[#ddd7cb] bg-white/70 px-5 py-3.5 text-sm font-semibold text-[#444] shadow-2xs transition-colors hover:border-[#222] hover:bg-white hover:text-[#222]"
            >
              <span>Learn More</span>
            </a>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 border-t border-[#ded8cc] pt-6 md:justify-start text-xs text-[#777]">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#222]" />
              <span>Free &amp; Open Collection</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#222]" />
              <span>Full Local Control</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#222]" />
              <span>Zero Clutter</span>
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="book-illustration">
            <div className="book transition-transform duration-500 hover:rotate-0 hover:scale-105">
              <div className="book-spine"></div>
              <div className="book-cover">
                <p>THE</p>
                <h2>BOOK</h2>
                <h2>NEST</h2>
                <span>PERSONAL LIBRARY</span>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-4 -left-6 hidden sm:flex items-center gap-3 rounded-xl border border-[#ded8cc] bg-white/95 p-3.5 shadow-lg backdrop-blur-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f1eee8] text-[#222]">
              <Bookmark size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-[#222]">Personal Shelves</p>
              <p className="text-[11px] text-[#777]">Organized by Genre &amp; Year</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-y border-[#ded8cc] bg-[#ebe6dc] py-24 px-6 sm:px-10 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
            <div>
              <p className="mb-2 text-xs font-bold tracking-[3px] text-[#777] uppercase">
                WHAT YOU CAN DO
              </p>
              <h2 className="text-4xl font-extrabold tracking-tight text-[#222] sm:text-5xl">
                Your library, <span className="font-serif font-normal italic">your way.</span>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-[#666]">
              Everything you need to catalogue your library without endless spreadsheets, complicated setups, or intrusive feeds.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="group relative rounded-2xl border border-[#ddd7cb] bg-[#f8f5ee] p-8 shadow-2xs transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[#222]">
              <div className="flex items-center justify-between mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#222] text-white shadow-xs transition-transform duration-300 group-hover:scale-110">
                  <BookOpen size={22} strokeWidth={1.8} />
                </div>
                <span className="font-serif text-2xl italic font-normal text-[#aaa]">01</span>
              </div>
              <h3 className="text-xl font-bold text-[#222]">
                Organize Your Books
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#707070]">
                Keep all your treasured titles in one serene catalog. Categorize by genre, publication year, and track custom cover art effortlessly.
              </p>
            </div>

            <div className="group relative rounded-2xl border border-[#ddd7cb] bg-[#f8f5ee] p-8 shadow-2xs transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[#222]">
              <div className="flex items-center justify-between mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#222] text-white shadow-xs transition-transform duration-300 group-hover:scale-110">
                  <Search size={22} strokeWidth={1.8} />
                </div>
                <span className="font-serif text-2xl italic font-normal text-[#aaa]">02</span>
              </div>
              <h3 className="text-xl font-bold text-[#222]">
                Instant Discovery
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#707070]">
                Search titles and authors in real-time. Use the sidebar category filters to narrow down classics, science, fantasy, and fiction instantly.
              </p>
            </div>

            <div className="group relative rounded-2xl border border-[#ddd7cb] bg-[#f8f5ee] p-8 shadow-2xs transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[#222]">
              <div className="flex items-center justify-between mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#222] text-white shadow-xs transition-transform duration-300 group-hover:scale-110">
                  <Pencil size={22} strokeWidth={1.8} />
                </div>
                <span className="font-serif text-2xl italic font-normal text-[#aaa]">03</span>
              </div>
              <h3 className="text-xl font-bold text-[#222]">
                Complete Control
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#707070]">
                Add new arrivals, update editions, or delete books when needed. Every change syncs cleanly with your local library storage.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20 sm:px-10 lg:px-12 text-center">
        <div className="flex justify-center text-[#999] mb-6">
          <Quote size={36} strokeWidth={1.5} />
        </div>
        <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl leading-relaxed text-[#222] italic max-w-3xl mx-auto">
          &ldquo;A reader lives a thousand lives before he dies. The man who never reads lives only one.&rdquo;
        </blockquote>
        <p className="mt-4 text-xs font-bold tracking-widest text-[#777] uppercase">
          — George R.R. Martin
        </p>
      </section>

      <section className="border-t border-[#ded8cc] bg-[#f1eee8] py-20 px-6 sm:px-10 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-[#ddd7cb] bg-[#f8f5ee] p-8 sm:p-14 lg:p-16 shadow-xs flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl text-center md:text-left">
              <p className="text-xs font-bold tracking-[3px] text-[#777] uppercase mb-2">
                WELCOME TO BOOKNEST
              </p>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#222]">
                A simple home <br className="hidden sm:block" />
                <span className="font-serif font-normal italic">for every story.</span>
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#666]">
                Ready to build your personal shelf? Start cataloguing your favorite books today with clean, intuitive tools designed to stay out of your way.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                to="/library"
                onClick={onEnter}
                className="inline-flex items-center gap-2.5 rounded-xl bg-[#222] px-8 py-4 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#333] hover:shadow-xl active:translate-y-0 cursor-pointer"
              >
                <span>Start Your Collection</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
