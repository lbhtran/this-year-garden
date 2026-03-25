import { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Navigation } from './components/Navigation';
import { WeatherWidget } from './components/WeatherWidget';
import { OverviewSection } from './components/OverviewSection';
import { DiagramsSection } from './components/DiagramsSection';
import { SeedsSection } from './components/SeedsSection';
import { ShoppingSection } from './components/ShoppingSection';
import { PestsSection } from './components/PestsSection';
import { TemperatureSection } from './components/TemperatureSection';
import { TimelineSection } from './components/TimelineSection';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useWeather } from './hooks/useWeather';
import { initialPlants } from './data/plants';
import type { Plant } from './data/plants';
import { initialShoppingItems } from './data/shopping';
import type { ShoppingItem } from './data/shopping';
import { initialContainers } from './data/containers';

function App() {
  const [plants, setPlants] = useLocalStorage<Plant[]>('garden-plants', initialPlants);
  const [shoppingItems, setShoppingItems] = useLocalStorage<ShoppingItem[]>('garden-shopping', initialShoppingItems);
  const [activeSection, setActiveSection] = useState('overview');
  const weather = useWeather();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          if (entry.target.id) {
            setActiveSection(entry.target.id);
          }
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.section, .timeline-item').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleUpdatePlant = (updated: Plant) => {
    setPlants(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleAddPlant = (plant: Plant) => {
    setPlants(prev => [...prev, plant]);
  };

  const handleDeletePlant = (id: string) => {
    setPlants(prev => prev.filter(p => p.id !== id));
  };

  const handleToggleShoppingItem = (id: string) => {
    setShoppingItems(prev => prev.map(item => item.id === id ? { ...item, bought: !item.bought } : item));
  };

  return (
    <>
      <Hero />
      <Navigation activeSection={activeSection} />

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 100px' }}>
        <div style={{ paddingTop: 48 }}>
          <WeatherWidget plants={plants} weather={weather} />
        </div>

        <OverviewSection containers={initialContainers} />
        <DiagramsSection />
        <SeedsSection
          plants={plants}
          onUpdatePlant={handleUpdatePlant}
          onAddPlant={handleAddPlant}
          onDeletePlant={handleDeletePlant}
          currentWeather={weather.current}
        />
        <ShoppingSection items={shoppingItems} onToggle={handleToggleShoppingItem} />
        <PestsSection />
        <TemperatureSection currentTemp={weather.current?.temperature} />
        <TimelineSection />
      </main>

      <footer style={{ background: 'var(--green-deep)', color: 'var(--green-pale)', textAlign: 'center', padding: '40px 24px', fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 1, opacity: 0.8 }}>
        🪴 My Garden Plan · First Season 2026 · Made with care
      </footer>
    </>
  );
}

export default App;
