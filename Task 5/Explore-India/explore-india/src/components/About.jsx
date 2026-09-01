import { Compass, MapPin, Ticket } from 'lucide-react';

export default function About({ isDark }) {
  const features = [
    {
      icon: Compass,
      title: 'Discover',
      description: 'Explore new destinations and hidden places across India.'
    },
    {
      icon: MapPin,
      title: 'Experience',
      description: 'Create memorable travel experiences and unforgettable moments.'
    },
    {
      icon: Ticket,
      title: 'Travel',
      description: 'Plan and enjoy your next adventure with ease and confidence.'
    }
  ];

  return (
    <section id="about" className={`${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} py-20 md:py-24`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Travel. Discover. Experience.
          </h2>
          <p className={`text-lg leading-relaxed max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            ExploreIndia helps travelers discover beautiful destinations across India and find inspiration for their next journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`h-full flex flex-col items-center text-center p-8 rounded-2xl shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
              >
                <div className="mb-5 flex items-center justify-center">
                  <div className={`p-4 rounded-full ${isDark ? 'bg-blue-900/80' : 'bg-blue-100'}`}>
                    <Icon size={30} className="text-blue-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className={`text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
