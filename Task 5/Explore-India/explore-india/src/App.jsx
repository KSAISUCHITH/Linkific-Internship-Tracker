import { useState, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Destinations from './components/Destinations';
import About from './components/About';
import Contact from './components/Contact';
import DestinationModal from './components/DestinationModal';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [isDark, setIsDark] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const destinationsRef = useRef(null);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleViewDetails = (destination) => {
    setSelectedDestination(destination);
  };

  const handleCloseModal = () => {
    setSelectedDestination(null);
  };

  return (
    <div className={isDark ? 'dark' : ''}>
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <main>
        <Hero isDark={isDark} destinationsRef={destinationsRef} />
        <Destinations isDark={isDark} onViewDetails={handleViewDetails} destinationsRef={destinationsRef} />
        <About isDark={isDark} />
        <Contact isDark={isDark} destinationsRef={destinationsRef} />
      </main>
      <Footer isDark={isDark} />
      <DestinationModal destination={selectedDestination} isDark={isDark} onClose={handleCloseModal} />
    </div>
  );
}

export default App;
