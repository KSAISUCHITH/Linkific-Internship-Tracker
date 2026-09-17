export default function Footer({
  brand = 'BookNest',
  year = new Date().getFullYear()
}) {
  return (
    <footer className="w-full bg-[#222] text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:px-12">
        <div className="flex flex-col justify-between gap-10 pb-12 md:flex-row md:gap-20">
          <div className="max-w-sm space-y-3">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {brand}
            </h2>
            <p className="text-sm leading-relaxed text-[#aaa]">
              Your personal space for every story worth keeping. Organize your
              reading journey in one quiet corner.
            </p>
          </div>

          <div className="max-w-md space-y-2">
            <h3 className="text-xl font-semibold text-white">
              Happy reading.
            </h3>
            <p className="text-sm leading-relaxed text-[#aaa]">
              Build your collection, discover your next favorite, and keep your
              stories close wherever your imagination takes you.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-[#3a3a3a] pt-6 text-xs text-[#888] sm:flex-row">
          <p>© {year} {brand}. All rights reserved.</p>
          <p className="italic">Built for passionate readers &amp; book collectors.</p>
        </div>
      </div>
    </footer>
  )
}
