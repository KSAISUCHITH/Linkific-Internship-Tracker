import { useState } from 'react';
import { Heart, MapPin, Star } from 'lucide-react';

export default function DestinationCard({ destination, isDark, onViewDetails }) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div
      className={`h-full flex flex-col rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${
        isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <div className="relative h-48 overflow-hidden">
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
            size={19}
            className={
              isFavorite
                ? 'fill-red-600 text-red-600'
                : 'text-gray-600'
            }
          />
        </button>
      </div>

      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-xl font-bold mb-2">
          {destination.name}
        </h3>

        <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
          <MapPin size={16} />
          <span>{destination.location}</span>
        </div>

        <p
          className={`text-sm leading-6 line-clamp-3 mb-5 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          {destination.description}
        </p>

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-1.5">
            <Star
              size={17}
              className="text-yellow-500 fill-yellow-500"
            />
            <span className="text-sm font-semibold">
              {destination.rating}
            </span>
          </div>

          <span
            className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
              isDark
                ? 'bg-blue-900 text-blue-200'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {destination.category}
          </span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-600">
          <span className="text-lg font-bold text-blue-600">
            {destination.price}
          </span>

          <button
            onClick={() => onViewDetails(destination)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold whitespace-nowrap shadow-sm"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}