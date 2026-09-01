import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero({ isDark, destinationsRef }) {
  const scrollToDestinations = () => {
    destinationsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className={`${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} py-12 md:py-20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="text-blue-600 font-semibold text-sm md:text-base tracking-wide">EXPLORE INDIA</div>
            <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-bold leading-[1.05] tracking-tight">
              Discover places worth remembering.
            </h1>
            <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Explore beautiful destinations, discover new experiences, and plan your next unforgettable journey across the incredible landscapes of India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={scrollToDestinations}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-base leading-none hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Explore Destinations</span>
                <ArrowRight size={18} className="shrink-0" />
              </button>
              <button className={`px-6 py-3 rounded-xl font-semibold text-base leading-none border-2 ${isDark ? 'border-white hover:bg-white hover:text-gray-900' : 'border-gray-900 hover:bg-gray-900 hover:text-white'} transition-colors shadow-sm`}>
                Learn More
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center lg:justify-end">
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=700&fit=crop"
              alt="Mountain landscape"
              className="rounded-2xl shadow-xl w-full max-w-[620px] h-[420px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
