import { ArrowRight } from 'lucide-react';

export default function Contact({ isDark, destinationsRef }) {
  const scrollToDestinations = () => {
    destinationsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="contact" className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'} py-20 md:py-24`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className={`text-3xl md:text-4xl font-bold tracking-tight mb-5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Ready to plan your next journey?
        </h2>
        <p className={`text-lg leading-relaxed max-w-3xl mx-auto mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Start exploring India's most beautiful destinations today and create memories that will last a lifetime.
        </p>
        <button
          onClick={scrollToDestinations}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-base leading-none hover:bg-blue-700 transition-colors inline-flex items-center gap-2 shadow-sm"
        >
          <span>Start Exploring</span>
          <ArrowRight size={18} className="shrink-0" />
        </button>
      </div>
    </section>
  );
}
