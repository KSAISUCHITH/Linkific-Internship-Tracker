export default function Footer({ isDark }) {
  return (
    <footer className={`${isDark ? 'bg-gray-900 text-gray-300' : 'bg-gray-900 text-gray-300'} py-16 md:py-20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-12">
          
          <div className="pr-4 md:pr-6">
            <h3 className="text-3xl font-bold text-blue-600 mb-3 leading-none">ExploreIndia</h3>
            <p className="text-sm leading-6 text-gray-300">
              Discover beautiful destinations across India and plan your next unforgettable journey.
            </p>
          </div>

          
          <div>
            <h4 className="text-xl font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#home" className="hover:text-blue-400 transition-colors">Home</a></li>
              <li><a href="#destinations" className="hover:text-blue-400 transition-colors">Destinations</a></li>
              <li><a href="#about" className="hover:text-blue-400 transition-colors">About</a></li>
              <li><a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          
          <div>
            <h4 className="text-xl font-semibold mb-4 text-white">Services</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Trip Planning</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Destination Guide</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Travel Tips</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Reviews</a></li>
            </ul>
          </div>

          
          <div>
            <h4 className="text-xl font-semibold mb-4 text-white">Newsletter</h4>
            <p className="text-sm mb-4 leading-6 text-gray-300">
              Subscribe to get travel tips and destination updates.
            </p>
            <div className="flex gap-2.5">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2.5 rounded-lg bg-gray-800 text-white text-sm placeholder-gray-500 outline-none border border-gray-700"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors leading-none whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2026 ExploreIndia. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6 text-sm justify-center md:justify-end">
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
