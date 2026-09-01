import { useState } from 'react';
import { Search } from 'lucide-react';
import DestinationCard from './DestinationCard';
import { destinations as allDestinations } from '../data/destinations';

export default function Destinations({ isDark, onViewDetails, destinationsRef }) {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Mountains', 'Beaches', 'Nature', 'Heritage'];

  const filteredDestinations = allDestinations.filter(destination => {
    const matchesSearch = destination.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         destination.location.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || destination.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="destinations" ref={destinationsRef} className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'} py-16 md:py-20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Popular Destinations
          </h2>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Discover some of India's most beautiful places.
          </p>
        </div>

     
        <div className="mb-10 space-y-4">
          <div className={`flex items-center gap-3 px-4 py-4 rounded-xl border ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'} shadow-sm`}>
            <Search size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className={`flex-1 outline-none bg-transparent text-base ${isDark ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'}`}
            />
          </div>

         
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-white text-gray-900 hover:bg-gray-100 shadow-sm'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map(destination => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                isDark={isDark}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className={`text-center py-12 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <p className="text-lg font-semibold">No destinations found.</p>
            <p className="text-sm mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </section>
  );
}
