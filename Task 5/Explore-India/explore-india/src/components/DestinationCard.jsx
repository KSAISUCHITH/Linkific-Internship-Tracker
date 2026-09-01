import { useState } from 'react';
import { Heart, MapPin, Star } from 'lucide-react';

export default function DestinationCard({ destination, isDark, onViewDetails }) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className={`rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      
      <div className="relative overflow-hidden h-48">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform"
        >
          <Heart
            size={20}
            className={isFavorite ? 'fill-red-600 text-red-600' : 'text-gray-600'}
          />
        </button>
      </div>

      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-xl font-bold">{destination.name}</h3>
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <MapPin size={16} />
            {destination.location}
          </div>
        </div>

        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {destination.description}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-500 fill-yellow-500" />
            <span className="font-semibold">{destination.rating}</span>
          </div>
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
            {destination.category}
          </span>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-300 dark:border-gray-600 gap-3">
          <span className="text-lg font-bold text-blue-600">{destination.price}</span>
          <button
            onClick={() => onViewDetails(destination)}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold leading-none whitespace-nowrap shadow-sm"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
