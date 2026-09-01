import { useState } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';

export default function Navbar({ isDark, toggleTheme }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`sticky top-0 z-50 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <div className="flex-shrink-0 font-bold text-3xl tracking-tight text-blue-600">
            ExploreIndia
          </div>

          
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            <a href="#home" className="text-base font-medium hover:text-blue-600 transition-colors">Home</a>
            <a href="#destinations" className="text-base font-medium hover:text-blue-600 transition-colors">Destinations</a>
            <a href="#about" className="text-base font-medium hover:text-blue-600 transition-colors">About</a>
            <a href="#contact" className="text-base font-medium hover:text-blue-600 transition-colors">Contact</a>
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-200'} hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-200'} hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        
        {isMenuOpen && (
          <div className={`md:hidden pb-4 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <a href="#home" className="block px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700">Home</a>
            <a href="#destinations" className="block px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700">Destinations</a>
            <a href="#about" className="block px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700">About</a>
            <a href="#contact" className="block px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700">Contact</a>
          </div>
        )}
      </div>
    </nav>
  );
}
