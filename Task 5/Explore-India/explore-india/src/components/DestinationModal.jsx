import { X, MapPin, Star } from 'lucide-react';

export default function DestinationModal({ destination, isDark, onClose }) {
  if (!destination) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
        {/* Header with Close Button */}
        <div className="flex justify-between items-center p-6 border-b border-gray-300 dark:border-gray-700">
          <h2 className="text-2xl font-bold">{destination.name}</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'} transition-colors`}
          >
            <X size={24} />
          </button>
        </div>

        
        <div className="p-6 space-y-4">
          
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-64 object-cover rounded-lg"
          />

         
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <MapPin size={20} />
            <span className="text-lg">{destination.location}</span>
          </div>

          
          <div>
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
              {destination.description}
            </p>
          </div>

          
          <div className="grid grid-cols-2 gap-4 py-4">
           
            <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Category</p>
              <p className="font-semibold">{destination.category}</p>
            </div>

            
            <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Rating</p>
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <span className="font-semibold">{destination.rating}</span>
              </div>
            </div>

            
            <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Price</p>
              <p className="font-semibold text-lg text-blue-600">{destination.price}</p>
            </div>

            
            <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Best Time</p>
              <p className="font-semibold">April - October</p>
            </div>
          </div>

         
          <div className="flex gap-3 pt-4 border-t border-gray-300 dark:border-gray-700">
            <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Book Trip
            </button>
            <button
              onClick={onClose}
              className={`flex-1 ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} py-3 rounded-lg font-semibold transition-colors`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
